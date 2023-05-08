import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { hp, wp } from '../utils';
import { theme } from '../constants/theme';
import { Text } from 'react-native';
import { translate } from '../i18n';

class Button1 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { title, style, btnTxt, children } = this.props;

        return (
            <TouchableOpacity
                style={{ ...styles.btn, ...style }}
                onPress={async () => {
                    if(onPress)onPress()
                }}>
                {children}
                {title&&<Text style={{...styles.btnTxt, ...btnTxt}}>{translate(title)}</Text>}
            </TouchableOpacity>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Button1);

const styles = StyleSheet.create({

    btn: {
        height: hp('6'),
        width: wp('50'),
        alignSelf: 'center',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#21347E",
        borderRadius: 10,
        flexDirection: 'row-reverse'
    },
    btnTxt: {
        color: "#fff",
        fontSize: 16,
        fontFamily: theme.font01,
        lineHeight:22
    },
});