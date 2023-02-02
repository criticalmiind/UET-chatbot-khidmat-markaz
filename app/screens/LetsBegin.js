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
    BackHandler
} from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { getAsrLink, get_resource, hp, isNullRetNull, notify, uid, wp } from './../utils';
import AudioRecord from 'react-native-audio-recording-stream';
import {
    base64_into_blob,
    check_microphone,
    get_query_answers,
    play_message_handler,
    on_mic_click,
    text_to_speech,
    on_click_chat_text_panel,
    close_connection
} from '../api/methods';
import { Logo, MicIcon } from '../constants/images';
import { call_asr_manager, dialogue_manager, method, run_scripts, tts_manager } from '../api';
import Loader from '../components/Loader';

class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        this.get_resource = get_resource.bind(this);
        this.tts_manager = tts_manager.bind(this);
        this.close_connection = close_connection.bind(this);
        this.dialogue_manager = dialogue_manager.bind(this);
        this.sound = null;
        this.ws = { readyState: 3 };
        // this.ws = new WebSocket(this.get_resource('asr'));
        this.get_query_answers = get_query_answers.bind(this);
        this.on_click_chat_text_panel = on_click_chat_text_panel.bind(this);
        this.on_mic_click = on_mic_click.bind(this);
        this.text_to_speech = text_to_speech.bind(this);
        this.play_message_handler = play_message_handler.bind(this);
        this.state = {
            "isLoaded":false,
            "loader": false,
            "is_recording": false,
            "socket_status": 3,
            "last_id": false,
            "last_ids_list": {},
            "chat_list": {},
            "last_unread_msgs": {},
            "play_text_id": false,
            "temp_text": ""
        }
    }

    async UNSAFE_componentWillMount() {
        this.setState({ "isLoaded":true })

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
        this.socketListners()
        
        BackHandler.addEventListener('hardwareBackPress', (async function () {
            if(this.state.isLoaded){
                this.setState({ "screen_loader":true, "loader_message":"Closing Connection" })
                const res = await this.close_connection()
                this.setState({ "screen_loader":false, "loader_message":false })
                notify({"title":res.resultFlag?'Success':'Failed', "message":`${res.message}`})
                this.props.updateRedux({ resources:{} })
                this.props.navigation.goBack(null)
            }
            return true;
        }).bind(this));
    }

    async componentWillUnmount() {
        this.setState({ "isLoaded":false })
        // BackHandler.removeEventListener('hardwareBackPress');
        BackHandler.addEventListener('hardwareBackPress', (async function () {
            BackHandler.exitApp()
        }))

        // function addEventListener(eventName, handler) {
        //     if (_backPressSubscriptions.indexOf(handler) === -1) {
        //       _backPressSubscriptions.push(handler);
        //     }
      
        //     return {
        //       remove: function remove() {
        //         return BackHandler.removeEventListener(eventName, handler);
        //       }
        //     };
        //   }

        this.ws = { readyState: 3 };
        this.sound = null;
        await AudioRecord.stop()
    }

    socketListners() {
        if (this.ws) {
            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this)
            this.ws.onerror = this.onError.bind(this);
            this.ws.onclose = this.onClose.bind(this);
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
                if (this.ws.readyState == 1) {
                    this.ws.send(chunk)
                } else {
                    if (this.ws.readyState == 3) {
                        this.ws = { readyState: 3 };
                        this.ws = new WebSocket(this.get_resource('asr'));
                        this.socketListners()
                        this.ws.send(chunk)
                    }
                }
            }
        } catch (error) {
            console.log("onAudioStreaming", error)
        }
    }

    onMessage(e) {
        const { chat_list, last_id, last_ids_list, temp_text, is_recording } = this.state;
        if (!is_recording) return;
        var data = e.data;
        var json = JSON.parse(data);
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

    onError(e) {
        console.log("On Error:", e)
        this.setState({ "socket_status": 2 })
    }

    onClose(e) {
        console.log("On Close:", e)
        this.setState({ "socket_status": 3 })
    }

    getStatus(id) {
        let status = 'CONNECTING';
        if (id == 1) status = 'CONNECTED'
        if (id == 2) status = 'CLOSING'
        if (id == 3) status = 'CLOSED'
        return status
    }

    getStatusIcon(id) {
        let color = 'yellow';
        if (id == 1) color = 'green'
        if (id == 2) color = 'orange'
        if (id == 3) color = 'red'
        return <View style={{ height: hp('3'), width: hp(3), borderRadius: 100, backgroundColor: color }} />
    }

    render() {
        const { is_recording, chat_list, screen_loader=false, loader_message=false, loader, socket_status, play_text_id } = this.state;
        const { resources } = this.props;

        return (<>
            <Loader isShow={screen_loader} mesasge={loader_message}/>
            <View style={styles.safeArea}>
                <View style={styles.mainView}>
                    <View style={styles.v02}>
                        <View style={{ width: wp('78'), justifyContent: 'center', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                {this.getStatusIcon(socket_status)}<Text style={styles.letsBeginText}>{"ای خدمت مرکز"} </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack()
                            }}>
                            <Image source={Logo} style={{ height: wp('18'), width: wp('18') }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: hp('2', '1') }} />

                    <View style={styles.v01}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', flexDirection: 'column' }}

                            style={{ width: wp('98') }}
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
                                            {!is ? <>
                                                <View style={styles.chatViewIcon(is)} />
                                                <View style={{ width: wp('2') }} />
                                            </> : <></>
                                            }
                                            <TouchableOpacity
                                                style={styles.chatTextView(is)}
                                                onPress={() => {
                                                    // this.setState({ "play_text_id":a });
                                                    this.on_click_chat_text_panel(c.text)
                                                }}>
                                                <Text style={styles.chatTxt(is)}>{c.text}</Text>
                                                {/* { a == play_text_id && <ActivityIndicator color={"#fff"}/> } */}
                                            </TouchableOpacity>
                                            {is ? <>
                                                <View style={{ width: wp('2') }} />
                                                <View style={styles.chatViewIcon(is)} />
                                            </> : <></>
                                            }
                                        </View>
                                    )
                                })
                            }
                            {loader && <ActivityIndicator size="large" color={"blue"} />}
                            {(is_recording && !loader) && <Text style={{ textAlign:'center' }}>Speak Now</Text>}
                        </ScrollView>
                    </View>

                    <View style={{ height: hp('2', '1') }} />

                    <View style={styles.askBtnView}>
                        <TouchableOpacity
                            style={styles.autoDetectBtn(is_recording)}
                            onPressIn={async () => {
                                this.setState({ "loader": true })
                                let res = await call_asr_manager({ "function": method["openAsrConnection"], "connectionId": this.get_resource("cid") })
                                if (res.resultFlag) {
                                    this.ws = new WebSocket(getAsrLink(res.asrModel), this.get_resource("cid"));
                                    resources['asrModel'] = res.asrModel
                                    this.props.updateRedux({ "resources": resources })
                                    setTimeout(() => {
                                        // this.setState({ "loader" :false})
                                        this.on_mic_click()
                                    }, 500)
                                } else {
                                    notify({ "title": "Failed!", "message": res.message, "success": false })
                                    this.props.navigation.goBack()
                                }
                            }}
                            onPressOut={async () => {
                                setTimeout(async () => {
                                    await this.on_mic_click()
                                }, 100)
                                // setTimeout(async () => {
                                //     resources['asrModel'] = false
                                //     this.props.updateRedux({ "resources":resources })
                                // },300)
                            }}>
                            <View style={styles.autoDetectBtnInnerRow}>
                                <Image source={MicIcon} style={styles.autoDetectBtnIcon(is_recording)} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1
    },
    logoRow: {
        height: hp('20'),
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    v02: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    letsBeginText: {
        fontSize: 45,
        textAlign: 'right',
        color: theme.primary,
        marginTop: hp('4', '0.5'),
        fontFamily: theme.font01
    },
    notesText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'right',
        color: theme.quinary,
    },
    autoDetectBtn: (is) => ({
        height: hp('10'),
        width: hp('10'),
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        borderColor: is ? 'red' : theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    autoDetectBtnInnerRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    autoDetectBtnIcon: is => ({ width: wp('10'), height: wp('10'), resizeMode: 'contain', tintColor: is ? 'red' : theme.designColor }),
    v01: {
        height: hp('68'),
        width: wp('98'),
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
    chatViewIcon: (is) => ({
        height: hp('3.5'),
        width: hp('3.5'),
        borderRadius: 100,
        backgroundColor: is ? 'pink' : 'green'
    }),
    chatTextView: (is) => ({
        maxWidth: wp('80'),
        borderRadius: 6,
        backgroundColor: is ? 'pink' : 'green',
        padding: hp('1')
    }),
    chatTxt: (is) => ({
        fontSize: 18,
        textAlign: 'right',
        color: is ? '#333' : 'white',
        fontFamily: theme.font01
    }),
    askBtnView: {
        width: '100%',
        position: 'absolute',
        bottom: hp('4', '2')
    }
});