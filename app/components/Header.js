import React from 'react';
import { StyleSheet, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { hp, wp } from '../utils';
import { TouchableOpacity } from 'react-native';
import { LogoWhite, SvgBackIcon, SvgHelp1 } from '../constants/images';
import { Image } from 'react-native';
import { theme } from '../constants/theme';

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { onClickHelp, onClickBack } = this.props;

        return (<>
            <View style={styles.headerView}>
                <TouchableOpacity
                    onPress={() => {
                        if (onClickHelp) onClickHelp()
                    }}>
                    <SvgHelp1 />
                </TouchableOpacity>
                <Image source={LogoWhite} style={{ top: -4, height: wp('13'), width: wp('13') }} />
                <TouchableOpacity
                    style={{ width: wp('18') }}
                    onPress={() => {
                        if (onClickBack) onClickBack()
                    }}>
                    <SvgBackIcon />
                </TouchableOpacity>
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const styles = StyleSheet.create({
    headerView: {
        height: hp('8'),
        width: wp('100'),
        paddingHorizontal: wp('2'),
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor:theme.designColor
    },
});