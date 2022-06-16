import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
// import MainNav from './navigators/screenStackNavigators';
import { mapDispatchToProps, mapStateToProps } from './redux/actions/userActions';
import LetsBegin from './screens/LetsBegin';

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state={}
    }
    
    UNSAFE_componentWillMount(){
    }

    render(){
        return (<>
            <LetsBegin />
        </>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);