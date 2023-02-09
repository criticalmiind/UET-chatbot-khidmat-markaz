import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, BackHandler } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, notify, wp } from '../utils';
import { Logo } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';

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
            <Loader isShow={loader}/>
            <View style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("5") }} />
                        <Image source={Logo} style={styles.logo} />
                        <View style={{ height: hp("7") }} />

                        <View style={{ height: hp("4") }} />
                        <TouchableOpacity
                            style={styles.autoDetectBtn()}
                            onPress={async () => {
                                this.get_resources(session)
                            }}>
                            <Text style={styles.autoDetectBtnText()}>شروع کریں</Text>
                        </TouchableOpacity>
                        <View style={{ height: hp("2") }} />
                        <TouchableOpacity
                            style={styles.autoDetectBtn()}
                            onPress={async () => {
                                this.props.updateRedux({ "userData":{}, "resources":{} })
                            }}>
                            <Text style={styles.autoDetectBtnText()}>لاگ آوٹ</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Text style={styles.version}>V.1.0.0</Text>
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
        fontFamily: theme.font01,
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
        fontSize: 16
    },
    logo: { height: wp('50'), width: wp('50'), alignSelf: 'center' },
    version:{
        fontSize:16,
        position:'absolute',
        bottom:hp('1.5'),
        alignSelf:'center',
        fontFamily:theme.font01
    }
});