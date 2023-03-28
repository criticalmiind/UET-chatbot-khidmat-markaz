import React, { useEffect, useState } from 'react';
import { Slider, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { formatTime, hp, wp } from '../utils';
import { SvgPauseIcon, SvgPlayIcon } from '../constants/images';

const PlayerView = ({
    onPlay,
    lastPlayVoice = { "duration": 0, "index": 0, "text_id": false },
    playState = false,
    voice_timer = 0,
    unique_id,
    index,
}) => {

    const timer = lastPlayVoice["index"] == index && lastPlayVoice["text_id"] == unique_id ? (voice_timer || 0) : 0

    const isPlay = playState == 'play' && lastPlayVoice["index"] == index && lastPlayVoice["text_id"] == unique_id

    return (
        <View style={styles.v01}>
            <View style={styles.playView}>
                <TouchableOpacity
                    onPress={() => {
                        if (onPlay) onPlay(playState)
                    }}>
                    {isPlay && <SvgPauseIcon /> || <SvgPlayIcon />}
                </TouchableOpacity>
            </View>
            <Slider
                style={styles.sliderStyle}
                thumbTintColor="transparent"
                // thumbImage
                // onSlidingComplete={(e)=>{
                //     console.log('test',e)
                // }}
                disabled={false}
                minimumValue={0}
                maximumValue={parseFloat(lastPlayVoice['duration']) || 0}
                value={timer}
                minimumTrackTintColor="#A3A3A3"
                maximumTrackTintColor="#000000" />
            <Text style={styles.counterTxt}>{formatTime(timer)}</Text>
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerView);

const styles = StyleSheet.create({
    v01: {
        height: hp('3'),
        width: '100%',
        backgroundColor: '#F0F7FF',
        borderRadius: 100,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: wp('1'),
        width: wp('76')
    },
    playView: {
        position: 'absolute',
        zIndex: 10,
        left: wp('2'),
    },
    sliderStyle: {
        left: wp('6', '1'),
        width: '78%',
        borderRadius: 100,
        padding: 0
    },
    counterTxt: {
        position: 'absolute',
        zIndex: 10,
        right: wp('2'),
        fontFamily: theme.font01,
        color: "#333",
        fontSize: 10
    },
});