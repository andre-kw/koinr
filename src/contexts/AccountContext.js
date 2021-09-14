import React, {useState} from 'react';
import useWallet from '../hooks/Wallet';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txs: {}, setTxs: () => {},
  tokens: [], setTokens: () => {},
});

export default AccountContext;

export function AccountProvider(props) {
  const eth = useWallet();
  const [address, setAddress] = useState('');
  const [txs, setTxs] = useState([]);
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
    txs, setTxs,
    tokens, setTokens,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}