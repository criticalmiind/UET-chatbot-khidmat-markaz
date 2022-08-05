import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { Logo } from '../constants/images';
import { B64ANDROID } from '../api/test';
const utf8 = require('utf8');

class Start extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
        }
    }


convertURIToBinary(dataURI) {
    let BASE64_MARKER = ';base64,';
    let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    let base64 = dataURI.substring(base64Index);
    let raw = window.atob(base64);
    let rawLength = raw.length;
    let arr = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      arr[i] = raw.charCodeAt(i);
    }
    return arr;
  }

    UNSAFE_componentWillMount(){
        // let a = "Não";
        // var uint8array = new TextEncoder().encode(B64ANDROID[0]);
        // // var str = new TextDecoder().decode(uint8array);
        // const blob = new Blob([uint8array], { type: 'audio/x-raw' });


        // let binary = this.convertURIToBinary(`data:application/octet-stream;base64,${B64ANDROID[0]}`);
        // let blob = new Blob([binary], {
        //   type: 'audio/ogg'
        // });
        // console.log(blob)

        // console.log(uint8array, blob)

        // fetch('http://192.168.10.6:8000/', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ base64:B64ANDROID[0] }),
        //   })
        //     .then(response => response.blob())
        //     .then(data => {
        //       console.log('Success:', data);
        //     })
        //     .catch((error) => {
        //       console.error('Error:', error);
        //     });
    }

    render() {
        const { loader, username = "", password = "" } = this.state;

        return (<>
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("5") }} />
                        <Image source={Logo} style={styles.logo}/>
                        <View style={{ height: hp("7") }} />
                        
                        <View style={{ height: hp("4") }} />
                        <TouchableOpacity
                            style={styles.autoDetectBtn()}
                            onPress={async () => {
                                this.props.navigation.navigate("LetsBegin")
                            }}>
                            <Text style={styles.autoDetectBtnText()}>شروع کریں</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            style={styles.autoDetectBtn()}
                            onPress={async () => {
                                this.props.updateRedux({ userData:{} })
                            }}>
                            <Text style={styles.autoDetectBtnText()}>لاگ آوٹ</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Start);

const styles = StyleSheet.create({
    safeArea: {
        flexDirection: 'column',
        backgroundColor: theme.tertiary,
        flex: 1
    },
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1,
    },
    autoDetectBtn: (is) => ({
        height: hp('7'),
        width: wp('90'),
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        borderColor: is ? 'red' : theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    autoDetectBtnText: (is) => ({
        color: is ? 'red' : theme.designColor,
        fontSize: 20,
        fontFamily:theme.font01,
    }),
    textInput: {
        textAlign:'right',
        height: hp('7'),
        width: wp('90'),
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        borderColor: "#a3a3a3",
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp('4'),
        fontSize: 16
    },
    logo:{ height:wp('50'), width:wp('50'), alignSelf:'center' }
});