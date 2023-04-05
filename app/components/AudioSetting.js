import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { hp, uid, wp } from '../utils';
import { theme } from '../constants/theme';
import { translate } from '../i18n';
import { SvgPopupHelpIcon, SvgPopupSuccessIcon, SvgPopupWrongIcon } from '../constants/images';

class AudioSetting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "config": this.props.audioRecordingOptions
        }
    }

    render() {
        const { onClick = (e) => { } } = this.props;
        const { config } = this.state;
        const { sampleRate, channels, bitsPerSample, chunkSize } = config;

        const rates = [16000, 44100]
        const channelsList = [1, 2]
        const bits = [8, 16, 32]
        const chunks = [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]

        const Item = ({ index, value, isSelected, field }) => {
            return (
                <TouchableOpacity
                    key={index}
                    style={styles.btn1(isSelected)}
                    onPress={() => {
                        this.setState({ "config": { ...config, [field]: value } })
                    }}>
                    <Text style={{ "color": isSelected ? '#fff' : '#333', "fontSize": 12 }}>{value}</Text>
                </TouchableOpacity>
            )
        }

        return (<>
            <View style={styles.safeArea}>
                <View style={styles.v01}>
                    <View style={styles.v02}>
                        <View style={{ height: hp('2') }} />
                        <Text style={{ ...styles.txt, color: theme.designColor, fontWeight: '700' }}>Speak Setting</Text>

                        <Text style={{ ...styles.txt }}>Sample Rate</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {rates.map((v, i) => <Item field={"sampleRate"} index={i} value={v} isSelected={sampleRate == v} />)}
                        </ScrollView>

                        <View style={{ height: hp('1') }} />

                        <Text style={{ ...styles.txt }}>Channels</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {channelsList.map((v, i) => <Item field={"channels"} index={i} value={v} isSelected={channels == v} />)}
                        </ScrollView>

                        <View style={{ height: hp('1') }} />

                        <Text style={{ ...styles.txt }}>Bits Per Sample</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {bits.map((v, i) => <Item field={"bitsPerSample"} index={i} value={v} isSelected={bitsPerSample == v} />)}
                        </ScrollView>

                        <View style={{ height: hp('1') }} />

                        <Text style={{ ...styles.txt }}>Audio Chunk Size</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ width:wp('5') }}/>
                            {chunks.map((v, i) => <Item field={"chunkSize"} index={i} value={v} isSelected={chunkSize == v} />)}
                            <View style={{ width:wp('5') }}/>
                        </ScrollView>
                    </View>
                    <View style={{ height: hp('3') }} />
                    <View style={styles.v03}>
                        <TouchableOpacity
                            style={{ ...styles.btn, borderRightWidth: 1 }}
                            onPress={() => {
                                this.props.updateRedux({
                                    "audioRecordingOptions":{
                                        "sampleRate": 16000,
                                        "channels": 1,
                                        "bitsPerSample": 16,
                                        "chunkSize": 1024,
                                        "wavFile": `audio-${uid()}.wav`,
                                    }
                                })
                                if (onClick) onClick(false)
                            }}>
                            <Text style={{ ...styles.txt }}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.btn, borderRightWidth: 1 }}
                            onPress={() => {
                                if (onClick) onClick(false)
                            }}>
                            <Text style={{ ...styles.txt }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.btn, borderRightWidth: 0 }}
                            onPress={() => {
                                this.props.updateRedux({ "audioRecordingOptions": config })
                                if (onClick) onClick(false)
                            }}>
                            <Text style={{ ...styles.txt, color: '#1E88E5' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.mainView}>
                </View>
            </View>
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioSetting);

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
        // height: hp('60'),
        width: wp('90'),
        alignSelf: 'center',
        backgroundColor: '#fff',
        zIndex: 11,
        borderRadius: 10
    },
    v02: {
        // height: hp('23'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    v03: {
        // position: 'absolute',
        // bottom: 0,
        height: hp('7'),
        width: wp('90'),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',

        borderTopColor: '#ddd',
        borderTopWidth: 1,
    },
    btn: {
        height: hp('7'),
        width: wp('30'),
        borderRightWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    txt: { fontFamily: theme.font01, fontSize: 20, color: '#333' },
    btn1: (is) => ({
        height: hp('5'),
        width: wp('15'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.designColor,
        backgroundColor: is ? theme.designColor : 'transparent'
    })
});