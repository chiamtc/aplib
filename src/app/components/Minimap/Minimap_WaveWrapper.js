import style from '../../util/Style';
import {subjects} from "../../M3dAudio";
import _ from 'lodash';

export default class Minimap_WaveWrapper {

    constructor(params) {
        //container which is to hold wrapper and wrapper's subsequent elements
        this.container_id = params.container_id;
        this.container = null;

        //wrapper params, the main element to have interaction registered and physical attributes (w,h)
        this.height = params.height;
        this.width = 0;

        this.miniWave_wrapper = null;

        this.normalize = params.normalize || false;
        this.lastPos = 0;
        this.fill = params.fill || true; //boolean indication to display whole wave
        this.scroll = params.scroll || false; //boolean indication to allow scrolling horizontally
        this.autoCenter = true; //hardcoded
        this.pixelRatio = params.pixelRatio || 1;
        this.amplitude = params.amplitude || 1;
        this.wave_canvas = null;
        this.maxCanvasWidth = params.maxCanvasWidth || 4000; //4k

        this.mainWaveStyle = params.mainWaveStyle;
    }

    /**
     * //try to make miniWave_wrapper and progressWave_wrapper on the same level. Doable?
     *  - container
     *      - miniWave_wrapper //main wave
     *          - element1
     *          - progressWave_wrapper2 //progress wave
     *              - element2
     *          - etc_wrapper3 //other wrappers like timeline,regions
     *              - element3
     *
     */
    init() {
        this.createContainer();
        this.createMiniWaveWrapper();
        /* subjects.m3dAudio_control.subscribe((res) => {
             switch (res.type) {
                 case ZOOM:
                     const scrollbarHeight = this.height - this.progressWave_wrapper.scrollHeight;
                     if (scrollbarHeight > 0) {
                         style(this.container, {height: `${this.height}px`})
                         style(this.miniWave_wrapper, {height: `${scrollbarHeight + this.height}px`})
                     } else style(this.miniWave_wrapper, {height: `${this.height}px`});
                     break;
             }
         });*/
    }

    createContainer() {
        const container = document.querySelector(this.container_id);

        if (!container) {
            throw new Error("No container element id found. Pass container id as a string.")
        } else this.container = container;
    }

    createMiniWaveWrapper() {
        const wrapper = document.createElement('minimap');
        style(wrapper, {
            display: 'block',
            position: 'relative',
            height: `${this.height}px`,
            zIndex: 99,
            top: 0
        });
        style(this.container, {top: 0});
        if (this.fill || this.scroll) {
            style(wrapper, {
                width: '100%',
                overflowX: 'auto',//always turn it on //this.hideScrollbar ? 'hidden' : 'auto',
                overflowY: 'hidden'
            });
        }
        this.miniWave_wrapper = this.container.appendChild(wrapper);
        this.register_miniWrapper_events();
    }

    register_miniWrapper_events() {
        this.miniWave_wrapper.addEventListener('click', (e) => {
            /* //functionality of seekTo on minimap
            const scrollbarHeight =
                 this.miniWave_wrapper.offsetHeight - this.miniWave_wrapper.clientHeight;
             if (scrollbarHeight !== 0) {
                 // scrollbar is visible.  Check if click was on it
                 const bbox = this.miniWave_wrapper.getBoundingClientRect();
                 if (e.clientY >= bbox.bottom - scrollbarHeight) {
                     // ignore mousedown as it was on the scrollbar
                     return;
                 }
             }
             // this.fireEvent('click', e, this.handleEvent(e)); //TODO: create a new global canvas subject and fire here
             this.handleEvent_mainWave(e);*/
            console.log('minimap click? ', e)
        });

        this.miniWave_wrapper.addEventListener('dblclick', e => {
            // this.fireEvent('dblclick', e, this.handleEvent(e));  //TODO: create a new global canvas subject and fire here
        });

        /*   this.miniWave_wrapper.addEventListener('scroll', e => {
               // this.handleEvent_mainWave(e);
               // this.fireEvent('scroll', e) //TODO: create a new global canvas subject and fire here
           });*/
    }

    handleEvent_mainWave(e) {
        e.preventDefault();
        const clientX = e.targetTouches
            ? e.targetTouches[0].clientX
            : e.clientX;
        const bbox = this.miniWave_wrapper.getBoundingClientRect();
        const nominalWidth = this.width;
        const parentWidth = this.getContainerWidth();
        let progress;
        if (!this.fill && nominalWidth < parentWidth) {
            progress = (clientX - bbox.left) * (this.pixelRatio / nominalWidth) || 0;
            if (progress > 1) progress = 1;
        } else progress = (clientX - bbox.left + this.miniWave_wrapper.scrollLeft) / this.miniWave_wrapper.scrollWidth || 0;
        subjects.waveWrapper_state.next({type: e.type, value: progress});
    }

    getContainerWidth() {
        return Math.round(this.container.clientWidth * this.pixelRatio);
    }

    getWidth() {
        return this.width;
    }

    setWidth(width) {
        if (this.width == width) return false;

        this.width = width;

        if (this.fill || this.scroll) style(this.miniWave_wrapper, {width: ''});
        else style(this.miniWave_wrapper, {width: ~~(this.width / this.pixelRatio) + 'px'});

        this.updateSize();
        return true;
    }

    prepareDraw(peaks, channelIndex, start, end, fn) {
        return requestAnimationFrame(() => {
            // calculate maximum modulation value, either from the barHeight
            // parameter or if normalize=true from the largest value in the peak
            // set
            let absmax = 1 / this.amplitude;
            if (this.normalize) {
                const max = _.max(peaks);
                const min = _.min(peaks);
                absmax = -min > max ? -min : max;
            }

            // Bar wave draws the bottom only as a reflection of the top,
            // so we don't need negative values
            const hasMinVals = [].some.call(peaks, val => val < 0);
            const height = this.height * this.pixelRatio;
            const offsetY = height * channelIndex || 0;
            const halfH = height / 2;

            return fn({
                absmax: absmax,
                hasMinVals: hasMinVals,
                height: height,
                offsetY: offsetY,
                halfH: halfH,
                peaks: peaks
            });
        });
    }

    drawWave(peaks, channelIndex, start, end) {
        this.wave_canvas.clearWave();
        this.setContextStyles();
        return this.prepareDraw(
            peaks,
            channelIndex,
            start,
            end,
            ({absmax, hasMinVals, height, offsetY, halfH, peaks}) => {
                if (!hasMinVals) {
                    const reflectedPeaks = [];
                    const len = peaks.length;
                    let i = 0;
                    for (i; i < len; i++) {
                        reflectedPeaks[2 * i] = peaks[i];
                        reflectedPeaks[2 * i + 1] = -peaks[i];
                    }
                    peaks = reflectedPeaks;
                }
                if (start !== undefined) this.drawLine(peaks, absmax, halfH, offsetY);

                this.wave_canvas.mainWave_ctx.fillRect(start, this.height / 2, this.width, 1);
            }
        );
    }

    drawLine(peaks, absmax, halfH, offsetY) {
        this.wave_canvas.drawLine(peaks, absmax, halfH, offsetY);
    }

    //this function adds initialised canvases from m3daudio to this class so that it could update dimension of canvases in updateSize()
    //reasons 1. one wrapper can have multiple canvases 2. canvas' job is to clear and draw lines nothing to do with wrapper's updating size. 3. wrapper updates size followed by canvases 4. most properties used to update canvases size is in wrapper class
    addCanvases(waveCanvas) {
        this.wave_canvas = waveCanvas;
        this.miniWave_wrapper.appendChild(waveCanvas.mainWave_canvas);
        this.setCanvasStyles()
    }

    setContextStyles() {
        this.wave_canvas.setCtxWaveFillStyles(this.mainWaveStyle)
    }

    setCanvasStyles() {
        this.wave_canvas.setCanvasWaveBgStyles(this.mainWaveStyle)
    }

    updateSize() {
        const elementWidth = Math.round(this.width / this.pixelRatio);
        const totalWidth = Math.round(this.width / this.pixelRatio); //TODO: this.width not this.getWidth()
        this.wave_canvas.updateDimensions(elementWidth, totalWidth, this.width, this.height);
    }

    destroy() {
        this.container.removeChild(this.miniWave_wrapper);
    }
}
