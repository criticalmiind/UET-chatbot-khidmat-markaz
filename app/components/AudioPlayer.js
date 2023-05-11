import React, { Component } from 'react';
import { View, Text, Slider, TouchableOpacity, Alert } from 'react-native';
import Sound from 'react-native-sound';
import { AUDIO } from '../assets/audio';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { hp, wait, wp } from '../utils';
import { SvgPauseIcon, SvgPlayIcon } from '../constants/images';
var RNFS = require('react-native-fs');

const base64IntoPath = async (url) => {
  const path = `${RNFS.DocumentDirectoryPath}/temp_audio_file.wav`;
  try {
    await RNFS.writeFile(path, url.replace("data:audio/wav;base64,", ""), 'base64')
  } catch (error) {
    console.log(error);
  }
  return path
}

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.sound = null
    this.state = {
      "isPlaying": false,
      "duration": 0,
      "currentTime": 0,
      "sliderValue": 0,
    };
  }

  stopAudio = async () => {
    if (this.sound) await this.sound.stop()
    this.sound = null
  }

  togglePlay = async () => {
    if (!this.props.audio) {
      Alert.alert("Invalid Audio", "Please pass valid audio");
      return
    }
    if (this.state.isPlaying == false) {
      let path = await base64IntoPath(this.isBase64 ? this.props.audio : AUDIO[this.props.audio])
      this.sound = new Sound(path, '', (error) => {
        this.onSoundPlay(error)
        this.sound.play((success) => {
          this.playComplete(success)
        });
      });
    } else if (this.state.isPlaying == 'play') {
      if (this.sound) this.sound.pause();
      this.setState({ "isPlaying": 'pause' });
      this.props.updateParent({ "isPlaying": 'pause' })
    } else if (this.state.isPlaying == 'pause') {
      this.sound.play((success) => {
        this.playComplete(success)
      });
      this.setState({ "isPlaying": 'play' });
      this.props.updateParent({ "isPlaying": 'play' })
    }
  };

  onSoundPlay = async (error) => {
    this.setState({ "isPlaying": 'play', "duration": this.sound._duration });
    this.props.updateParent({ "isPlaying": 'play' })
    await wait(100)
    if (error) {
      Alert.alert('Notice', '(Error code : 1) audio file error.\naudio file not reachable!');
    } else {
      try {
        this.playTimer = setInterval((e) => {
          if (this.sound)
            this.sound.getCurrentTime(async (seconds, isPlaying) => {
              this.setState({ "currentTime": seconds, "sliderValue": seconds });
            })
        }, 500)
      } catch (e) {
        Alert.alert('Notice', '(Error code : 2) ' + e);
      }
    }
  }

  playComplete = (success) => {
    this.setState({ "isPlaying": false, "currentTime": 0, "sliderValue": 0 });
    this.props.updateParent({ "isPlaying": false })
    if (this.playTimer) clearInterval(this.playTimer);
  }

  handleSliderChange = (value) => {
    if (this.sound) {
      this.sound.setCurrentTime(value);
      this.setState({ "currentTime": value, "sliderValue": value });
    }
  };

  formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const pad = (num) => (num < 10 ? `0${num}` : num);
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  render() {
    const { isPlaying, duration, currentTime, sliderValue } = this.state;
    return (
      <View style={{ width: '100%' }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F0F7FF',
          borderRadius: 10,
          paddingHorizontal: wp('2'),
          paddingVertical: hp('1')
        }}>
          <TouchableOpacity onPress={this.togglePlay.bind(this)}>
            {
              isPlaying == 'play' && <SvgPauseIcon /> ||
              isPlaying == 'pause' && <SvgPlayIcon /> ||
              <SvgPlayIcon />
            }
          </TouchableOpacity>
          <Slider
            style={{ flex: 1 }}
            minimumValue={0}
            maximumValue={duration}
            value={sliderValue}
            onValueChange={this.handleSliderChange.bind(this)}
            thumbTintColor="#000000"
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
          <Text style={{ fontSize: 12 }}>{this.formatTime(currentTime)}</Text>
        </View>
      </View>
    )
  }
}

export default AudioPlayer;