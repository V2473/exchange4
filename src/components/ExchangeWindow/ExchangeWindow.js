
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounceCallback } from '@react-hook/debounce';
import { useState, useEffect, useRef } from "react";
import { Paper, Button } from '@material-ui/core';
import * as actions from "../../actions";
import * as CONSTANTS from '../../_constants';
import './ExchangeWindow.scss';
import axios from 'axios';

 
function ExchangeWindow () {
  // const [invoicesList, setInvoicesList] = useState([]);
  // const [withdrawalsList, setWithdrawalsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);  
  const refCalculations = useRef();
  const page = useHistory();
  const reduxCalculations = useSelector(state => state.calculations);
  const reduxInvoicesList = useSelector(state => state.paymentsLists.invoicesList);
  const reduxWithdrawalsList = useSelector(state => state.paymentsLists.withdrawalsList);
  const dispatch =  useDispatch();
  const setReduxCalculations = (a) => dispatch(actions.updateCalculations(a));
  


  refCalculations.current = reduxCalculations;
  const [lastValidCalculations, setLastValidCalculations] = useState({ ...reduxCalculations });
  


  useEffect(() => {
    // setRefreshing(true);
    dispatch(actions.updateInvoicesList());
    // setRefreshing(false);
    

    // axios.get(CONSTANTS.PAY_METHODS)
    //   .then(res => {
    //     setPaymentsLists([ ...res.data.invoice ], [ ...res.data.withdraw ]);
        
    //     
    //   }
    // );

    setReduxCalculations({
      invoiceId: '6',
      invoiceAmount: '',
      withdrawId: '4',
      withdrawAmount: '',
    })

    console.log(reduxCalculations);
  }, []) 

  const numberValidator = (num) => {
    if (num === '') {
      return num;
    }
    
    return new RegExp(`^[0-9]{0,` + CONSTANTS.MAX_INTEGERS + `}([,.][0-9]{0,` + CONSTANTS.MAX_DECIMALS + `})?$`).test(num) ? num.replace(',', '.') : false;
  }

  const calculate = (e) => {
    e.preventDefault();
    
    let event = numberValidator(e.target.value) !== false ? {[e.target.name]: numberValidator(e.target.value)} : {} ;
    let newCalculations;

    if(e.target.value === '') {
      newCalculations = {...reduxCalculations, ...{invoiceAmount: '', withdrawAmount: ''}};
      setReduxCalculations({ ...newCalculations });
      if (JSON.stringify(lastValidCalculations) === JSON.stringify(newCalculations)) {
        debounceRateRefresh('stop');
      }
      return;
    } else if (!numberValidator(e.target.value)) {
      if (JSON.stringify(lastValidCalculations) === JSON.stringify(newCalculations)) {
        debounceRateRefresh('stop');
      }
      return;
    } else if (+e.target.value === 0) {
      newCalculations = {...reduxCalculations, ...{invoiceAmount: e.target.value, withdrawAmount: e.target.value}};
      setReduxCalculations({ ...newCalculations });
      debounceRateRefresh('stop');
      return;
    }

    newCalculations = {...reduxCalculations, ...event};

    setReduxCalculations({ ...newCalculations });
    let isInvoice = (e.target.name === "invoiceId" || e.target.name === "invoiceAmount") ? true : false;

    if (JSON.stringify(lastValidCalculations) === JSON.stringify(newCalculations)) {
      return;
    }

    setLastValidCalculations({ ...newCalculations });

    debounceRateRefresh(
      true,
      isInvoice ? 'invoice' : 'withdraw',
      isInvoice ? newCalculations.invoiceAmount : newCalculations.withdrawAmount,
      newCalculations.invoiceId,
      newCalculations.withdrawId,
      newCalculations
    )
    
  }

  const rateRefresh = (stop, base, amount, invoicePayMethod, withdrawPayMethod, newCalculations) => {
    if (stop === 'stop' || (+amount * 1) === 0 || amount === '.') {
      return;
    }
    let newRate;
    let isInvoice = base === "invoice" ? true : false;
    axios.get(CONSTANTS.PAY_METHODS + '/calculate?' + new URLSearchParams({
      base,
      amount,
      invoicePayMethod,
      withdrawPayMethod,
    })).then(res => {
      newRate = res.data.amount;
      isInvoice ? newCalculations.withdrawAmount = newRate : newCalculations.invoiceAmount = newRate;
      isInvoice ? newCalculations.invoiceAmount = refCalculations.current.invoiceAmount : newCalculations.withdrawAmount = refCalculations.current.withdrawAmount;
      if (isInvoice && refCalculations.current.invoiceAmount === '') {
        newCalculations.withdrawAmount = '';
      } else if (!isInvoice && refCalculations.current.withdrawAmount === '') {
        newCalculations.invoiceAmount = '';
      }
      setReduxCalculations({ ...newCalculations });
    });
  }

  const debounceRateRefresh = useDebounceCallback((...args) => rateRefresh(...args), CONSTANTS.DEBOUNCE_TIMER);
  
  return (
    <Paper elevation={5}>
      <div className={'tradeWindow'}>
        <h1>Sell</h1>
        
        <form onSubmit={() => page.push('/confirmation')}>
          <select
            name="invoiceId"
            onChange={calculate}
            value={reduxCalculations.invoiceId}
            disabled={refreshing ? 'disabled' : false}
          >
            {reduxInvoicesList.map(invoice => (
              <option value={invoice.id} key={invoice.id}>{invoice.name}</option>
            ))}
          </select>
          <br />
          <input
            type="text"
            name="invoiceAmount"
            onInput={calculate}
            value={reduxCalculations.invoiceAmount}
            placeholder="0"
            disabled={refreshing ? 'disabled' : false}
          />
        </form>
        
      </div>
      <div className={'tradeWindow'}>
        <h1>Buy</h1>
        
        <form onSubmit={() => page.push('/confirmation')}> 
          <select
            name="withdrawId"
            onChange={calculate}
            value={reduxCalculations.withdrawId}
            disabled={refreshing ? 'disabled' : false}
          >
            {reduxWithdrawalsList.map(withdraw => (
              <option value={withdraw.id} key={withdraw.id}>{withdraw.name}</option>
            ))}
          </select>
          <br />
          <input
            type="text"
            name="withdrawAmount"
            onInput={calculate}
            value={reduxCalculations.withdrawAmount}
            placeholder="0"
            disabled={refreshing ? 'disabled' : false}
          />
        </form>
      </div>

      <div className={'buttonWrapper'}>
        <Button variant='contained' color='primary' disabled={false} onClick={() => page.push('/confirmation')}>
          Exchange
        </Button>
      </div>
    </Paper>
  );
}

export default ExchangeWindow;