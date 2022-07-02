import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, ActivityIndicator, NativeModules } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { hp, uid, wp } from './../utils';
import AudioRecord from 'react-native-audio-record';
import { base64ToBlob, checkMicrophone, getQueriesAnswers, playMessage, speechToText, textToSpeech } from '../api/methods';
import { decode as atob, encode as btoa } from 'base-64'
var RNFS = require('react-native-fs');
const { RNAudioRecord } = NativeModules;
// const BASE_URL = "wss://tech.cle.org.pk:9991/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=852d4287-aaec-4298-bf32-f86d0d545ddf";
const BASE_URL = "wss://tech.cle.org.pk:9991/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=852d4287-aaec-4298-bf32-f86d0d545ddf";


class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        // this.ws = new WebSocket(BASE_URL);
        this.ws = { readyState:3 };
        this.getQueriesAnswers = getQueriesAnswers.bind(this);

        this.speechToTextHandler = speechToText.bind(this);
        this.textToSpeechHandler = textToSpeech.bind(this);
        this.playMessageHandler = playMessage.bind(this);
        this.state = {
            "loader": false,
            "is_recording": false,
            "socket_status": 3,
            "last_id":false,
            "last_ids_list":{},
            "chat_list": {
            },
            "last_unread_msgs":{}
        }
    }

    base64ToArrayBuffer(base64) {
        var binary_string = atob(base64);
        var len = binary_string.length;
        var bytes = new Int16Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async UNSAFE_componentWillMount() {
        const options = {
            sampleRate: 16000,  // default 44100
            channels: 1,        // 1 or 2, default 1
            bitsPerSample: 16,  // 8 or 16, default 16
            audioSource: 6,     // android only (see below)
            wavFile: 'onMessage.wav' // default 'audio.wav'
        };
        let audioPermission = await checkMicrophone();
        AudioRecord.init(options);

        // console.log(RNAudioRecord.getConstants())
        
        AudioRecord.on('data', async (data) => {
            const chunk = await base64ToBlob(data)

            try {
                if(this.ws.readyState == 1){
                    this.ws.send(chunk)
                }else{
                    if(this.ws.readyState == 3){
                        this.ws = null
                        this.ws = new WebSocket(BASE_URL);
                        this.socketListners()
                        this.ws.send(chunk)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        });

        this.socketListners()
    }

    socketListners(){
        if(this.ws){
            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this)
            this.ws.onerror = this.onError.bind(this);
            this.ws.onclose = this.onClose.bind(this);
        }
    }

    onMessage(e) {
        const { chat_list, last_id, last_ids_list } = this.state;
        var data = e.data;
        var res = JSON.parse(data);
        if(res.result){
            const { final=false, hypotheses=[] } = res.result;
            let msgObj = hypotheses[0]

            const unique_id = last_id?last_id:uid();
            chat_list[unique_id] = { "is_question": true, "text": msgObj.transcript }
            last_ids_list[unique_id] = chat_list[unique_id];

            this.setState({
                "chat_list":chat_list,
                "last_id":final?false:unique_id,
                "last_ids_list":last_ids_list
            })
            if(final) this.ws.close();
        }
    }

    onOpen(e) {
        console.log("On Open:", e)
        this.setState({ "socket_status":1 })
    }

    onError(e) {
        console.log("On Open:", e)
        this.setState({ "socket_status":2 })
    }

    onClose(e) {
        console.log("On Open:", e)
        this.setState({ "socket_status":3 })
    }

    getStatus(id){
        let status = 'CONNECTING';
        if(id == 1) status = 'CONNECTED'
        if(id == 2) status = 'CLOSING'
        if(id == 3) status = 'CLOSED'
        return status
    }

    render() {
        const { is_recording, chat_list, loader, socket_status } = this.state;

        return (<>
            <View style={styles.safeArea}>
                <View style={styles.mainView}>
                    <Text style={styles.letsBeginText}>{"Lets Begin"}</Text>
                    <Text style={styles.notesText}>{"By start button to ask"}{`(${this.getStatus(socket_status)})`}</Text>

                    <View style={{ height: hp('2', '1') }} />

                    <View style={styles.v01}>
                        <ScrollView
                            // contentContainerStyle={{
                                // justifyContent: 'flex-end',
                                // height: '100%',
                            // }}
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
                                                onPress={()=>{

                                                }}>
                                                <Text style={styles.chatTxt(is)}>{c.text}</Text>
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
                        </ScrollView>
                    </View>


                    <View style={{ height: hp('2', '1') }} />

                    <View style={styles.askBtnView}>
                        <TouchableOpacity
                            style={styles.autoDetectBtn(is_recording)}
                            // onPress={async () => {
                            //     // this.setState({ loader: true })
                            //     await this.speechToTextHandler()
                            //     // this.setState({ loader: false })
                            // }}
                            onPressIn={async()=>{
                                // this.setState({ loader: true })
                                await this.speechToTextHandler()
                            }}
                            onPressOut={async()=>{
                                await this.speechToTextHandler()
                                // this.setState({ loader: false })
                            }}
                            >
                            <View style={styles.autoDetectBtnInnerRow}>
                                <Text style={styles.autoDetectBtnText(is_recording)}>{is_recording ? "Stop" : "Ask?"}</Text>
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
    letsBeginText: {
        fontSize: 45,
        alignSelf: 'center',
        color: theme.primary,
        marginTop: hp('4', '0.5'),
    },
    notesText: {
        fontSize: 16,
        fontWeight: '500',
        alignSelf: 'center',
        color: theme.quinary,
        marginTop: hp('1', '0.5'),
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
    autoDetectBtnText: (is) => ({
        color: is ? 'red' : theme.designColor,
        fontSize: 20,
    }),
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
    chatTxt: (is) => ({ fontSize: 14, textAlign: is ? 'right' : 'left', color: is ? '#333' : 'white' }),
    askBtnView: {
        width: '100%',
        position: 'absolute',
        bottom: hp('4', '2')
    }
});