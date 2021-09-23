import * as actionTypes from './actionTypes';

export const isRefreshing = (bool) => {
  return { type: actionTypes.IS_REFRESHING, payload: bool };
}

export const isCalculating = (bool) => {
  return { type: actionTypes.IS_CALCULATING, payload: bool };
}

export const isEmptyAmounts = (bool) => {
  return { type: actionTypes.IS_EMPTY_AMOUNTS, payload: bool };
}

export const updateCalculations = (calculations) => {
  return { type: actionTypes.UPDATE_CALCULATIONS, payload: { ...calculations } }
};

export const calculate = (e) => {
  return { type: actionTypes.CALCULATE, payload: e }
}

export const updatePaymentsList = () => {
  return { type: actionTypes.UPDATE_PAYMENTS_LIST }
}

export const bid = (...bid) => {
  return { type: actionTypes.BID, payload: [ ...bid ] }
}