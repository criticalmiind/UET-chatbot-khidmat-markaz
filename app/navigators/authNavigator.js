import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import SelectLanguage from './../screens/preLogin/selectLanguage';

const  Auth = createStackNavigator({
    // SelectLanguage: { screen:SelectLanguage, navigationOptions: { headerShown:false } },
});
const AuthNavigator = createAppContainer(Auth);

export default AuthNavigator;