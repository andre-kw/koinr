import React, {useState} from 'react';
import {Contract} from '@ethersproject/contracts';
import useWallet from '../hooks/Wallet';
import abi from '../abi';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txs: {}, setTxs: () => {},
  tokens: [], setTokens: () => {},
});

export default AccountContext;

const tokenReducer = (state, action) => {
  switch(action.type) {
    case 'add':
      if(state.findIndex(t => t.address === action.payload.address) > -1)
        return state;

      const {address, provider} = action.payload;

      // (async () => {
      //   if(await provider.getCode(address) == '0x')
      //     return;

      //   const token = {
      //     address,
      //     contract: new Contract(address, abi,provider),
      //   };

      //   console.log(await token.contract.name());
      // })();

      const token = {
        address,
        contract: new Contract(address, abi, provider),
      };

      // provider.getCode(address)
      //   .then(res => {
      //     if(res != '0x') {
            token.contract.name()
              .then(name => console.log('token:', name));
      //     }
      //   })
      
      return [...state, token];
    default:
      throw Error();
  }
};

export function AccountProvider(props) {
  const eth = useWallet();
  const [address, setAddress] = useState('');
  const [txs, setTxs] = useState([]);
  const [tokens, setTokens] = React.useReducer(tokenReducer, []); // TODO: need reducer here instead

  React.useEffect(() => {
    console.log(txs);

    const promises = [];

    txs.forEach(tx => {
      if(tx.txreceipt_status !== "1")
        return;

      if(tx.from === eth.selectedAddress()) {
        // console.log('tx history: sent to ' + tx.to)

        if(tokens.findIndex(t => t.address === tx.to) === -1) {
          eth.getCode(tx.to)
            .then(res => {
              if(res && res != '0x')
                setTokens({type: 'add', payload: {address: tx.to, provider: eth.provider}});
            })
        }
      }
    });
  }, [txs]);

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