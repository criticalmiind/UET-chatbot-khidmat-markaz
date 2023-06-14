import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import HelpIcon from '../components/HelpIcon';
import { Logo } from '../constants/images';
import Header from '../components/Header';


class ContactUs extends React.Component {
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
            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                <Header
                    onClickHelp={() => {
                        this.setState({ popup: { "show": true, "title": "Instractions", "audio": "HelpScreen", "btnTitle": "Back", "type": "help", "message": translate("help screen help") } })
                    }}
                    onClickBack={() => {
                        this.props.navigation.goBack()
                    }} />

                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("4") }} />

                        <Text style={{ ...styles.title, lineHeight: 60, fontSize: 40 }}>{translate('Contact Us')}</Text>

                        {/* <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text> */}

                        <View style={{ height: hp("8") }} />

                        <Text style={styles.txt01}>{translate('Contact No')}</Text>
                        <View style={styles.v01}>
                            <Text style={styles.txt02}>{translate("+92-42-99000000")}</Text>
                        </View>

                        <View style={{ height: hp("4") }} />

                        <Text style={styles.txt01}>{translate('Email Address')}</Text>
                        <View style={styles.v01}>
                            <Text style={styles.txt02}>{translate("info@pitb.gov.pk")}</Text>
                        </View>
                        <View style={{ height: hp("6") }} />

                        <Text style={styles.txt01}>{translate('11th Floor, Arfa Software Technology Park, 346-B, Ferozpur Road, Lahore.')}</Text>

                    </View>
                    <View style={{ height: hp("10") }} />
                    <PoweredBy />
                    <View style={{ height: hp("3") }} />
                </ScrollView>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);

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
    logo: {
        height: wp('24'),
        width: wp('24'),
        alignSelf: 'center'
    },
    logo_bg: {
        height: wp('35'),
        width: wp('35'),
        alignSelf: 'center',
        position: 'absolute',
        opacity: 0.05
    },
    title: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 22,
        color: theme.designColor
    },
    v01:{
        alignSelf:'center',
        height:hp('6'),
        width:wp('90'),
        borderWidth:1,
        borderRadius:20,
        borderColor:"#000000",
        backgroundColor:"#E8E8E8",
        justifyContent:'center',
        paddingHorizontal:wp('2')
    },
    txt01:{
        fontFamily:theme.font01,
        fontSize:22,
        color:theme.designColor,
        textAlign:'center'
    },
    txt02:{
        fontFamily:theme.font01,
        fontSize:18,
        color:theme.designColor,
        textAlign:'center'
    },
});