import React from 'react';
import { Image } from 'react-native';
import { wp } from '../utils';
// import { Path, Svg, SvgXml } from 'react-native-svg';
// import { back, calender, city, drawer_icon, drawer_profile_icon, female, female_on, help, male, male_on, other, other_on, play, player_pause, player_play, popup_help, popup_success, popup_wrong, pwd, pwd_off, pwd_on, user } from './svgs';

const Logo = require('./../assets/logo.png');
const Logo01 = require('./../assets/cle_logo.png');
const LogoWhite = require('./../assets/logo_white.png');
const MicIcon = require('./../assets/mic.png');
const phone = require('./../assets/icons/phone.png');
const city = require('./../assets/icons/city.png');
const help = require('./../assets/icons/help.png');
const name = require('./../assets/icons/name.png');
const play = require('./../assets/icons/play.png');
const pause = require('./../assets/icons/pause.png');
const pwd = require('./../assets/icons/pwd.png');
const pwd_off = require('./../assets/icons/pwd_off.png');
const pwd_on = require('./../assets/icons/pwd_on.png');
const success_popup = require('./../assets/icons/success_popup.png');
const error_popup = require('./../assets/icons/error_popup.png');
const help_popup = require('./../assets/icons/help_popup.png');
const back = require('./../assets/icons/back.png');
const menu = require('./../assets/icons/menu.png');
const calender = require('./../assets/icons/calender.png');
const thumb = require('./../assets/icons/thumb.png');
const dob = require('./../assets/icons/dob.png');
const update = require('./../assets/icons/update.png');
const register = require('./../assets/icons/register.png');
const plus = require('./../assets/icons/plus.png');
const minus = require('./../assets/icons/minus.png');
const map = require('./../assets/icons/map.png');
const gender = require('./../assets/icons/gender.png');
const delte = require('./../assets/icons/delete.png');
const confirm_password = require('./../assets/icons/confirm_password.png');
const close = require('./../assets/icons/close.png');

const SvgPhone = () => <Image source={phone} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<Svg width={20} height={20} viewBox="0 0 20 20"><Path d="M3.68095 1.00063C3.93894 1.05643 4.18708 1.13536 4.3936 1.3094C4.42283 1.33381 4.45333 1.35695 4.48002 1.3839C5.06526 1.96688 5.65273 2.54765 6.23353 3.13476C6.66531 3.57096 6.74188 4.17043 6.43655 4.66909C6.30515 4.8894 6.10021 5.05652 5.85766 5.14112C5.49895 5.27014 5.22222 5.48983 5.06717 5.84552C4.96591 6.07589 4.94816 6.33423 5.01697 6.57623C5.1914 7.22959 5.55138 7.77739 5.9892 8.27985C6.51408 8.88217 7.11457 9.3932 7.8377 9.74666C8.13922 9.89407 8.45059 10.0231 8.79913 9.9746C9.26014 9.91119 9.61186 9.68675 9.79328 9.24769C9.91211 8.95952 10.0564 8.70116 10.3366 8.53758C10.7922 8.27129 11.3666 8.30585 11.7568 8.66058C12.1139 8.9852 12.4485 9.33423 12.79 9.67502C13.1017 9.98632 13.4255 10.2881 13.7143 10.6184C14.0803 11.035 14.0908 11.6871 13.768 12.1382C13.7015 12.2309 13.6278 12.3183 13.5475 12.3994C13.205 12.7456 12.8513 13.0813 12.5162 13.4345C12.1584 13.8114 11.7168 13.9759 11.2106 13.9972C10.6705 14.0203 10.1498 13.8998 9.64204 13.7283C8.64154 13.3907 7.73889 12.8661 6.88454 12.2564C5.47521 11.2502 4.21963 10.0452 3.15703 8.67929C2.36971 7.67056 1.69551 6.59398 1.27898 5.37476C1.09787 4.84408 0.97555 4.30104 1.00415 3.73391C1.02925 3.23715 1.19192 2.80475 1.5627 2.45508C1.87407 2.16185 2.17622 1.85847 2.47138 1.54906C2.7316 1.27675 3.01151 1.05136 3.40104 1L3.68095 1.00063Z" stroke="#7580AC" stroke-miterlimit="10" /></Svg>
const SvgPwd = () => <Image source={pwd} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<SvgXml xml={pwd}/>
const SvgCPwd = () => <Image source={confirm_password} style={{ width: 18, height: 30 }} /> //<SvgXml xml={pwd}/>
const SvgPwdOn = () => <Image source={pwd_on} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<SvgXml xml={pwd_on}/>
const SvgPwdOff = () => <Image source={pwd_off} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<SvgXml xml={pwd_off}/>
const SvgUser = () => <Image source={name} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<SvgXml xml={user}/>
const SvgCity = () => <Image source={city} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<SvgXml xml={city}/>
const SvgMap = () => <Image source={map} style={{ width: 18, height: 28 }} /> //<SvgXml xml={city}/>
const SvgHelp = ({style={}}) => <Image source={help} style={{ width: '100%', height: '100%', resizeMode: 'contain', ...style }} /> //<SvgXml xml={help}/>
const SvgHelp1 = () => <Image source={help} style={{ width: 36, height: 36 }} /> //<SvgXml xml={help}/>
const SvgPlay = () => <Image source={play} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<SvgXml xml={play}/>
const SvgDrawerIcon = () => <Image source={menu} style={{ width: 24, height: 24, resizeMode: 'contain' }} /> //<SvgXml xml={drawer_icon}/>
const SvgDrawerProfileIcon = () => <Image source={name} style={{ width: wp('20'), height: wp('20'), resizeMode: 'contain' }} /> //<SvgXml xml={drawer_profile_icon}/>
const SvgBackIcon = () => <Image source={back} style={{ width: 20, height: 20, resizeMode: 'contain' }} /> //<SvgXml xml={back}/>
const SvgCalenderIcon = () => <Image source={calender} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<SvgXml xml={calender}/>
const SvgPlayIcon = () => <Image source={play} style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: '#333' }} /> //<SvgXml xml={player_play} fill="#000000"/>
const SvgPauseIcon = () => <Image source={pause} style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: '#333' }} /> //<SvgXml xml={player_pause}/>
const SvgPopupWrongIcon = () => <Image source={error_popup} style={{ width: 40, height: 40, resizeMode: 'contain' }} /> //<SvgXml xml={popup_wrong}/>
const SvgPopupSuccessIcon = () => <Image source={success_popup} style={{ width: 18, height: 18, resizeMode: 'contain' }} /> //<SvgXml xml={popup_success}/>
const SvgPopupHelpIcon = () => <Image source={help_popup} style={{ width: 40, height: 40, resizeMode: 'contain' }} /> //<SvgXml xml={popup_help}/>
const ThumbImg = () => <Image source={thumb} style={{ width: 3, height: 40, resizeMode: 'contain' }} /> //<SvgXml xml={popup_help}/>
const SvgGender = () => <Image source={gender} style={{ width: 18, height: 40 }} /> //<SvgXml xml={popup_help}/>
const SvgUpdate = () => <Image source={update} style={{ width: 28, height: 28, resizeMode: 'contain' }} /> //<SvgXml xml={popup_help}/>
const SvgDelete = () => <Image source={delte} style={{ width: 28, height: 28, resizeMode: 'contain' }} /> //<SvgXml xml={popup_help}/>
const SvgReg = () => <Image source={register} style={{ width: 20, height: 32 }} /> //<SvgXml xml={popup_help}/>
const SvgClose = () => <Image source={close} style={{ width: 18, height: 18 }} /> //<SvgXml xml={popup_help}/>

export {
    Logo,
    Logo01,
    LogoWhite,
    MicIcon,
    thumb,
    SvgPhone,
    SvgPwd,
    SvgPwdOn,
    SvgPwdOff,
    SvgUser,
    SvgCity,
    SvgHelp,
    SvgPlay,
    SvgDrawerIcon,
    SvgDrawerProfileIcon,
    SvgBackIcon,
    SvgCalenderIcon,
    SvgPlayIcon,
    SvgPauseIcon,
    SvgPopupWrongIcon,
    SvgPopupSuccessIcon,
    SvgPopupHelpIcon,
    ThumbImg,
    SvgMap,
    SvgGender,
    SvgCPwd,
    SvgUpdate,
    SvgReg,
    SvgHelp1,
    SvgDelete,
    SvgClose
}