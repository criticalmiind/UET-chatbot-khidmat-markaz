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
import { ungzip } from 'pako';

// const CLETOKEN = "af253b41-404c-4d78-be7f-6684dd52bcc2";
// const SERVER = "wss://tech.cle.org.pk:9996/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=af253b41-404c-4d78-be7f-6684dd52bcc2"
// const CONTENT_TYPE = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=" + CLETOKEN;

// const CLETOKEN = "af253b41-404c-4d78-be7f-6684dd52bcc2";
// const SERVER = "wss://202.142.147.156:3000/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=af253b41-404c-4d78-be7f-6684dd52bcc2"
// const CONTENT_TYPE = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=" + CLETOKEN;

// const ws = new WebSocket("wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self");
// const ws = new WebSocket(SERVER + '?' + CONTENT_TYPE);
// const SERVER = "wss://202.142.147.156:3000/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=af253b41-404c-4d78-be7f-6684dd52bcc2"

// 852d4287-aaec-4298-bf32-f86d0d545ddf

// Decode base64 zip
// let req = "eJzdmt9v1DgQx9/7V+QdYTwez4wtrSohdJxOujvuBG+IhxwEaUV3F6VbhO6vv4ntBHpQ2LbZTVJVasfz4zsf21M/ZfVie7HeNr99at7ud+0vn/dt3RlP39Uf9/V+vdu+1D/NebV6tvk02Lnma8/Lj039oWl71+V5Vb2u3pytfr3Y/VNfXHOfVZUzyGiheQS2EiMoxM0jG6rHaNh6irqIFRhg8Zjsx95YL0h54Qx7ZMgLNN554LwAE639kka6KmnREEMsbZwBF7hIi7Eh+CHSickgDQKQI2CCBJKhBmKIfQSs99QTCMeAOUImCvosoGgoiUaSmEYkBRTTO3A5gCYyScgLMgIOuwjrMQFD2qZ0UuxcKLZwkEyvOR5sTH5nAsQYkj+aYCnkWjTOkuTOwfgYvO91dH+xoAbrqNd3QQ87+fV2KEYofhJgLvqMAlL8NgamXkfvhgoPWscu+dMEkIOoS3AVm6g7wDQNYHxAViSArjXFbhjUdkapHRU/Bceh2EEo9DaCDH4fAQYd62MY7NihJhsQXJ9j9RYw2d3lCmGZTohkOdlehzNCtlGP1wsl22kvTDodf4jOJVNPJXrJg0m6FUYscx0QOfu1FIHyqbD6pZx6MMwEWOYDLNic3/1/BPHJ9npjFkKy2agKcbEJQ3DJljTovVsnjovbOkQptrMoVDCjkOvl2ToXi02YpzIhRD3+gs9kpd+W6Ojmtrb713/e7v5t+gcivwZPvn04ysNTXofV9dfocr/eDI9QF/6rXe/aF+/fXzb784r0wvXAqtUf9ednu6utusDaavXn1eZ5W28aLdDV31f1u1ZF3r5q2s25Pj9Qnek9db+GP18Z18z/Lb5ZfsfxXdcNzhvdPwj8MPST4E/DByQclHJg0sFpt0i8Veotk2+dfoeCO5XcsejOZfcovFfpPYvvXT6CwCgSI4mMJjOi0KhSI4uNLncEwaNIHkn0aLJHFD6q9JHFjy5/ggYnaXGiJidrc8JGJ2114mYnbzdBw0laTtR0srYTNp609cTNJ28/A4BZIMwEYjYYMwKZFcrMYGaHM0OgWSLNFGq2WDMGmzXazOFmj7cAwEUgLgRyMZgLAl0U6sJgF4e7QOBFIi8UerHYCwZfNPrC4ReP/wA28CC28EA28WC20W3kzdnq9/W2qdv8nV/1evg+cGq2cX6+fD5549eRTw78lvs/mASdSQ=="
// const gzippedString = 'H4sIAAAAAAAA//NIzcnJVyguSUzOzi9LLUrLyS/XUSjJSMzLLlZIyy9SSMwpT6wsVshIzSnIzEtXBACs78K6LwAAAA==';
// const gzippedBuffer = new Buffer.from(req, 'base64');
// const unzippedBuffer = ungzip(gzippedBuffer);
// const unzippedString = new TextDecoder('utf8').decode(unzippedBuffer);
// console.log(unzippedString)


const BASE_URL = "wss://tech.cle.org.pk:9991/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=af253b41-404c-4d78-be7f-6684dd52bcc2";
// const BASE_URL = "wss://tech.cle.org.pk:9991/client/ws/speech";


class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        this.ws = new WebSocket(BASE_URL);
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
            wavFile: 'test.wav' // default 'audio.wav'
        };
        AudioRecord.init(options);

        AudioRecord.on('data', async (data) => {
            const b64toBlob = (base64, type = 'application/octet-stream') => fetch(`data:${type};base64,${base64}`).then(res => res.blob())
            const chunk = await b64toBlob(data)

            // console.log(chunk);

            if(this.ws.readyState == 1){
                this.ws.send(chunk)
            }else{
                this.ws = new WebSocket(BASE_URL);
                this.ws.send(chunk)
            }
        });

        // console.log(this.ws)

        if(this.ws){
            this.ws.onopen = function (e) {
                console.log("On Open:", e)
            };

            this.ws.onmessage = function (e) {
                var data = e.data;
                var res = JSON.parse(data);
                console.log("On Message:",res)
            }

            this.ws.onclose = function (e) {
                console.log("On Close:", e)
            };

            this.ws.onerror = function (e) {
                var data = e.data;
                console.log("On Error:", e)
            }
        }

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