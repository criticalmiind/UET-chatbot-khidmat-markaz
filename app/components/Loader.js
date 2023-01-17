import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';

class Loader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { isShow, mesasge } = this.props;

        return (<>
            {isShow &&
                <View style={styles.safeArea}>
                    <ActivityIndicator size={"large"}/>
                    {mesasge && <Text>{mesasge}</Text>}
                    <View style={styles.mainView}>
                    </View>
                </View>
            }
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);

const styles = StyleSheet.create({
    safeArea: {
        position:"absolute",
        width:wp('100'),
        height:hp('100'),
        zIndex:10,
        alignItems:'center',
        justifyContent:'center'
    },
    mainView:{
        position:"absolute",
        backgroundColor:'black',
        width:wp('100'),
        height:hp('100'),
        zIndex:10,
        opacity:0.5,
    }
});