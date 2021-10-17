import React, { useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import Web3EthAbi from 'web3-eth-abi';
import AccountContext from 'contexts/AccountContext';
import TokenContext from '../contexts/TokenContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import useTxnIterator from '../hooks/TxnIterator';
import usePancakeTxnIterator from '../hooks/PancakeTxnIterator';
import TokenButton from './TokenButton';
import bscscan from '../apis/bscscan';
import { pullToReleaseConfig } from '../config';
import { router as PancakeSwapV1RouterAddress } from '../abis/PancakeSwapV1Router';
import { router as PancakeSwapV2RouterAddress } from '../abis/PancakeSwapV2Router';
import { fnSignatures as PancakeSwapV1FnSignatures } from '../abis/PancakeSwapV1Router';
import { fnSignatures as PancakeSwapV2FnSignatures } from '../abis/PancakeSwapV2Router';
import { fnSignatures as BEP20FnSignatures } from '../abis/BEP20';
import './styles/Tokens.css';

export default function TokenGrid(props) {
  const acc = React.useContext(AccountContext);
  const tkn = React.useContext(TokenContext);
  const eth = useWallet();
  const handleError = useErrorHandler();
  const {getTokens} = useTxnIterator();
  const {getTokens: getPancakeV2Tokens} = usePancakeTxnIterator();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState([]);

  const getTxns = async () => {
    const txns = await bscscan.txlist(eth.selectedAddress());
    return txns;
  };

  // TODO: helper function?
  const serializeTxns = (txns) => {
    const pancakeV1Sigs = PancakeSwapV1FnSignatures();
    const pancakeV2Sigs = PancakeSwapV2FnSignatures();
    const bep20Sigs = BEP20FnSignatures();
    const bep20Filter = txn => {
      if(txn.to === PancakeSwapV1RouterAddress.toLowerCase()
          || txn.to === PancakeSwapV2RouterAddress.toLowerCase()
          || !bep20Sigs[txn.input.slice(0, 10)])
        return false;
      
      return true;
    };

    return {
      bep20Txns: txns.filter(bep20Filter)
        .map(tx => {
          const fn = bep20Sigs[tx.input.slice(0, 10)];
          const extraData = {fn};
          const inputData = fn
            .substring(fn.indexOf('(') + 1, fn.length - 1)
            .split(',');
    
          return {...tx, inputData: Web3EthAbi.decodeParameters(inputData, tx.input.slice(10)), extraData};
        }),
      
      pancakeV1Txns: txns.filter(txn => txn.to === PancakeSwapV1RouterAddress.toLowerCase())
        .map(tx => {
          const fn = pancakeV1Sigs[tx.input.slice(0, 10)];
          const extraData = {fn};
          const inputData = fn
            .substring(fn.indexOf('(') + 1, fn.length - 1)
            .split(',');

          return {...tx, inputData: Web3EthAbi.decodeParameters(inputData, tx.input.slice(10)), extraData};
        }),

      pancakeV2Txns: txns.filter(txn => txn.to === PancakeSwapV2RouterAddress.toLowerCase())
        .map(tx => {
          const fn = pancakeV2Sigs[tx.input.slice(0, 10)];
          const extraData = {fn};
          const inputData = fn
            .substring(fn.indexOf('(') + 1, fn.length - 1)
            .split(',');
    
          return {...tx, inputData: Web3EthAbi.decodeParameters(inputData, tx.input.slice(10)), extraData};
        }),

      unknownTxns: txns.filter(txn => !bep20Sigs[txn.input.slice(0, 10)])
    }
  };

  const load = async () => {
    setLoading(true);

    try {
      const txns = await getTxns();
      const {bep20Txns, pancakeV1Txns, pancakeV2Txns, unknownTxns} = serializeTxns(txns);
      const tokens = await getTokens([...bep20Txns, ...unknownTxns]);
      const pancakeV2Tokens = await getPancakeV2Tokens([...pancakeV1Txns, ...pancakeV2Txns]);
      acc.setTxns([...bep20Txns, ...unknownTxns]);
      acc.setPancakeV1Txns([...pancakeV1Txns]);
      acc.setPancakeV2Txns([...pancakeV2Txns]);
      tkn.setTokens([...tokens]);
      // acc.setPancakeV1Tokens([...pancakeV1Tokens]);
      tkn.setPancakeV2Tokens([...pancakeV2Tokens]);
    } catch(e) {
      handleError(e);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    load();

    PullToRefresh.init({
      ...pullToReleaseConfig,
      onRefresh: load
    });

    return function cleanup() {
      PullToRefresh.destroyAll();
    };
  }, []);

  React.useEffect(() => {
    const arr = [];

    tkn.getAll().forEach((t, i) => {
      if(i === 0)
        arr.unshift(...tkn.constants);
      if(arr.findIndex(tk => tk.address.toLowerCase() === t.address.toLowerCase()) === -1)
        arr.push(t);
    });

    setTokens(arr);
  }, [tkn.tokens, tkn.pancakeV2Tokens]);

  return (
    <section id="tokens" className={loading ? 'loading' : ''}>
      <div>
        {loading && tokens.length === 0 && <div id="load-spinner" role="alert" aria-live="polite" aria-label="loading"></div>}
        {tokens.map(token => 
          <TokenButton key={token.address} token={token} onClick={() => props.setInfoDrawerAddress(token.address)} />)}
      </div>
    </section>
  );
}