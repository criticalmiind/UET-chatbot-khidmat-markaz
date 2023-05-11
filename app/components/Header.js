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
                    style={styles.btn01}
                    onPress={() => {
                        if (onClickHelp) onClickHelp()
                    }}>
                    <SvgHelp1 />
                </TouchableOpacity>
                <Image source={LogoWhite} style={styles.logo} />
                <TouchableOpacity
                    style={styles.btn02}
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
        flex: 1,
        paddingHorizontal: wp('2'),
        paddingVertical: hp('2'),
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.designColor,
    },
    logo: {
        height: wp('12'),
        width: wp('12'),
        top: -4
    },
    btn01: {
        width: wp('10'),
        height: wp('10'),
        alignItems: 'flex-end',
        borderRadius: 100,
        borderWidth: 1.5,
        borderColor: "#ffffff",
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn02: { width: wp('10'), alignItems: 'flex-start' }
});