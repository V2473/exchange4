import * as actionTypes from './actionTypes';

export const updateCalculations = (calculations) => {
  return { type: actionTypes.UPDATE_CALCULATIONS, payload: { ...calculations } }
}

export const isEmptyAmounts = (bool) => {
  return { type: actionTypes.IS_EMPTY_AMOUNTS, payload: bool };
}

export const isCalculating = (bool) => {
  return { type: actionTypes.IS_CALCULATING, payload: bool };
}

export const isRefreshing = (bool) => {
  return { type: actionTypes.IS_REFRESHING, payload: bool };
}

export const bid = (...bid) => {
  return { type: actionTypes.BID, payload: [ ...bid ] }
}

export const calculate = (e) => {
  return { type: actionTypes.CALCULATE, payload: e }
}

export const updatePaymentsList = () => {
  return { type: actionTypes.UPDATE_PAYMENTS_LIST }
}

export const isBidSuccess = (e) => {
  return { type: actionTypes.IS_BID_SUCCESS , payload: e }
}