import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    Image,
    Platform,
    BackHandler,
    StatusBar,
    Alert
} from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { get_resource, hp, isNullRetNull, uid, wp } from './../utils';
import AudioRecord from 'react-native-audio-recording-stream';
import {
    base64_into_blob,
    check_microphone,
    get_query_answers,
    play_message_handler,
    on_mic_click,
    close_connection,
    onPlayBack
} from '../api/methods';
import { LogoWhite, MicIcon, SvgBackIcon } from '../constants/images';
import { dialogue_manager, run_scripts, SOCKET_CONFIG, tts_manager } from '../api';
import Loader from '../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayerView from '../components/PlayerView';
import Popup from '../components/Popup';
import io from 'socket.io-client';
import { translate } from '../i18n';
const abortController = new AbortController();
// const dummy_data = {
//     "is_question": false,
//     "text": [
//         "کیا آپ کو کچھ اور جاننا ہے؟",
//         "آپ حبیب بینک میں فیس جمع کروانے کے بعد درکار دستاویزات لے کر# ای خدمت مرکز تشریف لے جائیں۔ آپ کا لائسنس 15 دن میں رینیو ہو جائے گا۔ ",
//     ],
//     "voiceFiles": {
//         "کیا آپ کو کچھ اور جاننا ہے؟": {
//             "audio": a2,
//             "duration": "2.988"
//         },
//         "آپ حبیب بینک میں فیس جمع کروانے کے بعد درکار دستاویزات لے کر# ای خدمت مرکز تشریف لے جائیں۔ آپ کا لائسنس 15 دن میں رینیو ہو جائے گا۔ ": {
//             "audio": a1,
//             "duration": "11.358"
//         },
//     }
// }

class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        this.get_resource = get_resource.bind(this);
        this.tts_manager = tts_manager.bind(this);
        this.close_connection = close_connection.bind(this);
        this.dialogue_manager = dialogue_manager.bind(this);
        this.onPlayBack = onPlayBack.bind(this);

        this.Sound = null;
        this.socket = io(this.get_resource('asr'), SOCKET_CONFIG(this.get_resource('cid')));
        this.get_query_answers = get_query_answers.bind(this);
        this.on_mic_click = on_mic_click.bind(this);
        this.play_message_handler = play_message_handler.bind(this);
        this.state = {
            "isLoaded": false,
            "loader": false,
            "is_recording": false,
            "socket_status": false,
            "last_id": false,
            "last_ids_list": {
                // "asalamoalaikom": { "is_question": true, "text": "السلام علیکم" },
            },
            "chat_list": {
                // "asfdasfa": { "is_question": true, "text": ["آپ حبیب بینک میں فیس جمع کروانے کے بعد درکار دستاویزات لے کر# ای خدمت مرکز تشریف لے جائیں۔","آپ کا لائسنس 15 دن میں رینیو ہو جائے گا۔ کیا آپ کو مزید کچھ معلوم کرنا ہے؟"] },
                // "asfdasfa": dummy_data,
            },
            "last_played_voice": {},
            "play_text_id": false,
            "temp_text": ""
        }
    }

    async UNSAFE_componentWillMount() {
        this.setState({ "isLoaded": true })

        // this.onPlayBack("asfdasfa", dummy_data, 0)

        let audioPermission = await check_microphone();

        AudioRecord.init(this.props.audioRecordingOptions);
        AudioRecord.on('data', this.onAudioStreaming.bind(this));

        BackHandler.addEventListener('hardwareBackPress', (async function () {
            if (this.state.isLoaded) {
                await this.closeSession()
            }
            return true;
        }).bind(this));
    }

    componentDidMount() {
        this.socket?.on('connect', (e) => {
            this.setState({ "socket_status": true })
            console.log("socket connected")
            this.get_query_answers()
        });

        this.socket?.on('disconnect', (async (e) => {
            console.log('Disconnected from server', e);
            await this.closeSession()
        }).bind(this));

        this.socket?.on('response', this.onMessage.bind(this));
    }

    async componentWillUnmount() {
        this.setState({ "isLoaded": false })
        if (this.timeout) clearInterval(this.timeout);
        if (this.socket && this.state.socket_status) this.socket?.disconnect();
        if (this.Sound && this.state.playState == 'play') this.Sound.stop()
        this.Sound = null;
        await AudioRecord.stop()
        BackHandler.addEventListener('hardwareBackPress', (async function () {
            BackHandler.exitApp()
        }))
    }

    wait = (time = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => { resolve() }, time)
        });
    }

    async closeSession() {
        this.setState({ "screen_loader": true, "loader_message": "Closing Connection" })
        const res = await this.close_connection()
        this.setState({ "popup": { "show": true, "type": res.resultFlag ? 'success' : "wrong", "message": translate(res.message) } })
        await this.wait(500)
        this.props.updateRedux({ resources: {} })
        this.props.navigation.goBack(null)
    }

    async onAudioStreaming(data) {
        try {
            var chunk = null
            if (Platform.OS == 'android') {
                chunk = await run_scripts(data, abortController.signal);
                if (!this.state.is_recording && !chunk) return
            } else {
                chunk = await base64_into_blob(data);
            }
            // console.log({ "size": chunk.size, "chunk": chunk, "data": data })
            if (chunk) this.socket?.emit('audio_bytes', chunk)
        } catch (error) {
            console.log("onAudioStreaming", error)
        }
    }

    onMessage(e) {
        const { chat_list, last_id, last_ids_list, temp_text, is_recording } = this.state;
        if (!is_recording) return;
        var json = e.response;
        console.log(json)

        if (json.result) {
            const { final, hypotheses = [] } = json.result;
            let res = hypotheses[0]

            let text = `${temp_text} ${res.transcript}`
            let final_text = final ? `${temp_text} ${res.transcript}` : isNullRetNull(temp_text, res.transcript)

            const unique_id = last_id ? last_id : uid();
            chat_list[unique_id] = { "is_question": true, "text": final ? final_text : text }
            last_ids_list[unique_id] = chat_list[unique_id];

            this.setState({
                "temp_text": final ? text : temp_text,
                "chat_list": chat_list,
                "last_id": unique_id,
                "last_ids_list": last_ids_list
            })
        }
    }

    playComplete = (success) => {
        if (this.timeout) clearInterval(this.timeout);
        if (this.Sound) {
            if (!success) Alert.alert('Notice', '(Error code : 3) audio file error.\naudio file not stopped!');
            this.setState({ "playState": false, "duration": 0 });
        }
    }

    onSoundPlay(error) {
        if (error) {
            Alert.alert('Notice', '(Error code : 1) audio file error.\naudio file not reachable!');
        } else {
            try {
                this.timeout = setInterval((e) => {
                    if (this.Sound)
                        this.Sound.getCurrentTime(async (seconds, isPlaying) => {
                            this.setState({ "playState": "play", "duration": seconds })
                        })
                }, 500)
            } catch (e) {
                Alert.alert('Notice', '(Error code : 2) ' + e);
            }
        }
    }

    render() {
        const { is_recording, chat_list, screen_loader = false, loader_message = false, loader } = this.state;

        const _renderMessagePanel = (unique_id, obj, text, index) => {
            const { last_played_voice, duration, playState } = this.state;


            return (
                <View style={styles.chatRow(obj.is_question)} key={uid()}>
                    {!obj.is_question ? <View style={styles.chatViewIcon(obj.is_question)} /> : <></>}
                    <View style={styles.chatTextView(obj.is_question)}>
                        {!obj.is_question && <PlayerView
                            voice_timer={duration}
                            lastPlayVoice={last_played_voice}
                            index={index}
                            unique_id={unique_id}
                            playState={playState}
                            sound={this.Sound}
                            {...this}
                            onPlay={() => {
                                if (this.Sound) this.Sound.stop()
                                this.onPlayBack(unique_id, obj, index)
                            }}>
                        </PlayerView>}
                        <Text style={styles.chatTxt(obj.is_question)}>{text}</Text>
                    </View>
                    {obj.is_question ? <View style={styles.chatViewIcon(obj.is_question)} /> : <></>}
                </View>
            )
        }
        return (<>
            <Loader isShow={screen_loader} mesasge={loader_message} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} />

            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                <View style={styles.headerView}>
                    <TouchableOpacity
                        style={styles.helpBtn}
                        onPress={() => {
                            this.setState({ popup: { "show": true, "type": "help", "message": translate("Would You need help?") } })
                        }}>
                        <Text style={styles.helpBtnTxt}>HELP</Text>
                    </TouchableOpacity>
                    <Image source={LogoWhite} style={{ top: -4, height: wp('14'), width: wp('14') }} />
                    <TouchableOpacity
                        style={{ width: wp('18') }}
                        onPress={() => {
                            this.closeSession()
                        }}>
                        <SvgBackIcon />
                    </TouchableOpacity>
                </View>
                <View style={styles.mainView}>
                    <View style={styles.v01}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', flexDirection: 'column' }}
                            style={{ width: wp('100') }}
                            ref={(ref) => { this.scrollViewRef = ref }}
                            onContentSizeChange={() => {
                                if (this.scrollViewRef) this.scrollViewRef.scrollToEnd({ animated: false })
                            }}>
                            {
                                Object.entries(chat_list).map((arr, index1) => {
                                    const unique_id = arr[0], obj = arr[1];
                                    if (typeof (obj.text) == 'string') {
                                        return _renderMessagePanel(unique_id, obj, obj['text'], index1)
                                    }
                                    return <>{obj.text.map((text, index2) => {
                                        return _renderMessagePanel(unique_id, obj, obj['text'][index2], index2)
                                    })}</>
                                })
                            }
                            {loader && <ActivityIndicator size="large" color={"blue"} />}
                            {(is_recording && !loader) && <Text style={{ textAlign: 'center' }}>Speak Now</Text>}
                        </ScrollView>
                    </View>

                    <View style={styles.speakBtnView}>
                        <TouchableOpacity
                            style={styles.speakBtn(is_recording)}
                            onPressIn={async () => {
                                this.on_mic_click(true)
                            }}
                            onPressOut={async () => {
                                await this.wait(500)
                                abortController.abort();
                                await this.on_mic_click(false)
                            }}>
                            <Image source={MicIcon} style={styles.speakBtnTxt(is_recording)} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LetsBegin);

const styles = StyleSheet.create({
    safeArea: {
        flexDirection: 'column',
        backgroundColor: theme.designColor,
        flex: 1
    },
    headerView: {
        height: hp('8'),
        width: wp('100'),
        paddingHorizontal: wp('2'),
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    helpBtn: {
        height: hp('4.5'),
        width: wp('18'),
        borderRadius: 6,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    helpBtnTxt: {
        fontSize: 16,
        color: theme.designColor,
        fontWeight: '700'
    },
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1
    },
    speakBtnView: {
        width: '100%',
        position: 'absolute',
        bottom: hp('1', '1')
    },
    speakBtn: (is) => ({
        height: hp('10'),
        width: hp('10'),
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        backgroundColor: is ? 'red' : theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    speakBtnTxt: is => ({
        width: wp('10'),
        height: wp('10'),
        resizeMode: 'contain',
        tintColor: '#fff'
    }),
    v01: {
        height: hp('69', '80'),
        width: wp('100'),
        borderWidth: 1,
        borderColor: "#ddd",
        alignSelf: 'center',
        paddingHorizontal: wp('2'),
        paddingVertical: wp('2'),
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    chatRow: (is) => ({
        width: wp('96'),
        padding: wp('2'),
        flexDirection: 'row',
        justifyContent: is ? 'flex-end' : 'flex-start'
    }),
    chatTextView: (is) => ({
        maxWidth: wp('80'),
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        ...is ? { borderTopLeftRadius: 10 } : { borderTopRightRadius: 10 },
        backgroundColor: is ? '#DEDEDE' : '#C6DDF8',
        padding: hp('1')
    }),
    chatTxt: (is) => ({
        fontSize: 18,
        textAlign: 'right',
        color: '#333',
        fontFamily: theme.font01
    }),
    chatViewIcon: (is) => ({
        backgroundColor: "transparent",
        borderStyle: "solid",
        height: hp('3'),

        borderLeftColor: is ? '#DEDEDE' : 'transparent',
        borderRightColor: is ? 'transparent' : '#C6DDF8',
        borderBottomColor: 'transparent',

        borderLeftWidth: is ? hp('2.8') : 0,
        borderRightWidth: is ? 0 : hp('2.8'),
        borderBottomWidth: hp('2.8'),
    }),
});