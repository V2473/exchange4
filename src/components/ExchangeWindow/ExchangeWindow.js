import { React, useState, useEffect, useRef } from "react";
import { Paper, Button } from '@material-ui/core';
import './ExchangeWindow.scss';
import axios from 'axios';
import CONSTANTS from '../../constants/constants';
import { useDebounceCallback } from '@react-hook/debounce'
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';


function ExchangeWindow () {
  const [invoice, setInvoices] = useState([]);
  const [withdraw, setWithdraw] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [calculations, setCalculations] = useState({
    invoiceId: '6',
    invoiceAmount: '',
    withdrawId: '4',
    withdrawAmount: '',
  });
  const refCalculations = useRef();
  const page = useHistory();

  refCalculations.current = calculations;


  useEffect(() => {
    setRefreshing(true);
    axios.get(CONSTANTS.payMethods)
      .then(res => {
        
        setInvoices(prev => ([...res.data.invoice]));
        setWithdraw(prev => ([...res.data.withdraw]));
        setRefreshing(false);
      }
    );
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const numberValidator = (num) => {
    if (num === '') {
      return num;
    } 
    return /^[0-9]{0,9}([,.][0-9]{0,8})?$/.test(num) ? num.replace(',', '.') : false;
  }

  const calculate = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    
    let event = numberValidator(e.target.value) !== false ? {[e.target.name]: numberValidator(e.target.value)} : {} ;
    let newCalculations;
    console.log(numberValidator(e.target.value), calculations[e.target.name])

    if(e.target.value === '') {
      newCalculations = {...calculations, ...{invoiceAmount: '', withdrawAmount: ''}};
      setCalculations({ ...newCalculations });
      dbRR(false);
      return;
    } else if (!numberValidator(e.target.value)) {
      dbRR(false);
      return;
    } else if (+e.target.value === 0) {
      console.log('zero')
      newCalculations = {...calculations, ...{invoiceAmount: e.target.value, withdrawAmount: e.target.value}};
      setCalculations({ ...newCalculations });
      dbRR(false);
      return;
    }

    newCalculations = {...calculations, ...event};

    setCalculations({ ...newCalculations });
    let isInvoice = (e.target.name === "invoiceId" || e.target.name === "invoiceAmount") ? true : false;
    console.log(isInvoice, e.target.name, newCalculations, calculations);

    dbRR(
      true,
      isInvoice ? 'invoice' : 'withdraw',
      isInvoice ? newCalculations.invoiceAmount : newCalculations.withdrawAmount,
      newCalculations.invoiceId,
      newCalculations.withdrawId,
      newCalculations
    );
  }

  const rateRefresh = (work, base, amount, invoicePayMethod, withdrawPayMethod, newCalculations) => {
    if (!work) {
      return;
    }
    let newRate = '';
    let isInvoice = base === "invoice" ? true : false;
    axios.get(CONSTANTS.payMethods + '/calculate?' + new URLSearchParams({
      base: base,
      amount: amount,
      invoicePayMethod: invoicePayMethod,
      withdrawPayMethod: withdrawPayMethod,
    })).then(res => {
      newRate = res.data.amount;
      isInvoice ? newCalculations.withdrawAmount = newRate : newCalculations.invoiceAmount = newRate;
      console.log(calculations.invoiceAmount);
      isInvoice ? newCalculations.invoiceAmount = refCalculations.current.invoiceAmount : newCalculations.withdrawAmount = refCalculations.current.withdrawAmount;
      if (isInvoice && refCalculations.current.invoiceAmount === '') {
        newCalculations.withdrawAmount = '';
      } else if (!isInvoice && refCalculations.current.withdrawAmount === '') {
        newCalculations.invoiceAmount = '';
      }

      setCalculations({ ...newCalculations });
    });
  }

  const dbRR = useDebounceCallback((...args) => rateRefresh(...args), 300);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('confirm');
    page.push('/confirmation')
    return;
  }
  

  return (
    <Paper elevation={5}>
      <div className={'tradeWindow'}>
        <h1>Sell</h1>
        
        <form onSubmit={submitHandler}>
          <select
            name="invoiceId"
            onChange={calculate}
            value={calculations.invoiceId}
            disabled={refreshing ? 'disabled' : false}
          >
            {invoice.map(invoice => (
              <option value={invoice.id} key={invoice.id}>{invoice.name}</option>
            ))}
          </select>
          <br />
          <input
            type="text"
            name="invoiceAmount"
            onInput={calculate}
            value={calculations.invoiceAmount}
            placeholder="0"
            disabled={refreshing ? 'disabled' : false}
          />
        </form>
        
      </div>
      <div className={'tradeWindow'}>
        <h1>Buy</h1>
        
        <form onSubmit={submitHandler}>
          <select
            name="withdrawId"
            onChange={calculate}
            value={calculations.withdrawId}
            disabled={refreshing ? 'disabled' : false}
          >
            {withdraw.map(withdraw => (
              <option value={withdraw.id} key={withdraw.id}>{withdraw.name}</option>
            ))}
          </select>
          <br />
          <input
            type="text"
            name="withdrawAmount"
            onInput={calculate}
            value={calculations.withdrawAmount}
            placeholder="0"
            disabled={refreshing ? 'disabled' : false}
          />
        </form>
      </div>


      <div className={'buttonWrapper'}>
        <Button variant='contained' color='primary' disabled={false} onClick={submitHandler}>
          Exchange
        </Button>
      </div>
    </Paper>
  );
}

export default ExchangeWindow;