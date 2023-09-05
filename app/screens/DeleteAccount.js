import React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { SvgDelete, SvgPhone, SvgPwd } from '../constants/images';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Input from '../components/Input';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import Header from '../components/Header';
import Button1 from '../components/Button1';
import { call_application_manager, method } from '../api';

class DeleteAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            'userName': "",
            'password': "",
            ...this.props.userData
        }
    }

    async delete_account() {
        const { sessionId } = this.props.userData;
        const { userName, password } = this.state;
        this.setStateObj({ loader: true })
        let obj = { 'function': method['deleteUserAccount'], 'userName': userName, 'password': password, 'sessionId': sessionId }
        let res = await call_application_manager(obj)
        if (res.resultFlag) {
            this.setState({ popup: { "show": true, "type": "success", "message": "Account deleted successfully!" } })
            setTimeout(() => {
                this.props.updateRedux({ "userData": {} })
            }, 2000)
        } else {
            this.setStateObj({ "loader": false, "popup": { "show": true, "type": "wrong", "message": translate(res.message ? res.message : res.error) } })
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { loader, userName, password } = this.state;

        return (<>
            <Loader isShow={loader} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} />

            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                <Header
                    onClickHelp={() => {
                        this.setState({ popup: { "show": true, "title": "Instractions", "audio": "DeleteAccountScreen", "btnTitle": "Back", "type": "help", "message": translate("delete screen help") } })
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
                        <Text style={styles.title}>{translate('Delete Account')}</Text>
                        <View style={{ height: hp("1.5") }} />
                        <Input
                            viewStyle={{ width: wp('84') }}
                            Icon={SvgPhone}
                            placeholder={translate('phone-placeholder')}
                            disabled={true}
                            value={userName}
                            onChangeText={(str) => {
                                // this.setState({ "userName": str })
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

                        <View style={{ height: hp("2") }} />

                        <Button1
                            title="Delete Account"
                            style={styles.btn}
                            btnTxt={styles.btnTxt}
                            onPress={() => {
                                this.delete_account()
                            }}>
                            <SvgDelete />
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);

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