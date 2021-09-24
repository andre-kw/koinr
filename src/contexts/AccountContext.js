import React, { useState } from 'react';
import { sha3 } from 'web3-utils';
import Web3EthAbi from 'web3-eth-abi';
import useWallet from '../hooks/Wallet';
import { abi as PancakeSwapV2Abi } from '../abis/PancakeSwapV2Router';
import { router as PancakeSwapV2RouterAddress } from '../abis/PancakeSwapV2Router';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  txns: {}, setTxns: () => {},
  pancakeTxns: {}, setPancakeTxns: () => {},
  tokens: [], setTokens: () => {},
});

export default AccountContext;

const prepareData = e => `${e.name}(${e.inputs.map(e => e.type)})`;
const encodeSelector = f => sha3(f).slice(0,10);

export function AccountProvider(props) {
  const eth = useWallet();
  const [address, setAddress] = useState('');
  const [txns, setTxns] = useState([]);
  const [pancakeTxns, setPancakeTxns] = useState([]);
  const [tokens, setTokens] = useState([]);

  const pancakeFnSignatures = {};
  
  PancakeSwapV2Abi
    .filter(e => e.type === "function")
    .forEach(e => {
      pancakeFnSignatures[encodeSelector(prepareData(e))] = prepareData(e);
    });

  React.useEffect(() => {
    setAddress(window.ethereum.selectedAddress);
  }, [window.ethereum.selectedAddress]);

  React.useEffect(() => {
    const t = txns.filter(txn => txn.to === PancakeSwapV2RouterAddress.toLowerCase());

    setPancakeTxns(t.map(tx => {
      const fn = pancakeFnSignatures[tx.input.slice(0, 10)];
      if(!fn) return;

      const args = fn
        .substring(fn.indexOf('(') + 1, fn.length - 1)
        .split(',');

      return {...tx, args: Web3EthAbi.decodeParameters(args, tx.input.slice(10))};
    }));
  }, [txns]);

  React.useEffect(() => {
    console.log('pancake txns:', pancakeTxns)
  }, [pancakeTxns]);

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