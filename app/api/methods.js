import AudioRecord from "react-native-audio-record";
import { PermissionsAndroid, Alert, Platform, NativeModules } from 'react-native';
import { simplify, uid } from "../utils";
import { askQuestionApi, speechToTextApi, textTotSpeechApi } from './index';
import Sound from "react-native-sound";
var RNFS = require('react-native-fs');
const { RNAudioRecord } = NativeModules;

export const checkMicrophone = async () => {
    if (Platform.OS == 'android') {
        var result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (!result) {
            result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
        }
        result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        return result;
    } else {
        return true
    }
};

export const base64ToBlob = (base64, type = 'application/octet-stream') => fetch(`data:${type};base64,${base64}`).then(res => res.blob())

export async function speechToText() {
    const { is_recording } = this.state;
    let audioPermission = await checkMicrophone();
    if (audioPermission) {
        this.setState({ "is_recording": !is_recording })
        if (!is_recording) {
            AudioRecord.start();
        } else {
            let audioFile = await AudioRecord.stop();
            this.ws.send("EOS")
            setTimeout(() => {
                this.getQueriesAnswers()
            }, 500);
        }
    } else {
        Alert.alert("Please Allow audio permission and try again!")
    }
    return false
}

export async function getQueriesAnswers(){
    const { last_unread_msgs, chat_list, last_ids_list } = this.state;

    let ids_list = Object.entries(last_ids_list).map(e=>({ "id":e[0], ...e[1] }))
    ids_list.forEach(async(el) => {
        const qs = await askQuestionApi({ "message": el.text })
        // console.log("Query Ans Respnse:", qs)
    
        if (qs.length > 0) {
            const unique_id = uid();
            chat_list[unique_id] = { "is_question": false, "text": qs[0].text }
            this.setState({ "chat_list":chat_list })

            let ttsRes = await textTotSpeechApi({ "text": qs[0].text, "voice": "CLE_Naghma1", "rate": 2, "volume": 100 })

            if (ttsRes && ttsRes.response && ttsRes.response.status == 'ok') {

                last_unread_msgs[el.id] = { "is_question": false, "encodedFile": ttsRes.response.encodedFile }
                setTimeout(() => {
                    this.setState({ "last_unread_msgs":last_unread_msgs })
                    this.playMessageHandler(ttsRes.response.encodedFile)
                },500)
            }
        }
        setTimeout(() => {
            this.setState({ "last_ids_list":{} })
        }, 500);
    });
}

// export async function speechToText() {

//     const { is_recording, chat_list } = this.state;
//     let audioPermission = await checkMicrophone();
//     if (audioPermission) {
//         this.setState({ "is_recording": !is_recording })
//         if (!is_recording) {
//             AudioRecord.start();
//         } else {
//             let audioFile = await AudioRecord.stop();
//             this.ws.send("EOS")
//             return
//             let a = await RNFS.readFile(`${audioFile}`, 'base64')
//             let sttRes = await speechToTextApi({ "file": a, "lang": "ur", "srate": 16000 })
//             // console.log("Speech To Text Respnse:", sttRes)
//             if (simplify(sttRes.response.status) == 'ok') {

//                 chat_list.push({
//                     "is_question": true,
//                     "text": sttRes.response.text
//                 })
//                 this.setState({ chat_list })


//                 let qs = await askQuestionApi({ "message": sttRes.response.text })
//                 // console.log("Query Ans Respnse:", qs)
//                 qs.forEach(e => {
//                     chat_list.push({ "is_question": false, "text": e.text })
//                 });

//                 this.setState({ chat_list })

//                 if (qs.length > 0) {
//                     let ttsRes = await textTotSpeechApi({ "text": qs[0].text, "voice": "CLE_Naghma1", "rate": 2, "volume": 100 })
//                     // console.log("Text To Speech Respnse:", ttsRes)
//                     if (ttsRes && ttsRes.response && ttsRes.response.status == 'ok') {
//                         this.playMessageHandler(ttsRes.response.encodedFile)
//                     }
//                 }
//             }
//         }
//     } else {
//         Alert.alert("Please Allow audio permission and try again!")
//     }
//     return false
// }

export async function playMessage(base64) {
    const path = `${RNFS.DocumentDirectoryPath}/test_audio_file.wav`;
    await RNFS.writeFile(path, base64.replace("data:audio/wav;base64,", ""), 'base64')
        .then(() => {
            console.log("Path:", path)
            this.sound = new Sound(path, '', () => {
                this.sound.play((r) => {
                    // console.log("message play success:", r)
                })
            })
        })
}

export async function textToSpeech(text, voice = 'CLE_Naghma1') {
    const { chat_list } = this.state;
    let ttsRes = await textTotSpeechApi({ "text": text, "voice": voice, "rate": 3, "volume": 100 })
    console.log("Text To Speech Respnse:", ttsRes)
    if (simplify(ttsRes.response.status) == 'ok') {
        chat_list.push({
            "is_question": false,
            "text": text
        })
        this.setState({ chat_list })
    }
}