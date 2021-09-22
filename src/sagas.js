import { takeEvery, put, select, debounce } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as CONSTANTS from './_constants';

function* calculate(action) {
  const e = action.payload;
  const numberValidator = (num) => {
    if (num === '') {
      return num;
    }
    
    return new RegExp(`^[0-9]{0,` + CONSTANTS.MAX_INTEGERS + `}([,.][0-9]{0,` + CONSTANTS.MAX_DECIMALS + `})?$`).test(num) ? num.replace(',', '.') : false;
  }

  e.preventDefault();
  
  let event = numberValidator(e.target.value) !== false ? {[e.target.name]: numberValidator(e.target.value)} : {} ;
  let newCalculations;

  const calculations = (state) => state.calculations;
  const reduxCalculations = yield select(calculations);

  if(e.target.value === '') {
    newCalculations = {...reduxCalculations, ...{invoiceAmount: '', withdrawAmount: ''}};
    yield put({
      type: actionTypes.UPDATE_CALCULATIONS,
      payload: {
        ...newCalculations
      }
    })
    if (JSON.stringify(reduxCalculations) === JSON.stringify(newCalculations)) {
      yield put({ type: actionTypes.DEBOUNCED_RATE_REFRESH, payload: [ 'stop' ] })
    }
    return;
  } else if (!numberValidator(e.target.value)) {
    if (JSON.stringify(reduxCalculations) === JSON.stringify(newCalculations)) {
      yield put({ type: actionTypes.DEBOUNCED_RATE_REFRESH, payload: [ 'stop' ] })
    }
    return;
  } else if (+e.target.value === 0) {
    newCalculations = {...reduxCalculations, ...{invoiceAmount: e.target.value, withdrawAmount: e.target.value}};
    yield put({
      type: actionTypes.UPDATE_CALCULATIONS,
      payload: {
        ...newCalculations
      }
    })
    yield put({ type: actionTypes.DEBOUNCED_RATE_REFRESH, payload: [ 'stop' ] })
    return;
  }

  newCalculations = {...reduxCalculations, ...event};

  
  let isInvoice = (e.target.name === "invoiceId" || e.target.name === "invoiceAmount") ? true : false;

  if (JSON.stringify(reduxCalculations) === JSON.stringify(newCalculations)) {
    return;
  }

  yield put({
    type: actionTypes.UPDATE_CALCULATIONS,
    payload: {
      ...newCalculations
    }
  })

  yield put({ type: actionTypes.DEBOUNCED_RATE_REFRESH, payload: [ 
    true,
    isInvoice ? 'invoice' : 'withdraw',
    isInvoice ? newCalculations.invoiceAmount : newCalculations.withdrawAmount,
    newCalculations.invoiceId,
    newCalculations.withdrawId,
    newCalculations
  ] })
}

function* rateRefresh(action) {
  let [stop, base, amount, invoicePayMethod, withdrawPayMethod, newCalculations] = action.payload;
  if (stop === 'stop' || (+amount * 1) === 0 || amount === '.') {
    return;
  }

  let newRate;
  let isInvoice = base === "invoice" ? true : false;

  yield axios.get(CONSTANTS.PAY_METHODS + '/calculate?' + new URLSearchParams({
    base,
    amount,
    invoicePayMethod,
    withdrawPayMethod,
  })).then(res => {
    newRate = res.data.amount;
  });

  isInvoice ? newCalculations.withdrawAmount = newRate : newCalculations.invoiceAmount = newRate;
  const calculations = (state) => state.calculations;
  const refCalculations = yield select(calculations);
  isInvoice ? newCalculations.invoiceAmount = refCalculations.invoiceAmount : newCalculations.withdrawAmount = refCalculations.withdrawAmount;
    if (isInvoice && refCalculations.invoiceAmount === '') {
      newCalculations.withdrawAmount = '';
    } else if (!isInvoice && refCalculations.withdrawAmount === '') {
      newCalculations.invoiceAmount = '';
    }

  yield put({
    type: actionTypes.UPDATE_CALCULATIONS,
    payload: {
      ...newCalculations
    }})
}

function* sagaPaymentsLists() {
  yield put({type: actionTypes.IS_REFRESHING, payload: true});
  const payload = yield axios.get(CONSTANTS.PAY_METHODS).then(res => res);
  yield put({type: actionTypes.UPDATE_INVOICES_LIST, payload: [ ...payload.data.invoice ]});
  yield put({type: actionTypes.UPDATE_WITHDRAWALS_LIST, payload: [ ...payload.data.withdraw ]});
  yield put({type: actionTypes.IS_REFRESHING, payload: false});
}

export default function* sagaWatcher() {
  yield takeEvery(actionTypes.UPDATE_PAYMENTS_LIST, sagaPaymentsLists)
  // eslint-disable-next-line no-unused-vars
  const action = yield debounce(CONSTANTS.DEBOUNCE_TIMER, actionTypes.DEBOUNCED_RATE_REFRESH, rateRefresh);
  // eslint-disable-next-line no-unused-vars
  const actionE = yield takeEvery(actionTypes.CALCULATE, calculate)
}