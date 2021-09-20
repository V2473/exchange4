import './App.scss';
import ExchangeWindow from './components/ExchangeWindow/ExchangeWindow';
import Confirmation from './components/Confirmation/Confirmation';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/" component={ExchangeWindow} />
          <Route path="/confirmation" component={Confirmation} />
        </Switch>
      </Router>
  );
}

export default App;
