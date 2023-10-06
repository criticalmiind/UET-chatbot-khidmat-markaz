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
                const districts = res.divisionList.map((d) => ({ "id": d[0], "eng_name": d[1], "name": d[2] }))
                const tehsils = res.districtList.map((d) => ({ "id": d[0], "districtId": d[1], "eng_name": d[2], "name": d[3] }))
                const cities = res.tehsilList.map((d) => ({ "id": d[0], "districtId": d[1], "tehsilId": d[2], "eng_name": d[3], "name": d[4] }))
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