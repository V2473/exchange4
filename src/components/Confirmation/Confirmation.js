import React from "react";
import { Paper, Button } from '@material-ui/core';
import './Confirmation.scss';

function Confirmation () {
  return (
    <Paper elevation={5}>
      <h1>Confirmation</h1>
      <div className={'buttonWrapper'}>
        <Button variant='contained' color='primary' disabled={false}>
          Exchange
        </Button>
      </div>
    </Paper>
  );
}

export default Confirmation;