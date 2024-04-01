import { Alert, Platform } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export const wait = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve() }, time)
  });
}


export function wp(ios, android, ipad) {
  if (Platform.isPad && ipad) {
    return ipad ? widthPercentageToDP(isNullRetNull(ipad, 0)) : widthPercentageToDP(isNullRetNull(ios, 0));
  }
  if (ios && android) {
    return Platform.OS === 'ios' ? widthPercentageToDP(isNullRetNull(ios, 0)) : widthPercentageToDP(isNullRetNull(android, 0));
  } else {
    return widthPercentageToDP(isNullRetNull(ios, 0))
  }
}

export function hp(ios, android, ipad) {
  if (Platform.isPad && ipad) {
    return ipad ? heightPercentageToDP(isNullRetNull(ipad, 0)) : heightPercentageToDP(isNullRetNull(ios, 0));
  }
  if (ios && android) {
    return Platform.OS === 'ios' ? heightPercentageToDP(isNullRetNull(ios, 0)) : heightPercentageToDP(isNullRetNull(android, 0));
  } else {
    return heightPercentageToDP(isNullRetNull(ios, 0))
  }
}

export function isObjEmpty(obj) {
  if (obj) {
    return Object.keys(obj).length === 0;
  }
  return true;
}

export function simplify(string) {
  if (string !== null && string !== undefined && string !== "") {
    return string.replace(/\s/g, '').toLowerCase();
  }
  return string;
}

export function isNullRetNull(string, retVal = "") {
  return string !== undefined && string !== null && string !== "" ? string : retVal;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export function formatTime(secondsElapsed) {
  let minutes = Math.floor(secondsElapsed / 60);
  let seconds = Math.floor(secondsElapsed % 60);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${minutes || '00'}:${seconds || '00'}`;
}