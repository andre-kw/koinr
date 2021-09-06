import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { AccountProvider } from './contexts/AccountContext';
import { IDBProvider } from './contexts/IDBContext';

render(
  <React.StrictMode>
    <IDBProvider>
      <AccountProvider>
        <App />
      </AccountProvider>
    </IDBProvider>
  </React.StrictMode>,
  document.getElementById('root')
);