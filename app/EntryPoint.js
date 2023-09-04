import React from 'react';
import { connect } from 'react-redux';
import { AuthNavContainer, MainNavContainer } from './navigators/screenStackNavigators';
import { mapDispatchToProps, mapStateToProps } from './redux/actions/userActions';
import { isObjEmpty } from './utils';
import { call_application_manager, method } from './api';

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    UNSAFE_componentWillMount() {
        this.getCitiesList()
    }

    async getCitiesList() {
        const { cityList, districtList, tehsilList } = this.props
        if (cityList.length < 1 || districtList.length < 1 || tehsilList.length < 1) {
            let obj = { 'function': method['getLocation'] }
            let res = await call_application_manager(obj)
            if (res.resultFlag) {
                const districts = res.districtList.map((d) => ({ "id": d[0], "name": d[1] }))
                const tehsils = res.tehsilList.map((d) => ({ "id": d[0], "districtId": d[1], "name": d[2] }))
                const cities = res.cityList.map((d) => ({ "id": d[0], "tehsilId": d[1], "name": d[2] }))
                this.props.updateRedux({
                    "districtList": districts,
                    "cityList": cities,
                    "tehsilList": tehsils,
                })
            }
        }
    }

    render() {
        const { userData } = this.props;
        if (isObjEmpty(userData)) return <AuthNavContainer />
        else return <MainNavContainer />
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);