import {subjects} from "../../M3dAudio";
import FFT from '../../util/FFT'
/**
 * 1. create wrapper
 * 2. create canvas
 * 3. update canvas width + height + styling
 * 4. getFrequencies() with callback as parameter
 *     4.1  retrieves all audiobuffer data (channeldata, samplerate etc etc)
 *     4.2  check if overlap , true ? get max value based on the canvas width and buffer, false? 4.3
 *     4.3 new fft instance
 *     4.4 slicing channelone data into chunks depending on fftsampleSize (512,1024 ...).
 *          4.4.1 Immediately, calculate spectrum via fftinstance on each chunk
 *          4.4.2 push each chunk into frequencies []  and increase currentOffset by ffySample for next chunk to start and iterate
 * 5. drawing spectrogram using frequencies[]
 * 6. resample() immediately to the pixels (some complex loops and etc)
 * 7. x2 forloop to draw on canvas
 */

import style from "../../util/Style";
import {CHANGE_FILTER, CLICK, RESIZE, ZOOM} from "../../constants";
import isEmpty from 'lodash/isEmpty';
import Spectrogram_FrequencyLabel from "./Spectrogram_FrequencyLabel/Spectrogram_FrequencyLabel";
//useful repo
//https://github.com/borismus/spectrogram
// dsp.js

/*
https://github.com/rustwasm/wasm-bindgen/issues/1480 this guy used promise.all() and callback
 */
//TODO: read fft topic
// spectrogram and PCG scientific paper: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1899182/ << uses STFT instead of FFT
// https://academo.org/demos/spectrum-analyzer/ //great js program to check. it has linear and logarithmic freq scale
// https://github.com/borismus/spectrogram //insanely good READ. logarithmic scale
// https://dsp.stackexchange.com/questions/42428/understanding-overlapping-in-stft
// https://dsp.stackexchange.com/questions/47448/window-periodoverlap-and-fft
// OG fft + spectrogram code https://developer.mozilla.org/en-US/docs/Archive/Misc_top_level/Visualizing_Audio_Spectrum

//TODO: read spectrogram drawing topic
// even better read: https://noisehack.com/build-music-visualizer-web-audio-api/
//http://arc.id.au/Spectrogram.html
//https://github.com/bastibe/WebGL-Spectrogram
// https://stackoverflow.com/questions/57125984/how-can-i-add-a-glsl-fragment-shader-audio-visualization/57126857#57126857
// https://github.com/a-vis/gl-spectrogram
class Spectrogram {
    constructor(params, m3dAudio) {
        this.wasm = params.wasmInstance;
        this.m3dAudio = m3dAudio;
        this.container_id = params.container_id;
        this.canvas_id = `${this.container_id.split('#')[1]}-canvas`; //for wasm
        this.container = null;
        this.wrapper = null;
        if (!params.colorMap) {
            throw new Error('No colorMap parameter found.')
        } else {
            if (!params.colorMap instanceof Array) {
                throw new Error('"colorMap" param is not an array of string. Provide in such format ["#ffffff", "#000000", ...]')
            }
        }
        this.colorMap = params.colorMap;
        this.spectrogramCanvas = null;
        this.spectrogramCtx = null;
        this.spectrumGain = params.spectrumGain || 100;
        this.drawer = m3dAudio.wave_wrapper;
        this.pixelRatio = m3dAudio.wave_wrapper.pixelRatio;
        this.fftSamples = params.fftSamples || 512;
        this.noverlap = params.noverlap;
        this.windowFunc = params.windowFunc;
        this.alpha = params.alpha;
        this.height = m3dAudio.wave_wrapper.height;
        this.width = m3dAudio.wave_wrapper.width;
        this.maxCanvasWidth = this.m3dAudio.wave_wrapper.maxCanvasWidth;
        this.maxCanvasElementWidth = this.drawer.maxCanvasElementWidth || Math.round(this.maxCanvasWidth / this.pixelRatio);
        this.fill = true;
        this.scroll = true;
        this.drawer = null; //aka wrapper;
        this.web_audio = null; //aka web_audio
        this.spectrogramFreqLabels = params.spectrogramFreqLabels;
        this.offscreenCanvasSupport = false;
        this.offscreenCanvas = null;
        //TODO: have a feature detection class
        try {
            const c = document.createElement('canvas');
            c.setAttribute('id', 'feature-detection-canvas');
            c.transferControlToOffscreen().getContext('2d');
            this.offscreenCanvasSupport = true;
        } catch (e) {
            this.offscreenCanvasSupport = false;
        }
    }

    init() {
        this.setM3dAudioState();
        this.createContainer();
        this.createWrapper();
        this.createCanvas();
        this.renderSpectrogram();
        this.createFreqLabels();
        this.m3dAudio.wave_wrapper.mainWave_wrapper.addEventListener('scroll', this.onScroll);
        subjects.m3dAudio_control.subscribe((res) => {
            switch (res.type) {
                case CHANGE_FILTER:
                    this.clearCanvas();
                    this.renderSpectrogram();
                    break;
                case ZOOM:
                    // const scrollbarHeight = this.m3dAudio.wave_wrapper.height - this.m3dAudio.wave_wrapper.progressWave_wrapper.scrollHeight;
                    // scrollbarHeight !== 0 ? style(this.container, {top: `-${this.height + scrollbarHeight}px`}) : style(this.container, {top: `-${this.height}px`});
                    this.clearCanvas();
                    this.renderSpectrogram();
                    break;
            }
        });

        subjects.waveWrapper_state.subscribe((i) => {
            switch (i.type) {
                case RESIZE:
                    this.clearCanvas();
                    this.renderSpectrogram();
                    break;
            }
        });
    }

    setM3dAudioState() {
        this.drawer = this.m3dAudio.wave_wrapper;
        this.web_audio = this.m3dAudio.web_audio;
        this.fill = this.m3dAudio.fill;
        this.scroll = this.m3dAudio.scroll;
    }

    createContainer() {
        const container = document.querySelector(this.container_id);
        if (!container) throw new Error("No container element id found. Pass container id as a string.");
        else this.container = container;
    }

    createWrapper() {
        if (!this.wrapper) {
            const wrapper = document.createElement('spectrogram');
            this.wrapper = this.container.appendChild(wrapper);
            style(this.container, {
                display: 'block',
                position: 'relative',
                top: `-${this.height}px`,
                width: '100%'
            });

            style(this.wrapper, {
                display: 'block',
                position: 'absolute',
                height: `${this.height}px`
            });

            if (this.fill || this.scroll) {
                style(this.wrapper, {
                    width: '100%',
                    overflowX: 'hidden',
                    overflowY: 'hidden'
                });
            }
        }
    }

    createCanvas() {
        const canvasEle = document.createElement('canvas');
        if (!this.offscreenCanvasSupport) {
            canvasEle.setAttribute("id", this.canvas_id);
            this.spectrogramCanvas = this.wrapper.appendChild(canvasEle);
            this.spectrogramCtx = this.spectrogramCanvas.getContext('2d', {
                preserveDrawingBuffer: true,
                desynchronized: true
            });
            this.spectrogramCtx.imageSmoothingEnabled = true;
            style(this.spectrogramCanvas, {
                position: 'absolute',
                zIndex: 4,
                left: 0,
            });
        }
    }

    renderSpectrogram() {
        if (this.offscreenCanvas !== null) {
            this.container.removeChild(this.wrapper);
            this.wrapper = null;
            this.createWrapper();
            this.createCanvas();
        }
        if (this.offscreenCanvasSupport) {
            this.spectrogramCanvas = document.createElement('canvas');
            this.wrapper.appendChild(this.spectrogramCanvas);
            this.spectrogramCanvas.width = this.width;
            this.spectrogramCanvas.height = this.height;
        }
        this.calculateSpectrogramFrequency();
    }

    calculateSpectrogramFrequency() {
        const canvasWidth = this.drawer.mainWave_wrapper.scrollWidth - this.maxCanvasElementWidth * 0;
        this.spectrogramCanvas.width = canvasWidth * this.pixelRatio;
        this.spectrogramCanvas.height = (this.height + 1) * this.pixelRatio;
        this.spectrogramCanvas.style.width = canvasWidth; //irrelevant
        this.width = this.drawer.width;
        //TODO add loadFrequenciesData() by fetching them via url ?
        if (this.web_audio.filteredBuffer !== null) {
            this.m3dAudio.worker.postMessage({
                type: 'ww_getFrequencies',
                data: {
                    fftSamples: this.fftSamples,
                    buffer: {
                        channelData: this.web_audio.filteredBuffer.getChannelData(0),
                        length: this.web_audio.filteredBuffer.length, //TODO: optional to divide by 6 here
                        sampleRate: this.web_audio.filteredBuffer.sampleRate //TODO: optional to divide by 6 here
                    },
                    noverlap: this.noverlap,
                    width: this.drawer.width,
                    windowFunc: this.windowFunc,
                    alpha: this.alpha,
                }
            });
            this.m3dAudio.worker.onmessage = (event) => this.drawSpectrogram(event.data, this);
        }
    }

    drawSpectrogram(frequenciesData, my) {
        this.m3dAudio.worker.postMessage({
            type: 'ww_resample',
            data: {
                oldMatrix: frequenciesData,
                resample_width: this.width,
                colorMap: this.colorMap,
                spectrumGain: this.spectrumGain
            }
        });

        this.m3dAudio.worker.onmessage = (event) => {
            // console.log(window.indexedDB)
            //  window.indexedDB = window.indexedDB; // || window.mozIndexedDB ||    window.webkitIndexedDB || window.msIndexedDB;

            /*            var db;
                        var request = window.indexedDB.open("newDatabase", 1);

                        request.onerror = function(event) {
                            console.log("error: ");
                        };

                        request.onsuccess = function(event) {
                            db = request.result;
                            console.log("success: "+ db);
                        };

                        request.onupgradeneeded = function(ibdevent) {
                            var db = ibdevent.target.result;
                            var objectStore = db.createObjectStore("employee", {keyPath: "id"});

                            for (var i in employeeData) {
                                objectStore.add(employeeData[i]);
                            }


            /*    var request = db.transaction(["employee"], "readwrite")
                    .objectStore("employee")
                    .add({ id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" });

                request.onsuccess = function(event) {
                    alert("Kenny has been added to your database.");
                };

                request.onerror = function(event) {
                    alert("Unable to add data\r\nKenny is aready exist in your database! ");
                }
            // }

            //prefixes of window.IDB objects
              window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
              window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange*/

            requestAnimationFrame(() => {
                const pixels = event.data;
                /* //og code
                    const height = my.height;
                 const heightFactor = my.buffer ? 2 / my.buffer.numberOfChannels : 1;
                    for (let i = 0; i < pixels.length; i++) { //O(n^2) runtime
                        for (let j = 0; j < pixels[i].length; j++) {
                            my.spectrogramCtx.beginPath();
                            my.spectrogramCtx.fillStyle = pixels[i][j];
                            my.spectrogramCtx.fillRect(i, height - j * heightFactor, 1, heightFactor);
                            my.spectrogramCtx.fill();
                        }
                    }*/

                if (this.offscreenCanvasSupport) {
                    this.offscreenCanvas = this.spectrogramCanvas.transferControlToOffscreen();
                    this.m3dAudio.worker.postMessage({
                        type: 'ww_offscreen_spectrogram',
                        data: {
                            canvas: this.offscreenCanvas,
                            offScreenHeight: this.height,
                            offScreenWidth: this.width,
                            pixels: event.data
                        }
                    }, [this.offscreenCanvas]);
                    this.m3dAudio.worker.onmessage = (event) => {
                        this.spectrogramCanvas = null;
                    }
                } else {
                    if (this.wasm) {
                        this.wasm.draw_spec(this.canvas_id, this.height, pixels);
                    } else {
                        const height = my.height;
                        const heightFactor = my.buffer ? 2 / my.buffer.numberOfChannels : 1;
                        for (let i = 0; i < pixels.length; i++) { //O(n^2) runtime
                            for (let j = 0; j < pixels[i].length; j++) {
                                my.spectrogramCtx.beginPath();
                                my.spectrogramCtx.fillStyle = pixels[i][j];
                                my.spectrogramCtx.fillRect(i, height - j * heightFactor, 1, heightFactor);
                                my.spectrogramCtx.fill();
                            }
                        }
                    }
                }
            });
        };
    }

    clearCanvas = () => {
        if (!this.offscreenCanvasSupport) this.spectrogramCtx.clearRect(0, 0, this.spectrogramCtx.canvas.width, this.spectrogramCtx.canvas.height);
        else this.spectrogramCanvas = null;
    };

    onScroll = () => this.wrapper.scrollLeft = this.drawer.mainWave_wrapper.scrollLeft;

    show = () => style(this.container, {display: 'block', top: `-${this.m3dAudio.wave_wrapper.height}px`}); //hard-coded top:{}

    hide = () => style(this.container, {display: 'none'});

    destroy = () => {
        this.m3dAudio.worker.terminate();
        this.container.removeChild(this.wrapper);
    }

    createFreqLabels() {
        if (!isEmpty(this.spectrogramFreqLabels)) {
            const s = new Spectrogram_FrequencyLabel({spectrogram: this, params: this.spectrogramFreqLabels});
            s.createFreqLabels();
            s.renderAxesLabels(); //suppose to be in a different function
        }
    }
}

/**
 * Note:
 * 1. performance on drawing is significantly faster if I use hex() on colorColumn[m] (new array) and pushes to newMatrix[] rather than process it in drawSpectrogram's 2nd for loop (first loop length =600[width of canvas] and second loop = fftSamples/2)
 * 2. performance for fft itself.
 * TODO 1. wasm  (doable but not deployable)
 *      2. web-worker (doable)
 *      3. find even faster fft algo in dsp.js
 *      4.
 */

export default Spectrogram;
