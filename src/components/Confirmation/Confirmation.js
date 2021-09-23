import { useHistory } from 'react-router-dom';
import { Paper, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../redux/actions";
import './Confirmation.scss';

function Confirmation () {
  const dispatch =  useDispatch();
  const page = useHistory();

  const calculations = useSelector(state => state.calculations);
  const invoicesList = useSelector(state => state.paymentsLists.invoicesList);
  const withdrawalsList = useSelector(state => state.paymentsLists.withdrawalsList);
  const isRefreshing = useSelector(state => state.isRefreshing);

  const bid = (...e) => dispatch(actions.bid(...e));

  const confirmHandler = () => {
    bid(calculations.invoiceAmount, 'invoice', calculations.invoiceId, calculations.withdrawId)
    page.push('./success')
    
  }



  return (
    <Paper elevation={5}>
      <h1>Confirmation</h1>
      <div>
        Sell {calculations.invoiceAmount} {invoicesList.find(obj => obj.id === +calculations.invoiceId).name} <br />
        Buy {calculations.withdrawAmount} {withdrawalsList.find(obj => obj.id === +calculations.withdrawId).name} <br />
      </div>

      <div className={'buttonWrapper'}>
        <Button variant='contained' color='primary' disabled={isRefreshing} onClick={() => page.push('./')}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' disabled={isRefreshing} onClick={confirmHandler}>
          Confirm
        </Button>
      </div>
    </Paper>
  );
}

export default Confirmation;