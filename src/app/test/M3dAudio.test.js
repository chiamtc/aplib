import M3dAudio from "../M3dAudio";
import {UNREADY} from "../constants";
import {assert} from 'chai';
import WaveWrapper from "../WaveWrapper";
import WaveCanvas from "../WaveCanvas";
import WebAudio from "../WebAudio";
import {listOfFilter} from "../constants/filterschema";
import canvasSerializer from "jest-canvas-snapshot-serializer";

expect.addSnapshotSerializer(canvasSerializer);
describe('M3dAudio test suite', () => {
    beforeAll(()=>{
        document.body.innerHTML = '<div style="width:\'600px\'"><div id="waveform-container" /></div>';
    })
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

    //note, once load() is done in real application, it executes decoding of arraybuffer, instantiates with webaduio class and drawing waveform
    it('create() -> load(url)', async() => {
        // global.fetch = jest.fn().mockImplementation(() => Promise.resolve());

        const m3daudio = new M3dAudio();
        m3daudio.create({
            container_id: '#waveform-container',
            filters: listOfFilter,
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

        //tests from here onward using expect/assertion is tailored to pass this audio url
        const res = await m3daudio.load('https://firebasestorage.googleapis.com/v0/b/podstetheedata.appspot.com/o/human_samples%2F-LvrfS3FUwxCIH8_3uT3.wav?alt=media&token=24d4a22a-793f-4d10-b2cb-3345e188fb6b');
        assert.instanceOf(m3daudio.array_buffer, ArrayBuffer);
        assert.equal(m3daudio.array_buffer.byteLength, 640044);
        //can't assert canvas drawing, might need to test it with cypress
        m3daudio.playPause()
    });

    xit('play()', async() => {
        // global.fetch = jest.fn().mockImplementation(() => Promise.resolve());

        const m3daudio = new M3dAudio();
        m3daudio.create({
            container_id: '#waveform-container',
            filters: listOfFilter,
            filterId: "F1",
            width:600,
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
            plugins:[]
        });
        assert.instanceOf(m3daudio.wave_wrapper, WaveWrapper);
        assert.instanceOf(m3daudio.wave_canvas, WaveCanvas);
        assert.instanceOf(m3daudio.wave_canvas.mainWave_canvas, HTMLCanvasElement);
        assert.instanceOf(m3daudio.wave_canvas.mainWave_ctx, CanvasRenderingContext2D);

        assert.instanceOf(m3daudio.wave_canvas.progressWave_canvas, HTMLCanvasElement);
        assert.instanceOf(m3daudio.wave_canvas.progressWave_ctx, CanvasRenderingContext2D);
        assert.instanceOf(m3daudio.web_audio, WebAudio);

        //tests from here onward using expect/assertion is tailored to pass this audio url
        const res = await m3daudio.load('https://firebasestorage.googleapis.com/v0/b/podstetheedata.appspot.com/o/human_samples%2F-LvrfS3FUwxCIH8_3uT3.wav?alt=media&token=24d4a22a-793f-4d10-b2cb-3345e188fb6b');
        assert.instanceOf(m3daudio.array_buffer, ArrayBuffer);
        assert.equal(m3daudio.array_buffer.byteLength, 640044);
        //can't assert canvas drawing, might need to test it with cypress

        // m3daudio.playPause();
        // console.log(m3daudio.gain)
    });
});
