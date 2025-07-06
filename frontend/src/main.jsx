import './index.css';

import App from './App.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div className="dark:bg-dark-bg dark:text-dark-text">
      <App />
      <Toaster position="top-right" />
    </div>
  </Provider>,
);