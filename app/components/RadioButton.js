import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { hp, isNullRetNull, wp } from '../utils';
import { theme } from '../constants/theme';

class RadioButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {
            title,
            buttonsList,
            mainStyle,
            onChange = () => { },
            buttonStyle,
            titleStyle,
            buttonVerticle=false,
            buttonTextStyle,
            selectedKey="title",
            selectedValue
        } = this.props;

        return (<>
            <View style={{ ...styles.mainStyle, ...mainStyle ?? {} }}>
                <Text style={{ ...styles.titleStyle, ...titleStyle ?? {} }}>{title}</Text>
                <View style={{ "flexDirection":buttonVerticle?"column":"row" }}>
                    {buttonsList.map((e) => {
                        let is = e[selectedKey] == selectedValue
                        return(
                        <TouchableOpacity
                            style={{ ...styles.buttonStyle(is), ...buttonStyle ?? {} }}
                            onPress={() => {
                                onChange(e)
                            }}>
                            <Text style={{...styles.buttonTextStyle(is), ...buttonTextStyle }}>{isNullRetNull(e.title)}</Text>
                        </TouchableOpacity>
                    )})}
                </View>
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RadioButton);

const styles = StyleSheet.create({
    mainStyle: {
        alignSelf: 'center',
        width: "100%",
    },
    titleStyle: {
        fontSize: 18,
    },
    buttonStyle:(is)=> ({
        paddingVertical: wp('1'),
        paddingHorizontal: wp('4'),
        backgroundColor: is?theme.designColor:theme.tertiary,
        borderRadius: 2,
        margin: wp('1'),
        alignItems: 'center',
        justifyContent: 'center',
        "borderWidth":1,
        "borderColor":theme.designColor
    }),
    "buttonTextStyle":(is)=>({
        "fontSize":14,
        "color":is?theme.tertiary:theme.primary01
    })
});