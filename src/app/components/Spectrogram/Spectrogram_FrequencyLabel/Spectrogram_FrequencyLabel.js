import style from "../../../util/Style";

export default class Spectrogram_FrequencyLabel {
    //TODO: left/right
    constructor(parameter) {
        const {spectrogram, params} = parameter;
        this.spectrogram = spectrogram;
        this.spectrogramFreqLabels = null;
        this.spectrogramFreqLabelsCtx = null;
        this.width = params.width;
        this.background = params.backgroundColor;
        this.yLabelOffset = params.yLabelOffset;
        this.xLabelOffset = params.xLabelOffset;
        this.strideWidth = params.strideWidth;
        //TODO: Font class?
        this.fontSize = params.fontSize;
        this.fontWeight = params.fontWeight;
        this.fontFamily = params.fontFamily;
        this.fontColor = params.fontColor;
    }

    createFreqLabels() {
        const freqLabels = document.createElement('spectrogram-freq-labels');
        this.spectrogramFreqLabels = freqLabels;
        this.spectrogram.wrapper.appendChild(this.spectrogramFreqLabels);
        style(this.spectrogramFreqLabels, {
            //TODO: fix this shit
            display: 'block',
            position: 'absolute',
            top: 0,//`-${this.spectrogram.height}px`,
            height: `${this.spectrogram.height}px`,
            width: `${this.width}px`
        });
        const freqLabelCanvas = document.createElement('canvas');
        this.spectrogramFreqLabels.appendChild(freqLabelCanvas);
        this.spectrogramFreqLabelsCtx = freqLabelCanvas.getContext('2d');

        freqLabelCanvas.width = this.width;
        freqLabelCanvas.height = this.spectrogram.height;
        this.setCanvasStyle();
        style(freqLabelCanvas, {
            position: 'absolute',
            background: this.background,
            zIndex: 10,
            height: `${this.spectrogram.height}px`,
            width: `${this.width}px`,
            left: 0,
            top: 0,
        });
    }

    renderAxesLabels = () => {
//inspiration : https://academo.org/demos/spectrum-analyzer/
//source 1: https://github.com/borismus/spectrogram/blob/master/g-spectrogram.js#L140
//source 2: https://github.com/katspaugh/wavesurfer.js/blob/master/src/plugin/spectrogram.js#L563
        const ticks = 5; //adjustable
        const startFreq = 0;
        const nyquistFreq = this.spectrogram.m3dAudio.web_audio.audioContext.sampleRate / 2;
        const endFreq = nyquistFreq - startFreq;
        const step = (endFreq - startFreq) / ticks;
        const yLabelOffset = this.yLabelOffset;
        const xLabelOffset = this.xLabelOffset - this.strideWidth > 0 ? this.xLabelOffset : this.strideWidth + 5;


        for (let i = 0; i < ticks; i++) {
            const freq = endFreq - (step * i);
            const index = Math.round(freq / nyquistFreq * this.spectrogram.fftSamples);
            const percent = index / this.spectrogram.fftSamples;
            const x = 0;
            const y = Math.abs((1 - percent)) * this.spectrogram.height;

            this.spectrogramFreqLabelsCtx.fillRect(x, y + (yLabelOffset / 2), this.strideWidth, 2);  //adjustable for rect ?
            const freqStr = `${this.formatFreq(freq).toString()} ${this.formatUnit(freq)}`;
            this.spectrogramFreqLabelsCtx.fillText(freqStr, x + xLabelOffset, y + yLabelOffset);
        }
    };

    formatFreq(freq) {
        return freq >= 1000 ? (freq / 1000).toFixed(1) : Math.round(freq);
    }

    formatUnit(freq) {
        return freq >= 1000 ? 'KHz' : 'Hz';
    }

    setCanvasStyle() {
        this.setFontColor(this.fontColor);
        this.setFonts(this.fontSize, this.fontFamily);
        this.setFontWeight(this.fontWeight);
    }

    setFonts(fontSize, fontFamily) {
        this.spectrogramFreqLabelsCtx.font = `${fontSize}px ${fontFamily}`;
    }

    setFontWeight(fontWeight) {
        this.spectrogramFreqLabelsCtx.font = `${fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    }

    setFontColor(fontColor) {
        this.spectrogramFreqLabelsCtx.fillStyle = fontColor;
    }
}
/*
{
    yLabelOffset,
    xLabelOffset,
    width,
    ticks,
    backgroundColor,
}
 */
