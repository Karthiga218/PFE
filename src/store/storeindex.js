import DefaultReducer from './reducer/DefaultReducer';
import RHJobsReducer from './reducer/RHJobsReducer';
import PFEJobsReducer from './reducer/PFEJobsReducer';
import {createStore,combineReducers,applyMiddleware,compose} from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import createSagaMiddleware from 'redux-saga';


const persistConfig ={
    key:'root',
    storage:AsyncStorage
}

const middlewares = [];

if (__DEV__) {
  middlewares.push(createLogger());
}

// white list Or blacklist .['']
//migration ?
//expire (transform) need extra library
const RootReducer = combineReducers({DefaultReducer,RHJobsReducer,PFEJobsReducer})
const persistedReducer = persistReducer(persistConfig,RootReducer)
// const store = createStore(RootReducer);

// export default store;

export const store = createStore(persistedReducer,
    undefined,
    composeWithDevTools(applyMiddleware(...middlewares)),);
export const persistor = persistStore(store);