# audio player (ap)

audio player

workflow
1. get .wav via url using fetch api
2. decode audio using web audio api
3. apply audio data (getChannelData(0) one channel only) with custom filter schema (should use webaudio api iirfilter)
4. fft with configuration (hann algorithm by default) and resample fft frequency in web worker to avoid blocking main thread
5. drawing data with chromajs on canvas
6. plugins -> minimap, spectrogram, spectrogram frequency labels and timeline.

All elements mentioned above follows in DOM structure

```
<xx>
    <canvas></canvas>
</xx>
```

E.g.

```
<mainwave>
    <canvas></canvas>
</mainwave>
```


Used in central

```
<div>
    <timeline-top>
        <canvas></canvas>
    </timeline-top>
    <mainwave>
        <canvas></canvas>
        <progresswave>
            <canvas></canvas>
        </progresswave>
    </mainwave>
    <spectrogram>
        <spectrogram-frequency-label>
            <canvas></canvas>
        </spectrogram-frequency-label>
        <canvas></canvas>
    </spectrogram>
    <timeline-bottom>
        <canvas></canvas>
    </timeline-bottom>

</div>
```
## Usage

##### too lazy to write it up.


TODO:
- [x] util/ to use fetch api
- [x] webaudio as backend api for audio decoding
- [x] fft audio arraybuffer
- [x] canvas drawing for both waveform 
- [x] plugins - fft, minimap and timeline
- [x] web workers (second thread) to work on 1. fft an audio arraybuffer.  2. resample fft data and color using chromajs 3. ??
- [x] webdriver (selenium) to test most of the use cases 
- [ ] update test cases because of types of waveform visibility via drop-down menu
- [ ] ~~indexeddb to store fft and decoded filtered audio arraybuffer based on sampleId (prolly on central instead of this repo)~~
implement a flag to draw using data from indexeddb to skip fft process
- [ ] picture-in-picture. some idea: https://googlechrome.github.io/samples/picture-in-picture/audio-playlist. the article: https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture#show_canvas_element_in_picture-in-picture_window
- [ ] WASM audio decoding (better performance boost than web worker)
- [ ] WASM fft  (better performance boost than web worker)
- [ ] WASM drawing (better performance boost than web worker)

