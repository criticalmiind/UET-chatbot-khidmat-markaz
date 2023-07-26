import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
    BackHandler,
    StatusBar,
    Alert,
} from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { get_resource, hp, uid, wp } from './../utils';
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
import { MicIcon } from '../constants/images';
import { dialogue_manager, SOCKET_CONFIG, tts_manager } from '../api';
import Loader from '../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import Popup from '../components/Popup';
import io from 'socket.io-client';
import { translate } from '../i18n';
import Header from '../components/Header';
import PlayerView1 from '../components/PlayerView1';
import { FlatList } from 'react-native-gesture-handler';

class LetsBegin extends React.PureComponent {
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
            "speakBlur": true,
            "socket_status": false,
            "socketio": null,
            "last_id": false,
            "last_ids_list": {
                "asalamoalaikom": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
            },
            "chat_list": {
                // "asfdasfa": {
                //     "unique_id": "asfdasfa",
                //     "is_question": false,
                //     "text": ["آپ حبیب بینک میں فیس جمع کروانے کے بعد درکار دستاویزات لے کر# ای خدمت مرکز تشریف لے جائیں۔", "آپ کا لائسنس 15 دن میں رینیو ہو جائے گا۔ کیا آپ کو مزید کچھ معلوم کرنا ہے؟"],
                //     "audio_files": [
                //         // AUDIO['ChangePasswordScreen'], AUDIO['ContactUsScreen']
                //         { "audio": AUDIO['ChangePasswordScreen'], "duration": 10.00 },
                //         { "audio": AUDIO['ContactUsScreen'], "duration": 15.00 }
                //     ]
                // },
            },
            "last_played_voice": {},
            "temp_text": ""
        }
    }

    async UNSAFE_componentWillMount() {
        this.setState({ "isLoaded": true })

        let audioPermission = await check_microphone();

        AudioRecord.init(this.props.audioRecordingOptions);
        AudioRecord.on('data', this.onAudioStreaming.bind(this));

        BackHandler.addEventListener('hardwareBackPress', (async function () {
            if (this.props.navigation.isFocused()) {
                if (this.state.isLoaded) {
                    await this.closeSession()
                }
                // BackHandler.exitApp()
                return true
            } else {
                BackHandler.exitApp()
                return true;
            }
        }).bind(this));
        this.resetTimeout()
    }

    componentDidMount() {
        this.get_query_answers()
    }

    connectSocket = async () => {
        const { playState } = this.state
        if (this.Sound) await this.Sound.stop()
        // this.setState({ "last_played_voice":{}, "playState":false })
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

        this.setState({
            "speakPressed": true,
            "socketio": socket,
            "playState": false,
            "last_played_voice": {}
        });
    }

    async componentWillUnmount() {
        const { playState } = this.state
        this.setState({ "isLoaded": false })
        if (this.playTimer) clearInterval(this.playTimer);
        if (this.Sound) await this.Sound.stop()
        this.Sound = null;
        await AudioRecord.stop()
        BackHandler.addEventListener('hardwareBackPress', (function () {
            BackHandler.exitApp()
            return true
        }))
    }

    wait = (time = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => { resolve() }, time)
        });
    }

    closeSession = async () => {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.setState({ "screen_loader": true, "loader_message": "Closing Connection" })
        const res = await this.close_connection()
        this.setState({ "popup": { "show": true, "action": "session_closed", "type": res.resultFlag ? 'success' : "wrong", "message": translate(res.message) } })
        await this.wait(500)
        this.props.updateRedux({ resources: {} })
        // this.props.navigation.goBack(null)
    }

    onAudioStreaming = async (data) => {
        const { socketio } = this.state
        try {
            socketio?.emit('audio_bytes', data.replace("data:audio/wav;base64,", ""))
        } catch (error) {
            console.log("onAudioStreaming", error)
        }
    }

    onMessage = async (e) => {
        const {
            chat_list,
            last_id,
            last_ids_list,
            temp_text,
            is_recording,
            playState
        } = this.state;
        if (this.Sound && playState == 'play') await this.Sound.stop()
        // if (!is_recording) return;
        const json = e.response;

        if (json.result && json.result.hypotheses && json.result.hypotheses.length > 0) {
            const { final, hypotheses } = json.result;
            const transcript = hypotheses[0].transcript;

            const unique_id = last_id || uid();
            const updatedChatList = {
                ...chat_list,
                [unique_id]: { is_question: true, text: final ? `${temp_text} ${transcript}۔` : `${temp_text} ${transcript}` },
            };
            const updatedLastIdsList = {
                ...last_ids_list,
                [unique_id]: updatedChatList[unique_id],
            };

            this.setState((prevState) => ({
                "temp_text": final ? `${temp_text} ${transcript}۔` : temp_text,
                "chat_list": updatedChatList,
                "last_id": unique_id,
                "last_ids_list": updatedLastIdsList,
                "playState": false
            }));
        }
    }

    playComplete = async (success) => {
        const { last_played_voice, chat_list } = this.state
        if (this.playTimer) clearInterval(this.playTimer);
        const text = chat_list[last_played_voice['unique_id']]['text'];
        if(text.toString().includes('خدا حافظ')){
            setTimeout(() => {
                this.closeSession()
            }, 1000);
        }
    }

    onSoundPlay = (error) => {
        if (error) {
            Alert.alert('Notice', '(Error code : 1) audio file error.\naudio file not reachable!');
        } else {
            this.voicePlayerDurationService('on')
        }
    }

    resetTimeout = () => {
        var TIMEOUT_SECONDS = 120
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.closeSession()
        }, TIMEOUT_SECONDS * 1000);
    };

    clearAllTimeouts = () => {
        if (this.timeoutId) clearTimeout(this.timeoutId);
    };

    voicePlayerDurationService = (state = 'on') => {
        if (state == 'on') {
            this.voicePlayerDurationInterval = setInterval((s) => {
                if (this.Sound) {
                    this.Sound.getCurrentTime(async (seconds, isPlaying) => {
                        this.setState({
                            "sliderValue": seconds >= this.Sound?._duration ? 0 : seconds,
                            "playState": isPlaying ? 'play' : false
                        })
                    })
                    if (!this.props.navigation.isFocused()) {
                        this.Sound.stop()
                        this.Sound = null
                        if (this.voicePlayerDurationInterval) clearInterval(this.voicePlayerDurationInterval)
                        this.setState({ "playState": false })
                    }
                } else {
                    if (this.voicePlayerDurationInterval) clearInterval(this.voicePlayerDurationInterval)
                }
            }, 500)
        } else {
            if (this.voicePlayerDurationInterval) clearInterval(this.voicePlayerDurationInterval)
        }
    }

    renderChatItem = ({ item, index }) => {
        // if (typeof item.text === 'string') {
        if(!Array.isArray(item.text)){
            return this._renderMessagePanel(item, item.text, index);
        }
        return (
            <View>
                {item.text.map((text, innerIndex) => (
                    <View key={`${index}-${innerIndex}`}>
                        {this._renderMessagePanel(item, text, innerIndex)}
                    </View>
                ))}
            </View>
        );
    };

    // VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 2987, "dt": 6768, "prevDt": 15323}

    _renderMessagePanel = (obj, text, index) => {
        const { last_played_voice, playState } = this.state;
        let isPlay = false
        let sliderValue = obj['audio_files'] && obj['audio_files'].length >= index ? parseFloat(obj['audio_files'][index]['duration']) : 0
        let lastPlayVoice = {}
        if (obj['unique_id'] == last_played_voice['unique_id'] && last_played_voice['index'] == index) {
            isPlay = playState
            sliderValue = this.state.sliderValue
            lastPlayVoice = {
                ...last_played_voice,
                // "duration": this.Sound ? this.Sound._duration : 0.0,
            }
        }

        return (
            <View style={styles.chatRow(obj.is_question)}>
                {!obj.is_question ? <View style={styles.chatViewIcon(obj.is_question)} /> : <></>}
                <View style={styles.chatTextView(obj.is_question)}>
                    {!obj.is_question &&
                        <PlayerView1
                            index={index}
                            playState={isPlay}
                            lastPlayVoice={lastPlayVoice}
                            sliderValue={sliderValue}
                            sound={this.Sound}
                            onTogglePlay={() => {
                                this.onPlayBack(obj, index)
                            }} />
                    }
                    <Text style={styles.chatTxt(obj.is_question)}>{text ? text.replace("#", "") : ''}</Text>
                </View>
                {obj.is_question ? <View style={styles.chatViewIcon(obj.is_question)} /> : <></>}
            </View>
        )
    }

    renderInfoMessage = () => {
        return (<>
            <View style={styles.v05}>
                <View style={styles.v02}>
                    <View style={styles.v04}>
                        {
                            translate('services_list_01').split(',').map((t, i) => {
                                return <Text style={styles.txt02} key={i}>{t}</Text>
                            })
                        }
                    </View>
                    <View style={styles.v04}>
                        {
                            translate('services_list_02').split(',').map((t, i) => {
                                return <Text style={styles.txt02} key={i}>{t}</Text>
                            })
                        }
                    </View>
                </View>
            </View>
        </>)
    }

    render() {
        const {
            is_recording,
            chat_list,
            screen_loader = false,
            loader_message = false,
            loader
        } = this.state;

        return (
            <>
                <Loader isShow={screen_loader} mesasge={loader_message} />
                <Popup
                    {...this.state.popup}
                    onClick={() => {
                        if (this.state.popup.action == 'session_closed') {
                            this.props.navigation.goBack(null)
                        }
                        this.setState({ popup: {} })
                    }} />

                <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                    <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                    <Header
                        onClickHelp={() => {
                            this.setState({ popup: { "show": true, "title": "Instractions", "audio": "SpeakScreen", "btnTitle": "Back", "type": "help", "message": translate("speak screen help") } })
                        }}
                        onClickBack={() => {
                            this.closeSession()
                        }} />

                    <View style={styles.mainView}>
                        <View style={styles.v01}>
                            <FlatList
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', flexDirection: 'column' }}
                                style={{ width: wp('100') }}
                                ref={(ref) => { this.scrollViewRef = ref; }}
                                onContentSizeChange={() => {
                                    if (this.scrollViewRef) this.scrollViewRef.scrollToEnd({ animated: false });
                                }}
                                initialNumToRender={4}
                                data={Object.values(chat_list)}
                                renderItem={this.renderChatItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={
                                    <View style={{ flex: 1, height: hp('40') }}>
                                        {this.renderInfoMessage()}
                                    </View>
                                }
                                ListFooterComponent={loader && <ActivityIndicator size="large" color="blue" />}
                            />
                        </View>

                        <View style={styles.speakBtnView}>
                            <TouchableOpacity
                                disabled={(this.state.playState == 'play' || this.state.speakBlur)}
                                style={styles.speakBtn(is_recording, (this.state.playState == 'play' || this.state.speakBlur))}
                                onLongPress={async () => {
                                    this.connectSocket()
                                    this.resetTimeout()
                                }}
                                // disabled={playState}
                                // onPressIn={async () => {
                                //     this.connectSocket()
                                //     this.resetTimeout()
                                // }}
                                onPressOut={async () => {
                                    await this.onSpeakRelease()
                                }}>
                                <Image source={MicIcon} style={styles.speakBtnImg(is_recording)} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </>
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
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1
    },
    speakBtnView: {
        width: '100%',
        position: 'absolute',
        bottom: hp('1', '1')
    },
    speakBtn: (is, isPlay) => ({
        height: is ? hp('14') : hp('10'),
        width: is ? hp('14') : hp('10'),
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        backgroundColor: is ? 'red' : theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isPlay ? 0.5 : 1
    }),
    speakBtnImg: is => ({
        width: wp('10'),
        height: wp('10'),
        resizeMode: 'contain',
        tintColor: '#fff'
    }),
    v01: {
        height: hp('69', '80'),
        width: wp('100'),
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
        fontSize: 16,
        color: '#333',
        fontFamily: theme.font01,
        // textAlign:'center',
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

    v02: {
        flexDirection: 'row-reverse',
        backgroundColor: theme.designColor,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15,
        paddingHorizontal: hp('2'),
        paddingVertical: hp('1'),
    },
    v04: {
        width: '50%'
    },
    v05: {
        backgroundColor: '#ECECEC',
        width: wp('86'),
        alignSelf: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    txt02: {
        fontSize: 12,
        color: theme.tertiary,
        fontFamily: theme.font01,
    },
});