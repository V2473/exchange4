import { takeEvery, put, ForkEffect } from 'redux-saga/effects';
import * as requests from '../logic/requests'
import * as actionTypes from '../redux/actionTypes';
import * as Types from '../types/types'

function* requestUsersLists() {

  const payload: Types.User[] = yield requests.getUsersRequest();
  yield put({ type: actionTypes.UPDATE_USERS_LIST, payload: [...payload ]})
}

function* deleteUser(action: Types.ActionPayload<typeof actionTypes.DELETE_USER, Types.User['id']>) {
  yield requests.deleteUserRequest(action.payload)
  yield put({ type: actionTypes.REQUEST_USERS_LIST, })
}

function* editUser(action: Types.ActionPayload<typeof actionTypes.EDIT_USER, Types.User>) {
  yield requests.editUserRequest(action.payload)
  yield put({ type: actionTypes.REQUEST_USERS_LIST, })
}

function* createUser(action: Types.ActionPayload<typeof actionTypes.CREATE_USER, Types.User>) {
  yield requests.createUserRequest(action.payload)
  yield put({ type: actionTypes.REQUEST_USERS_LIST, })
}

export default function* sagaWatcher(): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery(actionTypes.REQUEST_USERS_LIST, requestUsersLists)
  yield takeEvery(actionTypes.DELETE_USER, deleteUser)
  yield takeEvery(actionTypes.EDIT_USER, editUser)
  yield takeEvery(actionTypes.CREATE_USER, createUser)
}