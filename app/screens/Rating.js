import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, StatusBar, SafeAreaView, TextInput } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import Loader from '../components/Loader';
import { translate } from '../i18n';
import Popup from '../components/Popup';
import PoweredBy from '../components/PoweredBy';
import HelpIcon from '../components/HelpIcon';
import { Logo } from '../constants/images';
import Header from '../components/Header';
import RatingStars from '../components/RatingStars';
import Button1 from '../components/Button1';


class Rating extends React.Component {
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
                        this.setState({ popup: { "show": true, "title": "Instractions", "audio": "FeedbackScreen", "btnTitle": "Back", "type": "help", "message": translate("suggestion screen help") } })
                    }}
                    onClickBack={() => {
                        this.props.navigation.goBack()
                    }} />

                <ScrollView>
                    <View style={styles.mainView}>
                    <View style={{ height: hp("8") }} />

                        <Text style={styles.title}>{translate('Give us rating')}</Text>

                        <View style={{ height: hp("1") }} />
                        <View style={styles.view01}>
                            <RatingStars
                                // defualtValue={rateValue}
                                getRatevalue={(val) => {
                                    // this.setState({ rateValue: val })
                                }} />
                        </View>
                        <Text style={styles.title}>{translate('Rate This App')}</Text>
                        <View style={{ height: hp("5") }} />

                        <TextInput
                            multiline
                            placeholder={translate('Record your valuable suggestions')}
                            numberOfLines={8}
                            // value='sakdjaskl'
                            textAlign={"right"}
                            style={{
                                padding:hp('1.5'),
                                width:wp('80'),
                                borderWidth:1,
                                borderColor:theme.designColor,
                                borderRadius:10,
                                backgroundColor:"#E8E8E8",
                                fontFamily:theme.font01,
                                lineHeight:10,
                                textAlignVertical:'top'
                            }}
                        />

                        <View style={{ height: hp("8") }} />
                        <Button1 title="Submit" onPress={() => { }} />
                        <View style={{ height: hp("9") }} />
                    </View>
                    <PoweredBy />
                    <View style={{ height: hp("3") }} />
                </ScrollView>
            </SafeAreaView>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rating);

const styles = StyleSheet.create({
    safeArea: {
        flexDirection: 'column',
        backgroundColor: theme.tertiary,
        flex: 1
    },
    mainView: {
        backgroundColor: theme.tertiary,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.font01,
        fontSize: 20,
        color: theme.designColor
    },
    view01: { flexDirection: 'row', height: hp('6'), width: '100%', alignItems: 'center', justifyContent: 'center' }
});