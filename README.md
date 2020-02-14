# aplib

## Installation

`npm i @m3dicine/audio`


## Usage

##### too lazy to write it up.


## Testing

1. use `ap/` and spins up localhost:9000 or go to /workspace in @m3dicine/core and run `"make:playground:audioplayer"`  
2. `npm run test:e2e:chrome / firefox / safari`
3. ??
4. checks `src/app/test/e2e/<browser>-test-results`

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

