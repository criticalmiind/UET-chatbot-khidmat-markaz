import { PermissionsAndroid, Alert, Platform } from 'react-native';
import AudioRecord from "react-native-audio-recording-stream";
import { makeAudioFileObj, uid } from "../utils";
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
    if (this.timeout) clearInterval(this.timeout);
    let audioPermission = await check_microphone();
    if (audioPermission) {
        if (recording) {
            this.setState({ "is_recording": recording, "last_id": uid() })
            if (this.Sound) this.Sound.stop()
            await this.wait(200)
            AudioRecord.start();
        } else {
            this.setState({ "is_recording": false, "last_id": false, "temp_text": "" })
            let audioFile = await AudioRecord.stop();
            await this.wait(200)
            this.get_query_answers()
        }
    } else {
        Alert.alert("Please Allow audio permission and try again!")
    }
    return false
}

export async function get_query_answers() {
    const { chat_list, last_ids_list } = this.state;
    const ids_list = Object.entries(last_ids_list).map(e => ({ "id": e[0], ...e[1] }))

    ids_list.forEach(async (el) => {
        const qs = await this.dialogue_manager({ "textMessage": el.text })
        if (qs.resultFlag) {
            const textArr = qs.textResponse

            const unique_id = uid();
            chat_list[unique_id] = { "is_question": false, "text": textArr }
            this.setState({ "chat_list": chat_list })

            const { resultFlag, audioResponse, message } = await this.tts_manager({ "textMessage": textArr })

            if (resultFlag) {
                let voiceFiles = {}
                textArr.forEach((txt, i) => { voiceFiles[txt] = audioResponse[i] });
                chat_list[unique_id] = { "is_question": false, "text": textArr, "voiceFiles": voiceFiles }

                this.setState({ "chat_list": chat_list })
                this.onPlayBack(unique_id, chat_list[unique_id], 0)
            } else {
                // this.setState({ "popup": { "show": true, "type": 'success', "message": translate(message) } })
                Alert.alert("Error", message)
            }
        }
        await this.wait(500)
        this.setState({
            "last_ids_list": {},
            "last_id": false,
            "temp_text": ""
        })
    });
}


export async function onPlayBack(text_id, obj, index) {

    let i = 0
    for (const id in obj['voiceFiles']) {
        const voiceFile = obj['voiceFiles'][id]
        this.setState({
            "playState": 'paly',
            "last_played_voice": {
                "duration": voiceFile['duration'],
                "index": i,
                "text_id": text_id
            }
        })
        await this.wait(600)
        await this.play_message_handler(voiceFile['audio'], false)
        i++
    }
}

export async function play_message_handler(url, is_path = false) {
    let new_url = url

    // if url is base64 string then make base64 into temp file path
    if (!is_path) {
        const path = `${RNFS.DocumentDirectoryPath}/temp_audio_file.wav`;
        await RNFS.writeFile(path, url.replace("data:audio/wav;base64,", ""), 'base64')
        new_url = path
    }

    return await new Promise(resolve => {
        if (this.Sound) this.Sound.stop()
        this.Sound = new Sound(new_url, '', (err) => {
            this.onSoundPlay(err)
            if (err) {
                resolve()
            } else {
                this.Sound.play(async(s) => {
                    this.playComplete(s)
                    await this.wait(600)
                    resolve()
                })
            }
        })
    })
}

// export async function onPlayBack(text_id, obj, index) {
//     const { chat_list } = this.state
//     const text = obj.text[index]
//     if (obj['voiceFiles'] && obj['voiceFiles'][text]) {
//         this.setState({
//             "playState": 'paly',
//             "last_played_voice": {
//                 "duration": obj['voiceFiles'][text]['duration'],
//                 "index": index,
//                 "text_id": text_id
//             },
//             "chat_list": chat_list
//         })
//         await this.wait(600)
//         this.play_message_handler(obj['voiceFiles'][text]['audio'], false)
//         return
//     }
//     const { resultFlag, audioResponse, message } = await this.tts_manager({ "textMessage": [obj.text[text]] })
//     if (resultFlag) {
//         const voiceBase64 = audioResponse.length > 0 ? audioResponse[0] : false
//         const files = makeAudioFileObj(obj.text[text], voiceBase64, obj['voiceFiles'])
//         chat_list[text_id] = { ...obj, "voiceFiles": files }
//         this.setState({
//             "playState": 'paly',
//             "last_played_voice": {
//                 "duration": voiceBase64['duration'],
//                 "index": index,
//                 "text_id": text_id
//             },
//             "chat_list": chat_list
//         })
//         await this.wait(600)
//         this.play_message_handler(voiceBase64['audio'], false)
//     } else {
//         this.setState({ popup: { "show": true, "type": "wrong", "message": translate(message + "") } })
//     }
// }

// export async function play_message_handler(url, is_path = false) {
//     if (!is_path) {
//         const path = `${RNFS.DocumentDirectoryPath}/test_audio_file.wav`;
//         await RNFS.writeFile(path, url.replace("data:audio/wav;base64,", ""), 'base64')
//             .then(() => {
//                 if (this.Sound) this.Sound.stop()
//                 this.Sound = new Sound(path, '', this.onSoundPlay.bind(this))
//             })
//     } else {
//         if (this.Sound) this.Sound.stop()
//         this.Sound = new Sound(url, '', this.onSoundPlay.bind(this))
//     }
// }

export async function close_connection() {
    const { sessionId } = this.props.userData;
    let obj = { "function": method["connectionClose"], "sessionId": sessionId, "connectionId": this.get_resource('cid') }
    try {
        let res = await call_application_manager(obj)
        return res
    } catch (error) {
        return { "resultFlag": false, "message": `${error}` }
    }
}
