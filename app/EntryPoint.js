import React from 'react';
import { connect } from 'react-redux';
import { AuthNavContainer, MainNavContainer } from './navigators/screenStackNavigators';
import { mapDispatchToProps, mapStateToProps } from './redux/actions/userActions';
import { isObjEmpty } from './utils';

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state={}
    }
    
    UNSAFE_componentWillMount(){
    
    }
    
    render(){
        const { userData } = this.props;
        if(isObjEmpty(userData)) return <AuthNavContainer />
        else return <MainNavContainer/>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);