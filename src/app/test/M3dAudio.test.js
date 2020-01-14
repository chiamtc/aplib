import M3dAudio from "../M3dAudio";
import {UNREADY} from "../constants";
import {expect, assert} from 'chai';
import WaveWrapper from "../WaveWrapper";
import WaveCanvas from "../WaveCanvas";
import WebAudio from "../WebAudio";

describe('M3dAudio test suite', () => {
    it('constructor()', () => {
        document.body.innerHTML =
            '<div><div id="waveform-container"/></div>';

        const m3daudio = new M3dAudio();
        assert.instanceOf(m3daudio, M3dAudio);
        assert.isNull(m3daudio.wave_wrapper);
        assert.isNull(m3daudio.web_audio);
        assert.isNull(m3daudio.array_buffer);
        assert.isNull(m3daudio.defaultFilter);
        assert.isNull(m3daudio.filters);
        assert.isNull(m3daudio.filterId);
        assert.equal(m3daudio.web_audio_state, UNREADY);
        assert.equal(m3daudio.plugins, 0);
    });

    it('create()', () => {
        document.body.innerHTML =
            '<div><div id="waveform-container" style="width:\'600px\'"/></div>';

        const m3daudio = new M3dAudio();

        m3daudio.create({
            container_id: '#waveform-container',
            filters: [],
            filterId: "F1",
            height: 200,
            amplitude: 1,
            normalize: false,
            fill: true,
            scroll: true,
            minZoom: 20,
            maxZoom: 200,
            responsive: true,
            mainWaveStyle: {
                backgroundColor: 'transparent',
                lineColor: 'rgb(40, 170, 226, 0.5)'
            },
            progressWaveStyle: {
                backgroundColor: 'rgba(40, 170, 226,0.1)'
            },
            cursorStyle: {
                borderRightWidth: '2px',
                borderRightColor: 'red'
            },
        });

        assert.instanceOf(m3daudio.wave_wrapper, WaveWrapper);
        assert.instanceOf(m3daudio.wave_canvas, WaveCanvas);
        assert.instanceOf(m3daudio.wave_canvas.mainWave_canvas, HTMLCanvasElement);
        assert.instanceOf(m3daudio.wave_canvas.mainWave_ctx, CanvasRenderingContext2D);

        assert.instanceOf(m3daudio.wave_canvas.progressWave_canvas, HTMLCanvasElement);
        assert.instanceOf(m3daudio.wave_canvas.progressWave_ctx, CanvasRenderingContext2D);
        assert.instanceOf(m3daudio.web_audio, WebAudio);
    });

    it('create() -> load(url)', async() => {
        // global.fetch = jest.fn().mockImplementation(() => Promise.resolve());
        document.body.innerHTML = '<div><div id="waveform-container" style="width:\'600px\'"/></div>';
        const m3daudio = new M3dAudio();

        m3daudio.create({
            container_id: '#waveform-container',
            filters: [],
            filterId: "F1",
            height: 200,
            amplitude: 1,
            normalize: false,
            fill: true,
            scroll: true,
            minZoom: 20,
            maxZoom: 200,
            responsive: true,
            mainWaveStyle: {
                backgroundColor: 'transparent',
                lineColor: 'rgb(40, 170, 226, 0.5)'
            },
            progressWaveStyle: {
                backgroundColor: 'rgba(40, 170, 226,0.1)'
            },
            cursorStyle: {
                borderRightWidth: '2px',
                borderRightColor: 'red'
            },
        });

        assert.instanceOf(m3daudio.wave_wrapper, WaveWrapper);
        assert.instanceOf(m3daudio.wave_canvas, WaveCanvas);
        assert.instanceOf(m3daudio.wave_canvas.mainWave_canvas, HTMLCanvasElement);
        assert.instanceOf(m3daudio.wave_canvas.mainWave_ctx, CanvasRenderingContext2D);

        assert.instanceOf(m3daudio.wave_canvas.progressWave_canvas, HTMLCanvasElement);
        assert.instanceOf(m3daudio.wave_canvas.progressWave_ctx, CanvasRenderingContext2D);
        assert.instanceOf(m3daudio.web_audio, WebAudio);

        const res = await m3daudio.load('https://firebasestorage.googleapis.com/v0/b/podstetheedata.appspot.com/o/human_samples%2F-LvrfS3FUwxCIH8_3uT3.wav?alt=media&token=24d4a22a-793f-4d10-b2cb-3345e188fb6b');
        console.log('res',res)
    });



});
