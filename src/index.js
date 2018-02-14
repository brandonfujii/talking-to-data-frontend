import React from 'react';
import { render } from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import store from './store';
import AppProvider from './AppProvider';
import App from './App';

const $renderEntryPoint = document.getElementById('root');

render(
  <AppProvider store={store}>
    <App />
  </AppProvider>,
  $renderEntryPoint
);

registerServiceWorker();
