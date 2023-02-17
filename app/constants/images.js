import React from 'react';
import { Path, Svg, SvgXml } from 'react-native-svg';
import { back, city, drawer_icon, drawer_profile_icon, female, female_on, help, male, male_on, other, other_on, play, pwd, pwd_off, pwd_on, user } from './svgs';

const Logo = require('./../assets/logo.png');
const Logo01 = require('./../assets/cle_logo.png');
const LogoWhite = require('./../assets/logo_white.png');
const MicIcon = require('./../assets/mic.png');


const SvgPhone = () => <Svg width={20} height={20} viewBox="0 0 20 20"><Path d="M3.68095 1.00063C3.93894 1.05643 4.18708 1.13536 4.3936 1.3094C4.42283 1.33381 4.45333 1.35695 4.48002 1.3839C5.06526 1.96688 5.65273 2.54765 6.23353 3.13476C6.66531 3.57096 6.74188 4.17043 6.43655 4.66909C6.30515 4.8894 6.10021 5.05652 5.85766 5.14112C5.49895 5.27014 5.22222 5.48983 5.06717 5.84552C4.96591 6.07589 4.94816 6.33423 5.01697 6.57623C5.1914 7.22959 5.55138 7.77739 5.9892 8.27985C6.51408 8.88217 7.11457 9.3932 7.8377 9.74666C8.13922 9.89407 8.45059 10.0231 8.79913 9.9746C9.26014 9.91119 9.61186 9.68675 9.79328 9.24769C9.91211 8.95952 10.0564 8.70116 10.3366 8.53758C10.7922 8.27129 11.3666 8.30585 11.7568 8.66058C12.1139 8.9852 12.4485 9.33423 12.79 9.67502C13.1017 9.98632 13.4255 10.2881 13.7143 10.6184C14.0803 11.035 14.0908 11.6871 13.768 12.1382C13.7015 12.2309 13.6278 12.3183 13.5475 12.3994C13.205 12.7456 12.8513 13.0813 12.5162 13.4345C12.1584 13.8114 11.7168 13.9759 11.2106 13.9972C10.6705 14.0203 10.1498 13.8998 9.64204 13.7283C8.64154 13.3907 7.73889 12.8661 6.88454 12.2564C5.47521 11.2502 4.21963 10.0452 3.15703 8.67929C2.36971 7.67056 1.69551 6.59398 1.27898 5.37476C1.09787 4.84408 0.97555 4.30104 1.00415 3.73391C1.02925 3.23715 1.19192 2.80475 1.5627 2.45508C1.87407 2.16185 2.17622 1.85847 2.47138 1.54906C2.7316 1.27675 3.01151 1.05136 3.40104 1L3.68095 1.00063Z" stroke="#7580AC" stroke-miterlimit="10" /></Svg>
const SvgPwd = () => <SvgXml xml={pwd}/>
const SvgPwdOn = () => <SvgXml xml={pwd_on}/>
const SvgPwdOff = () => <SvgXml xml={pwd_off}/>
const SvgUser = () => <SvgXml xml={user}/>
const SvgCity = () => <SvgXml xml={city}/>
const SvgMaleOff = () => <SvgXml xml={male}/>
const SvgMaleOn = () => <SvgXml xml={male_on}/>
const SvgFemaleOff = () => <SvgXml xml={female}/>
const SvgFemaleOn = () => <SvgXml xml={female_on}/>
const SvgOtherOff = () => <SvgXml xml={other}/>
const SvgOtherOn = () => <SvgXml xml={other_on}/>
const SvgHelp = () => <SvgXml xml={help}/>
const SvgPlay = () => <SvgXml xml={play}/>
const SvgDrawerIcon = () => <SvgXml xml={drawer_icon}/>
const SvgDrawerProfileIcon = () => <SvgXml xml={drawer_profile_icon}/>
const SvgBackIcon = () => <SvgXml xml={back}/>

export {
    Logo,
    Logo01,
    LogoWhite,
    MicIcon,
    SvgPhone,
    SvgPwd,
    SvgPwdOn,
    SvgPwdOff,
    SvgUser,
    SvgCity,
    SvgMaleOff,
    SvgMaleOn,
    SvgFemaleOff,
    SvgFemaleOn,
    SvgOtherOff,
    SvgOtherOn,
    SvgHelp,
    SvgPlay,
    SvgDrawerIcon,
    SvgDrawerProfileIcon,
    SvgBackIcon,
}