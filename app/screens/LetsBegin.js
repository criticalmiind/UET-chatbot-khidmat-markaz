import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    Alert,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { mapDispatchToProps, mapStateToProps } from './../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from './../constants/theme';
import { hp, uid, wp } from './../utils';
import AudioRecord from 'react-native-audio-recording-stream';
import { MicIcon } from '../constants/images';
import { SOCKET_CONFIG } from '../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';
import { translate } from '../i18n';
import { OptimizedFlatList } from '../components/OptimizeFlatList';
import Input from '../components/Input';
import Button1 from '../components/Button1';
import moment from 'moment';

class LetsBegin extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            "is_recording": false,
            "speakPressed": false,
            "socket_status": false,
            "socketio": null,
            "last_id": false,
            "last_ids_list": {
                // "asalamoalaikom": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
            },
            "chat_list": {
                // "asalamoalaikom": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaikom1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaikomwe1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaikdsam1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaasdikom1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaikoasdm1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalazxikom1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaicckom1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaikczcom1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaikvzom1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
                // "asalamoalaikosdm1": { "unique_id": "asalamoalaikom", "is_question": true, "text": "السلام علیکم" },
            },
            "temp_text": "",
            "errors":""
        }
    }

    async UNSAFE_componentWillMount() {

        let audioPermission = await this.check_microphone();

        AudioRecord.init(this.props.audioRecordingOptions);
        AudioRecord.on('data', this.onAudioStreaming.bind(this));
    }

    componentDidMount() {}

    logErrors(e){
        console.log(e);
        this.setState({ 'errors': `${moment().format('mm:hhA')}\n${e}\n\n${this.state.errors}` })
    }

    check_microphone = async () => {
        if (Platform.OS == 'android') {
            var result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
            if (!result) {
                result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
            }
            result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
            return result;
        } else {
            return true
        }
    };

    async onSpeakPress(socket) {
        let audioPermission = await this.check_microphone();
        if (audioPermission) {
            await this.wait(100)
            AudioRecord.start();
            await this.wait(500)
            this.setState({
                "socket_status": true,
                "socketio": socket,
                "is_recording": true,
                "last_id": uid()
            })
        } else {
            Alert.alert(translate("Please Allow audio permission and try again!"))
        }
    }

    async onSpeakRelease() {
        await this.wait(200)
        const { socketio, socket_status } = this.state;
        let audioFile = await AudioRecord.stop();
        this.setState({ "speakPressed": false, "is_recording": false })
        await this.wait(1500)
        if (socketio && socket_status) {
            socketio?.emit('audio_bytes', 'EOS')
            socketio?.emit('audio_end')
        }
        if (socketio) socketio?.disconnect();
        this.setState({ "socketio": null, "last_id": false, "temp_text": "" })
        await this.wait(1000)
    }

    connectSocket = async () => {
        const { resources } = this.props
        // const socket = io(resources.asrModel, SOCKET_CONFIG('connection1'));
        const socket = io(resources.asrModel, SOCKET_CONFIG(resources.connectionId));
        socket.on('connect', ((e) => {
            this.logErrors('socket connected')

            this.onSpeakPress(socket)
            if (!this.state.speakPressed) {
                this.onSpeakRelease()
            }
        }).bind(this));

        socket.on('disconnect', (async (e) => {
            this.logErrors(`Disconnected from server: ${e}`)
        }).bind(this));

        socket.on('response', this.onMessage.bind(this));
        
        socket.on('connect_error', (error) => {
            console.log(error);
            this.logErrors(`Socket connection error: ${error}`)
        });
        
        this.setState({ "speakPressed": true, "socketio": socket });
    }

    async componentWillUnmount() {
        await AudioRecord.stop()
    }

    wait = (time = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => { resolve() }, time)
        });
    }

    onAudioStreaming = async (data) => {
        const { socketio } = this.state
        try {
            socketio?.emit('audio_bytes', data.replace("data:audio/wav;base64,", ""))
        } catch (error) {
            this.logErrors(`onAudioStreaming: ${error}`)
        }
    }

    onMessage = async (e) => {
        const {
            chat_list,
            last_id,
            last_ids_list,
            temp_text,
        } = this.state;
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
                "last_ids_list": updatedLastIdsList
            }));
        }
    }

    renderChatItem = ({ item, index }) => {
        if(!Array.isArray(item.text)){
            return this._renderMessagePanel(item, item.text);
        }
        return (
            <View>
                {item.text.map((text, innerIndex) => (
                    <View key={`${index}-${innerIndex}`}>
                        {this._renderMessagePanel(item, text)}
                    </View>
                ))}
            </View>
        );
    };

    _renderMessagePanel = (obj, text) => {
        return (
            <View style={styles.chatRow(obj.is_question)}>
                {!obj.is_question ? <View style={styles.chatViewIcon(obj.is_question)} /> : <></>}
                <View style={styles.chatTextView(obj.is_question)}>
                    <Text style={styles.chatTxt(obj.is_question)}>{text ? text.replace("#", "") : ''}</Text>
                </View>
                {obj.is_question ? <View style={styles.chatViewIcon(obj.is_question)} /> : <></>}
            </View>
        )
    }

    render() {
        const { is_recording, chat_list } = this.state;

        return (
            <>
                <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                    <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                    <View style={styles.mainView}>
                        <View style={styles.v01}>
                            { this.state.openLogs && <>
                                    <Input
                                        // disabled={true}
                                        multiline={true}
                                        viewStyle={{ height: undefined }}
                                        textInputStyle={{ textAlign: 'left', height: hp('30') }}
                                        value={`${this.state.errors}`}/>
                                    
                                    <View style={{ height:hp('1') }} />
                                </>
                            }
                            <Button1
                                style={{ height:hp('5') }}
                                title={this.state.openLogs?"Close Logs":"Open Logs"}
                                onPress={() => {
                                    this.setState({ "openLogs":!this.state.openLogs })
                                }}>
                            </Button1>

                                
                            <OptimizedFlatList
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', flexDirection: 'column' }}
                                style={{ width: wp('100') }}
                                data={Object.values(chat_list)}
                                renderItem={this.renderChatItem}
                                initialNumToRender={4}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>

                        <View style={styles.speakBtnView}>
                            <TouchableOpacity
                                style={styles.speakBtn(is_recording, false)}
                                onLongPress={async () => {
                                    this.connectSocket()
                                }}
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