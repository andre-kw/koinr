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
import { router as PancakeSwapV2RouterAddress } from '../abis/PancakeSwapV2Router';
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

  const getTxns = async () => {
    const txns = await bscscan.txlist(eth.selectedAddress());
    return txns;
  };

  const getTokens = async (txns) => {
    const temp = [];

    for await (let token of await txnIterator(txns)) {
      if(!token 
          || temp.findIndex(t => token.address === t.address) !== -1 
          || token.address === PancakeSwapV2RouterAddress)
        continue;

      let contract, name, symbol, balance, decimals;

      try {
        contract = new Contract(token.address, abi, eth.provider);
        name = await contract.name();
        symbol = await contract.symbol();
        balance = await contract.balanceOf(eth.selectedAddress());
        decimals = await contract.decimals();
      } catch(e) {
        e.data.origin = 'getTokens';
        e.data.address = token.address;
        handleError(e);
        // continue;
      }

      if(!isBigNumberish(balance))
        balance = BigNumber.from(0);

      if(!isBigNumberish(decimals))
        decimals = BigNumber.from(1); // TODO: need to know when this would actually be a thing
      
      temp.push({...token, contract, name, symbol, balance, decimals});
    }

    return temp;
  };

  React.useEffect(() => {
    PullToRefresh.init({
      ...pullToReleaseConfig,
      onRefresh: () => getTokens()
    });

    (async () => {
      try {
        const txns = await getTxns();
        const tokens = await getTokens(txns);
        acc.setTxns([...txns]);
        acc.setTokens([...tokens]);
      } catch(e) {
        handleError(e);
      }

      setLoading(false);
    })();

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