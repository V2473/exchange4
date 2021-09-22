import { takeEvery, put, call } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as CONSTANTS from './_constants';




function* sagaInvoicesList() {
  takeEvery(actionTypes.UPDATE_INVOICES_LIST)
  const payload = yield call(getLists());
  yield put({type: actionTypes.UPDATE_INVOICES_LIST, payload: [ ...payload.invoice ]});
}

function* sagaWithdrawalList() {
  takeEvery(actionTypes.UPDATE_INVOICES_LIST)
  const payload = yield call(getLists());
  yield put({type: actionTypes.UPDATE_WITHDRAWALS_LIST, payload: [ ...payload.withdraw ]});
}

async function getLists() {
  let json;
  axios.get(CONSTANTS.PAY_METHODS).then(res => {
    json = res.data;
    console.log(json)
    return json;
  })
}

export default function* rootSaga() {
  yield [
    sagaInvoicesList,
    sagaWithdrawalList,
  ]
}