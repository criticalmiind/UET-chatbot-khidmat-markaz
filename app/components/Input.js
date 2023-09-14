import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { SvgPwdOff, SvgPwdOn } from '../constants/images';

class Input extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "showPwd": false
        }
    }

    render() {
        const { Icon, iconStyle = {}, secureTextEntry, viewStyle = {}, textInputStyle = {}, disabled, multiline=false } = this.props;
        const { showPwd } = this.state;

        return (
            <View style={{ ...styles.view, ...viewStyle }}>
                {Icon && <View style={{ ...styles.icon, ...iconStyle }}><Icon /></View>}
                <TextInput
                    multiline={multiline}
                    editable={!disabled}
                    style={{ ...styles.textInput, ...textInputStyle }}
                    placeholderTextColor={"#939393"}
                    {...this.props}
                    {...secureTextEntry ? { "secureTextEntry": !showPwd } : {}} />
                {secureTextEntry &&
                    <TouchableOpacity onPress={() => { this.setState({ "showPwd": !showPwd }) }}>
                        <View style={{ paddingHorizontal: wp('2') }}>
                            {showPwd ? <SvgPwdOn /> : <SvgPwdOff />}
                        </View>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Input);

const styles = StyleSheet.create({
    view: {
        height: hp('6'),
        width: wp('90'),
        alignSelf: 'center',
        backgroundColor: "#E8E8E8",
        borderBottomWidth: 2,
        borderColor: "#7A7A7A",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row-reverse'
    },
    textInput: {
        textAlign: 'right',
        backgroundColor: "#E8E8E8",
        paddingLeft: wp('1'),
        flex: 1,
        fontSize: 14,
        fontFamily: theme.font01,
        color:"#333",
        lineHeight: 20
    },
    icon: {
        paddingLeft: wp('1'),
        paddingRight: wp('1')
    }

});