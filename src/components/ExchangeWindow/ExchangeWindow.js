import calculationsToInt from '../../Logic/calculationsToInt';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../redux/actions";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { useEffect } from "react";
import './ExchangeWindow.scss';

function ExchangeWindow () {
  const dispatch =  useDispatch();
  const page = useHistory();

  const withdrawalsList = useSelector(state => state.paymentsLists.withdrawalsList);
  const invoicesList = useSelector(state => state.paymentsLists.invoicesList);
  const isEmptyAmounts = useSelector(state => state.isEmptyAmounts);
  const isCalculating = useSelector(state => state.isCalculating);
  const calculations = useSelector(state => state.calculations);
  const isRefreshing = useSelector(state => state.isRefreshing);

  const updateCalculations = (...args) => dispatch(actions.updateCalculations(...args))
  const calculate = (e) => dispatch(actions.calculate(e));
  const setIsBidSuccess = (bool) => dispatch(actions.isBidSuccess(bool))

  
  useEffect(() => {
    dispatch(actions.updatePaymentsList());
    setIsBidSuccess(true);
    // eslint-disable-next-line 
  }, []) 

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isCalculating && !isRefreshing && !isEmptyAmounts) {
      updateCalculations((calculationsToInt(calculations)));

      page.push('/confirmation');
    }
  }

  return (
    <div elevation={5} className={"exchange"}>
      <div className={'tradeWindow'}>
        <h1>Sell</h1>
        
        <form onSubmit={submitHandler}>
          <select
            className={'form-select'}
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
            className={'form-control'}
            type="text"
            name="invoiceAmount"
            onInput={calculate}
            value={calculations.invoiceAmount || ''}
            placeholder="0"
            disabled={false}
          />
        </form>
        
      </div>
      <div className={'tradeWindow'}>
        <h1>Buy</h1>
        
        <form onSubmit={submitHandler}> 
          <select
            className={'form-select'}
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
            className={'form-control'}
            type="text"
            name="withdrawAmount"
            onInput={calculate}
            value={calculations.withdrawAmount || ''}
            placeholder="0"
            disabled={false}
          />
        </form>
      </div>

      <div className={'buttonWrapper'}>
        <button
          type="button"
          className={classnames("btn","btn-primary","btn-exchange")}
          disabled={isCalculating || isRefreshing || isEmptyAmounts}
          onClick={submitHandler}
        >
          Exchange
        </button>
      </div>
    </div>
  );
}

export default ExchangeWindow;