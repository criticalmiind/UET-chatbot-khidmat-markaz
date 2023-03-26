import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

const VoicePlayer = ({ uri }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      setSound(sound);
      const { duration } = await sound.getStatusAsync();
      setDuration(duration);
    }
    loadSound();
  }, [uri]);

  const playSound = async () => {
    if (sound !== null) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound !== null) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const updatePosition = async () => {
    if (sound !== null) {
      const { position } = await sound.getStatusAsync();
      setPosition(position);
      setSliderValue(position);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updatePosition();
    }, 1000);
    return () => clearInterval(interval);
  });

  const handleSliderValueChange = async (value) => {
    if (sound !== null) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const handleSliderLayout = (event) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  const formattedTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds - minutes * 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={isPlaying ? pauseSound : playSound}>
        <MaterialIcons
          name={isPlaying ? 'pause' : 'play-arrow'}
          size={32}
          color="black"
        />
      </TouchableOpacity>
      <View style={styles.sliderContainer} onLayout={handleSliderLayout}>
        <View
          style={[
            styles.slider,
            { width: sliderWidth * (position / duration) },
          ]}
        />
        <Slider
          minimumValue={0}
          maximumValue={duration}
          value={sliderValue}
          onValueChange={handleSliderValueChange}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
          thumbTintColor="#000000"
        />
      </View>
      <Text>{formattedTime(duration)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    height: 10,
  },
  slider: {
    height: 2,
    backgroundColor: '#000000',
    position: 'absolute',
    top: 4,
    left: 0,
  },
});

export default VoicePlayer;