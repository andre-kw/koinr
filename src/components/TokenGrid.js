import React, { useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import AccountContext from 'contexts/AccountContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import TokenButton from './TokenButton';
import bscscan from '../apis/bscscan';
import { pullToReleaseConfig } from '../config';
import useTxnIterator from '../hooks/TxnIterator';
import './styles/Tokens.css';

export default function TokenGrid(props) {
  const acc = React.useContext(AccountContext);
  const eth = useWallet();
  const handleError = useErrorHandler();
  const {getTokens} = useTxnIterator();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState([]);

  const getTxns = async () => {
    const txns = await bscscan.txlist(eth.selectedAddress());
    return txns;
  };

  const load = async () => {
    setLoading(true);

    try {
      const txns = await getTxns();
      const tokens = await getTokens(txns);
      acc.setTxns([...txns]);
      acc.setTokens([...tokens]);
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

    [...acc.tokens, ...acc.pancakeTokens].forEach(t => {
      if(arr.indexOf(t.address) === -1)
        arr.push(t);
    });

    setTokens(arr);
  }, [acc.tokens, acc.pancakeTokens]);

  return (
    <section id="tokens" className={loading ? 'loading' : ''}>
      <div>
        {loading && <div id="load-spinner" role="alert" aria-live="polite" aria-label="loading"></div>}
        {!loading && tokens.map(token => 
          <TokenButton key={token.address} token={token} onClick={() => props.setInfoDrawerAddress(token.address)} />)}
      </div>
    </section>
  );
}