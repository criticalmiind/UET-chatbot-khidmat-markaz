import { PermissionsAndroid, Alert, Platform, NativeModules } from 'react-native';
import AudioRecord from "react-native-audio-record";
import { simplify, uid } from "../utils";
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

export const base64ToBlobFetch = (base64, type = 'audio/x-raw') => fetch(`data:${type};base64,${base64}`).then(res => res.blob())

export async function onMicClick() {
    const { is_recording } = this.state;
    let audioPermission = await checkMicrophone();
    if (audioPermission) {
        this.setState({ "is_recording": !is_recording })
        if (!is_recording) {
            AudioRecord.start();
            if(this.sound) this.sound.stop()
        } else {
            let audioFile = await AudioRecord.stop();
            // console.log(audioFile)
            // this.playMessageHandler(audioFile, true)
            if(this.ws.readyState == 1) this.ws.send("EOS")
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
        console.log("qs", el)
        const qs = await askQuestionApi({ "message": el.text })
        console.log("qs", qs)

        if (qs.length > 0) {
            const unique_id = uid();
            chat_list[unique_id] = { "is_question": false, "text": qs[0].text }
            this.setState({ "chat_list":chat_list })

            const ttsRes = await textTotSpeechApi({ "text": qs[0].text, "voice": "CLE_Naghma1", "rate": 0, "volume": 100 })
            console.log("ttsRes", ttsRes)

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

export async function playMessage(url, is_path=false) {
    if(!is_path){
        const path = `${RNFS.DocumentDirectoryPath}/test_audio_file.wav`;
        await RNFS.writeFile(path, url.replace("data:audio/wav;base64,", ""), 'base64')
            .then(() => {
                console.log("Path:", path)
                this.sound = new Sound(path, '', () => {
                    this.sound.play((r) => {
                        // console.log("message play success:", r)
                    })
                })
            })
    }else{
        this.sound = new Sound(url, '', () => {
            this.sound.play((r) => {
                // console.log("message play success:", r)
            })
        })
    }
}

export async function textToSpeech(text, voice = 'CLE_Naghma1') {
    const { chat_list } = this.state;
    let ttsRes = await textTotSpeechApi({ "text": text, "voice": voice, "rate": 0, "volume": 100 })
    console.log("Text To Speech Respnse:", ttsRes)
    if (simplify(ttsRes.response.status) == 'ok') {
        chat_list.push({
            "is_question": false,
            "text": text
        })
        this.setState({ chat_list })
    }
}

export async function run_scripts(string) {
    const rawResponse = await fetch(`http://lovopyda.pythonanywhere.com/`, {
    // const rawResponse = await fetch(`http://192.168.1.193:8000/`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ "base64": string })
    })
    const content = await rawResponse.blob();
    return content;
}