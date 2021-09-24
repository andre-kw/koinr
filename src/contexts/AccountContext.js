import React, { useState } from 'react';
// import useWallet from '../hooks/Wallet';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txns: {}, setTxns: () => {},
  pancakeTxns: {}, setPancakeTxns: () => {},
  tokens: [], setTokens: () => {},
  pancakeTokens: [], setPancakeTokens: () => {},
});

export default AccountContext;

export function AccountProvider(props) {
  // const eth = useWallet();
  const [address, setAddress] = useState('');
  const [txns, setTxns] = useState([]);
  const [pancakeTxns, setPancakeTxns] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pancakeTokens, setPancakeTokens] = useState([]);

  React.useEffect(() => {
    setAddress(window.ethereum.selectedAddress);
  }, [window.ethereum.selectedAddress]);

  // React.useEffect(() => {
    
  // }, [txns]);

  React.useEffect(() => {
    if(pancakeTxns.length === 0)
      return;

    console.log('pancake txns:', pancakeTxns);

    // getPancakeTokens(pancakeTxns)
    //   .then(tokens => setPancakeTokens([...tokens]));
  }, [pancakeTxns]);

  const value = {
    address, setAddress,
    txns, setTxns,
    pancakeTxns, setPancakeTxns,
    tokens, setTokens,
    pancakeTokens, setPancakeTokens,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}