import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { hp, wp } from '../utils';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const ZoomableArea = () => {
  const [isTouching, setIsTouching] = useState(false);
  const [touchX, setTouchX] = useState(0);
  const [touchY, setTouchY] = useState(0);

  const animatedSize = new Animated.Value(0);

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setIsTouching(true);
    setTouchX(locationX);
    setTouchY(locationY);
    Animated.spring(animatedSize, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    Animated.spring(animatedSize, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const handleTouchCancel = () => {
    handleTouchEnd();
  };

  const animatedCircleSize = animatedSize.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Change this to control the circle size
  });
  console.log(animatedCircleSize, touchX, touchY);


  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log("Ok");
        }}>
        <Text>Abc</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log("Ok");
        }}
        style={styles.touchArea}
        onPressIn={handleTouchStart}
        onPressOut={handleTouchEnd}
        onResponderTerminate={handleTouchCancel}
      >
        <View style={styles.innerTouchArea}>
          {isTouching && animatedCircleSize != 0 && (<>
            <Text>JHGJHGKJHG</Text>
            <Animated.View
              style={[
                styles.circle,
                {
                  width: animatedCircleSize,
                  height: animatedCircleSize,
                  borderRadius: animatedCircleSize,

                  left: 100,
                  top: 100,
                  // left: touchX - animatedCircleSize / 2,
                  // top: touchY - animatedCircleSize / 2,
                },
              ]}
            />
          </>)}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: hp('50%'),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  touchArea: {
    width: wp('100%'),
    height: hp('50%'),
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerTouchArea: {
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1
  },
});

export default ZoomableArea;