import React, {useState} from 'react';
import {Contract} from '@ethersproject/contracts';
import {BigNumber,isBigNumberish} from '@ethersproject/bignumber/lib/bignumber';
import PullToRefresh from 'pulltorefreshjs';
import AccountContext from 'contexts/AccountContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import TokenButton from './TokenButton';
import bscscan from '../apis/bscscan';
import abi from '../abi';
import {pullToReleaseConfig} from '../config';
import './styles/Tokens.css';

export default function TokenGrid(props) {
  const acc = React.useContext(AccountContext);
  const eth = useWallet();
  const handleError = useErrorHandler();
  const [loading, setLoading] = useState(true);

  const txnIterator = async (txns) => {
    return {
      async *[Symbol.asyncIterator]() {
        for(let i = 0; i < txns.length; i++) {
          if(txns.isError === "1")
            yield;

          if(txns[i].from === eth.selectedAddress()) {
            // sending/swapping
            let code;

            try {
              code = await eth.getCode(txns[i].to);
            } catch(e) {
              handleError(e);
            }

            if(code && code !== '0x')
              yield {address: txns[i].to};

          } else if(txns[i].to === eth.selectedAddress()) {
            // TODO: receiving
          }
        }
      }
    };
  };

  const loadTokens = async () => {
    let txns;
    const temp = [];

    setLoading(true);

    try {
      txns = await bscscan.txlist(eth.selectedAddress());
    } catch(e) {
      setLoading(false);
      handleError(e);
      return;
    }

    for await (let token of await txnIterator(txns)) {
      if(!token || temp.findIndex(t => token.address === t.address) !== -1)
        continue;

      let contract, name, symbol, balance, decimals;

      try {
        contract = new Contract(token.address, abi, eth.provider);
        name = await contract.name();
        symbol = await contract.symbol();
        balance = await contract.balanceOf(eth.selectedAddress());
        decimals = await contract.decimals();
      } catch(e) {
        handleError(e);
        // continue;
      }

      if(!isBigNumberish(balance))
        balance = BigNumber.from(0);

      if(!isBigNumberish(decimals))
        decimals = BigNumber.from(1); // TODO: need to know when this would actually be a thing
      
      temp.push({...token, contract, name, symbol, balance, decimals});
    }

    acc.setTxns([...txns]);
    acc.setTokens([...temp]);
    setLoading(false);
  };

  React.useEffect(() => {
    PullToRefresh.init({
      ...pullToReleaseConfig,
      onRefresh: () => loadTokens()
    });

    loadTokens();

    return function cleanup() {
      PullToRefresh.destroyAll();
    };
  }, []);

  return (
    <section id="tokens" className={loading ? 'loading' : ''}>
      <div>
        {loading && <div id="load-spinner" role="alert" aria-live="polite" aria-label="loading"></div>}
        {!loading && acc.tokens.map(token => 
          <TokenButton key={token.address} token={token} onClick={() => props.setInfoDrawerAddress(token.address)} />)}
      </div>
    </section>
  );
}