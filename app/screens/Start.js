import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, notify, wp } from '../utils';
import { Logo, Logo01, SvgDrawerIcon, SvgDrawerProfileIcon, SvgPlay } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';

class Start extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
        }
    }

    UNSAFE_componentWillMount() {}

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
            this.setState({ loader: false })
            notify({ "title": "Failed!", "message": "Server Not Responding: "+res.message+"", "success": false })
        }
    }

    render() {
        const { loader, isSlider } = this.state;
        const { sessionId, name } = this.props.userData;
        
        return (<>
            <Loader isShow={loader} />
            {isSlider && <>
                <TouchableOpacity
                    style={styles.sliderBlurView}
                    onPress={() => {
                        this.setState({ isSlider: false })
                    }}>
                </TouchableOpacity>
                <View style={styles.sliderView}>
                    <View style={{ height: hp('10') }} />
                    <SvgDrawerProfileIcon />
                    <Text style={styles.userNameTxt}>{name}</Text>

                    <View style={{ height:hp('50') }}/>
                    <TouchableOpacity
                        style={styles.btn01}
                        onPress={async () => {
                            notify({title:"Sorry!",message:"this feature is under construction"})
                        }}>
                        <Text style={styles.btnTxt}>{translate('Delete Account')}</Text>
                    </TouchableOpacity>
                    <View style={{ height:hp('1') }}/>
                    <TouchableOpacity
                        style={styles.btn01}
                        onPress={async () => {
                            this.props.updateRedux({ "userData": {}, "resources": {} })
                        }}>
                        <Text style={styles.btnTxt}>{translate('Logout')}</Text>
                    </TouchableOpacity>
                </View>
            </>}
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => { this.setState({ isSlider: true }) }}>
                                <SvgDrawerIcon />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.headHelpBtn}
                                onPress={() => {
                                    notify({ title: "Sorry!", message: "this feature is under construction" })
                                }}>
                                <Text style={styles.headHelpBtnTxt}>HELP</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: hp("12") }} />
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={Logo} style={styles.logo_bg} />
                            <Image source={Logo} style={styles.logo} />
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text>

                        <View style={{ height: hp("6") }} />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={async () => {
                                this.get_resources(sessionId)
                            }}>
                            <SvgPlay />
                            <View style={{ width: wp('1') }} />
                            <Text style={styles.btnTxt}>{translate('start')}</Text>
                        </TouchableOpacity>
                        {/* <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={async () => {
                                this.props.updateRedux({ "userData": {}, "resources": {} })
                            }}>
                            <Text style={styles.btnTxt}>{translate('Logout')}</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View style={{ height: hp("24") }} />

                    <Text style={styles.powered_txt}>{translate('powered')}</Text>
                    <View style={{ height: hp("1") }} />
                    <View style={styles.powered_view}>
                        <Image source={Logo} style={styles.footer_logo} />
                        <Image source={Logo01} style={styles.footer_logo01} />
                    </View>
                </ScrollView>
                {/* <View style={styles.helpView}>
                    <TouchableOpacity
                        style={styles.helpBtn}
                        onPress={()=>{
                            notify({title:"Sorry!",message:"this feature is under construction"})
                        }}>
                        <Text style={{ fontSize:16, color:"#21347E" }}>?</Text>
                    </TouchableOpacity>
                </View> */}

                {/* <View style={styles.v01}>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={()=>{
                            notify({title:"Sorry!",message:"this feature is under construction"})
                        }}>
                        <Text style={styles.deleteBtnTxt}>{translate('Delete Account')}</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Start);

const styles = StyleSheet.create({
    sliderBlurView: {
        height: hp('100'),
        width: wp('100'),
        backgroundColor: '#333',
        position: 'absolute',
        opacity: 0.8,
        zIndex: 99
    },
    sliderView: {
        height: hp('100'),
        width: wp('54'),
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        position: 'absolute',
        zIndex: 100,
    },
    userNameTxt: {
        fontSize: 20,
        fontFamily: theme.font01,
        color: '#21347E'
    },

    safeArea: {
        flexDirection: 'column',
        backgroundColor: theme.tertiary,
        flex: 1
    },
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1,
    },
    header: {
        height: hp('10'),
        width: wp('100%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('3')
    },
    headHelpBtn: {
        height: hp('4'),
        width: wp('20'),
        borderRadius: wp('1'),
        backgroundColor: '#21347E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headHelpBtnTxt: {
        color: '#fff',
        fontSize: 16,
        // fontFamily:theme.font01,
    },
    btn: {
        height: hp('6'),
        width: wp('50'),
        alignSelf: 'center',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#21347E",
        flexDirection: 'row-reverse'
    },
    btn01: {
        height: hp('6'),
        width: wp('40'),
        alignSelf: 'center',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#21347E",
        flexDirection: 'row-reverse'
    },
    btnTxt: {
        color: "#fff",
        fontSize: 16,
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
    footer_logo: {
        height: wp('13'),
        width: wp('13'),
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    footer_logo01: {
        height: wp('13'),
        width: wp('24'),
        alignSelf: 'center',
        resizeMode: 'contain'
    },
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
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    deleteBtn: {
        paddingHorizontal: wp("3"),
        paddingVertical: wp("0.4"),
        backgroundColor: "#D9D9D9",
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 20,
    },
    deleteBtnTxt: {
        fontSize: 14,
        color: "#21347E",
        fontFamily: theme.font01
    }
});