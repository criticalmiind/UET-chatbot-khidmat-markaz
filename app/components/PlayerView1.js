import React, { useCallback } from 'react';
import { Slider, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/theme';
import { formatTime, hp, platform, wp } from '../utils';
import { SvgPauseIcon, SvgPlayIcon } from '../constants/images';

const PlayerView1 = ({
  onTogglePlay,
  lastPlayVoice = { duration: 0, index: 0, unique_id: false },
  playState = false,
  sliderValue,
  sound,
}) => {
  const _renderPlayPause = useCallback(() => {
    if (playState === 'play') {
      return <SvgPauseIcon />;
    }
    return <SvgPlayIcon />;
  }, [playState]);

  const handleSliderChange = useCallback(
    (value) => {
      if (sound) sound.setCurrentTime(value);
    },
    [sound]
  );

  return (
    <View style={styles.v01}>
      <View style={styles.playView}>
        <TouchableOpacity onPress={onTogglePlay}>
          {_renderPlayPause()}
        </TouchableOpacity>
        <Slider
          style={{ flex: 1 }}
          minimumValue={0}
          maximumValue={parseFloat(lastPlayVoice['duration']) || 0}
          value={sliderValue}
          onValueChange={handleSliderChange}
          thumbTintColor="#000000"
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
        />
        <Text style={styles.counterTxt}>{formatTime(sliderValue)}</Text>
      </View>
    </View>
  );
};

export default PlayerView1;

const styles = StyleSheet.create({
    v01: {
        width: '100%'
    },
    playView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F7FF',
        borderRadius: 10,
        paddingHorizontal: wp('2'),
        paddingVertical: hp('0.3')
    },
    sliderStyle: {
        left: wp('6', '2'),
        width: platform('78%', '90%'),
        borderRadius: 100,
        padding: 0
    },
    counterTxt: {
        fontFamily: theme.font01,
        color: "#333",
        fontSize: 10
    },
});