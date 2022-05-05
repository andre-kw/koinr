import React, { useState } from 'react';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txns: {}, setTxns: () => {},
  pancakeV1Txns: {}, setPancakeV1Txns: () => {},
  pancakeV2Txns: {}, setPancakeV2Txns: () => {},
});

export default AccountContext;

export function AccountProvider(props) {
  const [address, setAddress] = useState('');
  const [txns, setTxns] = useState([]);
  const [pancakeV1Txns, setPancakeV1Txns] = useState([]);
  const [pancakeV2Txns, setPancakeV2Txns] = useState([]);

  React.useEffect(() => {
    if(window.ethereum)
      setAddress(window.ethereum.selectedAddress);
  }, [window.ethereum]);

  const value = {
    address, setAddress,
    txns, setTxns,
    pancakeV1Txns, setPancakeV1Txns,
    pancakeV2Txns, setPancakeV2Txns,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}