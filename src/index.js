import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import rootReducer from './redux/reducers';
import './index.scss';
import App from './App';
import { composeWithDevTools } from 'redux-devtools-extension';
import sagaWatcher from './redux/saga/sagas';
import 'bootstrap/dist/css/bootstrap.min.css';


const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  )
)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

sagaMiddleware.run(sagaWatcher);
