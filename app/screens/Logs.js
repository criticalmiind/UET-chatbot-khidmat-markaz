import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { SvgDrawerIcon, SvgHelp } from '../constants/images';
import { call_application_manager, method } from '../api';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';

class Logs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "loader": false,
            "logs": []
        }
    }

    UNSAFE_componentWillMount() {
        this.get_logs()
    }

    async componentWillUnmount() { }

    async get_logs() {
        const { userName } = this.props.userData
        this.setState({ loader: true })
        let obj = { 'function': method['getMobileLog'], 'phoneNumber': userName }
        let res = await call_application_manager(obj)
        if (res.resultFlag) {
            this.setState({ "logs": res.data ? res.data : [], "loader": false })
        } else {
            this.setState({ "logs": [], "loader": false })
        }
    }

    render() {
        const { loader, logs } = this.state;

        return (<>
            <Loader isShow={loader} />
            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                <View style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.headHelpBtn}
                            onPress={() => { this.setState({ isSlider: true }) }}>
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
                        <View style={{ height: hp("1") }} />
                        <Text style={styles.title}>{translate('e-service')} - {translate('Log')}</Text>
                        <ScrollView>
                            {
                                logs.map((item, i) => {
                                    return <View key={i} style={{ width: wp('90'), alignSelf: 'center' }}>
                                        <View style={{ height: hp("3") }} />
                                        <Text style={styles.txt01}>{`(${i+1})`}</Text>

                                        <Text style={styles.txt01}>User: {item[3]}</Text>
                                        <Text style={styles.txt01}>Date: {item[4]}</Text>
                                        <Input
                                            viewStyle={{ height: undefined }}
                                            textInputStyle={{ textAlign: 'left' }}
                                            value={`Session: ${item[2]}`} />
                                        <Input
                                            disabled={true}
                                            multiline={true}
                                            viewStyle={{ height: undefined }}
                                            textInputStyle={{ textAlign: 'left' }}
                                            value={`Error: \n ${item[1]}`}
                                        />
                                        <View style={{ height: hp("3") }} />
                                    </View>
                                })
                            }
                            <View style={{ height: hp("6") }} />
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logs);

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
    txt01: {
        fontFamily: theme.font01,
        fontSize: 18,
        alignSelf: 'center',
        lineHeight: 20
    },
    title: {
        alignSelf: 'center',
        color: theme.designColor,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 28
    },
});