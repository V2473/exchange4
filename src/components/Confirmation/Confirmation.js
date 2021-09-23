import { useSelector, useDispatch } from 'react-redux';
// import * as actions from "../../redux/actions";
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as actions from "../../redux/actions";
import classnames from 'classnames';
import './Confirmation.scss';
import tryBid from '../../Logic/requests'

function Confirmation () {
  const dispatch =  useDispatch();
  const page = useHistory();
  
  const withdrawalsList = useSelector(state => state.paymentsLists.withdrawalsList);
  const invoicesList = useSelector(state => state.paymentsLists.invoicesList);
  const isEmptyAmounts = useSelector(state => state.isEmptyAmounts);
  const calculations = useSelector(state => state.calculations);
  const isRefreshing = useSelector(state => state.isRefreshing);
  const isBidSuccess = useSelector(state => state.isBidSuccess);

  const setIsBidSuccess = (bool) => dispatch(actions.isBidSuccess(bool))

  // const bid = (...e) => dispatch(actions.bid(...e));

  const confirmHandler = (e) => {
    e.preventDefault();

    tryBid(
      calculations.invoiceAmount,
      'invoice',
      calculations.invoiceId,
      calculations.withdrawId
      )
      .then(() => {
        page.push('/success')
      })
      .catch(() => {
        setIsBidSuccess(false);
      })
  }

  return (
    <div elevation={5} className={"paper"}>
      <h1 className={classnames("header-confirmation")}>Details</h1>
      <div>
        <div className={'confirm-text'}>
          <p>
          {withdrawalsList.length > 0 ? 'Sell' : ''}
          </p>
          <p>{calculations ? calculations.invoiceAmount + ' ': ''} 
          {withdrawalsList.length > 0 ? withdrawalsList.find(obj => obj.id === +calculations.withdrawId).name : ''}
          </p>
        </div> 
        <div className={'confirm-text'}>
          <p>
          {invoicesList.length > 0 ? 'Buy' : ''}
          </p>
          <p>{calculations ? calculations.withdrawAmount + ' ': ''}
          {invoicesList.length > 0 ? invoicesList.find(obj => obj.id === +calculations.invoiceId).name : ''}</p>
        </div>
      </div>

      {isBidSuccess ? '' : (<p className={'error'} >
        Server returned error,<br /> but see <a onClick={() => page.push('/success')} className={'error-link'}>success screen</a> anyway
      </p>)}

      <div className={'buttonWrapper-confirmation'}>
        <button
          className={classnames("btn","btn-outline-dark","btn-cancel")}
          variant='contained'
          color='primary'
          onClick={() => page.push('./')}
        >
          Cancel
        </button>

        <button
          className={classnames("btn","btn-primary","btn-confirm")}
          variant='contained'
          color='primary'
          disabled={isRefreshing || isEmptyAmounts}
          onClick={confirmHandler}
        >
          Confirm
        </button>

      </div>
    </div>
  );
}

export default Confirmation;