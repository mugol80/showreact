import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import RootReducer from './store/reducers/root';
import RootSaga from './store/sagas/root';
import App from './App';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    RootReducer,
    {},
    composeWithDevTools(applyMiddleware(createLogger(), sagaMiddleware)),
);

sagaMiddleware.run(RootSaga);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'),
);
