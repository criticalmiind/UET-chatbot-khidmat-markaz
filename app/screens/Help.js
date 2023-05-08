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


class Help extends React.Component {
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
                        this.setState({ popup: { "show": true, "title": "Instractions", "audio": "ChangePasswordScreen", "btnTitle": "Back", "type": "help", "message": translate("forgot password screen help") } })
                    }}
                    onClickBack={() => {
                        this.props.navigation.goBack()
                    }} />

                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("1") }} />

                        <Text style={{ ...styles.title, lineHeight: 60, fontSize: 40 }}>{translate('Help')}</Text>

                        <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text>

                        <View style={{ height: hp("4") }} />

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={()=>{
                                this.props.navigation.navigate("CommonQuestions")
                            }}>
                            <Text style={styles.btnTxt}>{translate("Common Questions")}</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={()=>{
                                // this.props.navigation.navigate("")
                            }}>
                            <Text style={styles.btnTxt}>{translate("Complaints")}</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={()=>{
                                // this.props.navigation.navigate("")
                            }}>
                            <Text style={styles.btnTxt}>{translate("Suggestions")}</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={()=>{
                                // this.props.navigation.navigate("")
                            }}>
                            <Text style={styles.btnTxt}>{translate("Contact Us (Email)")}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ height: hp("16") }} />
                    <PoweredBy />
                    <View style={{ height: hp("3") }} />
                </ScrollView>

                <HelpIcon
                    onPress={() => {
                        this.setState({
                            "popup": {
                                "show": true,
                                "title": "Instractions",
                                "btnTitle": "Back",
                                "type": "help",
                                "audio": "LoginScreen",
                                "message": translate("login screen help")
                            }
                        })
                    }} />
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Help);

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
    btn:{
        alignSelf:'center',
        height:hp('6'),
        width:wp('90'),
        borderWidth:1,
        borderColor:"#000000",
        backgroundColor:"#E8E8E8",
        justifyContent:'center',
        paddingHorizontal:wp('2')
    },
    btnTxt:{
        fontFamily:theme.font01,
        fontSize:20,
        color:theme.designColor,
        lineHeight:25
    }
});