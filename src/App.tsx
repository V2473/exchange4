import './App.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PaginationWindow from './components/PaginationWindow/PaginationWindow';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:page" component={PaginationWindow}/>
        <Redirect from="/" to="/1" />
      </Switch>
    </Router>
  );
}

export default App;
