import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { hp, uid, wp } from './../utils';
import AudioRecord from 'react-native-audio-record';
import { base64ToBlobFetch, checkMicrophone, getQueriesAnswers, playMessage, run_scripts, onMicClick, textToSpeech } from '../api/methods';
import { Logo, MicIcon } from '../constants/images';
import { B64ANDROID } from '../api/test';
import { decode as atob } from 'base-64';
const utf8 = require('utf8');

const BASE_URL = "wss://tech.cle.org.pk:9991/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=852d4287-aaec-4298-bf32-f86d0d545ddf";

class LetsBegin extends React.Component {
    constructor(props) {
        super(props)
        this.ws = { readyState: 3 };
        this.sound = null;
        this.ws = new WebSocket(BASE_URL);
        this.getQueriesAnswers = getQueriesAnswers.bind(this);

        this.onMicClickHandler = onMicClick.bind(this);
        this.textToSpeechHandler = textToSpeech.bind(this);
        this.playMessageHandler = playMessage.bind(this);
        this.state = {
            "loader": false,
            "is_recording": false,
            "socket_status": 3,
            "last_id": false,
            "last_ids_list": {},
            "chat_list": {
            },
            "last_unread_msgs": {}
        }
    }

    async UNSAFE_componentWillMount() {
        const options = {
            sampleRate: 16000,  // default 44100
            channels: 1,        // 1 or 2, default 1
            bitsPerSample: 16,  // 8 or 16, default 16
            // audioSource: 6,     // android only (see below)
            wavFile: 'onMessage.wav' // default 'audio.wav'
        };
        let audioPermission = await checkMicrophone();
        AudioRecord.init(options);
        AudioRecord.on('data', this.onAudioStreaming.bind(this));
        this.socketListners()
    }

    async componentWillUnmount(){
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
            if(Platform.OS == 'android'){
                chunk = await run_scripts(data);
            }else{
                chunk = await base64ToBlobFetch(data);
            }
            // const chunk = await Platform.OS === 'ios' ? base64ToBlobFetch(data) : run_scripts(data)
            console.log(chunk)
            // const chunk = await run_scripts(data)
            if(chunk){
                if (this.ws.readyState == 1) {
                    this.ws.send(chunk)
                } else {
                    if (this.ws.readyState == 3) {
                        this.ws = null
                        this.ws = new WebSocket(BASE_URL);
                        this.socketListners()
                        this.ws.send(chunk)
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    onMessage(e) {
        const { chat_list, last_id, last_ids_list } = this.state;
        var data = e.data;
        var res = JSON.parse(data);
        console.log("On Message: ", res)

        if (res.result) {
            const { final = false, hypotheses = [] } = res.result;
            let msgObj = hypotheses[0]

            const unique_id = last_id ? last_id : uid();
            chat_list[unique_id] = { "is_question": true, "text": msgObj.transcript }
            last_ids_list[unique_id] = chat_list[unique_id];

            this.setState({
                "chat_list": chat_list,
                "last_id": final ? false : unique_id,
                "last_ids_list": last_ids_list
            })
            if (final) this.ws.close();
        }
    }

    utf8_from_str(s) {
        for(var i=0, enc = encodeURIComponent(s), a = []; i < enc.length;) {
            if(enc[i] === '%') {
                a.push(parseInt(enc.substr(i+1, 2), 16))
                i += 3
            } else {
                a.push(enc.charCodeAt(i++))
            }
        }
        return a
    }

    onOpen(e) {
        console.log("On Open:", e)
        this.setState({ "socket_status": 1 })

        // B64ANDROID.forEach(async (el) => {

        //     // console.log(el.toString("utf8"))

        //     // const a = await base64ToBlobFetch(el)

        //     // const byteCharacters = atob(utf8.encode(string));
        //     // const byteCharacters = atob(el);
        //     // // console.log(byteCharacters)
        //     // const byteNumbers = new Array(byteCharacters.length);
        //     // for (let i = 0; i < byteCharacters.length; i++) {
        //     //     byteNumbers[i] = byteCharacters.charCodeAt(i);
        //     // }
        //     // const byteArray = new Uint16Array(this.utf8_from_str(el));
        //     const blob = new Blob([this.utf8_from_str(el)], { type: 'audio/x-raw' });

        //     // const blob = await run_scripts(el)
        //     // const blob = this.utf8_from_str(el)
        //     console.log(blob)
        //     this.ws.send(blob)
        //     if (B64ANDROID.length == 14) {
        //         ws.send("EOS")
        //     }
        // });
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
        const { is_recording, chat_list, loader, socket_status } = this.state;

        return (<>
            <View style={styles.safeArea}>
                <View style={styles.mainView}>
                    <View style={styles.v02}>
                        <View style={{ width: wp('78'), justifyContent:'center', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                {this.getStatusIcon(socket_status)}<Text style={styles.letsBeginText}>{"ای خدمت مرکز"} </Text>
                            </View>
                            {/* <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'flex-end' }}>
                                <Text style={styles.notesText}>{`(${this.getStatus(socket_status)})`} </Text>{this.getStatusIcon(socket_status)}
                                
                            </View> */}
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
                                                onPress={() => {

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
                            //     await this.onMicClickHandler()
                            // }}
                            onPressIn={async()=>{
                                await this.onMicClickHandler()
                            }}
                            onPressOut={async()=>{
                                await this.onMicClickHandler()
                            }}>
                            <View style={styles.autoDetectBtnInnerRow}>
                                {/* <Text style={styles.autoDetectBtnText(is_recording)}>{is_recording ? "Stop" : "Ask?"}</Text> */}
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
        fontFamily:theme.font01
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
    chatTxt: (is) => ({ fontSize: 14, textAlign: is ? 'right' : 'left', color: is ? '#333' : 'white' }),
    askBtnView: {
        width: '100%',
        position: 'absolute',
        bottom: hp('4', '2')
    }
});