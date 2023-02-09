import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isNullRetNull, notify, wp } from '../utils';
import { Logo, Logo01 } from '../constants/images';
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
    
    UNSAFE_componentWillMount() {
    }

    async get_resources(session){
        this.setState({ loader:true })
        let obj = { 'function': method['startService'], 'sessionId':session }
        let res = await call_application_manager(obj)
        if(res.resultFlag){
            this.props.updateRedux({ "resources":res })
            setTimeout(()=>{
                this.setState({ loader:false })
                this.props.navigation.navigate("LetsBegin")
            },300)
        }else{
            this.setState({ loader:false })
            notify({ "title":"Failed!", "message":res.message, "success":false })
        }
    }

    render() {
        const { loader } = this.state;
        const { session } = this.props.userData;

        return (<>
            <Loader isShow={loader} />
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("26") }} />
                        <View style={{ justifyContent:'center' }}>
                            <Image source={Logo} style={styles.logo_bg}/>
                            <Image source={Logo} style={styles.logo}/>
                        </View>
                        <Text style={styles.title}>{translate('e-service')}</Text>
                        
                        <View style={{ height: hp("6") }} />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={async () => {
                                this.get_resources(session)
                            }}>
                            <Text style={styles.btnTxt}>{translate('Contact')}</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={async () => {
                                this.props.updateRedux({ "userData":{}, "resources":{} })
                            }}>
                            <Text style={styles.btnTxt}>{translate('Logout')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: hp("12") }} />

                    <Text style={styles.powered_txt}>{translate('powered')}</Text>
                    <View style={{ height: hp("1") }} />
                    <View style={styles.powered_view}>
                        <Image source={Logo} style={styles.footer_logo} />
                        <Image source={Logo01} style={styles.footer_logo} />
                    </View>
                </ScrollView>
                <View style={styles.helpView}>
                    <TouchableOpacity
                        style={styles.helpBtn}
                        onPress={()=>{
                            notify({title:"Sorry!",message:"this feature is under construction"})
                        }}>
                        <Text style={{ fontSize:16, color:"#21347E" }}>?</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.v01}>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={()=>{
                            notify({title:"Sorry!",message:"this feature is under construction"})
                        }}>
                        <Text style={styles.deleteBtnTxt}>{translate('Delete Account')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    },
    btn: {
        height: hp('6'),
        width: wp('50'),
        alignSelf: 'center',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#21347E"
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
        position:'absolute',
        opacity:0.05
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
    footer_logo: { height: wp('13'), width: wp('13'), alignSelf: 'center' },
    helpView:{
        position:'absolute',
        bottom:hp('2'),
        right:hp('2')
    },
    helpBtn:{
        width:hp('4'),
        height:hp('4'),
        borderWidth:1,
        borderColor:"#21347E",
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center'
    },
    v01:{
        position:'absolute',
        bottom:0,
        left:0
    },
    deleteBtn:{
        paddingHorizontal:wp("3"),
        paddingVertical:wp("0.4"),
        backgroundColor:"#D9D9D9",
        alignItems:'center',
        justifyContent:'center',
        borderTopRightRadius:20,
    },
    deleteBtnTxt:{
        fontSize:14,
        color:"#21347E",
        fontFamily:theme.font01
    }
});