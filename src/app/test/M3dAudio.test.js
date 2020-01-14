import M3dAudio from "../M3dAudio";

describe('M3dAudio test suite', ()=>{
    beforeEach(() => {
    });

    it('constructor()' , ()=>{
        document.body.innerHTML =
            '<div><div id="waveform-container"/></div>';

        const m3daudio = new M3dAudio();

        expect(m3daudio).toBeInstanceOf(M3dAudio);
    });

    it('create()', ()=>{
        document.body.innerHTML =
            '<div><div id="waveform-container"/></div>';

        const m3daudio = new M3dAudio();

        m3daudio.create({
            container_id: '#waveform-container',
            filters: [],
            filterId: "F1",
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
    })

});
