import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { hp, wp } from './../utils';
import AudioRecord from 'react-native-audio-record';
import { base64ToBlob, onAudioPressIn, onAudioPressOut, playMessage, speechToText, textToSpeech } from '../api/methods';
import { decode as atob, encode as btoa } from 'base-64'
var RNFS = require('react-native-fs');

const BASE_URL = "wss://tech.cle.org.pk:9991/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=af253b41-404c-4d78-be7f-6684dd52bcc2";


class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        this.ws = new WebSocket(BASE_URL);
        this.onAudioPressIn = onAudioPressIn.bind(this);
        this.onAudioPressOut = onAudioPressOut.bind(this);

        this.speechToTextHandler = speechToText.bind(this);
        this.textToSpeechHandler = textToSpeech.bind(this);
        this.playMessageHandler = playMessage.bind(this);
        this.state = {
            "loader": false,
            "is_recording": false,
            "chat_list": []
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

    UNSAFE_componentWillMount() {
        const options = {
            sampleRate: 16000,  // default 44100
            channels: 1,        // 1 or 2, default 1
            bitsPerSample: 16,  // 8 or 16, default 16
            audioSource: 6,     // android only (see below)
            wavFile: 'onMessage.wav' // default 'audio.wav'
        };
        AudioRecord.init(options);

        AudioRecord.on('data', async (data) => {
            const chunk = await base64ToBlob(data)

            try {
                if(this.ws.readyState == 1){
                    this.ws.send(chunk)
                }else{
                    console.log(this.ws)
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
            this.ws.onopen = function (e) {
                console.log("On Open:", e)
            };
            
            this.ws.onmessage = this.onMessage.bind(this)

            this.ws.onclose = function (e) {
                console.log("On Close:", e)
            };

            this.ws.onerror = function (e) {
                var data = e.data;
                console.log("On Error:", e)
            }
        }
    }

    onMessage(e) {
        const { chat_list } = this.state;
        var data = e.data;
        var { status=0, result=null } = JSON.parse(data);
        if(result){
            const { final=false, hypotheses=[] } = result;
            if(final){
                let msgObj = hypotheses[0]
                chat_list.push({
                    "is_question": true,
                    "text": msgObj.transcript
                })
                this.setState({ chat_list })
            }
        }
        // console.log("On Message:",res)
    }

    onWriteMsg(){

    }

    render() {
        const { is_recording, chat_list, loader } = this.state;

        return (<>
            <View style={styles.safeArea}>
                <View style={styles.mainView}>
                    <Text style={styles.letsBeginText}>{"Lets Begin"}</Text>
                    <Text style={styles.notesText}>{"By start button to ask"}</Text>

                    <View style={{ height: hp('2', '1') }} />

                    <View style={styles.v01}>
                        <ScrollView
                            contentContainerStyle={{
                                justifyContent: 'flex-end',
                                height: '100%',
                            }}
                            style={{ width: wp('98') }}
                            ref={(ref) => { this.scrollViewRef = ref }}
                            onContentSizeChange={() => {
                                if (this.scrollViewRef) this.scrollViewRef.scrollToEnd({ animated: true })
                            }}>
                            {
                                (chat_list ?? []).map((c, i) => {
                                    let is = c.is_question;
                                    return (
                                        <View style={styles.chatRow(is)} key={i}>
                                            {!is ? <>
                                                <View style={styles.chatViewIcon(is)} />
                                                <View style={{ width: wp('2') }} />
                                            </> : <></>
                                            }
                                            <View style={styles.chatTextView(is)}>
                                                <Text style={styles.chatTxt(is)}>{c.text}</Text>
                                            </View>
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
                            // onPressIn={()=>{
                            //     this.onAudioPressIn()
                            // }}
                            // onPressOut={()=>{
                            //     this.onAudioPressOut()
                            // }}
                            onPress={async () => {
                                // this.setState({ loader: true })
                                await this.speechToTextHandler()
                                // this.setState({ loader: false })
                            }}>
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