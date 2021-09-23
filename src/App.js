import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ExchangeWindow from './components/ExchangeWindow/ExchangeWindow';
import Confirmation from './components/Confirmation/Confirmation';
import Success from './components/Success/Success';
import './App.scss';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ExchangeWindow} />
        <Route path="/confirmation" component={Confirmation} />
        <Route path="/success" component={Success} />
      </Switch>
    </Router>
  );
}

export default App;