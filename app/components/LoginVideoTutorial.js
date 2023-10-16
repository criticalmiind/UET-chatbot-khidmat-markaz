import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { translate } from '../i18n';
import WebView from 'react-native-webview';
import { PlayIcon1, SvgPlayIcon, VideoBg } from '../constants/images';

class LoginVideoTutorial extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "play": false
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        return (<>
            <Text style={styles.btnTxt}>{translate('App Usage Technique')}</Text>
            <View style={styles.v01}>
                {this.state.play ?
                    <WebView
                        style={{ flex: 1 }}
                        containerStyle={{ borderWidth: 1, backgroundColor: '#fff' }}
                        allowsFullscreenVideo={true}
                        allowsInlineMediaPlayback={false}
                        source={{ "uri": "https://cc.cle.org.pk/static/videos/PITB.webm" }} /> :
                    <>
                        <VideoBg style={{ height: hp('21'), width: wp('76') }} />
                        <TouchableOpacity
                            style={styles.btn01}
                            onPress={() => {
                                this.setState({ "play": true })
                            }}>
                            <PlayIcon1 style={{ height: hp('3'), width: hp('3') }} />
                        </TouchableOpacity>
                    </>
                }
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginVideoTutorial);

const styles = StyleSheet.create({
    btnTxt: {
        alignSelf: 'center',
        color: "#333",
        fontSize: 16,
        fontFamily: theme.font01
    },
    v01:{
        height: hp('21'),
        width: wp('76'),
        alignSelf: 'center',
        borderWidth: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    btn01:{
        alignSelf: 'center',
        position: 'absolute',
        height:hp('10'),
        width:hp('10'),
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    }
});