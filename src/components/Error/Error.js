import { Paper, Button } from '@material-ui/core';
import './Error.scss';

function Error () {
  return (
    <Paper elevation={5}>
      <h1>Error</h1>
      <div className={'buttonWrapper'}>
        <Button variant='contained' color='primary' disabled={false}>
          Exchange
        </Button>
      </div>
    </Paper>
  );
}

export default Error;