import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { hp, wp } from '../utils';
import { theme } from '../constants/theme';
import { translate } from '../i18n';
import { SvgPopupHelpIcon, SvgPopupSuccessIcon, SvgPopupWrongIcon } from '../constants/images';

class Popup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { show, type, message, onClick=(e)=>{} } = this.props;

        return (<>
            {show &&
                <View style={styles.safeArea}>
                    <View style={styles.v01}>
                        <View style={styles.v02}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {type && <Text style={{ ...styles.txt, fontSize: 20 }}>{translate(type)}</Text>}
                                <View style={{ width: wp('1') }} />
                                {type == 'help' && <SvgPopupHelpIcon />}
                                {type == 'success' && <SvgPopupSuccessIcon />}
                                {type == 'wrong' && <SvgPopupWrongIcon />}
                            </View>
                            {message&&<Text style={{ ...styles.txt, fontSize:24 }}>{message}</Text>}
                        </View>
                        <View style={styles.v03}>
                            <TouchableOpacity
                                style={{ ...styles.btn, borderRightWidth: 1 }}
                                onPress={()=>{
                                    if(onClick) onClick(false)
                                }}>
                                <Text style={{ ...styles.txt }}>{translate("No")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ ...styles.btn, borderRightWidth: 0 }}
                                onPress={()=>{
                                    if(onClick) onClick(true)
                                }}>
                                <Text style={{ ...styles.txt, color: '#1E88E5' }}>{translate("Yes")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.mainView}>
                    </View>
                </View>
            }
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Popup);

const styles = StyleSheet.create({
    safeArea: {
        position: "absolute",
        width: wp('100'),
        height: hp('100'),
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainView: {
        position: "absolute",
        backgroundColor: 'black',
        width: wp('100'),
        height: hp('100'),
        zIndex: 10,
        opacity: 0.5,
    },
    v01: {
        height: hp('30'),
        width: wp('82'),
        alignSelf: 'center',
        backgroundColor: '#fff',
        zIndex: 11,
        borderRadius: 10
    },
    v02: {
        height: hp('23'),
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    v03: {
        height: hp('7'),
        width: wp('82'),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row'
    },
    btn: {
        height: hp('7'),
        width: wp('41'),
        borderRightWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    txt: { fontFamily: theme.font01, fontSize: 20, color:'#333' },
});