import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, notify, wp } from '../utils';
import { Logo, Logo01, SvgCPwd, SvgCalenderIcon, SvgCity, SvgGender, SvgHelp, SvgMap, SvgPhone, SvgPwd, SvgReg, SvgUser } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import cities from './../constants/cities.json';
import tehseel from './../constants/tehseel.json';
import Input from '../components/Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import HelpIcon from '../components/HelpIcon';
import Button1 from '../components/Button1';

const GENDER_LIST = [
    { "name": translate("Male"), "value": "Male" },
    { "name": translate("Female"), "value": "Female" },
    { "name": translate("Other"), "value": "Other" },
]

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            // 'name': '',
            // 'userName': '',
            // 'password': '',
            // 'city': '',
            // 'district': '',
            // 'gender': translate("Male"),
            // 'dateOfBirth': false,


            'name': 'Test',
            'userName': 'Test',
            'password': 'Test',
            'confirm_password': 'Test',
            'city': '',
            'district': '',
            'gender': "Male",
            'dateOfBirth': false,
        }
    }

    async register() {
        const {
            name,
            userName,
            password,
            confirm_password,
            city,
            district,
            gender,
            dateOfBirth
        } = this.state;
        if (password !== confirm_password) {
            this.setState({ popup: { "show": true, "type": "wrong", "message": translate("Passwords don't match") } })
            return
        }
        this.setStateObj({ loader: true })
        let obj = {
            'function': method['signUpUser'],
            // 'name': name,
            'userName': userName,
            'password': password,
            'city': city,
            // 'district':district,
            'tehsil': district,
            'gender': translate(gender),
            'dataOfBirth': dateOfBirth
        }
        this.setStateObj({ loader: false })
        console.log(obj);
        return
        let res = await call_application_manager(obj)
        this.setStateObj({ loader: false })
        if (res.resultFlag) {
            this.setState({ popup: { "show": true, "type": "success", "message": "Registered Successfully! Now please login!" } })
            setTimeout(() => {
                this.props.navigation.navigate("Login")
            }, 1500);
        } else {
            this.setState({ popup: { "show": true, "type": "wrong", "message": translate(res.message) } })

        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const {
            loader,
            showDatePicker,

            name,
            userName,
            password,
            confirm_password,
            city,
            district,
            gender,
            dateOfBirth,
        } = this.state;

        let disabled_reg = () => {
            // if (isNullRetNull(name, 1) == 1) return true
            // if (isNullRetNull(userName, 1) == 1) return true
            // if (isNullRetNull(password, 1) == 1) return true
            // if (isNullRetNull(confirm_password, 1) == 1) return true
            // if (password != confirm_password) return true
            // if (isNullRetNull(city, 1) == 1) return true
            // if (isNullRetNull(district, 1) == 1) return true
            // if (isNullRetNull(gender, 1) == 1) return true
            return false
        }

        return (<>
            <Loader isShow={loader} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} />
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
                            Icon={SvgPhone}
                            placeholder={translate('phone-placeholder')}
                            value={userName}
                            onChangeText={(str) => {
                                this.setState({ "userName": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <Input
                            Icon={SvgPwd}
                            placeholder={translate("Password")}
                            value={password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "password": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <Input
                            Icon={SvgCPwd}
                            placeholder={translate("Confirm Password")}
                            value={confirm_password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "confirm_password": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <View style={{ flexDirection: 'row-reverse', alignSelf: 'center', justifyContent: 'space-between', width: wp('90') }}>
                            <SelectDropdown
                                renderSearchInputLeftIcon={() => <SvgCity />}
                                renderDropdownIcon={() => <SvgCity />}
                                data={tehseel}
                                buttonStyle={{ width: wp('44.5'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
                                searchInputStyle={{ flexDirection:'row-reverse' }}
                                searchInputTxtStyle={{ textAlign: "right", fontFamily:theme.font01 }}
                                rowTextStyle={{ fontFamily:theme.font01 }}
                                selectedRowStyle={{ backgroundColor:theme.designColor }}
                                selectedRowTextStyle={{ color:"#fff" }}
                                buttonTextStyle={styles.txt01}
                                defaultButtonText={translate('City')}
                                search={true}
                                defaultValue={city}
                                onSelect={(selectedItem) => {
                                    this.setStateObj({ 'city': selectedItem.name })
                                }}
                                buttonTextAfterSelection={(selectedItem) => selectedItem.name}
                                rowTextForSelection={(item) => item.name}
                            />
                            <SelectDropdown
                                renderSearchInputLeftIcon={() => <SvgMap />}
                                renderDropdownIcon={() => <SvgMap />}
                                data={cities}
                                buttonStyle={{ width: wp('44.5'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
                                searchInputStyle={{ flexDirection:'row-reverse' }}
                                searchInputTxtStyle={{ textAlign: "right", fontFamily:theme.font01 }}
                                rowTextStyle={{ fontFamily:theme.font01 }}
                                selectedRowStyle={{ backgroundColor:theme.designColor }}
                                selectedRowTextStyle={{ color:"#fff" }}
                                buttonTextStyle={styles.txt01}
                                defaultButtonText={translate('District')}
                                search={true}
                                defaultValue={district}
                                onSelect={(selectedItem) => {
                                    this.setStateObj({ 'district': selectedItem.name })
                                }}
                                buttonTextAfterSelection={(selectedItem) => selectedItem.name}
                                rowTextForSelection={(item) => item.name}
                            />
                        </View>

                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            style={styles.btnDatePicker}
                            onPress={() => { this.setState({ 'showDatePicker': !showDatePicker }) }}>
                            {dateOfBirth ? <Text style={styles.txt01}>{dateOfBirth.toLocaleDateString()}</Text>
                                : <Text style={styles.txt01}>{translate('dob')}</Text>}
                            <SvgCalenderIcon />
                        </TouchableOpacity>
                        {showDatePicker && <DateTimePicker
                            testID="dateTimePicker"
                            value={dateOfBirth ? dateOfBirth : new Date()}
                            mode={"date"}
                            is24Hour={true}
                            onChange={(e) => {
                                this.setState({ "dateOfBirth": e.nativeEvent.timestamp, "showDatePicker": false })
                            }} />
                        }
                        <View style={{ height: hp("2") }} />

                        <SelectDropdown
                            searchPlaceHolder={translate('Gender')}
                            renderDropdownIcon={() => <SvgGender />}
                            renderSearchInputLeftIcon={() => <SvgGender />}
                            data={GENDER_LIST}
                            buttonStyle={{ width: wp('90'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
                            searchInputStyle={{ flexDirection:'row-reverse' }}
                            searchInputTxtStyle={{ textAlign: "right", fontFamily:theme.font01 }}
                            rowTextStyle={{ fontFamily:theme.font01 }}
                            selectedRowStyle={{ backgroundColor:theme.designColor }}
                            selectedRowTextStyle={{ color:"#fff" }}
                            buttonTextStyle={styles.txt01}
                            defaultButtonText={translate('Gender')}
                            search={true}
                            defaultValue={translate(gender)}
                            onSelect={(i) => {
                                this.setStateObj({ "gender": i.value })
                            }}
                            buttonTextAfterSelection={(i) => i.name}
                            rowTextForSelection={(item) => item.name}
                        />
                        <View style={{ height: hp("2") }} />
                        <Button1
                            title="register"
                            onPress={async () => {
                                this.register()
                            }}>
                            <SvgReg />
                        </Button1>
                        {/* <TouchableOpacity
                            disabled={disabled_reg()}
                            style={{ ...styles.btn, opacity: disabled_reg() ? 0.8 : 1 }}
                            onPress={async () => {
                                this.register()
                            }}>
                            <SvgReg />
                            <Text style={styles.btnTxt}>{translate('register')}</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View style={{ height: hp("5") }} />

                    <PoweredBy />
                    <View style={{ height: hp("6") }} />
                </ScrollView>
                <HelpIcon
                    onPress={() => {
                        this.setState({ popup: { "show": true, "title": "Instractions", "audio": "RegistrationScreen", "btnTitle": "Back", "type": "help", "message": translate("reg screen help") } })
                    }} />
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
    btnDatePicker: {
        width: wp('90'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        paddingHorizontal: wp('2'),
        height: hp('6'),
        borderBottomWidth: 2,
        borderColor: "#7A7A7A",
        backgroundColor: '#E8E8E8'
    },
    txt01: { fontFamily: theme.font01, textAlign: 'right', color: "#a3a3a3" }
});