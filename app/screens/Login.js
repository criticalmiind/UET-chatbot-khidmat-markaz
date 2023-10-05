import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, wp } from '../utils';
import { Logo, SvgPhone, SvgPwd } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Input from '../components/Input';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import HelpIcon from '../components/HelpIcon';
import LoginVideoTutorial from '../components/LoginVideoTutorial';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            'userName': "",
            'password': "",
            "loginData": {},
            'userName': '03049758182',
            'password': "12345678",
        }
    }

    async login() {
        const { userName, password } = this.state;

        this.setStateObj({ loader: true })
        let obj = { 'function': method['loginUser'], 'userName': userName, 'password': password }
        let res = await call_application_manager(obj)
        if (res.resultFlag) {
            // this.setState({ "loader": false, "popup": { "show": true, "type": "success", "message": translate("Login Successfully!") } })
            let data = await call_application_manager({ 'function': method['getUserProfile'], 'sessionId': res.sessionId })
            // this.setStateObj({ "loginData": { ...res, ...data.resultFlag ? data : {} } })
            this.props.updateRedux({ "userData": { ...res, ...data.resultFlag ? data : {} } })
        } else {
            this.setState({ "loader": false, "popup": { "show": true, "type": "wrong", "message": translate(res.message ? res.message : res.error) } })
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { loader, userName, password, loginData } = this.state;
        let disabled_login = (isNullRetNull(userName, 1) == 1 || isNullRetNull(password, 1) == 1)

        return (<>
            <Loader isShow={loader} />
            <Popup
                {...this.state.popup}
                onClick={() => {
                    this.setStateObj({ "popup": {} })
                    // this.props.updateRedux({ "userData": loginData })
                }} />
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("5") }} />
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text>
                        <LoginVideoTutorial />
                        <View style={{ height: hp("4") }} />
                        <Input
                            Icon={SvgPhone}
                            keyboardType={'decimal-pad'}
                            placeholder={translate('phone-placeholder')}
                            value={userName}
                            onChangeText={(str) => {
                                this.setState({ "userName": str })
                            }} />

                        <View style={{ height: hp("1") }} />
                        <Input
                            Icon={SvgPwd}
                            iconStyle={{ paddingRight: wp('2') }}
                            placeholder={translate("password")}
                            value={password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "password": str })
                            }} />

                        {/* <View style={{ height: hp("1") }} /> */}
                        <View style={styles.v01}>
                            <TouchableOpacity
                                style={styles.forgot_pwd_btn}
                                onPress={() => {
                                    this.props.navigation.navigate("ForgotPassword", { "screen": "Login" })
                                }}>
                                <Text style={styles.forgot_pwd_txt}>{translate("I forgot my password?")}</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                style={styles.forgot_pwd_btn}
                                onPress={() => {
                                    this.props.navigation.navigate("VideoTutorial")
                                }}>
                                <Text style={styles.forgot_pwd_txt}>{translate("Video Tutorial")}</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View style={{ height: hp("1") }} />
                        <TouchableOpacity
                            disabled={disabled_login}
                            style={{ ...styles.btn, opacity: disabled_login ? 0.8 : 1 }}
                            onPress={async () => {
                                this.login()
                            }}>
                            <Text style={styles.btnTxt}>{translate('login')}</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("1") }} />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={async () => {
                                this.props.navigation.navigate("Register")
                            }}>
                            <Text style={styles.btnTxt}>{translate('create_new_account')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: hp("3") }} />
                    <PoweredBy />
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
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

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
    btn: {
        height: hp('6'),
        width: wp('50'),
        alignSelf: 'center',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#21347E",
        borderRadius: 10,
        flexDirection: 'row-reverse'
    },
    btnTxt: {
        color: "#fff",
        fontSize: 16,
        fontFamily: theme.font01
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
        borderColor: "#a3a3a3",
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 22
    },
    v01: {
        flexDirection: 'row',
        width: wp('90'),
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    forgot_pwd_btn: {
        alignItems: 'flex-start',
        alignSelf: 'center'
    },
    forgot_pwd_txt: {
        fontFamily: theme.font01
    }
});