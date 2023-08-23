import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import Header from '../components/Header';
import Button1 from '../components/Button1';


class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { loader } = this.state;

        return (<>
            <Loader isShow={loader} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} />
            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                <Header
                    onClickHelp={() => {
                        this.setState({ popup: { "show": true, "title": "Instractions", "audio": "SettingsScreen", "btnTitle": "Back", "type": "help", "message": translate("settings screen help") } })
                    }}
                    onClickBack={() => {
                        this.props.navigation.goBack()
                    }} />

                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("28") }} />

                        <View style={styles.v01}>
                            
                            <View style={styles.v03}>
                                <Text style={styles.title}>{translate('Settings')}</Text>
                            </View>
                            <View style={{ height: hp("2") }} />


                            <Button1
                                title="Delete Account"
                                onPress={() => {
                                    this.props.navigation.navigate("DeleteAccount")
                                }}/>
                            <View style={{ height: hp("1") }} />

                            <Button1
                                title="Update Password"
                                onPress={() => {
                                    this.props.navigation.navigate("ForgotPassword", { "screen":"Settings" })
                                }}/>
                            <View style={{ height: hp("4") }} />

                        </View>

                    </View>
                    <View style={{ height: hp("21") }} />
                    <PoweredBy />
                    <View style={{ height: hp("3") }} />
                </ScrollView>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

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
    title: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 36,
        color: "#fff",
        lineHeight: 62,
    },

    v01: {
        backgroundColor: '#ECECEC',
        width: wp('86'),
        alignSelf: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    v03: {
        paddingTop: hp('1'),
        paddingHorizontal: hp('1'),
        backgroundColor: theme.designColor,
    },
    txt01: {
        fontSize: 14,
        color: theme.tertiary,
        fontFamily: theme.font01,
        textAlign: 'center'
    },
});