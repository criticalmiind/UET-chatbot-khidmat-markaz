import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LetsBegin from './../screens/LetsBegin';

export const MainNav = createStackNavigator({
  LetsBegin: { screen:LetsBegin, navigationOptions: { headerShown: false } },
});