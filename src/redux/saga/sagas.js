import { takeEvery, put, select, debounce } from 'redux-saga/effects';
import numberValidator from '../../Logic/numberValidator'
import * as CONSTANTS from '../../constants/_constants';
import * as actionTypes from '../actionTypes';
import axios from 'axios';

function* bid() {
  yield put({ type: actionTypes.IS_REFRESHING, payload: true });


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
  const isInvoice = (inputType === "invoiceId" || inputType === "invoiceAmount") ? true : false;
  const isInputNumberValid = numberValidator(inputNumber);
  const event = isInputNumberValid ? {[inputType]: inputNumber.replace(',', '.')} : {};
  const newCalculations = { ...stateCalculations, ...event }
  
  if(inputNumber === '') {
    yield put({
      type: actionTypes.UPDATE_CALCULATIONS,
      payload: {
        ...stateCalculations, ...{invoiceAmount: '', withdrawAmount: ''}
      }
    })
    yield put({ type: actionTypes.IS_CALCULATING, payload: false });
    return;

  } else if (+inputNumber === 0 && inputNumber.length <= CONSTANTS.MAX_DECIMALS) {
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
  const [base, amount, newCalculations] = action.payload;

  yield put({ type: actionTypes.IS_REFRESHING, payload: true });

  if (+amount === 0) {
    yield put({ type: actionTypes.IS_CALCULATING, payload: false });
    yield put({ type: actionTypes.IS_REFRESHING, payload: false });
    return
  }

  const isInvoice = base === "invoice" ? true : false;

  const newRate = yield axios
    .get(CONSTANTS.PAY_METHODS_CALCULATE_URI + new URLSearchParams({
      base,
      amount: +amount,
      invoicePayMethod: newCalculations.invoiceId,
      withdrawPayMethod: newCalculations.withdrawId,
    }))
    .then(res => res.data.amount)
    .catch(e => {
      console.log(e)
      return;
    }
  );

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

  const payload = yield axios
    .get(CONSTANTS.PAY_METHODS_URI)
    .then(res => res)
    .catch(e => {
    console.log(e);
    return;
  });

  yield put({ type: actionTypes.UPDATE_WITHDRAWALS_LIST, payload: [ ...payload.data.withdraw ] });
  yield put({ type: actionTypes.UPDATE_INVOICES_LIST, payload: [ ...payload.data.invoice ] });
  yield put({ type: actionTypes.IS_REFRESHING, payload: false });
}

export default function* sagaWatcher() {
  // eslint-disable-next-line no-unused-vars
  const action = yield debounce(CONSTANTS.DEBOUNCE_TIMER, actionTypes.RATE_REFRESH, rateRefresh);
  // eslint-disable-next-line no-unused-vars
  const actionCalculate = yield takeEvery(actionTypes.CALCULATE, calculate)
  // eslint-disable-next-line no-unused-vars
  const actionBid = yield takeEvery(actionTypes.BID, bid)
  yield takeEvery(actionTypes.UPDATE_PAYMENTS_LIST, updatePaymentsLists)
  yield takeEvery(actionTypes.UPDATE_CALCULATIONS, isEmptyAmounts)
  yield takeEvery(actionTypes.CALCULATE, isEmptyAmounts)
}