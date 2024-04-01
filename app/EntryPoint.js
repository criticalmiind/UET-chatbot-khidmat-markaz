import React from 'react';
import { connect } from 'react-redux';
import { MainNavContainer } from './navigators/screenStackNavigators';
import { mapDispatchToProps, mapStateToProps } from './redux/actions/userActions';

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    UNSAFE_componentWillMount() {
    }

    render() {
        return <MainNavContainer />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);