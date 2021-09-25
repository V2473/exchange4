import * as actionTypes from './actionTypes';
import { combineReducers } from "redux";
import * as Types from '../types/types';

const usersList = (state: Types.User[] = [], action: Types.ActionPayload<typeof actionTypes.UPDATE_USERS_LIST, Types.User[]>)  => {
  switch(action.type) {
    case actionTypes.UPDATE_USERS_LIST:
      return action.payload;
    default: return state;
  }
}

interface AppState {
  usersList: Types.User[] | undefined | [];
}

const rootReducer = combineReducers<AppState>({
  usersList
});

export default rootReducer;