import React from 'react';
import AccountContext from '../contexts/AccountContext';

function useErrorHandler(err) {
  const ctx = React.useContext(AccountContext);

  if(err && err.message === 'MetaMask not installed')
    ctx.setAddress('');

  return (err) => console.error(`Caught error: ${err.message}`);
}

export default useErrorHandler;