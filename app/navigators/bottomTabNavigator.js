import React from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import {
    MainNav,
    // NearByNav,
    // AppointmentNav,
    // ProfileNav,
} from "./screenStackNavigators";
import { StyleSheet } from "react-native";
import { hp } from "../utils";
import { theme } from "../constants/theme";

// const getTabBarIcon = (navigation, focused, tintColor) => {
//     const { routeName } = navigation.state;
//     if (routeName === "Discover") {
//         return <FontAwesomeIcon name="globe" size={hp('2')} color={focused ? theme.designColor : theme.quaternary} />
//     } else if (routeName === "Nearby") {
//         return <EntypoIcon name="location-pin" size={hp('2.2')} color={focused ? theme.designColor : theme.quaternary} />
//     } else if (routeName === "History") {
//         return <FontAwesomeIcon name="shopping-bag" size={hp('2')} color={focused ? theme.designColor : theme.quaternary} />
//     } else if (routeName === "Profile") {
//         return <FontAwesomeIcon name="user" size={hp('2')} color={focused ? theme.designColor : theme.quaternary} />
//     }
//     return <FontAwesomeIcon name="globe" size={24} color={theme.quaternary} />
// };

// const getLabel = (tab, tintColor) => {
//     let tabLabel = tab.state.routeName
//     return <Text style={styles.text01(tintColor)}>{i18n.t(simplify(tabLabel))}</Text>
// }

let Array = [
    "CompanyProfile",
    "LetsBegin",
    "Slider",
    "SelectLanguage",
    "Registration",
    "VerifyOtp",
    "BookAppointment",
    "SelectAddress",
    "BookingPayment",
    "BookingFinished",
    "AccountInformation",
    "SpecialOfferDetail",
    "ViewSpecialist",
    "InviteFriends",
    "AddNewAddress",
    "SelectOnMap",
    "ManageAddresses",
]

const BottomTab = createBottomTabNavigator(
    {
        Main: MainNav,
        // Nearby: NearByNav,
        // History: AppointmentNav,
        // Profile: ProfileNav,
    },
    {
        initialRouteName:'Main',
        defaultNavigationOptions: ({ navigation }) =>{
            return({
                // tabBarLabel:({ tintColor }) => getLabel(navigation, tintColor),
                // tabBarIcon: ({ focused, tintColor }) => getTabBarIcon(navigation, focused, tintColor),
                tabBarVisible: Array.indexOf(navigation.state.routes[navigation.state.index].routeName) > -1 ? false : true,
                tabBarOnLongPress:(()=>{return null}),
            })
        },
        tabBarOptions: {
            activeTintColor: theme.designColor,
            inactiveTintColor: "gray",
            style:{
                flexDirection:'row',
                height:hp('5.5','5.5','6')
            },
            tabStyle:{
                flexDirection:'column'
            }
        }
    }
);

const BottomTabNavigator = createAppContainer(BottomTab)

export default BottomTabNavigator;

const styles = StyleSheet.create({
    text01:(tintColor)=>{
        return{
            color:tintColor,
            textAlign:'center',
            fontFamily:theme.font03,
            fontSize:12
        }
    }
})