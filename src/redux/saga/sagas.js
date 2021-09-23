import { takeEvery, put, select, debounce } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes';
import axios from 'axios';
import * as CONSTANTS from '../../constants/_constants';
import numberValidator from '../../Logic/numberValidator'

function* bid(action) {
  console.log("bid start", action.payload)
  yield put({ type: actionTypes.IS_REFRESHING, payload: true });
  let [amount, base, invoicePayMethod, withdrawPayMethod] = action.payload;
  console.log("bid start3")
  const payload = yield axios.post(CONSTANTS.BID + new URLSearchParams({
    amount,
    base,
    invoicePayMethod,
    withdrawPayMethod
  }), { headers: { 'Content-Type': 'application/json' }}).then(res => {
    console.log(res)
  }).catch(e => {
    console.log(e)
    return;
  });
  console.log(payload)
  yield put({ type: actionTypes.IS_REFRESHING, payload: false });
}

function* isEmptyAmounts() {
  const calculations = yield select((state) => state.calculations);

  if (
    +calculations.invoiceAmount === 0 ||
    calculations.invoiceAmount === '' ||
    +calculations.withdrawAmount === 0 ||
    calculations.withdrawAmount === ''
    ) {
      yield put({ type: actionTypes.IS_EMPTY_AMOUNTS, payload: true })
    } else {
      yield put({ type: actionTypes.IS_EMPTY_AMOUNTS, payload: false })
    }
}

function* calculate(action) {
  const e = action.payload;
  e.preventDefault();
  yield put({ type: actionTypes.IS_CALCULATING, payload: true });

  const inputNumber = e.target.value;
  const inputType = e.target.name;
  const stateCalculations = yield select((state) => state.calculations);
  let isInvoice = (inputType === "invoiceId" || inputType === "invoiceAmount") ? true : false;
  let isInputNumberValid = numberValidator(inputNumber);
  let event = isInputNumberValid ? {[inputType]: inputNumber.replace(',', '.')} : {};
  let newCalculations = { ...stateCalculations, ...event }
  
  if(inputNumber === '') {
    yield put({
      type: actionTypes.UPDATE_CALCULATIONS,
      payload: {
        ...stateCalculations, ...{invoiceAmount: '', withdrawAmount: ''}
      }
    })
    yield put({ type: actionTypes.IS_CALCULATING, payload: false });
    return;
  } else if (+inputNumber === 0) {
    yield put({
      type: actionTypes.UPDATE_CALCULATIONS,
      payload: {
        ...stateCalculations,
        ...{invoiceAmount: inputNumber, withdrawAmount: inputNumber}
      }
    })
    yield put({type: actionTypes.IS_CALCULATING, payload: false });
    return;
  } else if (!isInputNumberValid || JSON.stringify(stateCalculations) === JSON.stringify(newCalculations)) {
    yield put({type: actionTypes.IS_CALCULATING, payload: false });
    return;
  }

  yield put({ type: actionTypes.UPDATE_CALCULATIONS, payload: { ...newCalculations } })

  yield put({ type: actionTypes.IS_REFRESHING, payload: true });
  yield put({ type: actionTypes.RATE_REFRESH, payload: [ 
    isInvoice ? 'invoice' : 'withdraw',
    isInvoice ? newCalculations.invoiceAmount : newCalculations.withdrawAmount,
    newCalculations
  ] })
}

function* rateRefresh(action) {
  let [base, amount, newCalculations] = action.payload;
  yield put({ type: actionTypes.IS_REFRESHING, payload: true });

  if (+amount === 0) {
    yield put({ type: actionTypes.IS_CALCULATING, payload: false });
    yield put({ type: actionTypes.IS_REFRESHING, payload: false });
    return
  }

  let isInvoice = base === "invoice" ? true : false;

  let newRate = yield axios.get(CONSTANTS.PAY_METHODS_CALCULATE + new URLSearchParams({
    base,
    amount: +amount,
    invoicePayMethod: newCalculations.invoiceId,
    withdrawPayMethod: newCalculations.withdrawId,
  })).then(res => res.data.amount).catch(e => {
    console.log(e)
    return;
  });

  isInvoice ? newCalculations.withdrawAmount = newRate : newCalculations.invoiceAmount = newRate;
  const stateCalculations = yield select((state) => state.calculations);
  isInvoice ? newCalculations.invoiceAmount = stateCalculations.invoiceAmount : newCalculations.withdrawAmount = stateCalculations.withdrawAmount;
    if (isInvoice && (stateCalculations.invoiceAmount === '' || +stateCalculations.invoiceAmount === 0)) {
      newCalculations.withdrawAmount = stateCalculations.invoiceAmount;
    } else if (!isInvoice && (stateCalculations.withdrawAmount === ''|| +stateCalculations.withdrawAmount === 0)) {
      newCalculations.invoiceAmount = stateCalculations.withdrawAmount ;
    }

  yield put({ type: actionTypes.UPDATE_CALCULATIONS, payload: { ...newCalculations }})
  yield put({ type: actionTypes.IS_CALCULATING, payload: false });
  yield put({ type: actionTypes.IS_REFRESHING, payload: false });
}

function* updatePaymentsLists() {
  yield put({ type: actionTypes.IS_REFRESHING, payload: true });
  const payload = yield axios.get(CONSTANTS.PAY_METHODS).then(res => res).catch(e => {
    console.log(e);
    return;
  });
  yield put({ type: actionTypes.UPDATE_INVOICES_LIST, payload: [ ...payload.data.invoice ] });
  yield put({ type: actionTypes.UPDATE_WITHDRAWALS_LIST, payload: [ ...payload.data.withdraw ] });
  yield put({ type: actionTypes.IS_REFRESHING, payload: false });
}

export default function* sagaWatcher() {
  yield takeEvery(actionTypes.UPDATE_PAYMENTS_LIST, updatePaymentsLists)
  // eslint-disable-next-line no-unused-vars
  const action = yield debounce(CONSTANTS.DEBOUNCE_TIMER, actionTypes.RATE_REFRESH, rateRefresh);
  // eslint-disable-next-line no-unused-vars
  const actionCalculate = yield takeEvery(actionTypes.CALCULATE, calculate)
  yield takeEvery(actionTypes.UPDATE_CALCULATIONS, isEmptyAmounts)
  yield takeEvery(actionTypes.CALCULATE, isEmptyAmounts)
  // eslint-disable-next-line no-unused-vars
  const actionBid = yield takeEvery(actionTypes.BID, bid)
}