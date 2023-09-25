import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, isObjEmpty, wp } from '../utils';
import { Logo, SvgCPwd, SvgCalenderIcon, SvgCity, SvgGender, SvgMap, SvgPhone, SvgPwd, SvgReg } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';
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
            'name': '',
            'userName': '',
            'password': '',
            'district': {},
            'tehsil': {},
            'city': {},
            'gender': {},
            'dateOfBirth': false,
        }
    }

    async register() {
        const {
            name,
            userName,
            password,
            confirm_password,
            district,
            tehsil,
            city,
            gender,
            dateOfBirth
        } = this.state;

        let error = ''
        if (!isNullRetNull(userName, false)) error += translate("Phone number is required") + '.\n'
        if (isNullRetNull(userName, false) && isNullRetNull(userName, '').length <= 10) error += translate("Phone Number length should be greater then 10") + '.\n'
        if (!isNullRetNull(password, false)) error += translate("Password is required") + '.\n'
        if (isNullRetNull(password, false) && isNullRetNull(password, '').length <= 5) error += translate("Password length should be greater then 5") + '.\n'
        if (isNullRetNull(password, false) && password !== confirm_password) error += translate("Passwords doesn't matched") + '.\n'
        if (isObjEmpty(district)) error += translate("District is required") + '.\n'
        if (isObjEmpty(tehsil)) error += translate("Tehsil is required") + '.\n'
        if (isObjEmpty(city)) error += translate("City is required") + '.\n'
        if (!isNullRetNull(dateOfBirth, false)) error += translate("Date of Birth is required") + '.\n'
        if (isObjEmpty(gender)) error += translate("Gender is required") + '.\n'

        if (!!isNullRetNull(error, false)) {
            this.setState({ "popup": { "show": true, "type": "wrong", "message": error } })
            return
        }

        this.setStateObj({ loader: true })
        let obj = {
            'function': method['signUpUser'],
            'name': name,
            'userName': userName,
            'password': password,
            'district': district.name,
            'tehsil': tehsil.name,
            'city': city.name,
            'gender': gender.value,
            'dataOfBirth': dateOfBirth
        }
        this.setStateObj({ loader: false })
        let res = await call_application_manager(obj)
        this.setStateObj({ loader: false })
        if (res.resultFlag) {
            this.setState({ "popup": { "show": true, "type": "success", "message": translate("Registered Successfully! Now please login!") } })
            // setTimeout(() => {
            //     this.props.navigation.navigate("Login")
            // }, 1500);
        } else {
            this.setState({ "popup": { "show": true, "type": "wrong", "message": translate(res.message) } })

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
            district,
            tehsil,
            city,
            gender,
            dateOfBirth,
        } = this.state;

        const {
            districtList,
            cityList,
            tehsilList
        } = this.props;

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
            <Popup {...this.state.popup} onClick={() => { this.setState({ "popup": {} }) }} />
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
                            keyboardType={'decimal-pad'}
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
                                renderSearchInputLeftIcon={() => <SvgMap />}
                                renderDropdownIcon={() => <SvgMap />}
                                data={districtList}
                                buttonStyle={{ width: wp('29'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
                                searchInputStyle={{ flexDirection: 'row-reverse' }}
                                searchInputTxtStyle={{ textAlign: "right", fontFamily: theme.font01 }}
                                rowTextStyle={{ fontFamily: theme.font01 }}
                                selectedRowStyle={{ backgroundColor: theme.designColor }}
                                selectedRowTextStyle={{ color: "#fff" }}
                                buttonTextStyle={styles.txt01}
                                defaultButtonText={translate('District')}
                                search={true}
                                defaultValue={district}
                                onSelect={(selectedItem) => {
                                    this.setStateObj({ 'district': selectedItem })
                                }}
                                buttonTextAfterSelection={(selectedItem) => selectedItem.name}
                                rowTextForSelection={(item) => item.name}
                            />
                            <SelectDropdown
                                renderSearchInputLeftIcon={() => <SvgMap />}
                                renderDropdownIcon={() => <SvgMap />}
                                data={tehsilList.filter((t) => t.districtId == district.id)}
                                buttonStyle={{ width: wp('29'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
                                searchInputStyle={{ flexDirection: 'row-reverse' }}
                                searchInputTxtStyle={{ textAlign: "right", fontFamily: theme.font01 }}
                                rowTextStyle={{ fontFamily: theme.font01 }}
                                selectedRowStyle={{ backgroundColor: theme.designColor }}
                                selectedRowTextStyle={{ color: "#fff" }}
                                buttonTextStyle={styles.txt01}
                                defaultButtonText={translate('Tehsil')}
                                search={true}
                                defaultValue={tehsil}
                                onSelect={(selectedItem) => {
                                    this.setStateObj({ 'tehsil': selectedItem })
                                }}
                                buttonTextAfterSelection={(selectedItem) => selectedItem.name}
                                rowTextForSelection={(item) => item.name}
                            />
                            <SelectDropdown
                                renderSearchInputLeftIcon={() => <SvgCity />}
                                renderDropdownIcon={() => <SvgCity />}
                                data={cityList.filter((c) => c.tehsilId == tehsil.id)}
                                buttonStyle={{ width: wp('29'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
                                searchInputStyle={{ flexDirection: 'row-reverse' }}
                                searchInputTxtStyle={{ textAlign: "right", fontFamily: theme.font01 }}
                                rowTextStyle={{ fontFamily: theme.font01 }}
                                selectedRowStyle={{ backgroundColor: theme.designColor }}
                                selectedRowTextStyle={{ color: "#fff" }}
                                buttonTextStyle={styles.txt01}
                                defaultButtonText={translate('City')}
                                search={true}
                                defaultValue={city}
                                onSelect={(selectedItem) => {
                                    this.setStateObj({ 'city': selectedItem })
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
                            display="spinner"
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
                            searchInputStyle={{ flexDirection: 'row-reverse' }}
                            searchInputTxtStyle={{ textAlign: "right", fontFamily: theme.font01 }}
                            rowTextStyle={{ fontFamily: theme.font01 }}
                            selectedRowStyle={{ backgroundColor: theme.designColor }}
                            selectedRowTextStyle={{ color: "#fff" }}
                            buttonTextStyle={styles.txt01}
                            defaultButtonText={translate('Gender')}
                            // search={true}
                            defaultValue={gender}
                            onSelect={(g) => {
                                this.setStateObj({ "gender": g })
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