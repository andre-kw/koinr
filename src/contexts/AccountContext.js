import React, {useState} from 'react';
// import {Contract} from '@ethersproject/contracts';
import useWallet from '../hooks/Wallet';
// import abi from '../abi';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txs: {}, setTxs: () => {},
  // contracts: [], setContracts: () => {},
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
  // const [contracts, setContracts] = useState([]);
  const [tokens, setTokens] = useState([]);

  // const contractIterator = async () => {
  //   return {
  //     async *[Symbol.asyncIterator]() {
  //       for(let i = 0; i < contracts.length; i++) {
  //         yield {address: contracts[i].address};
  //       }
  //     }
  //   };
  // };

  // React.useEffect(() => {
  //   console.log(contracts);

  //   if(contracts.length > 0)
  //     contracts[0].name().then(res => console.log('testtt', res))
  //       .catch(err => console.log('errors suck ass', err));

  //   (async () => {
  //     for await (let tokenData of await contractIterator()) {
  //       console.log('tokenData', tokenData)
  //     }
  //   })();
  // }, [contracts]);

  React.useEffect(() => {
    tokens.forEach(t => {
      console.log('token:', t.name, `(${t.symbol})`)
    });
  }, [tokens]);

  React.useEffect(() => {
    setAddress(window.ethereum.selectedAddress);
  }, [window.ethereum.selectedAddress]);

  const value = {
    address, setAddress,
    txs, setTxs,
    // contracts, setContracts,
    tokens, setTokens,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}