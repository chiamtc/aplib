import {JSDOM} from 'jsdom';
import "web-audio-test-api";
import 'jest-canvas-mock';
import 'jest-fetch-mock';
// import AudioContext from "./deprecated_webaudio_mock";

const dom = new JSDOM();
// global.AudioContext = AudioContext;
global.window = dom.window;
global.document = dom.window.document;
