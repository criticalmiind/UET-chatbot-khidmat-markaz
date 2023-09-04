import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import Header from '../components/Header';
import AudioPlayer from '../components/AudioPlayer';
import { call_application_manager, method } from '../api';

class CommonQuestions extends React.Component {
    constructor(props) {
        super(props)
        this.audioRef = React.createRef()
        this.state = {
            "loader": false,
            "expended": {},
            "data_list": []
        }
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    componentWillMount() {
        this.get_faqs()
    }

    async get_faqs() {
        this.setStateObj({ loader: true })
        let obj = { 'function': method['getFaq'] }
        let res = await call_application_manager(obj)
        this.setStateObj({ loader: false })
        if (res.resultFlag) {
            let faqList = []
            for (let i = 0; i < res.faqList.length; i++) {
                const el = res.faqList[i];
                faqList.push({ "id": i + 1, "question": el[0], "ans": el[1], "filename": el[2], "audio": false })
            }
            this.setState({ "data_list": faqList, "loader": false, })
        } else {
            this.setStateObj({ "loader": false, "popup": { "show": true, "type": "wrong", "message": translate(res.message ? res.message : res.error) } })
        }
    }

    async get_faq_audio(item = {}) {
        this.setStateObj({ "loader": true })
        let obj = { 'function': method['getFaqAudio'], 'audioFileName': item['filename'] }
        let res = await call_application_manager(obj)
        if (res.resultFlag) {
            this.setStateObj({
                "expended": { ...item, "audio": res.faqAudioFile },
                "loader": false
            })
        } else {
            this.setStateObj({ "loader": false, "popup": { "show": true, "type": "wrong", "message": translate(res.message ? res.message : res.error) } })
        }
    }

    render() {
        const { loader, expended, data_list } = this.state;

        return (<>
            <Loader isShow={loader} />
            <Popup {...this.state.popup} onClick={() => { this.setState({ popup: {} }) }} />
            <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
                <StatusBar barStyle="light-content" backgroundColor={theme.designColor} />
                <Header
                    onClickHelp={() => {
                        this.setState({ popup: { "show": true, "title": "Instractions", "audio": "FAQsScreen", "btnTitle": "Back", "type": "help", "message": translate("feqs screen help") } })
                    }}
                    onClickBack={() => {
                        this.props.navigation.goBack()
                    }} />

                <ScrollView>
                    <View style={styles.mainView}>
                        <View style={{ height: hp("1") }} />

                        <Text style={{ ...styles.title, lineHeight: 60, fontSize: 40 }}>{translate('Common Questions')}</Text>

                        <View style={{ height: hp("2") }} />

                        {
                            data_list.map((item, i) => {
                                return (
                                    <View key={i} style={styles.v04}>
                                        <TouchableOpacity
                                            style={styles.btn01}
                                            onPress={async () => {
                                                if (this.audioRef.current) await this.audioRef.current.stopAudio()
                                                if (item.id == expended.id) {
                                                    this.setStateObj({ "expended": {} })
                                                } else {
                                                    await this.get_faq_audio(item)
                                                }
                                            }}>
                                            <Text style={styles.txt03}>{translate(item.id)}</Text>

                                            <View style={{ flexDirection: 'row-reverse', width: wp('80') }}>
                                                <Text style={styles.txt01}>{translate(item.question)}</Text>
                                            </View>
                                            <View style={styles.v01}>
                                                <Text style={styles.txt02}>{item.id == expended.id ? "-" : "+"}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {item.id == expended.id &&
                                            <>
                                                <View style={styles.v02}>
                                                    <Text style={styles.txt03}>{translate("Jeem")}</Text>

                                                    <View style={{ flexDirection: 'row-reverse', width: wp('84') }}>
                                                        <Text style={styles.txt01}>{translate(expended.ans)}</Text>
                                                    </View>

                                                </View>
                                                <View style={styles.v03}>
                                                    <AudioPlayer
                                                        ref={this.audioRef}
                                                        audio={expended.audio}
                                                        isBase64={true}
                                                        updateParent={(obj) => {
                                                            // this.setState(obj)
                                                        }} />
                                                </View>
                                            </>
                                        }
                                    </View>
                                )
                            })
                        }

                    </View>
                    <View style={{ height: hp("2") }} />
                    <PoweredBy />
                    <View style={{ height: hp("3") }} />
                </ScrollView>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommonQuestions);

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
    logo: {
        height: wp('24'),
        width: wp('24'),
        alignSelf: 'center'
    },
    logo_bg: {
        height: wp('35'),
        width: wp('35'),
        alignSelf: 'center',
        position: 'absolute',
        opacity: 0.05
    },
    title: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 22,
        color: theme.designColor
    },

    txt01: {
        fontFamily: theme.font01,
        fontSize: 16,
        color: theme.designColor,
    },
    txt03: {
        fontFamily: theme.font01,
        fontSize: 16,
        color: theme.designColor,
        width: wp('4'),
        textAlign: 'center'
    },
    v04: {
        borderTopColor: "#d3d3d3",
        borderTopWidth: 1,
        borderBottomColor: "#d3d3d3",
        borderBottomWidth: 1,
        paddingVertical: hp('1')
    },
    btn01: {
        width: wp('100'),
        flexDirection: 'row-reverse',
        paddingHorizontal: wp('5'),
        justifyContent: 'space-between',
    },
    v01: {
        borderWidth: 1,
        borderColor: theme.designColor,
        height: hp('2'),
        width: hp('2'),
        borderRadius: 100,
        marginVertical: hp('1.5'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    v02: {
        width: wp('100'),
        flexDirection: 'row-reverse',
        paddingHorizontal: wp('5'),
        justifyContent: 'space-between',
    },
    txt02: {
        lineHeight: 19,
        fontSize: 22,
        color: theme.designColor
    },
    v03: {
        width: wp('100'),
        paddingHorizontal: wp('10'),
    },
});