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
                        borderRadius: 10
                    }}>
                        <Text style={styles.title}>{cameFrom == 'Login' && translate('Forgot Password') || cameFrom == 'Settings' && translate('Change Password')}</Text>
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
                            placeholder={translate("Password")}
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