import React from 'react';
import {render} from 'react-dom';
import App from './components/App';
import {IDBProvider} from './contexts/IDBContext';

render(
  <React.StrictMode>
    <IDBProvider>
      <App />
    </IDBProvider>
  </React.StrictMode>,
  document.getElementById('root')
);