import { PermissionsAndroid, Alert, Platform } from 'react-native';
import AudioRecord from "react-native-audio-recording-stream";
import { isNullRetNull, jsonParse, notify, simplify, uid } from "../utils";
import Sound from "react-native-sound";
import { call_application_manager, method } from '.';
import { translate } from '../i18n';
var RNFS = require('react-native-fs');

export const check_microphone = async () => {
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

export const base64_into_blob = (base64, type = 'audio/x-raw') => fetch(`data:${type};base64,${base64}`).then(res => res.blob())

export async function on_mic_click(recording) {
    const { is_recording } = this.state;
    let audioPermission = await check_microphone();
    if (audioPermission) {
        if (!is_recording) {
            this.setState({ "is_recording": recording, "last_id": uid() })
            if (this.Sound) this.Sound.stop()
            AudioRecord.start();
        } else {
            // this.ws.send("eos")
            this.setState({
                "is_recording": false,
                "last_id": false,
                "temp_text": ""
            })
            let audioFile = await AudioRecord.stop();
            setTimeout(() => {
                this.get_query_answers()
            }, 200);
        }
    } else {
        Alert.alert("Please Allow audio permission and try again!")
    }
    return false
}

export async function get_query_answers() {
    const { last_unread_msgs, chat_list, last_ids_list } = this.state;

    let ids_list = Object.entries(last_ids_list).map(e => ({ "id": e[0], ...e[1] }))
    ids_list.forEach(async (el) => {
        const qs = await this.dialogue_manager({ "textMessage": el.text })
        if (qs.resultFlag) {
            console.log(qs);
            // let cleared_text = isNullRetNull(qs.textResponse,"").split("!")[0]
            let cleared_text = qs.textResponse
            // isNullRetNull(qs.textResponse, "")

            const unique_id = uid();
            chat_list[unique_id] = { "is_question": false, "text": cleared_text.toString() }
            this.setState({ "chat_list": chat_list })
            
            const { resultFlag, audioResponse, message } = await this.tts_manager({ "textMessage": [cleared_text.toString()] })
            if (resultFlag) {
                let encodedFile = audioResponse.length>0?audioResponse[0].audio:''
                let duration = parseFloat(audioResponse.length>0?audioResponse[0].duration:0)
                last_unread_msgs[el.id] = { "is_question": false, "encodedFile": encodedFile, "duration":duration }
                setTimeout(() => {
                    this.setState({ "last_unread_msgs": last_unread_msgs })
                    this.play_message_handler(encodedFile, false)
                }, 500)
            }else{
                this.setState({ popup: { "show": true, "type":'success', "message": translate(message) } })
            }
        }
        setTimeout(() => {
            this.setState({
                "last_ids_list": {},
                "last_id": false,
                "temp_text": ""
            })
        }, 500);
    });
}

export async function onPlayBack(text_id, obj, callback=(e)=>{}) {
    const { palyState, chat_list } = this.state
    if(obj.encodedFile){
        this.play_message_handler(obj.encodedFile, false, callback)
        return
    }
    const { resultFlag, audioResponse, message } = await this.tts_manager({ "textMessage": [obj.text] })
    if(resultFlag){
        let encodedFile = audioResponse.length>0?audioResponse[0].audio:''
        let duration = parseFloat(audioResponse.length>0?audioResponse[0].duration:0)
        chat_list[text_id] = { ...obj, "duration":duration, "encodedFile":encodedFile  }
        this.setState({ "playState":'paly', "chat_list":chat_list })

        setTimeout(() => {
            this.play_message_handler(encodedFile, false, callback)
        }, 500)
    }else{
        this.setState({ popup: { "show": true, "type": "wrong", "message": translate(message+"") } })
    }
}

export async function play_message_handler(url, is_path = false, callback=(e)=>{}) {
    // const { is_recording } = this.state
    // if (!is_recording) return
    if (!is_path) {
        const path = `${RNFS.DocumentDirectoryPath}/test_audio_file.wav`;
        await RNFS.writeFile(path, url.replace("data:audio/wav;base64,", ""), 'base64')
            .then(() => {
                if (this.Sound) this.Sound.stop()
                this.Sound = new Sound(path, '', () => {
                    this.Sound.play((r) => {
                        if(callback) callback(r)
                    })
                })
            })
    } else {
        if (this.Sound) this.Sound.stop()
        this.Sound = new Sound(url, '', () => {
            this.Sound.play((r) => {
                if(callback) callback(r)
            })
        })
    }
}

export async function close_connection() {
    const { sessionId } = this.props.userData;
    let obj = { "function": method["connectionClose"], "sessionId":sessionId, "connectionId":this.get_resource('cid') }
    try {
        let res = await call_application_manager(obj)        
        return res
    } catch (error) {
        return { "resultFlag":false, "message":`${error}` }
    }
}
