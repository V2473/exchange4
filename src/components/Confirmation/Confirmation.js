import { useHistory } from 'react-router-dom';
import { Paper, Button } from '@material-ui/core';
import './Confirmation.scss';

function Confirmation () {
  
  const page = useHistory();

  return (
    <Paper elevation={5}>
      <h1>Confirmation</h1>
      <div className={'buttonWrapper'}>
        <Button variant='contained' color='primary' disabled={false} onClick={() => page.push('./')}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' disabled={false} onClick={() => page.push('./success')}>
          Confirm
        </Button>
      </div>
    </Paper>
  );
}

export default Confirmation;