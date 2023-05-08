import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Login from './../screens/Login';
import Register from './../screens/Register';
import Start from './../screens/Start';
import LetsBegin from './../screens/LetsBegin';
import DeleteAccount from "../screens/DeleteAccount";
import ForgotPassword from "../screens/ForgotPassword";
import VideoTutorial from "../screens/VideoTutorial";
import Profile from "../screens/Profile";
import Help from "../screens/Help";
import CommonQuestions from "../screens/CommonQuestions";

export const MainNav = createStackNavigator({
  Start: { screen: Start, navigationOptions: { headerShown: false } },
  LetsBegin: { screen: LetsBegin, navigationOptions: { headerShown: false } },
  DeleteAccount: { screen: DeleteAccount, navigationOptions: { headerShown: false } },
  Profile: { screen: Profile, navigationOptions: { headerShown: false } },
  Help: { screen: Help, navigationOptions: { headerShown: false } },
  CommonQuestions: { screen: CommonQuestions, navigationOptions: { headerShown: false } },
});

export const AuthNav = createStackNavigator({
  Login: { screen: Login, navigationOptions: { headerShown: false } },
  Register: { screen: Register, navigationOptions: { headerShown: false } },
  ForgotPassword: { screen: ForgotPassword, navigationOptions: { headerShown: false } },
  VideoTutorial: { screen: VideoTutorial, navigationOptions: { headerShown: false } },
});

export const MainNavContainer = createAppContainer(MainNav)
export const AuthNavContainer = createAppContainer(AuthNav)
