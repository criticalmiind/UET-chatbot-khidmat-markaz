import React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, wp } from '../utils';
import { SvgPhone, SvgPwd, SvgUpdate } from '../constants/images';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Input from '../components/Input';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import Header from '../components/Header';
import Button1 from '../components/Button1';
import { call_application_manager, method } from '../api';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props)
        const { userData } = this.props
        this.state = {
            "loader": false,
            'userName': "",
            'password': "",
            'confirm_password': "",
            ...userData,
        }
    }

    async update_passowrd() {
        const { userName, password, confirm_password, sessionId } = this.state;
        const cameFrom = this.props.navigation.getParam('screen')

        let error = false
        if (password != confirm_password) error = translate("Passwords doesn't matched")
        if (isNullRetNull(password, '').length < 6) error = translate('Password length should be greater then 5')
        if(error){
            this.setStateObj({ "popup": { "show": true, "type": "wrong", "message": translate(error) } })
            return
        }

        this.setStateObj({ loader: true })

        if (cameFrom == 'Settings') {
            let obj = { 'function': method['updateUserPassword'], 'newPassword': password, 'sessionId': sessionId }
            let res = await call_application_manager(obj)
            if (res.resultFlag) {
                this.setState({ "loader": false, "popup": { "show": true, "type": "success", "message": translate("Password update successfully!") } })
            } else {
                this.setStateObj({ "loader": false, "popup": { "show": true, "type": "wrong", "message": translate(res.message ? res.message : res.error) } })
            }
        }

        if (cameFrom == 'Login') {
            let obj = { 'function': method['forgotPassword'], 'userName': userName, 'newPassword': password }
            let res = await call_application_manager(obj)
            if (res.resultFlag) {
                this.setState({ "loader": false, "popup": { "show": true, "type": "success", "message": translate("Password reset successfully!") } })
            } else {
                this.setStateObj({ "loader": false, "popup": { "show": true, "type": "wrong", "message": translate(res.message ? res.message : res.error) } })
            }
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { loader, userName, password, confirm_password } = this.state;
        const cameFrom = this.props.navigation.getParam('screen')

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

                <View style={styles.mainView}>
                    <View style={{
                        width: wp('90'),
                        backgroundColor: theme.designColor,
                        alignSelf: 'center',
                        borderRadius: 10,
                        zIndex:10
                    }}>
                        <Text style={styles.title}>{cameFrom == 'Login' && translate('Forgot Password') || cameFrom == 'Settings' && translate('Change Password')}</Text>
                        <View style={{ height: hp("1.5") }} />
                        <Input
                            viewStyle={{ width: wp('84') }}
                            Icon={SvgPhone}
                            placeholder={translate('phone-placeholder')}
                            value={userName}
                            disabled={cameFrom == 'Settings'}
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

                        <Button1
                            title="Update Password"
                            style={styles.btn}
                            btnTxt={styles.btnTxt}
                            onPress={() => {
                                this.update_passowrd()
                            }}>
                            <SvgUpdate />
                        </Button1>

                        <View style={{ height: hp("3") }} />
                    </View>
                    <View style={{ height: hp("6") }} />
                    <View style={{ position: 'absolute', alignSelf: 'center', bottom: hp('6') }}>
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
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1,
        justifyContent: 'center',
        position:'relative'
    },
    btn: {
        backgroundColor: "#ffffff"
    },
    btnTxt: {
        color: theme.designColor,
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