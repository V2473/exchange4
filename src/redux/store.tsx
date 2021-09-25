import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { sagaMiddleware } from '../saga/sagaMiddleware';

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  )
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;