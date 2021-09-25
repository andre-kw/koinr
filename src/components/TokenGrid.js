import React, { useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { sha3 } from 'web3-utils';
import Web3EthAbi from 'web3-eth-abi';
import AccountContext from 'contexts/AccountContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import useTxnIterator from '../hooks/TxnIterator';
import usePancakeTxnIterator from '../hooks/PancakeTxnIterator';
import TokenButton from './TokenButton';
import bscscan from '../apis/bscscan';
import { pullToReleaseConfig } from '../config';
import { abi as PancakeSwapV2Abi } from '../abis/PancakeSwapV2Router';
import { router as PancakeSwapV2RouterAddress } from '../abis/PancakeSwapV2Router';
import './styles/Tokens.css';

export default function TokenGrid(props) {
  const acc = React.useContext(AccountContext);
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
  const getPancakeV2Txns = (txns) => {
    const pancakeFnSignatures = {};
    const prepareData = e => `${e.name}(${e.inputs.map(e => e.type)})`;
    const encodeSelector = f => sha3(f).slice(0,10);

    PancakeSwapV2Abi
      .filter(e => e.type === "function")
      .forEach(e => {
        pancakeFnSignatures[encodeSelector(prepareData(e))] = prepareData(e);
      });

    const t = txns.filter(txn => txn.to === PancakeSwapV2RouterAddress.toLowerCase());

    return t.map(tx => {
      const fn = pancakeFnSignatures[tx.input.slice(0, 10)];
      if(!fn) return;

      const args = fn
        .substring(fn.indexOf('(') + 1, fn.length - 1)
        .split(',');

      return {...tx, args: Web3EthAbi.decodeParameters(args, tx.input.slice(10))};
    });
  };

  const load = async () => {
    setLoading(true);

    try {
      const txns = await getTxns();
      const pancakeV2Txns = getPancakeV2Txns(txns);
      const tokens = await getTokens(txns);
      const pancakeV2Tokens = await getPancakeV2Tokens(pancakeV2Txns);
      acc.setTxns([...txns]);
      acc.setPancakeV2Txns([...pancakeV2Txns]);
      acc.setTokens([...tokens]);
      acc.setPancakeV2Tokens([...pancakeV2Tokens]);
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

    [...acc.tokens, ...acc.pancakeV2Tokens].forEach(t => {
      if(arr.findIndex(tk => tk.address.toLowerCase() === t.address.toLowerCase()) === -1)
        arr.push(t);
    });

    setTokens(arr);
  }, [acc.tokens, acc.pancakeV2Tokens]);

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