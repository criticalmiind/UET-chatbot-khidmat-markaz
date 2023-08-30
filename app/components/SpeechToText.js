import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Voice from 'react-native-voice';
import { hp, isObjEmpty, wp } from '../utils';
import { theme } from '../constants/theme';

const SpeechToText = ({
    btnDisabled=false,
    btnStyle={},
    btnContent=false,
    onSpeechStart=()=>{},
    onSpeechStop=()=>{},
    onSpeakResults=(text)=>{},
    onSpeechFinalResults=(text)=>{},
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (isSpeaking) {
            startSpeechRecognition();
        }
    }, [isSpeaking]);

    const startSpeechRecognition = async () => {
        console.log("Start");
        onSpeechStart()
        try {
            await Voice.start('ur-IN');
        } catch (error) {
            console.error('Error starting voice recognition:', error);
        }
    };

    const stopSpeechRecognition = async () => {
        try {
            await Voice.stop();
            setIsSpeaking(false);
            onSpeechStop()
            console.log("Stop");
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    };

    Voice.onSpeechPartialResults = (e) => {
        const partialResults = e.value;
        onSpeakResults(partialResults)
    };

    Voice.onSpeechResults = (e) => {
        const res = e.value[0];
        console.log("b", res);
        onSpeechFinalResults(res)
    };


    Voice._onSpeechError = (e) => {
        console.log(e);
    };

    Voice._onSpeechStart = (e) => {
        setIsSpeaking(true);
    };

    
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: hp('2') }}>
                <TouchableOpacity
                    disabled={btnDisabled}
                    onLongPress={startSpeechRecognition}
                    onPressOut={stopSpeechRecognition}
                    style={isObjEmpty(btnStyle)?{
                        height: hp('5'),
                        width: wp('40'),
                        backgroundColor: theme.designColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isSpeaking ? 0.5 : 1
                    }:btnStyle}>
                    { btnContent ? btnContent : <Text style={{ color: '#fff' }}>Start</Text> }
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SpeechToText