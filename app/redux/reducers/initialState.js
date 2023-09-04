import { uid } from "../../utils";

export const initialState = { 
    userData:{},
    resources:{},
    cityList: [],
    districtList: [],
    tehsilList: [],

    audioRecordingOptions:{
        sampleRate: 16000,  // default 44100
        channels: 1,        // 1 - mono or 2 - stero, default 1
        bitsPerSample: 16,  // 8 or 16, default 16
        chunkSize: 8192, // 1024, //2048, //4096, //8192
        wavFile: `audio-${uid()}.wav`, // default 'audio.wav'
    },
}