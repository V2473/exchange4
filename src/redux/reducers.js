import * as actionTypes from './actionTypes';
import { combineReducers } from "redux";

const isBidSuccess = (state = true, action)  => {
  switch(action.type) {
    case actionTypes.IS_BID_SUCCESS:
      return action.payload;
    default: return state;
  }
}

const isEmptyAmounts = (state = true, action) => {
  switch(action.type) {
    case actionTypes.IS_EMPTY_AMOUNTS:
      return action.payload;
    default: return state;
  }
}
const isRefreshing = (state = false, action) => {
  switch(action.type) {
    case actionTypes.IS_REFRESHING:
      return action.payload;
    default: return state;
  }
}

const isCalculating = (state = false, action) => {
  switch(action.type) {
    case actionTypes.IS_CALCULATING:
      return action.payload;
    default: return state;
  }
}

const calculations = (state = {
  invoiceId: '6',
  invoiceAmount: '',
  withdrawId: '4',
  withdrawAmount: '',
}, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_CALCULATIONS:
      return {
          ...state,
          ...action.payload,
        }
    default: return state;
  }
};

const paymentsLists = (state = {
  invoicesList: [],
  withdrawalsList: []
}
  , action) => {
    switch (action.type) {
      case actionTypes.UPDATE_INVOICES_LIST:
        return { ...state, invoicesList:  action.payload };
      
      case actionTypes.UPDATE_WITHDRAWALS_LIST:
        return { ...state, withdrawalsList: action.payload };

      default: return state
    }
}

const rootReducer = combineReducers({
  calculations,
  paymentsLists,
  isRefreshing,
  isCalculating,
  isEmptyAmounts,
  isBidSuccess,
});

export default rootReducer;