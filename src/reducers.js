import { combineReducers } from "redux";
import * as actionTypes from './actionTypes';


let calculations = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_CALCULATIONS:
      return {
          ...state,
          ...action.payload,
        }
    default: return state;
  }
};

let paymentsLists = (state = {
  invoicesList: [],
  withdrawalsList: []
}
  , action) => {
    console.log('PL - ', action);
    switch (action.type) {
      case actionTypes.UPDATE_INVOICES_LIST:
        return { ...state, invoicesList: [ ...action.payload ]};
      
      case actionTypes.UPDATE_WITHDRAWALS_LIST:
        return { ...state, withdrawalsList: [ ...action.payload ]};

      default: return state
    }
}

const rootReducer = combineReducers({
  calculations,
  paymentsLists,
});

export default rootReducer;