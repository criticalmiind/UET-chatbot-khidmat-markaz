import AudioRecord from "react-native-audio-record";
import { PermissionsAndroid, Alert, Platform } from 'react-native';
import { simplify } from "../utils";
import { askQuestionApi, speechToTextApi, textTotSpeechApi } from './index';
import Sound from "react-native-sound";
var RNFS = require('react-native-fs');

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

export async function speechToText() {
    const { is_recording, chat_list } = this.state;
    let audioPermission = await checkMicrophone();
    if (audioPermission) {
        this.setState({ "is_recording": !is_recording })
        if (!is_recording) {
            AudioRecord.start();
        } else {
            let audioFile = await AudioRecord.stop();
            let a = await RNFS.readFile(`${audioFile}`, 'base64')
            let sttRes = await speechToTextApi({ "file": a, "lang": "ur", "srate": 16000 })
            console.log("Speech To Text Respnse:", sttRes)
            if (simplify(sttRes.response.status) == 'ok') {

                chat_list.push({
                    "is_question": true,
                    "text": sttRes.response.text
                })
                this.setState({ chat_list })


                let qs = await askQuestionApi({ "message": sttRes.response.text })
                console.log("Query Ans Respnse:", qs)
                qs.forEach(e => {
                    chat_list.push({ "is_question": false, "text": e.text })
                });

                this.setState({ chat_list })

                if (qs.length > 0) {
                    let ttsRes = await textTotSpeechApi({ "text": qs[0].text, "voice": "CLE_Naghma1", "rate": 2, "volume": 100 })
                    console.log("Text To Speech Respnse:", ttsRes)
                    if (ttsRes && ttsRes.response && ttsRes.response.status == 'ok') {
                        this.playMessageHandler(ttsRes.response.encodedFile)
                    }
                }
            }
        }
    } else {
        Alert.alert("Please Allow audio permission and try again!")
    }
    return false
}

export async function playMessage(base64) {
    const path = `${RNFS.DocumentDirectoryPath}/test_audio_file.wav`;
    await RNFS.writeFile(path, base64.replace("data:audio/wav;base64,", ""), 'base64')
        .then(() => {
            this.sound = new Sound(path, '', () => {
                this.sound.play((r) => {
                    console.log("message play success:", r)
                })
            })
        })
}

export async function textToSpeech(text, voice = 'CLE_Naghma1') {
    const { chat_list } = this.state;
    let ttsRes = await textTotSpeechApi({ "text": text, "voice": voice, "rate": 2, "volume": 100 })
    console.log("Text To Speech Respnse:", ttsRes)
    if (simplify(ttsRes.response.status) == 'ok') {
        chat_list.push({
            "is_question": false,
            "text": text
        })
        this.setState({ chat_list })
    }
}