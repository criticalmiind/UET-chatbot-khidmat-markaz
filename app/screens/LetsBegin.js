import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { hp, simplify, wp } from './../utils';
import AudioRecord from 'react-native-audio-record';
import { playMessage, speechToText, textToSpeech } from '../api/methods';
var RNFS = require('react-native-fs');
import { decode as atob, encode as btoa } from 'base-64'
import { Buffer } from 'buffer';
import { speechToTextApi } from '../api';
import { base64Audio } from '../constants/images';
import Sound from 'react-native-sound';
var RNFS = require('react-native-fs');

// const CLETOKEN = "af253b41-404c-4d78-be7f-6684dd52bcc2";
// const SERVER = "wss://tech.cle.org.pk:9996/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=af253b41-404c-4d78-be7f-6684dd52bcc2"
// const CONTENT_TYPE = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=" + CLETOKEN;

// const CLETOKEN = "af253b41-404c-4d78-be7f-6684dd52bcc2";
// const SERVER = "wss://202.142.147.156:3000/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=af253b41-404c-4d78-be7f-6684dd52bcc2"
// const CONTENT_TYPE = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=" + CLETOKEN;

// const ws = new WebSocket("wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self");
// const ws = new WebSocket("wss://202.142.147.156:3000");

// const ws = new WebSocket(SERVER + '?' + CONTENT_TYPE);

class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        this.speechToTextHandler = speechToText.bind(this);
        this.textToSpeechHandler = textToSpeech.bind(this);
        this.playMessageHandler = playMessage.bind(this);
        this.state = {
            "loader": false,
            "is_recording": false,
            "chat_list": []
        }
    }

    UNSAFE_componentWillMount() {
        const options = {
            sampleRate: 16000,  // default 44100
            channels: 1,        // 1 or 2, default 1
            bitsPerSample: 16,  // 8 or 16, default 16
            audioSource: 6,     // android only (see below)
            wavFile: 'test.wav' // default 'audio.wav'
        };
        AudioRecord.init(options);

        // let text = " السلام و علیکم.";

        // this.textToSpeechHandler(text)

        // let ttsRes = await textTotSpeech({ "text": sttRes.response.text, "voice" : "CLE_Naghma1", "rate":2, "volume":100 })
        // console.log("Text To Speech Respnse:", ttsRes)


        AudioRecord.on('data', async (data) => {
            // console.log(data)
            // const byteCharacters = atob(data);
            // const byteNumbers = new Array(byteCharacters.length);
            // for (let i = 0; i < byteCharacters.length; i++) {
            //     byteNumbers[i] = byteCharacters.charCodeAt(i);
            // }
            // const byteArray = new Uint8Array(byteNumbers);
            // const blob = new Blob([byteArray], { type: 'audio/wav' });


            // let sttRes = await speechToTextApi({ "file": data, "lang": "ur", "srate": 16000 })
            // console.log("Speech To Text Respnse:", sttRes)

            // let chunk = Buffer.from(data, 'base64');
            // console.log(chunk)

            // ws.send(blob)
        });


        // ws.onmessage = function (e) {
        //     var data = e.data;
        //     console.log("On Message:", e)
        // }

        // ws.onopen = function (e) {
        //     console.log("On Open:", e)

        // };

        // ws.onclose = function (e) {
        //     console.log("On Close:", e)
        // };

        // ws.onerror = function (e) {
        //     var data = e.data;
        //     console.log("On Error:", e)
        // }
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

                        {/* {loader &&
                            <View style={{ position: 'absolute', bottom: 1, zIndex: 10 }}>
                                <ActivityIndicator size="large" color={"blue"} />
                            </View>
                        } */}
                    </View>


                    <View style={{ height: hp('2', '1') }} />

                    <View style={styles.askBtnView}>
                        <TouchableOpacity
                            style={styles.autoDetectBtn(is_recording)}
                            onPress={async () => {
                                this.setState({ loader: true })
                                await this.speechToTextHandler()
                                this.setState({ loader: false })
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