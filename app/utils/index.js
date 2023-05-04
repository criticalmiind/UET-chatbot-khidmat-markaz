import { Alert, Platform } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export function getAsrLink(asrModel, connectionId) {
  return `${asrModel}content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=${connectionId}`
}
export function get_resource(key) {
  const { asrModel, connectionId, dialogueManager, ttsManager } = this.props.resources;
  // if (key == 'asr') return asrModel ? `${asrModel}?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=${connectionId}` : ''
  // if (key == 'asr') return asrModel ? `${asrModel}?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1` : ''
  if (key == 'asr') return asrModel ? `${asrModel}` : ''
  if (key == 'dm') return filter_url(dialogueManager)
  if (key == 'tts') return filter_url(ttsManager)
  if (key == 'cid') return connectionId
}


export const wait = (time = 100) => {
  return new Promise((resolve) => {
      setTimeout(() => { resolve() }, time)
  });
}

export function filter_url(str) {
  let arr = str.split("//")
  return `https://${arr[1]}`
}

export function jsonParse(str) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return {}
  }
}

export function platform(ios, android, ipad) {
  if (Platform.isPad && ipad) {
    return ipad ? ipad : ios;
  }
  if (ios && android) {
    return Platform.OS === 'ios' ? ios : android;
  } else {
    return ios
  }
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

export function padNumber(number, p = '000') {
  let str = "" + number
  let pad = p
  return pad.substring(0, pad.length - str.length) + str;
}

export function splitArrayIntoChunks(array, lenght) {
  var chunks = [], i = 0, n = array.length;
  while (i < n) {
    chunks.push(array.slice(i, i += lenght));
  }
  return chunks;
}

export async function notify({ title = '', message = '', success }) {
  Alert.alert(title, message)
}

export function makeAudioFileObj(text, audio = false, files = {}) {
  return { ...audio ? { [`${text}`]: audio } : {}, ...files }
}

// export async function askUser(is, callback) {
//   if (is) return callback(is)
//   Alert.alert(
//     "Cowafera Would like to use your location to find nearest salons!",
//     "Are you sure want to allow location access on your device?",
//     [
//       { text: "No", onPress: () => callback(false) },
//       { text: "Yes", onPress: async () => callback(true) }
//     ],
//     { cancelable: false }
//   );
// }

export function search(list, keyword = '', key1 = 'name', key2) {
  let matched = [];
  if (keyword !== '') {
    matched = list.filter(function (obj) {
      let isTrue = false;
      if (obj[key1] && simplify(obj[key1]).includes(simplify(keyword))) isTrue = true;
      if (obj[key2] && simplify(obj[key2]).includes(simplify(keyword))) isTrue = true;
      return isTrue;
    })
  } else {
    matched = list;
  }
  return matched
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export function formatTime(secondsElapsed) {
  let minutes = Math.floor(secondsElapsed / 60);
  let seconds = Math.floor(secondsElapsed % 60);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${minutes}:${seconds}`;
}