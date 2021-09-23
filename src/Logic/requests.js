
import * as CONSTANTS from '../constants/_constants';
// import * as actionTypes from '../redux/actionTypes';
import axios from 'axios';

export default async function tryBid(...params) {
  const [amount, base, invoicePayMethod, withdrawPayMethod] = params;

  return await axios.post(CONSTANTS.BID_URI + new URLSearchParams({
      amount,
      base,
      invoicePayMethod,
      withdrawPayMethod
    }), { headers: { 'Content-Type': 'application/json' }});

}
