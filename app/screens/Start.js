import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, Platform } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { Logo, SvgDrawerIcon, SvgHelp, SvgPlay } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Popup from '../components/Popup';
import { SafeAreaView } from 'react-native-safe-area-context';
import AudioSetting from '../components/AudioSetting';
import Slider from '../components/Slider';
import Button1 from '../components/Button1';

class Start extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
        }
    }

    UNSAFE_componentWillMount() { }

    async get_resources(session) {
        // this.props.navigation.navigate("LetsBegin")
        // return
        this.setState({ loader: true })
        let obj = { 'function': method['startService'], 'sessionId': session }
        let res = await call_application_manager(obj)
        if (res.resultFlag) {
            this.props.updateRedux({ "resources": res })
            setTimeout(() => {
                this.setState({ loader: false })
                this.props.navigation.navigate("LetsBegin")
            }, 300)
        } else {
            this.setState({ loader: false, popup: { "show": true, "type": "wrong", "message": translate(res.message) } })
        }
    }

    render() {
        const { loader, isSlider, audioSettingPopup } = this.state;
        const { sessionId } = this.props.userData;

        const renderPanel = (isPopup) => {
            return (<>
                <Text style={styles.title01}>{translate('Dear Citizen Welcome!')}</Text>
                <View style={styles.v01}>
                    <View style={styles.v03}>
                        <Text style={styles.txt01}>{translate('start screen instraction 1')}</Text>
                        <Text style={styles.txt01}>{translate('start screen instraction 2')}</Text>
                    </View>
                    <View style={{ height: hp("2") }} />

                    <View style={styles.v02}>
                        <View style={styles.v04}>
                            {
                                translate('services_list_01').split(',').map((t, i) => {
                                    return <Text style={styles.txt02} key={i}>{t}</Text>
                                })
                            }
                        </View>
                        <View style={styles.v04}>
                            {
                                translate('services_list_02').split(',').map((t, i) => {
                                    return <Text style={styles.txt02} key={i}>{t}</Text>
                                })
                            }
                        </View>
                    </View>
                    <View style={{ height: hp("2") }} />

                    <View style={styles.v03}>
                        <Text style={styles.txt01}>{translate(`start screen instraction 3`)}</Text>
                    </View>
                    <View style={{ height: hp("2") }} />
                    {!isPopup && <>
                        <Button1
                            title="start"
                            onPress={() => {
                                this.get_resources(sessionId)
                            }}>
                            <SvgPlay />
                            <View style={{ width: wp('1') }} />
                        </Button1>
                        <View style={{ height: hp("2") }} />
                    </>
                    }
                </View>
            </>)
        }

        return (<>
            <Loader isShow={loader} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} >{renderPanel(true)}</Popup>
            {audioSettingPopup && <AudioSetting onClick={(is) => { this.setState({ "audioSettingPopup": is }) }} />}
            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                {isSlider && <Slider onClose={() => { this.setState({ isSlider: false }) }} navigation={this.props.navigation} />}
                <View style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => { this.setState({ isSlider: true }) }}>
                            <SvgDrawerIcon />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.headHelpBtn}
                            onPress={() => {
                                this.setState({ popup: { "show": true, "title": "Instractions", "audio": "HomeScreen", "btnTitle": "Back", "type": "help" } })
                            }}>
                            <SvgHelp />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.mainView}>
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <View style={{ height: hp("1") }} />
                        <Text style={styles.title}>{translate('e-service')}</Text>

                        {renderPanel()}

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