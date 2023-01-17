import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, notify, wp } from '../utils';
import { Logo } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            'userName': 'cleUser',
            'password': "cle@Password"
        }
    }

    async login(){
        const { userName, password } = this.state;
        this.setStateObj({ loader:true })
        let obj = { 'function': method['loginUser'], 'userName':userName, 'password': password }
        let res = await call_application_manager(obj)
        if(res.resultFlag){
            notify({ "title":"Success!", "message":"Login Successfully!", "success":true })
            this.props.updateRedux({ "userData":res })
        }else{
            this.setStateObj({ loader:false })
            notify({ "title":"Failed!", "message":"Login Failed!", "success":false })
        }
    }

    setStateObj(data){
        this.setState({ ...this, ...data })
    }

    render() {
        const { loader, userName, password } = this.state;

        return (<>
            <Loader isShow={loader}/>
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("5") }} />
                        <Image source={Logo} style={styles.logo}/>
                        <View style={{ height: hp("7") }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={"ای میل/فون نمبر/صارف نام"}
                            value={userName}
                            onChangeText={(str) => {
                                this.setState({ "userName": str })
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

                        <View style={{ height: hp("4") }} />
                        <TouchableOpacity
                            style={styles.autoDetectBtn()}
                            onPress={async () => {
                                this.login()
                            }}>
                            <Text style={styles.autoDetectBtnText()}>لاگ ان کریں</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            style={styles.autoDetectBtn()}
                            onPress={async () => {
                                this.props.navigation.navigate("Register")
                            }}>
                            <Text style={styles.autoDetectBtnText()}>رجسٹر کریں</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Text style={styles.version}>V.1.0.0</Text>
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
        fontSize: 22,
        fontFamily:theme.font01
    }),
    textInput: {
        textAlign:'right',
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
        fontFamily:theme.font01
    },
    logo:{ height:wp('50'), width:wp('50'), alignSelf:'center' },
    version:{
        fontSize:16,
        position:'absolute',
        bottom:hp('1.5'),
        alignSelf:'center',
        fontFamily:theme.font01
    }
});