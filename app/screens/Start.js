import React from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { Logo } from '../constants/images';
import { translate } from '../i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import AudioSetting from '../components/AudioSetting';
import Button1 from '../components/Button1';
import Input from '../components/Input';

class Start extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    UNSAFE_componentWillMount() {
        let test = {
            "asrManager": "https://chat.pitb.gov.pk/connectionInterfaceOne/asrManager/",
            "asrModel": "https://csa.cle.org.pk:3000",
            "connectionId": "557620240329222630539802",
            "dialogueManager": "https://chat.pitb.gov.pk/connectionInterfaceOne/dialogueManager/",
            "message": "success", "resultFlag": true,
            "sessionId": "1504202403292226224459825905086",
            "ttsManager": "https://chat.pitb.gov.pk/connectionInterfaceOne/ttsManager/"
        }
    }

    async componentWillUnmount() { }

    render() {
        const { audioSettingPopup } = this.state;
        const { resources } = this.props;

        return (<>
            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                {audioSettingPopup && <AudioSetting onClick={(is) => { this.setState({ "audioSettingPopup": is }) }} />}
                <View style={styles.safeArea}>
                    <View style={styles.mainView}>
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <View style={{ height: hp("1") }} />
                        <Text style={styles.title}>{translate('e-service')}</Text>
                        

                        <Text style={styles.title01}>{translate('Dear Citizen Welcome!')}</Text>
                        <View style={{ height: hp("4") }} />
                        <View style={styles.v01}>
                            <View style={{ height: hp("2") }} />

                            <Input
                                viewStyle={{ width:"90%" }}
                                textInputStyle={{ textAlign: 'left' }}
                                placeholder={"ASR MODEL URL"}
                                value={resources.asrModel}
                                onChangeText={(str) => {
                                    this.props.updateRedux({ "resources":{ ...resources, "asrModel":str } })
                                }} />
                            <View style={{ height: hp("2") }} />

                            <Input
                                viewStyle={{ width:"90%" }}
                                textInputStyle={{ textAlign: 'left' }}
                                placeholder={"Connection ID"}
                                value={resources.connectionId}
                                onChangeText={(str) => {
                                    this.props.updateRedux({ "resources":{ ...resources, "connectionId":str } })
                                }} />
                            <View style={{ height: hp("2") }} />

                            <Button1
                                title="start"
                                onPress={() => {
                                    this.props.navigation.navigate("LetsBegin")
                                }}>
                            </Button1>

                            <View style={{ height: hp("1") }} />
                            <Button1
                                title="Audio Settings"
                                onPress={() => {
                                    this.setState({ "audioSettingPopup":true })
                                }}>
                            </Button1>
                            <View style={{ height: hp("2") }} />
                        </View>
                        
                        <View style={{ height: hp("6") }} />
                    </View>
                </View>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Start);

const styles = StyleSheet.create({
    safeArea: {
        flexDirection: 'column',
        backgroundColor: theme.tertiary,
        flex: 1
    },
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        // height: hp('10'),
        ...Platform.select({ "ios": {}, "android": { "marginTop": hp('2') } }),
        width: wp('100%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('3')
    },
    headHelpBtn: {
        width: hp('4.5'),
        height: hp('4.5'),
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
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
    v02: {
        flexDirection: 'row-reverse',
        backgroundColor: theme.designColor,
        width: wp('80'),
        alignSelf: 'center',
        borderRadius: 15,
        paddingHorizontal: hp('2'),
        paddingVertical: hp('1'),
    },
    v03: {
        paddingVertical: hp('1'),
        paddingHorizontal: hp('1'),
        backgroundColor: theme.designColor,
    },
    v04: {
        width: '50%'
    },
    txt01: {
        fontSize: 14,
        color: theme.tertiary,
        fontFamily: theme.font01,
        textAlign: 'center'
    },
    txt02: {
        fontSize: 12,
        color: theme.tertiary,
        fontFamily: theme.font01,
    },
    logo: {
        height: wp('22'),
        width: wp('22'),
        alignSelf: 'center'
    },
    logo_bg: {
        height: wp('30'),
        width: wp('30'),
        alignSelf: 'center',
        position: 'absolute',
        opacity: 0.05
    },
    title: {
        alignSelf: 'center',
        color: theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 22
    },
    title01: {
        alignSelf: 'center',
        color: theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 30,
        lineHeight: 40,
    },
});