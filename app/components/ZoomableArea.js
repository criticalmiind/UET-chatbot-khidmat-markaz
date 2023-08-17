import React, { useState } from 'react';
import { Text } from 'react-native';
import { View } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const ZoomableAreaView = ({ children }) => {
  const [scale, setScale] = useState(1);

  const onZoomEvent = event => {
    setScale(event.nativeEvent.scale);
  };

  const onZoomStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Do something when the pinch gesture ends
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PinchGestureHandler onGestureEvent={onZoomEvent} onHandlerStateChange={onZoomStateChange}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ scale }],
            }}
          >
            {children}
          </View>
        </View>
      </PinchGestureHandler>
    </View>
  );
};

export default ZoomableAreaView;


// import React, { useState } from 'react';
// import { View, Text } from 'react-native';
// import Svg, { G, Rect, Text as SVGText } from 'react-native-svg';
// import { TapGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

// const ZoomInScreenPart = ({ children }) => {
//     const [scale, setScale] = useState(1);
//     const [baseScale, setBaseScale] = useState(1);
//     const [translateX, setTranslateX] = useState(0);
//     const [translateY, setTranslateY] = useState(0);

//     const onZoomEvent = event => {
//         setScale(event.nativeEvent.scale);
//     };

//     const onZoomStateChange = event => {
//         console.log(event.nativeEvent.oldState, State.ACTIVE);
//         if (event.nativeEvent.oldState === State.ACTIVE) {
//             setBaseScale(scale);
//         }
//     };

//     const onDoubleTap = event => {
//         const x = event.nativeEvent.x;
//         const y = event.nativeEvent.y;

//         setTranslateX(-x * (scale - baseScale));
//         setTranslateY(-y * (scale - baseScale));
//     };

//     return (
//         <TapGestureHandler onActivated={onDoubleTap}>
//             <PinchGestureHandler onGestureEvent={onZoomEvent} onHandlerStateChange={onZoomStateChange}>
//                 <View style={{ flex: 1 }}>
//                     <Svg width="100%" height="100%">
//                         <G transform={{ translateX, translateY, scale }}>
//                             {/* Your content here */}
//                             <Text>asdhakjsdhaskdhkajsdh</Text>
//                             <Text>asdhakjsdhaskdhkajsdh</Text>
//                             <Text>asdhakjsdhaskdhkajsdh</Text>
//                             <Text>asdhakjsdhaskdhkajsdh</Text>
//                             <Text>asdhakjsdhaskdhkajsdh</Text>
//                             <Text>asdhakjsdhaskdhkajsdh</Text>
//                             <Text>asdhakjsdhaskdhkajsdh</Text>
//                             <Text>asdhakjsdhaskdhkajsdh</Text>
//                             {children}
//                         </G>
//                     </Svg>
//                 </View>
//             </PinchGestureHandler>
//         </TapGestureHandler>
//     );
// };

// export default ZoomInScreenPart