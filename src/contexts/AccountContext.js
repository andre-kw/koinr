import React, {useState} from 'react';
// import {Contract} from '@ethersproject/contracts';
import useWallet from '../hooks/Wallet';
// import abi from '../abi';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txs: {}, setTxs: () => {},
  tokens: [], setTokens: () => {},
});

export default AccountContext;

// const tokenReducer = (state, action) => {
//   switch(action.type) {
//     case 'add':
//       if(state.findIndex(t => t.address === action.payload.address) > -1)
//         return state;

//       const {address, provider} = action.payload;
//       const token = {address};

//       try {
//         token.contract = new Contract(address, abi, provider);
//       } catch(e) {
//         console.log('tokenReducer error:', e);
//       }

//       return [...state, token];

//     case 'edit':
//       const i = state.findIndex(t => t.address === action.payload.address);
//       if(!i) return state;

//       // state[i] = {...state[i], }

//     default:
//       throw Error();
//   }
// };

export function AccountProvider(props) {
  const eth = useWallet();
  const [address, setAddress] = useState('');
  const [txs, setTxs] = useState([]);
  const [tokens, setTokens] = useState([]);

  React.useEffect(() => {
    console.log(tokens);

    // if(tokens[tokens.length -1].name)
    //   return;

    // setTokens(tokens.map(token => {
    //   return {...token, }
    // }));
  }, [tokens]);

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