import React from 'react';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { hp, wp } from '../utils';
import { translate } from '../i18n';
import { SvgHelp } from '../constants/images';

class HelpIcon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { onPress } = this.props
        return (
            <View style={styles.helpView}>
                <TouchableOpacity
                    style={styles.helpBtn}
                    onPress={() => {
                        if(onPress) onPress()
                    }}>
                    <SvgHelp />
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpIcon);

const styles = StyleSheet.create({
    helpView: {
        position: 'absolute',
        top: hp('2'),
        right: hp('2')
    },
    helpBtn: {
        width: hp('4.5'),
        height: hp('4.5'),
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
});