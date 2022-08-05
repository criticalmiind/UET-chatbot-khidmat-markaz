import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import configureStore from "./app/redux/store/index";
const { persistor, store } = configureStore();
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import EntryPoint from "./app/EntryPoint";
import { LogBox } from "react-native";

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  async UNSAFE_componentWillMount(){
    this._isMounted = true;
    if(this._isMounted){
      LogBox.ignoreAllLogs(true)
    }
  }

  setStateObj(obj){
    if(this._isMounted){ this.setState({ ...this.state, ...obj }) }
  }

  render() {
    return (<>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          { <EntryPoint /> }
        </PersistGate>
      </Provider>
    </>);
  }
}


export default gestureHandlerRootHOC(App)