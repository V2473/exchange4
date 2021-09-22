import './App.scss';
import ExchangeWindow from './components/ExchangeWindow/ExchangeWindow';
import Confirmation from './components/Confirmation/Confirmation';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Error from './components/Error/Error';
import Success from './components/Success/Success';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ExchangeWindow} />
        <Route path="/confirmation" component={Confirmation} />
        <Route path="/success" component={Success} />
        <Route path="/error" component={Error} /> 
      </Switch>
    </Router>
  );
}

export default App;
