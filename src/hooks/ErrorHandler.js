import React from 'react';
import AccountContext from '../contexts/AccountContext';

function useErrorHandler() {
  const ctx = React.useContext(AccountContext);

  return (err) => {
    if(err?.data?.message.includes('missing trie node'))
      return;

    // if(err?.code === -32603)
    if(err?.data?.code === -32000) {
      if(err?.data?.origin === 'getTokens')
        return console.log(`%c fail ${err.data.address} - MetaMask will be unhappy.`, 'color: #909090');
    }

    console.error(`Caught error: ${err.message}`);
  };
}

export default useErrorHandler;