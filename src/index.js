import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { AccountProvider } from './contexts/AccountContext';
import { TokenProvider } from './contexts/TokenContext';

render(
  <React.StrictMode>
    <TokenProvider>
      <AccountProvider>
        <App />
      </AccountProvider>
    </TokenProvider>
  </React.StrictMode>,
  document.getElementById('root')
);