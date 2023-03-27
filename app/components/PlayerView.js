import React from 'react';
import { Slider, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { formatTime, hp, wp } from '../utils';
import { SvgPauseIcon, SvgPlayIcon } from '../constants/images';

const PlayerView = ({ text_obj = {}, text_id, onPlay, playState = false, duration=0 }) => {

    return (
        <View style={styles.v01}>
            <View style={styles.playView}>
                <TouchableOpacity
                    onPress={() => {
                        if (onPlay) onPlay(playState)
                    }}>
                    {playState == 'play' && <SvgPauseIcon /> || <SvgPlayIcon />}
                </TouchableOpacity>
            </View>
            <Slider
                style={styles.sliderStyle}
                thumbTintColor="transparent"
                // thumbImage={}
                disabled
                value={duration||0}
                minimumValue={0}
                maximumValue={(text_obj.duration||0)}
                minimumTrackTintColor="#333333"
                maximumTrackTintColor="#000000" />
            <Text style={styles.counterTxt}>{formatTime(duration)}</Text>
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
        width:wp('76')
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