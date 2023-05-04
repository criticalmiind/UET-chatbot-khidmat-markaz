import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { hp, wp } from '../utils';
import { theme } from '../constants/theme';
import { translate } from '../i18n';
import { SvgHelp, SvgPopupSuccessIcon, SvgPopupWrongIcon } from '../constants/images';
import AudioPlayer from './AudioPlayer';

class Popup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isPlaying: false
        }
    }

    render() {
        const { isPlaying } = this.state;
        const { show, type, title, audio, message, onClick = (e) => { }, btnTitle = "Back", children } = this.props;

        return (<>
            {show &&
                <View style={styles.safeArea}>
                    <View style={styles.v01}>
                        <View style={styles.v02}>
                            <View style={{ alignItems: 'center' }}>
                                <View style={{ height: hp('2') }} />
                                {type == 'help' && <SvgHelp style={{ height: hp('6'), width: hp('6') }} />}
                                {type == 'success' && <SvgPopupSuccessIcon />}
                                {type == 'wrong' && <SvgPopupWrongIcon />}
                                {title && <Text style={{ ...styles.txt, fontSize: 24, lineHeight: 40, }}>{translate(title)}</Text>}
                            </View>
                            {message && <Text style={{ ...styles.txt, fontSize: 14, textAlign: 'center' }}>{translate(message)}</Text>}
                            {children}
                            <View style={{ height: hp('2') }} />
                            {audio && <>
                                <AudioPlayer
                                    audio={audio}
                                    updateParent={(obj)=>{
                                        this.setState(obj)
                                    }}/>
                                <View style={{ height: hp('2') }} />
                            </>}
                        </View>

                        <View style={styles.v03}>
                            {/* {type == 'help' ? */}
                            <TouchableOpacity
                                style={{ ...styles.btn, borderRightWidth: 1, width: '100%' }}
                                onPress={() => {
                                    if(isPlaying == 'play'){
                                        Alert.alert("Sorry!","Please stop audio player first!")
                                        return
                                    }
                                    if (onClick) onClick(false)
                                }}>
                                <Text style={{ ...styles.txt, lineHeight: 30, }}>{translate(btnTitle)}</Text>
                            </TouchableOpacity>
                            {/* :
                                <>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, borderRightWidth: 1 }}
                                        onPress={() => {
                                            if (onClick) onClick(false)
                                        }}>
                                        <Text style={{ ...styles.txt, lineHeight: 30, }}>{translate("No")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, borderRightWidth: 0 }}
                                        onPress={() => {
                                            if (onClick) onClick(true)
                                        }}>
                                        <Text style={{ ...styles.txt, lineHeight: 30, color: '#1E88E5' }}>{translate("Yes")}</Text>
                                    </TouchableOpacity>
                                </>
                            } */}
                        </View>
                    </View>
                    <View style={styles.mainView}>
                    </View>
                </View>
            }
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Popup);

const styles = StyleSheet.create({
    safeArea: {
        position: "absolute",
        width: wp('100'),
        height: hp('100'),
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainView: {
        position: "absolute",
        backgroundColor: 'black',
        width: wp('100'),
        height: hp('100'),
        zIndex: 10,
        opacity: 0.5,
    },
    v01: {
        width: wp('86'),
        alignSelf: 'center',
        backgroundColor: '#fff',
        zIndex: 11,
        borderRadius: 10
    },
    v02: {
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp('3')
    },
    v03: {
        width: wp('82'),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row'
    },
    btn: {
        height: hp('6'),
        width: wp('41'),
        borderRightWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    txt: { fontFamily: theme.font01, fontSize: 20, color: '#333' },
});