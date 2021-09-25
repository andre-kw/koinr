import React, { useState } from 'react';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txns: {}, setTxns: () => {},
  pancakeV1Txns: {}, setPancakeV1Txns: () => {},
  pancakeV2Txns: {}, setPancakeV2Txns: () => {},
  tokens: [], setTokens: () => {},
  pancakeV1Tokens: [], setPancakeV1Tokens: () => {},
  pancakeV2Tokens: [], setPancakeV2Tokens: () => {},
});

export default AccountContext;

export function AccountProvider(props) {
  const [address, setAddress] = useState('');
  const [txns, setTxns] = useState([]);
  const [pancakeV1Txns, setPancakeV1Txns] = useState([]);
  const [pancakeV2Txns, setPancakeV2Txns] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pancakeV1Tokens, setPancakeV1Tokens] = useState([]);
  const [pancakeV2Tokens, setPancakeV2Tokens] = useState([]);

  React.useEffect(() => {
    setAddress(window.ethereum.selectedAddress);
  }, [window.ethereum.selectedAddress]);

  const value = {
    address, setAddress,
    txns, setTxns,
    pancakeV1Txns, setPancakeV1Txns,
    pancakeV2Txns, setPancakeV2Txns,
    tokens, setTokens,
    pancakeV1Tokens, setPancakeV1Tokens,
    pancakeV2Tokens, setPancakeV2Tokens,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}