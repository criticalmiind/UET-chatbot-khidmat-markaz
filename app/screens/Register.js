import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, notify, wp } from '../utils';
import { Logo, Logo01, SvgCity, SvgFemaleOff, SvgFemaleOn, SvgHelp, SvgMaleOff, SvgMaleOn, SvgOtherOff, SvgOtherOn, SvgPhone, SvgPwd, SvgUser } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import cities from './../constants/cities.json';
import Input from '../components/Input';

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            'name': '',
            'userName': '',
            'password': '',
            'city': '',
            'country': '',
            'secretQuestion': '',
            'secretAnswer': '',
            'gender': 'Male'
        }
    }

    async register() {
        const {
            name,
            userName,
            password,
            confirm_password,
            city,
            country,
            secretQuestion,
            secretAnswer,
            gender
        } = this.state;
        if (password !== confirm_password) {
            notify({ "title": "Failed!", "message": "Passwords doesn't match!", "success": false })
            return
        }
        this.setStateObj({ loader: true })
        let obj = {
            'function': method['signUpUser'],
            'name': name,
            'userName': userName,
            'password': password,
            'city': city,
            'country': country,
            'secretQuestion': 'password',
            'secretAnswer': 'password',
            'gender': gender
        }
        let res = await call_application_manager(obj)
        this.setStateObj({ loader: false })
        if (res.resultFlag) {
            notify({ "title": "Success!", "message": "Registered Successfully! Now please login!", "success": true })
            this.props.navigation.navigate("Login")
        } else {
            notify({ "title": "Failed!", "message": res.message, "success": false })
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const {
            loader,

            name,
            userName,
            password,
            confirm_password,
            city,
            secretAnswer,
            gender,
        } = this.state;

        let disabled_reg = () => {
            if(isNullRetNull(name, 1) == 1) return true
            if(isNullRetNull(userName, 1) == 1) return true
            if(isNullRetNull(password, 1) == 1) return true
            if(isNullRetNull(confirm_password, 1) == 1) return true
            if(password != confirm_password) return true
            if(isNullRetNull(city, 1) == 1) return true
            if(isNullRetNull(secretAnswer, 1) == 1) return true
            if(isNullRetNull(gender, 1) == 1) return true
            return false
        }


        return (<>
            <Loader isShow={loader} />
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("6") }} />
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text>
                        <View style={{ height: hp("2") }} />
                        <Input
                            Icon={SvgUser}
                            // style={styles.textInput}
                            placeholder={translate('Full Name')}
                            value={name}
                            onChangeText={(str) => {
                                this.setState({ "name": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <Input
                            Icon={SvgPhone}
                            // style={styles.textInput}
                            placeholder={translate('phone-placeholder')}
                            value={userName}
                            onChangeText={(str) => {
                                this.setState({ "userName": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <Input
                            Icon={SvgPwd}
                            // style={styles.textInput}
                            placeholder={translate("Confirm Password")}
                            value={password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "password": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <Input
                            Icon={SvgPwd}
                            // style={styles.textInput}
                            placeholder={translate("Confirm Password")}
                            value={confirm_password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "confirm_password": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <SelectDropdown
                            renderSearchInputLeftIcon={()=><SvgCity/>}
                            renderDropdownIcon={()=><SvgCity/>}
                            data={cities}
                            buttonStyle={{ width: wp('90'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
                            buttonTextStyle={{ fontFamily: theme.font01, textAlign: 'right', color: "#a3a3a3" }}
                            defaultButtonText={translate('City')}
                            search={true}
                            defaultValue={city}
                            onSelect={(selectedItem) => {
                                this.setStateObj({ city:selectedItem.name })
                            }}
                            buttonTextAfterSelection={(selectedItem) => selectedItem.name }
                            rowTextForSelection={(item) => item.name }
                        />

                        <View style={{ height: hp("2") }} />
                        <Input
                            // Icon={SvgCity}
                            // style={styles.textInput}
                            placeholder={translate('Secret String')}
                            value={secretAnswer}
                            onChangeText={(str) => {
                                this.setState({ "secretAnswer": str })
                            }} />
                        <View style={{ height: hp("2") }} />
                        <View style={styles.v01}>
                            <Text style={styles.txt01}>{translate('Gender')}</Text>
                            <View style={styles.v02}>
                                {
                                    [
                                        {name:"Male",icon_on:<SvgMaleOn/>,icon_off:<SvgMaleOff/>},
                                        {name:"Female",icon_on:<SvgFemaleOn/>,icon_off:<SvgFemaleOff/>},
                                        {name:"Other",icon_on:<SvgOtherOn/>,icon_off:<SvgOtherOff/>}
                                    ].map((e) => {
                                        let is = e.name == gender
                                        return (
                                            <TouchableOpacity
                                                key={e.name}
                                                style={styles.v03(is)}
                                                onPress={() => { this.setState({ "gender": e.name }) }}>
                                                {/* <Text style={{ color: is ? "#fff" : "#21347E" }}>{e}</Text> */}
                                                {is?e.icon_on:e.icon_off}
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            disabled={disabled_reg()}
                            style={{...styles.btn, opacity:disabled_reg()?0.8:1}}
                            onPress={async () => {
                                this.register()
                            }}>
                            <Text style={styles.btnTxt}>{translate('register')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: hp("5") }} />

                    <Text style={styles.powered_txt}>{translate('powered')}</Text>
                    <View style={{ height: hp("1") }} />
                    <View style={styles.powered_view}>
                        <Image source={Logo} style={styles.footer_logo} />
                        <Image source={Logo01} style={styles.footer_logo} />
                    </View>
                    <View style={{ height: hp("6") }} />
                </ScrollView>
                <View style={styles.helpView}>
                    <TouchableOpacity
                        style={styles.helpBtn}
                        onPress={() => {
                            notify({ title: "Sorry!", message: "this feature is under construction" })
                        }}>
                        <SvgHelp/>
                    </TouchableOpacity>
                </View>
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);

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
    txt01: {
        color: "#21347E",
        fontSize: 16,
        fontFamily: theme.font01
    },
    textInput: {
        textAlign: 'right',
        height: hp('6'),
        width: wp('90'),
        alignSelf: 'center',
        borderBottomWidth: 2,
        borderColor: "#7A7A7A",
        backgroundColor: "#E8E8E8",
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp('4'),
        fontSize: 14,
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
    helpView: {
        position: 'absolute',
        bottom: hp('2'),
        right: hp('2')
    },
    helpBtn: {
        width: hp('4'),
        height: hp('4'),
        borderWidth: 1,
        borderColor: "#21347E",
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    v01: {
        width: wp('90'),
        alignSelf: 'center',
        flexDirection: 'row-reverse',
        justifyContent: "space-around"
    },
    v02: {
        alignSelf: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
        width: "86%"
    },
    v03: (is) => ({
        // borderWidth: 3,
        // borderColor: "#21347E",
        borderRadius: 100,
        width: wp('15'),
        height: wp('15'),
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: is ? "rgba(33, 52, 126, 1)" : "#fff"
    }),
});