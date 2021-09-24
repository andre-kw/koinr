import React, {useState} from 'react';
import useWallet from '../hooks/Wallet';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txns: {}, setTxns: () => {},
  tokens: [], setTokens: () => {},
});

export default AccountContext;

export function AccountProvider(props) {
  const eth = useWallet();
  const [address, setAddress] = useState('');
  const [txns, setTxns] = useState([]);
  const [tokens, setTokens] = useState([]);

  // React.useEffect(() => {
  //   tokens.forEach(t => {
  //     console.log('token:', t.name, `(${t.symbol})`)
  //   });
  // }, [tokens]);

  React.useEffect(() => {
    setAddress(window.ethereum.selectedAddress);
  }, [window.ethereum.selectedAddress]);

  const value = {
    address, setAddress,
    txns, setTxns,
    tokens, setTokens,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}