import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import sagaWatcher from './saga/sagas';
import { store } from './redux/store';
import { sagaMiddleware } from './saga/sagaMiddleware';

sagaMiddleware.run(sagaWatcher);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  
  document.getElementById('root')
);
