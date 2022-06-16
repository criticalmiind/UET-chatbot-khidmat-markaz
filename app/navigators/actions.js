import { StackActions, NavigationActions } from 'react-navigation';

export async function resetStack(obj){
    const resetAction = await StackActions.reset({
        ...obj.index ? {index:obj.index} : {index:0},
        // actions: [NavigationActions.navigate({ routeName: 'Profile' })],
        actions: obj.routes ? obj.routes.map((route, i)=>{ return NavigationActions.navigate({ routeName:route, params:{ ...obj.params ? obj.params[i] : {} } }) }) : [],
    });
    this.props.navigation.dispatch(resetAction);
}