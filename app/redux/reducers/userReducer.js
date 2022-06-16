import createReducer from '../library/createReducer';
import * as types from '../actions/types';
import { initialState } from './initialState';

export const userReducer = createReducer(initialState, {
  [types.update_redux](state, action){
    return{
      ...state,
      ...action.payload ? action.payload : {}
    }
  }
});