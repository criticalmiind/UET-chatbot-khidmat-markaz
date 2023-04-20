import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, notify, wp } from '../utils';
import { Logo, Logo01, LogoWhite, SvgBackIcon, SvgHelp, SvgPhone, SvgPwd } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Input from '../components/Input';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            'userName': "",
            'password': "",
            'confirm_password': "",
        }
    }

    async update_passowrd() {
        this.setState({ popup: { "show": true, "type": "wrong", "message": translate("This Feature is under construction") } })
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { loader, userName, password, confirm_password } = this.state;
        let disabled_login = (isNullRetNull(userName, 1) == 1 || isNullRetNull(password, 1) == 1 || password != confirm_password)

        return (<>
            <Loader isShow={loader} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} />

            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                <View style={styles.headerView}>
                    <TouchableOpacity
                        style={styles.helpBtn}
                        onPress={() => {
                            this.setState({ popup: { "show": true, "type": "help", "message": translate("Would You need help?") } })
                        }}>
                        <Text style={styles.helpBtnTxt}>HELP</Text>
                    </TouchableOpacity>
                    <Image source={LogoWhite} style={{ top: -4, height: wp('14'), width: wp('14') }} />
                    <TouchableOpacity
                        style={{ width: wp('18') }}
                        onPress={() => { this.props.navigation.goBack() }}>
                        <SvgBackIcon />
                    </TouchableOpacity>
                </View>

                <View style={styles.mainView}>
                    <View style={{
                        // height:hp('50'),
                        width: wp('90'),
                        backgroundColor: theme.designColor,
                        alignSelf: 'center',
                        borderRadius: 30
                    }}>
                        <Text style={styles.title}>{translate('Forgot Password')}</Text>
                        <View style={{ height: hp("1.5") }} />
                        <Input
                            viewStyle={{ width: wp('84') }}
                            Icon={SvgPhone}
                            placeholder={translate('phone-placeholder')}
                            value={userName}
                            onChangeText={(str) => {
                                this.setState({ "userName": str })
                            }} />

                        <View style={{ height: hp("1") }} />
                        <Input
                            viewStyle={{ width: wp('84') }}
                            Icon={SvgPwd}
                            iconStyle={{ paddingRight: wp('2') }}
                            placeholder={translate("password")}
                            value={password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "password": str })
                            }} />

                        <View style={{ height: hp("1") }} />
                        <Input
                            viewStyle={{ width: wp('84') }}
                            Icon={SvgPwd}
                            placeholder={translate("Confirm Password")}
                            value={confirm_password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "confirm_password": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            // disabled={disabled_login}
                            style={{ ...styles.btn, opacity: disabled_login ? 0.9 : 1 }}
                            onPress={async () => {
                                this.update_passowrd()
                            }}>
                            <Text style={styles.btnTxt}>{translate('Update Password')}</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("3") }} />
                    </View>
                    <View style={{ height: hp("6") }} />
                    <View style={{
                        position:'absolute',
                        alignSelf:'center',
                        bottom:hp('6')
                    }}>
                        <PoweredBy />
                    </View>
                </View>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

const styles = StyleSheet.create({
    safeArea: {
        flexDirection: 'column',
        backgroundColor: theme.designColor,
        flex: 1
    },
    headerView: {
        height: hp('8'),
        width: wp('100'),
        paddingHorizontal: wp('2'),
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    helpBtn: {
        height: hp('4.5'),
        width: wp('18'),
        borderRadius: 6,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    helpBtnTxt: {
        fontSize: 16,
        color: theme.designColor,
        fontWeight: '700'
    },
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1,
        justifyContent: 'center',
    },
    btn: {
        height: hp('6'),
        width: wp('50'),
        alignSelf: 'center',
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#ffffff"
    },
    btnTxt: {
        color: theme.designColor,
        fontSize: 16,
        fontFamily: theme.font01
    },
    title: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 26,
        color: '#fff'
    },
});