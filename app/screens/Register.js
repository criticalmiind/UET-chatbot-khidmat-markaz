import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, notify, wp } from '../utils';
import { Logo } from '../constants/images';
import { call_application_manager, method } from '../api';
import RadioButton from '../components/RadioButton';
import Loader from '../components/Loader';

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            'name': 'Atta',
            'userName': '03345354727',
            'password': '12345678',
            'city': 'Charsadda',
            'country': 'pakistan',
            'secretQuestion': 'password',
            'secretAnswer': 'password',
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
        if(password !== confirm_password){
            notify({ "title": "Failed!", "message": "Passwords doesn't match!", "success": false })
            return
        }
        this.setStateObj({ loader: true })
        let obj = {
            'function': method['signUpUser'],
            'name': name,
            'userName':userName,
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
            country,
            secretQuestion,
            secretAnswer,
            gender,
        } = this.state;

        return (<>
            <Loader isShow={loader}/>
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("4") }} />
                        <Image source={Logo} style={styles.logo} />
                        <View style={{ height: hp("6") }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={"صارف نام"}
                            value={name}
                            onChangeText={(str) => {
                                this.setState({ "name": str })
                            }} />

                        <View style={{ height: hp("3") }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={"لاگ ان ID"}
                            value={userName}
                            onChangeText={(str) => {
                                this.setState({ "userName": str })
                            }} />

                        <View style={{ height: hp("3") }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={"شہر"}
                            value={city}
                            onChangeText={(str) => {
                                this.setState({ "city": str })
                            }} />

                        <View style={{ height: hp("3") }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={"ملک"}
                            value={country}
                            onChangeText={(str) => {
                                this.setState({ "country": str })
                            }} />

                        <View style={{ height: hp("3") }} />
                        <RadioButton
                            mainStyle={{ width: wp('90') }}
                            title="صنف منتخب کریں۔"
                            buttonsList={[{ "title": "Male" }, { "title": "Female" }]}
                            selectedValue={gender}
                            onChange={(d) => {
                                this.setState({ "gender": d.title })
                            }} />

                        <View style={{ height: hp("3") }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={"پاس ورڈ"}
                            value={password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "password": str })
                            }} />

                        <View style={{ height: hp("3") }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={"پاس ورڈ کی تصدیق کریں۔"}
                            value={confirm_password}
                            secureTextEntry
                            onChangeText={(str) => {
                                this.setState({ "confirm_password": str })
                            }} />

                        <View style={{ height: hp("4") }} />
                        <TouchableOpacity
                            style={styles.autoDetectBtn()}
                            onPress={async () => {
                                this.register()
                                // this.props.updateRedux({ userData: { "id": 1, "name": "Shawal Ahmad" } })
                            }}>
                            <Text style={styles.autoDetectBtnText()}>رجسٹر کریں</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            style={styles.autoDetectBtn()}
                            onPress={async () => {
                                this.props.navigation.navigate("Login")
                            }}>
                            <Text style={styles.autoDetectBtnText()}>لاگ ان کریں</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: hp("4") }} />
                </ScrollView>
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
    autoDetectBtn: (is) => ({
        height: hp('7'),
        width: wp('90'),
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        borderColor: is ? 'red' : theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    autoDetectBtnText: (is) => ({
        color: is ? 'red' : theme.designColor,
        fontSize: 20,
        fontFamily: theme.font01
    }),
    textInput: {
        textAlign: 'right',
        height: hp('7'),
        width: wp('90'),
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        borderColor: "#a3a3a3",
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp('4'),
        fontSize: 16,
        fontFamily: theme.font01
    },
    logo: { height: wp('40'), width: wp('40'), alignSelf: 'center' }
});