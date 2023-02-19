import React from 'react';
import { Slider, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { SvgPauseIcon, SvgPlayIcon } from '../constants/images';
import { on_click_chat_text_panel } from '../api/methods';

class PlayerView extends React.Component {
    constructor(props) {
        super(props)
        this.on_click_chat_text_panel = on_click_chat_text_panel.bind(this);
        this.state = {
            "isPlay":false,
        }
    }

    sound_callback(e){
        console.log(e)
    }

    render() {
        const { isPlay } = this.state;
        const { text_obj={} } = this.props;

        return (
            <View style={styles.v01}>
                <View style={styles.playView}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({ "isPlay":!isPlay })
                            this.on_click_chat_text_panel(text_obj.text, this.sound_callback)
                        }}>
                        {isPlay?<SvgPauseIcon />:<SvgPlayIcon />}
                    </TouchableOpacity>
                </View>
                <Slider
                    style={styles.sliderStyle}
                    thumbTintColor="transparent"
                    disabled={0}
                    value={0}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="#333333"
                    maximumTrackTintColor="#000000" />
                <Text style={styles.counterTxt}>00:10</Text>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerView);

const styles = StyleSheet.create({
    v01:{
        height: hp('3'),
        width: '100%',
        backgroundColor: '#F0F7FF',
        borderRadius: 100,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: wp('1')
    },
    playView:{
        position:'absolute',
        zIndex:10,
        left:wp('2')
    },
    sliderStyle:{
        left:wp('1%'),
        width: '91%',
        borderRadius: 100,
        padding: 0
    },
    counterTxt:{
        position:'absolute',
        zIndex:10,
        right:wp('2'),
        fontFamily:theme.font01,
        color:"#333",
        fontSize:10
    },
});