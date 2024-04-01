import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Start from './../screens/Start';
import LetsBegin from './../screens/LetsBegin';

export const MainNav = createStackNavigator({
  Start: { screen: Start, navigationOptions: { headerShown: false } },
  LetsBegin: { screen: LetsBegin, navigationOptions: { headerShown: false } },
});


export const MainNavContainer = createAppContainer(MainNav)
