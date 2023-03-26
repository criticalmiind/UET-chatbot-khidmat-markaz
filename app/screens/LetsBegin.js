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
    StatusBar
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
    text_to_speech,
    close_connection,
    onPlayBack
} from '../api/methods';
import { LogoWhite, MicIcon, SvgBackIcon } from '../constants/images';
import { dialogue_manager, run_scripts, SOCKET, SOCKET_CONFIG, tts_manager } from '../api';
import Loader from '../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayerView from '../components/PlayerView';
import Popup from '../components/Popup';
import io from 'socket.io-client';
import { translate } from '../i18n';

class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        this.get_resource = get_resource.bind(this);
        this.tts_manager = tts_manager.bind(this);
        this.close_connection = close_connection.bind(this);
        this.dialogue_manager = dialogue_manager.bind(this);
        this.onPlayBack = onPlayBack.bind(this);

        // this.Sound = null;
        // this.socket = io(this.get_resource('asr'), SOCKET_CONFIG(this.get_resource('cid')));
        this.get_query_answers = get_query_answers.bind(this);
        this.on_mic_click = on_mic_click.bind(this);
        this.text_to_speech = text_to_speech.bind(this);
        this.play_message_handler = play_message_handler.bind(this);
        this.state = {
            "isLoaded": false,
            "loader": false,
            "is_recording": false,
            "socket_status": false,
            "last_id": false,
            "last_ids_list": {},
            "chat_list": {
                "askjdawe": { "is_question": true, "text": "ایک ٹیلے پر واقع مزار خواجہ فریدالدین گنج شکرؒ کے احاطہء صحن میں ذرا سی ژالہ باری چاندی کے ڈھیروں کی مثل بڑے غضب کا نظارا دیتی ہے۔" },
                // "askjdasa": { "is_question": false, "text": "ایک ٹیلے پر واقع مزار خواجہ فریدالدین گنج شکرؒ کے احاطہء صحن میں ذرا سی ژالہ باری چاندی کے ڈھیروں کی مثل بڑے غضب کا نظارا دیتی ہے۔" },
            },
            "last_unread_msgs": {},
            "play_text_id": false,
            "temp_text": ""
        }
    }

    async UNSAFE_componentWillMount() {
        this.setState({ "isLoaded": true })

        const options = {
            sampleRate: 16000,  // default 44100
            channels: 1,        // 1 or 2, default 1
            bitsPerSample: 16,  // 8 or 16, default 16
            // audioSource: 6,     // android only (see below)
            wavFile: 'onMessage.wav', // default 'audio.wav'
            chunkSize: 4096, //8192
        };
        let audioPermission = await check_microphone();

        AudioRecord.init(options);
        AudioRecord.on('data', this.onAudioStreaming.bind(this));
        // this.socketListners()

        BackHandler.addEventListener('hardwareBackPress', (async function () {
            if (this.state.isLoaded) {
                await this.closeSession()
                // this.props.navigation.goBack(null)
            }
            return true;
        }).bind(this));
    }

    componentDidMount() {
        this.socket?.on('connect', (e) => {
            console.log('Connected to server');
            this.setState({ "socket_status": true })
        });

        this.socket?.on('disconnect', (e) => {
            console.log('Disconnected from server', e);
            this.setState({ "socket_status": false })
        });

        this.socket?.on('response', this.onMessage.bind(this));
    }

    async componentWillUnmount() {
        this.setState({ "isLoaded": false })
        BackHandler.addEventListener('hardwareBackPress', (async function () {
            BackHandler.exitApp()
        }))
        this.socket?.disconnect();
        this.Sound = null;
        await AudioRecord.stop()
    }

    async closeSession() {
        this.setState({ "screen_loader": true, "loader_message": "Closing Connection" })
        const res = await this.close_connection()
        this.setState({ "screen_loader": false, "loader_message": false })
        this.setState({ popup: { "show": true, "type": res.resultFlag ? 'success' : "wrong", "message": translate(res.message) } })
        if (res.resultFlag) {
            this.props.updateRedux({ resources: {} })
            this.props.navigation.goBack(null)
        } else {
            setTimeout(() => {
                this.props.updateRedux({ resources: {} })
                this.props.navigation.goBack(null)
            }, 2000)
        }
    }

    socketListners() {
        if (this.socket) {
            this.socket.on('connect', this.onOpen.bind(this));
            this.socket.on('disconnect', this.onClose.bind(this));
            this.socket.on('response', this.onMessage.bind(this));
        }
    }

    async onAudioStreaming(data) {
        try {
            var chunk = null
            if (Platform.OS == 'android') {
                chunk = await run_scripts(data);
            } else {
                chunk = await base64_into_blob(data);
            }
            // console.log({ "size":chunk.size, "chunk": chunk, "data": data })
            if (chunk) {
                if (this.state.socket_status) {
                    // this.ws.send(chunk)
                    this.socket?.emit('audio_bytes', chunk)
                } else {
                    this.socket = io(this.get_resource('asr'), SOCKET_CONFIG(this.get_resource('cid')));
                }
            }
        } catch (error) {
            console.log("onAudioStreaming", error)
        }
    }

    onMessage(e) {
        const { chat_list, last_id, last_ids_list, temp_text, is_recording } = this.state;
        if (!is_recording) return;
        var json = e.response;
        if (json.result) {
            // console.log("On Message: ", json)
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
            // if (final) this.ws.close();
        }
    }

    onOpen(e) {
        console.log("On Open:", e)
        this.setState({ "socket_status": 1, "loader": false })
    }

    onClose(e) {
        console.log("On Close:", e)
        // this.setState({ "socket_status": 3 })
    }

    render() {
        const { is_recording, chat_list, screen_loader = false, loader_message = false, loader, socket_status, play_text_id } = this.state;
        const { resources } = this.props;

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
                            // this.props.navigation.goBack()
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
                                Object.entries(chat_list).map((arr, i) => {
                                    let a = arr[0], c = arr[1];
                                    let is = c.is_question;
                                    return (
                                        <View style={styles.chatRow(is)} key={a}>
                                            {!is ? <View style={styles.chatViewIcon(is)} /> : <></>}
                                            <View style={styles.chatTextView(is)}>
                                                <PlayerView
                                                    text_obj={c}
                                                    text_id={a}
                                                    {...this}
                                                    onPlay={() => {
                                                        // if(isPlay && this.props.sound) this.props.sound.pause()
                                                        // console.log(text_id)
                                                        this.onPlayBack(a, c.text, () => { })
                                                    }} />
                                                <Text style={styles.chatTxt(is)}>{c.text}</Text>
                                            </View>
                                            {is ? <View style={styles.chatViewIcon(is)} /> : <></>}
                                        </View>
                                    )
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
                                setTimeout(async () => {
                                    await this.on_mic_click(false)
                                }, 500)
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
        height: hp('69','80'),
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