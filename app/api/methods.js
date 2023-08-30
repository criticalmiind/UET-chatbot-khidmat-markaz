import { PermissionsAndroid, Alert, Platform } from 'react-native';
import { uid, wait } from "../utils";
import Sound from "react-native-sound";
import { call_application_manager, method } from '.';
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


export async function get_query_answers() {
    const { chat_list, last_ids_list } = this.state;
    const ids_list = Object.entries(last_ids_list).map(e => ({ "id": e[0], ...e[1] }))
    if (ids_list.length < 1) {
        this.setState({ "speakBlur": false })
    }

    ids_list.forEach(async (el) => {
        const qs = await this.dialogue_manager({ "textMessage": el.text })
        if (qs.resultFlag) {
            const textArr = qs.textResponse

            const { resultFlag, audioResponse, message } = await this.tts_manager({ "textMessage": textArr })

            const unique_id = uid();
            chat_list[unique_id] = {
                "unique_id": unique_id,
                "is_question": false,
                "text": textArr,
                "audio_files": resultFlag ? audioResponse : []
            }
            this.setState({ "chat_list": chat_list })

            await wait(500)
            if (resultFlag) this.onPlayBack(chat_list[unique_id], -1)
            else Alert.alert("Error", message)
        }
        await this.wait(500)
        this.setState({
            "last_ids_list": {},
            "last_id": false,
            "temp_text": ""
        })
    });
}

export async function onPlayBack(obj, index) {
    const { playState, last_played_voice } = this.state;

    await wait(100)
    if (obj['unique_id'] == last_played_voice['unique_id'] && last_played_voice['index'] == index) {
        if (playState == 'play') {
            if (this.Sound) this.Sound.pause()
            this.setState({ "playState": 'pause', "speakBlur": false })
            await wait(200)
            this.voicePlayerDurationService('off')
        }
        if (playState == 'pause' || playState == false) {
            if (this.Sound) this.Sound.play(() => { this.playComplete() })
            this.setState({ "playState": 'play' })
            await wait(200)
            this.voicePlayerDurationService('on')
        }
        return
    }

    if (this.Sound) await this.Sound.stop()
    this.Sound = null

    let i = 0
    // Single Audio
    if (index > -1) {
        for (let j = 0; j < obj['audio_files'].length; j++) {
            const el = obj['audio_files'][j];
            if (i == index) {
                this.setState({
                    "playState": 'paly',
                    "sliderValue": 0,
                    "last_played_voice": {
                        "unique_id": obj['unique_id'],
                        "duration": el['duration'],
                        "index": i
                    }
                })
                await this.play_message_handler(el['audio'], false)
            }
            i++
        };
    } else {
        // Audios List
        for (let j = 0; j < obj['audio_files'].length; j++) {
            const el = obj['audio_files'][j];
            await wait(500);
            this.setState({
                "playState": 'paly',
                "sliderValue": 0,
                "last_played_voice": {
                    "unique_id": obj['unique_id'],
                    "duration": el['duration'],
                    "index": i
                }
            })
            await this.play_message_handler(el['audio'], false)
            i++
        }
    }

    this.setState({ "speakBlur": false })
}

export async function play_message_handler(url, is_path = false) {
    let new_url = url
    if (this.Sound) await this.Sound.stop()
    this.Sound = null

    await this.wait(500)
    // if url is base64 string then make base64 into temp file path
    if (!is_path) {
        const path = `${RNFS.DocumentDirectoryPath}/temp_audio_file.wav`;
        await RNFS.writeFile(path, url.replace("data:audio/wav;base64,", ""), 'base64')
        new_url = path
    }
    return await new Promise(resolve => {
        this.Sound = new Sound(new_url, '', (err) => {
            this.onSoundPlay(err)
            if (err) {
                resolve()
            } else {
                this.Sound.play(async (s) => {
                    this.playComplete(s)
                    await this.wait(600)
                    resolve()
                })
            }
        })
    })
}

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
