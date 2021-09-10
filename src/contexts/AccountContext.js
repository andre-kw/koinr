import React, {useState} from 'react';
import useWallet from '../hooks/Wallet';
import abi from '../abi';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txs: {}, setTxs: () => {},
});

export default AccountContext;

export function AccountProvider(props) {
  const eth = useWallet();
  const [address, setAddress] = useState('');
  const [txs, setTxs] = useState([]);

  React.useEffect(() => {
    console.log(txs);
    txs.forEach(tx => {
      if(tx.txreceipt_status !== "1")
        return;

      if(tx.to === eth.selectedAddress()) {
        console.log('tx history: received ' + tx.from)
      }
    });
  }, [txs]);

  const value = {
    address, setAddress,
    txs, setTxs,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}