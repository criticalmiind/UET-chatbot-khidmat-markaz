import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { Logo, Logo01, SvgHelp } from '../constants/images';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Popup from '../components/Popup';

class VideoTutorial extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { loader } = this.state;

        return (<>
            <Loader isShow={loader} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} />
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("9") }} />
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text>
                        <View style={{ height: hp("4") }} />
                        <Text style={styles.btnTxt}>{translate('App Usage Technique')}</Text>
                        <View style={{
                            height:hp('28'),
                            width:wp('90'),
                            alignSelf:'center',
                            backgroundColor:'#333'
                        }}>

                        </View>
                    </View>
                    <View style={{ height: hp("11") }} />

                    <Text style={styles.powered_txt}>{translate('powered')}</Text>
                    <View style={{ height: hp("1") }} />
                    <View style={styles.powered_view}>
                        <Image source={Logo} style={styles.footer_logo} />
                        <Image source={Logo01} style={styles.footer_logo01} />
                    </View>
                </ScrollView>
                <View style={styles.helpView}>
                    <TouchableOpacity
                        style={styles.helpBtn}
                        onPress={() => {
                            this.setState({ popup: { "show": true, "type": "help", "message": translate("Would You need help?") } })
                        }}>
                        <SvgHelp />
                    </TouchableOpacity>
                </View>
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoTutorial);

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
    btnTxt: {
        alignSelf:'center',
        color: "#333",
        fontSize: 18,
        fontFamily: theme.font01
    },
    logo: {
        height: wp('35'),
        width: wp('35'),
        alignSelf: 'center'
    },
    logo_bg: {
        height: wp('60'),
        width: wp('60'),
        alignSelf: 'center',
        position: 'absolute',
        opacity: 0.05
    },
    title: {
        alignSelf: 'center',
        borderColor: "#a3a3a3",
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 36
    },
    powered_view: {
        width: wp('40'),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    powered_txt: {
        alignSelf: 'center',
        borderColor: "#a3a3a3",
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 12,
        lineHeight: 15,
        letterSpacing: 6
    },
    footer_logo: { height: wp('13'), width: wp('13'), alignSelf: 'center' },
    footer_logo01: {
        height: wp('13'),
        width: wp('24'),
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    helpView: {
        position: 'absolute',
        top: hp('1'),
        right: hp('1')
    },
    helpBtn: {
        width: hp('8'),
        height: hp('8'),
        // borderWidth: 1,
        // borderColor: "#21347E",
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }
});