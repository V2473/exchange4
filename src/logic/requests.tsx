import * as CONSTANTS from '../constants/_constants';
import axios from 'axios';
import * as types from '../types/types'

export async function getUsersRequest(){
  return await axios.get(CONSTANTS.GET_POST_USERS_URL).then(res  => res.data)
  .catch(err => console.log(err));
}

export async function createUserRequest(user : types.User) {
  return await axios.post(CONSTANTS.GET_POST_USERS_URL + '?' + new URLSearchParams({
    name: user.name,
    surname: user.surname,
    desc: user.desc 
  }))
  .then(res => res)
  .catch(err => console.log(err));
}

export async function editUserRequest(user : types.User) {
  return await axios.put(CONSTANTS.PUT_DELETE_USER_URL + user.id + '?' +  new URLSearchParams({
    name: user.name,
    surname: user.surname,
    desc: user.desc 
  }))
  .then(res => res)
  .catch(err => console.log(err));
}

export async function deleteUserRequest(id : types.User['id']) {
  return await axios.delete(CONSTANTS.PUT_DELETE_USER_URL + id)
  .then(res => res)
  .catch(err => console.log(err));
}