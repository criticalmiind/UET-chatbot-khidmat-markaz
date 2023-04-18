import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import configureStore from "./app/redux/store/index";
const { persistor, store } = configureStore();
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import EntryPoint from "./app/EntryPoint";
import { LogBox, Text, View } from "react-native";
import CodePush from "react-native-code-push";

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
      const a = await CodePush.sync({
        updateDialog: true,
        installMode: CodePush.InstallMode.IMMEDIATE
      });
      if (a === 1) {
        CodePush.restartApp();
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


export default gestureHandlerRootHOC(App)