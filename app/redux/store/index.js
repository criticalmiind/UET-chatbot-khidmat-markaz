import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native'

import rootReducer from '../reducers/index' 

const config = {
    key: 'root',
    storage: AsyncStorage,
    // blacklist: ['loadingReducer'],
    debug: true, //to get useful logging
};

const reducers = persistCombineReducers(config, rootReducer);
const store = createStore(reducers);
const persistor = persistStore(store);

const configureStore = () => {
    return { persistor, store };
  };

export default configureStore;