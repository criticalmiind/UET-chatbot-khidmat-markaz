import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { translate } from '../i18n';
import { SvgDrawerProfileIcon } from '../constants/images';

class Slider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    setStateObj(data) {
        this.setState({ ...this, ...data })
    }

    render() {
        const { onClose } = this.props;

        return (<>
            <TouchableOpacity
                style={styles.sliderBlurView}
                onPress={() => {
                    if(onClose) onClose()
                }}>
            </TouchableOpacity>
            <View style={styles.sliderView}>
                <View style={{ height: hp('10') }} />
                <SvgDrawerProfileIcon />
                <Text style={styles.userNameTxt}>{'name'}</Text>

                <View style={{ height: hp('50') }} />
                <TouchableOpacity
                    style={styles.btn01}
                    onPress={async () => {
                        if(onClose) onClose()
                        this.props.navigation.navigate("DeleteAccount")
                    }}>
                    <Text style={styles.btnTxt}>{translate('Delete Account')}</Text>
                </TouchableOpacity>
                <View style={{ height: hp('1') }} />
                <TouchableOpacity
                    style={styles.btn01}
                    onPress={async () => {
                        this.props.updateRedux({ "userData": {}, "resources": {} })
                    }}>
                    <Text style={styles.btnTxt}>{translate('Logout')}</Text>
                </TouchableOpacity>
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
        fontSize: 20,
        fontFamily: theme.font01,
        color: '#21347E'
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
});