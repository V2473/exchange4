import * as CONSTANTS from '../constants/_constants'

export default function numberValidator(num) {
  if (num === '') {
    return num;
  }

  let isValid = new RegExp(`^[0-9]{0,` + CONSTANTS.MAX_INTEGERS + `}([,.][0-9]{0,` + CONSTANTS.MAX_DECIMALS + `})?$`).test(num);
  
  return isValid;
}