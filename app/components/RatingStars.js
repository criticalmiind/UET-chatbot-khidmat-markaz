import React from 'react'
import { TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { isNullRetNull } from '../utils';
import { theme } from '../constants/theme';

const START_SIZE = 28;

export default class RatingStars extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            rateVal: isNullRetNull(this.props.defualtValue, 'N/A') === 'N/A' ? 2.5 : parseInt(this.props.defualtValue),
            totalStars: this.props.totalStars ? this.props.totalStars : 5,
            valList:[],
        }
    }

    UNSAFE_componentWillMount(){
        this._isMounted = true;
        if(this._isMounted){
            this.makeRateVal()
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    makeRateVal(){
        let tempArray = [];
        for (let index = 1; index <= this.state.totalStars; index++) {
            tempArray.push(index)
        }
        this.setStateObj({ valList: tempArray })
    }

    setStateObj(obj){
        if(this._isMounted){ this.setState({ ...this.state, ...obj }) }
    }

    setRating(obj){
        this.setStateObj(obj)
        this.props.getRatevalue(obj.rateVal)
    }

    isInt(n) { return n % 1 === 0; }

    render(){
        const { rateVal, valList } = this.state;
        const isDisabled = this.props.disabled ? this.props.disabled : false;
        if(isDisabled){
            return valList.map((val, i)=>{
                if(rateVal === val-.5){
                    return(
                        <View key={i}>
                            <FontAwesome
                                name="star-half-empty"
                                color={theme.designColor}
                                size={START_SIZE}
                                style={{
                                    margin:2,
                                    transform: []
                                    // transform: i18n.t('arrow_direction')==='left' ? [ { rotateZ: '180deg' },{ rotateX: '180deg' } ] : []
                                }}/>
                        </View>
                    )
                }
                if(rateVal >= val){
                    if(rateVal === val){
                        return(
                            <View key={i}>
                                <FontAwesome
                                    name="star"
                                    color={theme.designColor}
                                    size={START_SIZE}
                                    style={{
                                        margin:2,
                                    }}/>
                            </View>
                        )
                    }else{
                        return(
                            <View key={i}>
                                <FontAwesome
                                    name="star"
                                    color={theme.designColor}
                                    size={START_SIZE}
                                    style={{
                                        margin:2,
                                    }}/>
                            </View>
                        )
                    }
                }else{
                    return(
                        <View key={i}>
                            <FontAwesome
                                name="star-o"
                                color={theme.designColor}
                                size={START_SIZE}
                                style={{
                                    margin:2,
                                }}/>
                        </View>
                    )
                }
            })
        }else{
            return valList.map((val, i)=>{
                if(rateVal === val-.5){
                    return(
                        <TouchableOpacity
                            key={i}
                            onPress={()=>{
                                this.setRating({ rateVal: parseFloat(val) })
                            }}>
                            <FontAwesome
                                name="star-half-empty"
                                color={theme.designColor} size={START_SIZE} style={{
                                    margin:2,
                                    transform: []
                                    // transform: i18n.t('arrow_direction')==='left' ? [ { rotateZ: '180deg' },{ rotateX: '180deg' } ] : []
                                }}/>
                        </TouchableOpacity>
                    )
                }
                if(rateVal >= val){
                    if(rateVal === val){
                        return(
                            <TouchableOpacity
                                key={i}
                                onPress={()=>{
                                    this.setRating({ rateVal: parseFloat(val-1) })
                                }}>
                                <FontAwesome
                                    name="star"
                                    color={theme.designColor}
                                    size={START_SIZE}
                                    style={{
                                        margin:2,    
                                    }}/>
                            </TouchableOpacity>
                        )
                    }else{
                        return(
                            <TouchableOpacity
                                key={i}
                                onPress={()=>{
                                    this.setRating({ rateVal: parseFloat(val) })
                                }}>
                                <FontAwesome
                                    name="star"
                                    color={theme.designColor}
                                    size={START_SIZE}
                                    style={{
                                        margin:2,    
                                    }}/>
                            </TouchableOpacity>
                        )
                    }
                }else{
                    return(
                        <TouchableOpacity
                            key={i}
                            onPress={()=>{
                                this.setRating({ rateVal: parseFloat(val-.5) })
                            }}>
                            <FontAwesome
                                name="star-o"
                                color={theme.designColor}
                                size={START_SIZE}
                                style={{
                                    margin:2,    
                                }}/>
                        </TouchableOpacity>
                    )
                }
            })
        }
    }
}