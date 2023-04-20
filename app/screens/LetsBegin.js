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
    Alert,
    TouchableWithoutFeedback
} from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { get_resource, hp, isNullRetNull, uid, wp } from './../utils';
import AudioRecord from 'react-native-audio-recording-stream';
import {
    check_microphone,
    get_query_answers,
    play_message_handler,
    onSpeakPress,
    onSpeakRelease,
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

class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        this.get_resource = get_resource.bind(this);
        this.tts_manager = tts_manager.bind(this);
        this.close_connection = close_connection.bind(this);
        this.dialogue_manager = dialogue_manager.bind(this);
        this.onPlayBack = onPlayBack.bind(this);

        this.Sound = null;
        this.get_query_answers = get_query_answers.bind(this);
        this.onSpeakPress = onSpeakPress.bind(this);
        this.onSpeakRelease = onSpeakRelease.bind(this);
        this.play_message_handler = play_message_handler.bind(this);
        this.state = {
            "isLoaded": false,
            "loader": false,
            "is_recording": false,
            "speakPressed": false,
            "socket_status": false,
            "socketio": null,
            "last_id": false,
            "last_ids_list": {
                "asalamoalaikom": { "is_question": true, "text": "السلام علیکم" },
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

        let audioPermission = await check_microphone();

        AudioRecord.init(this.props.audioRecordingOptions);
        AudioRecord.on('data', this.onAudioStreaming.bind(this));

        BackHandler.addEventListener('hardwareBackPress', (async function () {
            if (this.state.isLoaded) {
                await this.closeSession()
            }
            return true;
        }).bind(this));
        this.resetTimeout()
    }

    componentDidMount() {
        this.get_query_answers()
    }

    connectSocket = () => {
        const { playState } = this.state
        if (this.Sound && playState == 'play') this.Sound.stop()

        const socket = io(this.get_resource('asr'), SOCKET_CONFIG(this.get_resource('cid')));
        socket.on('connect', ((e) => {
            console.log("socket connected: ")
            const { speakPressed } = this.state
            this.onSpeakPress(socket)
            if (!speakPressed) {
                this.onSpeakRelease()
            }
        }).bind(this));
        socket.on('disconnect', (async (e) => {
            console.log('Disconnected from server', e);
        }).bind(this));

        socket.on('response', this.onMessage.bind(this));

        this.setState({ "speakPressed": true, "socketio": socket, "playState": false });
    }

    async componentWillUnmount() {
        const { playState } = this.state
        this.setState({ "isLoaded": false })
        if (this.playTimer) clearInterval(this.playTimer);
        if (this.Sound && playState == 'play') this.Sound.stop()
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
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.setState({ "screen_loader": true, "loader_message": "Closing Connection" })
        const res = await this.close_connection()
        this.setState({ "popup": { "show": true, "type": res.resultFlag ? 'success' : "wrong", "message": translate(res.message) } })
        await this.wait(500)
        this.props.updateRedux({ resources: {} })
        this.props.navigation.goBack(null)
    }

    async onAudioStreaming(data) {
        const { socketio } = this.state
        try {
            socketio?.emit('audio_bytes', data.replace("data:audio/wav;base64,", ""))
        } catch (error) {
            console.log("onAudioStreaming", error)
        }
    }

    onMessage(e) {
        const { chat_list, last_id, last_ids_list, temp_text, is_recording } = this.state;
        if (!is_recording) return;
        var json = e.response;
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
        if (this.playTimer) clearInterval(this.playTimer);
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
                this.playTimer = setInterval((e) => {
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

    resetTimeout = () => {
        var TIMEOUT_SECONDS = 60
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.closeSession()
        }, TIMEOUT_SECONDS*1000);
    };

    clearAllTimeouts = () => {
        if (this.timeoutId) clearTimeout(this.timeoutId);
    };

    render() {
        const { is_recording, chat_list, screen_loader = false, loader_message = false, loader } = this.state;

        const _renderMessagePanel = (unique_id, obj, text, index) => {
            const { last_played_voice, duration } = this.state;


            return (
                <View style={styles.chatRow(obj.is_question)} key={uid()}>
                    {!obj.is_question ? <View style={styles.chatViewIcon(obj.is_question)} /> : <></>}
                    <View style={styles.chatTextView(obj.is_question)}>
                        {!obj.is_question && <PlayerView
                            voice_timer={duration}
                            lastPlayVoice={last_played_voice}
                            index={index}
                            unique_id={unique_id}
                            playState={this.state.playState}
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
        return (
            <TouchableWithoutFeedback onPress={() => this.resetTimeout()}>
                <>
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
                                    {/* {(is_recording && !loader) && <Text style={{ textAlign: 'center' }}>Speak Now</Text>} */}
                                </ScrollView>
                            </View>

                            <View style={styles.speakBtnView}>
                                <TouchableOpacity
                                    style={styles.speakBtn(is_recording)}
                                    // disabled={playState}
                                    onPressIn={async () => {
                                        // this.setState({ is_recording:!is_recording })
                                        this.connectSocket()
                                        this.resetTimeout()
                                    }}
                                    onPressOut={async () => {
                                        await this.onSpeakRelease()
                                    }}>
                                    <Image source={MicIcon} style={styles.speakBtnTxt(is_recording)} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </>
            </TouchableWithoutFeedback>
        );
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
        height: is?hp('14'):hp('10'),
        width: is?hp('14'):hp('10'),
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        backgroundColor: is ? 'red' : theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: is ? 0.5 : 1
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
        // borderWidth: 1,
        // borderColor: "#ddd",
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