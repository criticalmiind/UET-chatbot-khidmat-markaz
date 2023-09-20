import React from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { mapDispatchToProps, mapStateToProps } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { theme } from '../constants/theme';
import { hp, wp } from '../utils';
import { call_application_manager, method } from '../api';
import Loader from './Loader';
import { translate } from '../i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from './Input';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      "loader": false,
      "hasError": false,
      "error": '',
      "errorInfo": {}
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary Error:', error);
    console.error('ErrorBoundary Error Info:', errorInfo);
    this.setState({ "hasError": true, "error": error, "errorInfo": errorInfo });
    this.save_logs(error, errorInfo)
  }

  async save_logs(error, errorInfo) {
    const { sessionId, userName } = this.props.userData
    let obj = {
      'function': method['mobileLog'],
      'sessionId': sessionId,
      'phoneNumber': userName,
      'dateTime': new Date(),
      'log': `${error} \n\n ${JSON.stringify(errorInfo)}`
    }
    let res = await call_application_manager(obj)
    if (res.resultFlag) {
      alert(`Error Saved: ${error} \n\n ${JSON.stringify(errorInfo)}`)
    } else {
      alert(`Error Not Saved: ${error} \n\n ${JSON.stringify(errorInfo)}`)
    }
  }

  render() {
    const { loader, hasError, error, errorInfo } = this.state;

    if (!hasError) return this.props.children

    return (<>
      <Loader isShow={loader} />
      <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
        <View style={styles.safeArea}>
          <View style={styles.header}>
          </View>
          <View style={styles.mainView}>
            <View style={{ height: hp("3") }} />
            <Text style={styles.title}>{translate('e-service')} - {translate('Log')}</Text>
            <ScrollView>
              <View style={{ width: wp('90'), alignSelf: 'center' }}>
                <View style={{ height: hp("3") }} />
                <View style={{ height: hp("3") }} />
                <Input
                  viewStyle={{ height: undefined }}
                  textInputStyle={{ textAlign: 'left' }}
                  value={`Error: ${error}`} />
                <Input
                  disabled={true}
                  multiline={true}
                  viewStyle={{ height: undefined }}
                  textInputStyle={{ textAlign: 'left' }}
                  value={`Error Info: \n ${JSON.stringify(errorInfo)}`}
                />
                <View style={{ height: hp("3") }} />
              </View>
              <View style={{ height: hp("6") }} />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);

const styles = StyleSheet.create({
  safeArea: {
    flexDirection: 'column',
    backgroundColor: theme.tertiary,
    flex: 1
  },
  mainView: {
    backgroundColor: theme.tertiary,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    ...Platform.select({ "ios": {}, "android": { "marginTop": hp('2') } }),
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3')
  },
  headHelpBtn: {
    width: hp('4.5'),
    height: hp('4.5'),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txt01: {
    fontFamily: theme.font01,
    fontSize: 18,
    alignSelf: 'center',
    lineHeight: 20
  },
  title: {
    alignSelf: 'center',
    color: theme.designColor,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: theme.font01,
    fontSize: 28
  },
});