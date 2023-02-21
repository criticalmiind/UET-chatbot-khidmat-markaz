import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, wp } from '../utils';
import { Logo, Logo01, SvgHelp, SvgPhone, SvgPwd } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Input from '../components/Input';
import Popup from '../components/Popup';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            'userName': "",
            'password': "",
            // 'userName': "cleUser",
            // 'password': "cle@Password",
            'userName': '03345354727',
            'password': "12345678"
        }
    }

    async login() {
        this.props.updateRedux({ "userData": {"id":2} })
        return
        const { userName, password } = this.state;
        this.setStateObj({ loader: true })
        let obj = { 'function': method['loginUser'], 'userName': userName, 'password': password }
        let res = await call_application_manager(obj)
        if (res.resultFlag) {
            this.setState({ popup:{ "show":true, "type":"success", "message":"Login Successfully!" } })
            this.props.updateRedux({ "userData": res })
        } else {
            this.setStateObj({ loader: false })
            this.setState({ popup:{ "show":true, "type":"wrong", "message":translate(res.message) } })
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { loader, userName, password } = this.state;
        let disabled_login = (isNullRetNull(userName, 1) == 1 || isNullRetNull(password, 1) == 1)
        
        return (<>
            <Loader isShow={loader}/>
            <Popup { ...this.state.popup } onClick={()=>{ this.setState({ popup:{} }) }}/>
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("9") }} />
                        <View style={{ justifyContent:'center' }}>
                            <Image source={Logo} style={styles.logo_bg}/>
                            <Image source={Logo} style={styles.logo}/>
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text>
                        <View style={{ height: hp("4") }} />
                        <Input
                            Icon={SvgPhone}
                            placeholder={translate('phone-placeholder')}
                            value={userName}
                            onChangeText={(str) => {
                                this.setState({ "userName": str })
                            }}/>

                        <View style={{ height: hp("3") }} />
                        <Input
                            Icon={SvgPwd}
                            iconStyle={{ paddingRight:wp('2') }}
                            placeholder={translate("password")}
                            value={password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "password": str })
                            }} />

                        <View style={{ height: hp("1") }} />
                        <TouchableOpacity
                            style={styles.forgot_pwd_btn}
                            onPress={()=>{
                                this.props.navigation.navigate("ForgotPassword")
                            }}>
                            <Text style={styles.forgot_pwd_txt}>{translate("I forgot my password?")}</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            disabled={disabled_login}
                            style={{...styles.btn, opacity:disabled_login?0.8:1 }}
                            onPress={async () => {
                                this.login()
                            }}>
                            <Text style={styles.btnTxt}>{translate('login')}</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={async () => {
                                this.props.navigation.navigate("Register")
                            }}>
                            <Text style={styles.btnTxt}>{translate('create_new_account')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: hp("9") }} />

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
                        onPress={()=>{
                            this.setState({ popup:{ "show":true, "type":"help", "message":translate("Would You need help?") } })
                        }}>
                        <SvgHelp/>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: "#21347E"
    },
    btnTxt: {
        color: "#fff",
        fontSize: 16,
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
        position:'absolute',
        opacity:0.05
    },
    title: {
        alignSelf: 'center',
        borderColor: "#a3a3a3",
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 36
    },
    forgot_pwd_btn: {
        width: wp('90'),
        alignItems: 'flex-start',
        alignSelf: 'center'
    },
    forgot_pwd_txt: {
        fontFamily: "#21347E"
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
        resizeMode:'contain'
    },
    helpView:{
        position:'absolute',
        bottom:hp('2'),
        right:hp('2')
    },
    helpBtn:{
        width:hp('4'),
        height:hp('4'),
        borderWidth:1,
        borderColor:"#21347E",
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center'
    }
});