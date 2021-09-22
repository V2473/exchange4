
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { Paper, Button } from '@material-ui/core';
import * as actions from "../../actions";
import './ExchangeWindow.scss';
 
function ExchangeWindow () {
  const page = useHistory();
  const dispatch =  useDispatch();

  const calculations = useSelector(state => state.calculations);
  const invoicesList = useSelector(state => state.paymentsLists.invoicesList);
  const withdrawalsList = useSelector(state => state.paymentsLists.withdrawalsList);
  const isRefreshing = useSelector(state => state.isRefreshing);

  const setCalculations = (a) => dispatch(actions.updateCalculations(a));
  const calculate = (e) => dispatch(actions.calculate(e));
  
  useEffect(() => {
    dispatch(actions.updatePaymentsList());

    setCalculations({
      invoiceId: '6',
      invoiceAmount: '',
      withdrawId: '4',
      withdrawAmount: '',
    }) 
    // eslint-disable-next-line 
  }, []) 

  return (
    <Paper elevation={5}>
      <div className={'tradeWindow'}>
        <h1>Sell</h1>
        
        <form onSubmit={() => page.push('/confirmation')}>
          <select
            name="invoiceId"
            onChange={calculate}
            value={calculations.invoiceId}
            disabled={isRefreshing ? 'disabled' : false}
          >
            {invoicesList.map(invoice => (
              <option value={invoice.id} key={invoice.id}>{invoice.name}</option>
            ))}
          </select>
          <br />
          <input
            type="text"
            name="invoiceAmount"
            onInput={calculate}
            value={calculations.invoiceAmount || ''}
            placeholder="0"
            disabled={isRefreshing ? 'disabled' : false}
          />
        </form>
        
      </div>
      <div className={'tradeWindow'}>
        <h1>Buy</h1>
        
        <form onSubmit={() => page.push('/confirmation')}> 
          <select
            name="withdrawId"
            onChange={calculate}
            value={calculations.withdrawId}
            disabled={isRefreshing ? 'disabled' : false}
          >
            {withdrawalsList.map(withdraw => (
              <option value={withdraw.id} key={withdraw.id}>{withdraw.name}</option>
            ))}
          </select>
          <br />
          <input
            type="text"
            name="withdrawAmount"
            onInput={calculate}
            value={calculations.withdrawAmount || ''}
            placeholder="0"
            disabled={isRefreshing ? 'disabled' : false}
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