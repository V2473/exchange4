import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import classnames from 'classnames';
import './Success.scss';

function Success () {

  const page = useHistory();

  return (
    <div elevation={5} className={"success"}>
      <div className={'success-img'}></div>
      <h1>Success</h1>
      <p> Your exchange order has been placed <br /> successfully and will be processed soon.</p>
      <div className={'buttonWrapper'}>
        <button
          className={classnames("btn","btn-primary","btn-confirm","btn-success_")}
          variant='contained'
          color='primary'
          disabled={false}
          onClick={() => page.push('./')}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default Success;