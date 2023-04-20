import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { Logo, Logo01 } from '../constants/images';
import { translate } from '../i18n';

class PoweredBy extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (<>
            <Text style={styles.powered_txt}>{translate('powered')}</Text>
            <View style={{ height: hp("1") }} />
            <View style={styles.powered_view}>
                <Image source={Logo} style={styles.footer_logo} />
                <Image source={Logo01} style={styles.footer_logo01} />
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PoweredBy);

const styles = StyleSheet.create({
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
    footer_logo01: {
        height: wp('13'),
        width: wp('24'),
        alignSelf: 'center',
        resizeMode: 'contain'
    },
});