import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { getItemByName, hp, wp } from '../utils';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Input from '../components/Input';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import SelectDropdown from 'react-native-select-dropdown'
import { Logo, SvgCalenderIcon, SvgCity, SvgGender, SvgMap, SvgPhone, SvgReg, SvgUser } from '../constants/images';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import Button1 from '../components/Button1';
import { call_application_manager, method } from '../api';

const GENDER_LIST = [
    { name: translate("Male") },
    { name: translate("Female") },
    { name: translate("Other") },
]

class Profile extends React.Component {
    constructor(props) {
        super(props)
        const { userData, districtList, tehsilList, cityList } = this.props
        this.state = {
            "loader": false,
            ...userData,
            "district": getItemByName(districtList, userData.district),
            "tehsil": getItemByName(tehsilList, userData.tehsil),
            "city": getItemByName(cityList, userData.city),
            "dateOfBirth": new Date(userData.dateOfBirth)
        }
    }

    UNSAFE_componentWillMount() {
        this.get_profile()
    }

    async get_profile() {
        const { userData } = this.props
        this.setStateObj({ "loader": true })
        let res = await call_application_manager({ 'function': method['getUserProfile'], 'sessionId': userData.sessionId })
        if (res.resultFlag) {
            this.setStateObj({ "loader": false })
            this.props.updateRedux({ "userData": { ...userData, ...res } })
        } else {
            this.setStateObj({ "loader": false, "popup": { "show": true, "type": "wrong", "message": translate(res.message ? res.message : res.error) } })
        }
    }

    async update() {
        const state = this.state
        this.setStateObj({ "loader": true })
        let res = await call_application_manager({
            'function': method['updateUserProfile'],
            "cnic": state.cnic,
            "dateOfBirth": state.dateOfBirth,
            "district": state.district.name,
            "tehsil": state.tehsil.name,
            "city": state.city.name,
            "gender": state.gender,
            "name": state.name,
            "sessionId": state.sessionId,
            "userName": state.userName,
        })
        if (res.resultFlag) {
            this.setStateObj({ "popup": { "show": true, "type": "success", "message": "Profile updated!" } })
            this.get_profile()
        } else {
            this.setStateObj({ "loader": false, "popup": { "show": true, "type": "wrong", "message": translate(res.message ? res.message : res.error) } })
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
            cnic,
            userName,
            district,
            tehsil,
            city,
            gender,
            dateOfBirth,
        } = this.state;

        const { districtList, tehsilList, cityList } = this.props;

        return (<>
            <Loader isShow={loader} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} />
            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                <Header
                    onClickHelp={() => {
                        this.setState({ popup: { "show": true, "title": "Instractions", "audio": "ProfileScreen", "btnTitle": "Back", "type": "help", "message": translate("profile screen help") } })
                    }}
                    onClickBack={() => {
                        this.props.navigation.goBack()
                    }} />

                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("1") }} />

                        <Text style={{ ...styles.title, lineHeight: 60, fontSize: 40 }}>{translate('Profile')}</Text>

                        <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text>

                        <View style={{ height: hp("2") }} />

                        <Input
                            Icon={SvgUser}
                            placeholder={translate('Full Name')}
                            value={name}
                            onChangeText={(str) => {
                                this.setState({ "name": str })
                            }} />
                        <View style={{ height: hp("2") }} />

                        <Input
                            Icon={SvgReg}
                            placeholder={translate('CNIC')}
                            value={cnic}
                            onChangeText={(str) => {
                                this.setState({ "cnic": str })
                            }} />
                        <View style={{ height: hp("2") }} />

                        <Input
                            Icon={SvgPhone}
                            placeholder={translate('phone-placeholder')}
                            value={userName}
                            onChangeText={(str) => {
                                this.setState({ "userName": str })
                            }} />

                        <View style={{ height: hp("2") }} />
                        <View style={{ flexDirection: 'row-reverse', alignSelf: 'center', justifyContent: 'space-between', width: wp('90') }}>
                            <SelectDropdown
                                renderSearchInputLeftIcon={() => <SvgMap />}
                                renderDropdownIcon={() => <SvgMap />}
                                data={districtList}
                                buttonStyle={{ width: wp('29'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
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
                                data={tehsilList.filter((t)=> t.districtId == district.id)}
                                buttonStyle={{ width: wp('29'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
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
                                data={cityList.filter((c)=> c.tehsilId == tehsil.id )}
                                buttonStyle={{ width: wp('29'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
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
                            display="spinner"
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
                            searchInputTxtStyle={{ textAlign: "right" }}
                            renderDropdownIcon={() => <SvgGender />}
                            data={GENDER_LIST}
                            buttonStyle={{ width: wp('90'), alignSelf: 'center', height: hp('6'), borderBottomWidth: 2, borderColor: "#7A7A7A" }}
                            buttonTextStyle={styles.txt01}
                            defaultButtonText={translate('Gender')}
                            search={true}
                            defaultValue={{ "name": gender }}
                            onSelect={(i) => {
                                this.setStateObj({ gender: i.name })
                            }}
                            buttonTextAfterSelection={(i) => i.name}
                            rowTextForSelection={(item) => item.name}
                        />
                        <View style={{ height: hp("2") }} />

                        <Button1
                            title="Update Profile"
                            onPress={() => {
                                this.update()
                            }} />

                    </View>
                    <View style={{ height: hp("3") }} />
                    <PoweredBy />
                    <View style={{ height: hp("3") }} />
                </ScrollView>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

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