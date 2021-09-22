import * as actionTypes from './actionTypes';


export const updateCalculations = (calculations) => {
  return {
    type: actionTypes.UPDATE_CALCULATIONS,
    payload: {
      ...calculations
    }
  }
};

export const updateWithdrawalsList = () => {
  return { type: actionTypes.UPDATE_WITHDRAWALS_LIST }
}

export const updateInvoicesList = () => {
  return { type: actionTypes.UPDATE_INVOICES_LIST }
}