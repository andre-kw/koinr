import React from 'react';
import AccountContext from '../contexts/AccountContext';

function useErrorHandler(err) {
  const ctx = React.useContext(AccountContext);

  return (err) => {
    if(err?.data?.message.includes('missing trie node'))
      return;

    console.error(`Caught error: ${err.message}`);
  };
}

export default useErrorHandler;