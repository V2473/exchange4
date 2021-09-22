import { useHistory } from 'react-router-dom';
import { Paper, Button } from '@material-ui/core';
import './Success.scss';

function Success () {

  const page = useHistory();

  return (
    <Paper elevation={5}>
      <h1>Success</h1>
      <div className={'buttonWrapper'}>
        <Button variant='contained' color='primary' disabled={false} onClick={() => page.push('./')}>
          Home
        </Button>
      </div>
    </Paper>
  );
}

export default Success;