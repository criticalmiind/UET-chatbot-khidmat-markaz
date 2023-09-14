import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import configureStore from "./app/redux/store/index";
const { persistor, store } = configureStore();
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import EntryPoint from "./app/EntryPoint";
import { Alert, LogBox, Text, View } from "react-native";
import CodePush from "react-native-code-push";
import { call_application_manager, method } from "./app/api";

// console.log(store.getState().userReducer);

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      "loader": true
    }
  }

  async UNSAFE_componentWillMount() {
    this._isMounted = true;
    if (this._isMounted) {
      LogBox.ignoreAllLogs(true)
      await this.checkForUpdate();
    }
  }

  async checkForUpdate() {
    this.setState({ loader: true })
    try {
      const status = await CodePush.sync({
        updateDialog: true,
        installMode: CodePush.InstallMode.IMMEDIATE
      });
      switch (status) {
        case CodePush.SyncStatus.UPDATE_INSTALLED:
          Alert.alert('Success', 'Update installed.');
          CodePush.restartApp();
          break;
        case CodePush.SyncStatus.ERROR:
          Alert.alert('Error', 'Error while updating.');
          this.setState({ loader: false })
          break;
        default:
          console.log(`Update Sync status: ${status}`);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ loader: false })
  }

  setStateObj(obj) {
    if (this._isMounted) { this.setState({ ...this.state, ...obj }) }
  }

  render() {
    const { loader } = this.state
    const Update = () => {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Checking For Update!</Text>
        </View>
      )
    }
    return (<>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          {loader ? <Update /> : <EntryPoint />}
        </PersistGate>
      </Provider>
    </>);
  }
}

const logError = async (error) => {
  const { userData } = store.getState().userReducer
  // setTimeout(() => {
  //   alert(`Error Saved: ${error}`)
  // }, 2000)
  console.log(`Error Saved: ${error}`);

  let obj = {
    'function': method['mobileLog'],
    'sessionId': userData.sessionId,
    'phoneNumber': userData.userName,
    'dateTime': new Date(),
    'log': `${error}`
  }
  let res = await call_application_manager(obj)
  if (res.resultFlag) {
    alert(`Error Saved: ${error}`)
  } else {
    alert(`Error Not Saved: ${error}`)
  }
};

global.ErrorUtils.setGlobalHandler(logError);

export default gestureHandlerRootHOC(App)