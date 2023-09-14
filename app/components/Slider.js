import React, { version } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, isObjEmpty, wp } from '../utils';
import { translate } from '../i18n';
import { SvgDrawerProfileIcon } from '../constants/images';
import codePush from 'react-native-code-push';

class Slider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "version": {}
        }
    }

    UNSAFE_componentWillMount() {
        codePush.getUpdateMetadata().then((updateMetadata) => {
            this.setState({ "version":updateMetadata })
        });

    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { version } = this.state;
        const { onClose, onAction } = this.props;

        return (<>
            <TouchableOpacity
                style={styles.sliderBlurView}
                onPress={() => {
                    if (onClose) onClose()
                }}>
            </TouchableOpacity>
            <View style={styles.sliderView}>
                <View style={{
                    height: hp('30'),
                    width: '100%',
                    backgroundColor: theme.designColor
                }}>
                    <Text style={styles.userNameTxt}>{translate('Full Name')}</Text>
                </View>

                <TouchableOpacity
                    style={styles.btn01}
                    onPress={async () => {
                        if (onClose) onClose()
                        this.props.navigation.navigate("Profile")
                    }}>
                    <Text style={styles.btnTxt}>{translate('Profile')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn01}
                    onPress={async () => {
                        if (onClose) onClose()
                        this.props.navigation.navigate("Settings")
                    }}>
                    <Text style={styles.btnTxt}>{translate('Settings')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn01}
                    onPress={async () => {
                        if (onClose) onClose()
                        this.props.navigation.navigate("Help")
                    }}>
                    <Text style={styles.btnTxt}>{translate('Help')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn01}
                    onPress={async () => {
                        if(onAction) onAction('logs')
                    }}>
                    <Text style={styles.btnTxt}>{translate('Log')}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={styles.btn01}
                    onPress={async () => {
                        if(onAction) onAction('setting')
                    }}>
                    <Text style={styles.btnTxt}>{translate('Audio Settings')}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={styles.btn01}
                    onPress={async () => {
                        if(onAction) onAction('logout')
                    }}>
                    <Text style={styles.btnTxt}>{translate('Logout')}</Text>
                </TouchableOpacity>

                {!isObjEmpty(version) &&
                    <View style={styles.versionView}>
                        <Text style={styles.versionTxt}>GitHub: 1.0.4</Text>
                        <Text style={styles.versionTxt}>App Version: {version.appVersion}</Text>
                        <Text style={styles.versionTxt}>Update Version: {version.label}</Text>
                    </View>
                }
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slider);

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
        position: 'absolute',
        bottom: hp('2'),
        right: hp('2'),
        fontSize: 40,
        fontFamily: theme.font01,
        color: '#fff'
    },
    btn01: {
        height: hp('6'),
        paddingHorizontal: hp('2'),
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: theme.secondary,
        alignItems: 'center',
        flexDirection: 'row-reverse'
    },
    btnTxt: {
        color: theme.designColor,
        fontSize: 18,
        fontFamily: theme.font01
    },
    versionView: { position: 'absolute', bottom: hp('2'), alignItems: 'center', justifyContent: 'center' },
    versionTxt: { fontSize: 12, fontFamily: theme.font01, color: '#333', lineHeight: 15 },
});