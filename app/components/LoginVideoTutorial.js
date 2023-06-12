import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { translate } from '../i18n';
import WebView from 'react-native-webview';

class LoginVideoTutorial extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        return (<>
            <Text style={styles.btnTxt}>{translate('App Usage Technique')}</Text>
            <View style={{
                height: hp('21'),
                width: wp('76'),
                alignSelf: 'center',
                backgroundColor: '#333'
            }}>
                <WebView
                    style={{ flex:1 }}
                    containerStyle={{ borderWidth:1 }}
                    allowsFullscreenVideo={true}
                    source={{ "uri":"https://bot.cle.org.pk/static/videos/PITB.webm" }}/>
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginVideoTutorial);

const styles = StyleSheet.create({
    btnTxt: {
        alignSelf: 'center',
        color: "#333",
        fontSize: 16,
        fontFamily: theme.font01
    },
});