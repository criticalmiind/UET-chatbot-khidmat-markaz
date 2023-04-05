import { uid } from "../../utils";

export const initialState = {
    userData:{},
    resources:{},
    audioRecordingOptions:{
        sampleRate: 16000,  // default 44100
        channels: 1,        // 1 or 2, default 1
        bitsPerSample: 16,  // 8 or 16, default 16
        chunkSize: 1024, // 1024, //2048, //4096, //8192
        wavFile: `audio-${uid()}.wav`, // default 'audio.wav'
    },
}