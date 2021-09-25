import * as actionTypes from './actionTypes';
import * as Types from '../types/types';

export const requestUsersList = (): Types.Action<typeof actionTypes.REQUEST_USERS_LIST> => {
  return { type: actionTypes.REQUEST_USERS_LIST }
}

export const deleteUser = (id: Types.User['id']): Types.ActionPayload<typeof actionTypes.DELETE_USER, Types.User['id']> => {
  return { type: actionTypes.DELETE_USER, payload: id }
}

export const editUser = (user: Types.User): Types.ActionPayload<typeof actionTypes.EDIT_USER, Types.User> => {
  return { type: actionTypes.EDIT_USER, payload: user }
}

export const createUser = (user: Types.User): Types.ActionPayload<typeof actionTypes.CREATE_USER, Types.User> => {
  return { type: actionTypes.CREATE_USER, payload: user }
}
