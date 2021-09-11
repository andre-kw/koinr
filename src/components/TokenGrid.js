import React from 'react';
import {Contract} from '@ethersproject/contracts';
import AccountContext from 'contexts/AccountContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import bscscan from '../apis/bscscan';
import abi from '../abi';

export default function TokenGrid(props) {
  const acc = React.useContext(AccountContext);
  const eth = useWallet();
  const handleError = useErrorHandler();

  React.useEffect(() => {
    const txnIterator = async (txs) => {
      return {
        async *[Symbol.asyncIterator]() {
          for(let i = 0; i < txs.length; i++) {
            if(txs.txreceipt_status !== "1")
              yield;

            if(txs[i].from === eth.selectedAddress()) {
              // sending/swapping
              let code;

              try {
                code = await eth.getCode(txs[i].to);
              } catch(e) {
                handleError(e);
              }

              if(code && code !== '0x')
                yield {address: txs[i].to};

            } else if(txs[i].to === eth.selectedAddress()) {
              // TODO: receiving
            }
          }
        }
      };
    };

    (async () => {
      let txs;
      const temp = [];

      try {
        txs = await bscscan.txlist(eth.selectedAddress());
      } catch(e) {
        handleError(e);
      }

      for await (let token of await txnIterator(txs)) {
        if(!token || temp.findIndex(t => token.address === t.address) !== -1)
          continue;

        let name;
        const contract = new Contract(token.address, abi, eth.provider);

        try {
          name = await contract.name();
        } catch(e) {
          handleError(e);
        }
        
        temp.push({...token, contract, name});
      }

      acc.setTxs([...txs]);
      acc.setTokens([...temp]);
    })();
  }, []);

  return (
    <section id="tokens">
      <div>
        {acc.tokens.map(token => <p key={token.address}>{token.address}</p>)}
      </div>
    </section>
  );
}