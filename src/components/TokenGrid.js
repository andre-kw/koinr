import React from 'react';
import AccountContext from 'contexts/AccountContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import bscscan from '../apis/bscscan';

export default function TokenGrid(props) {
  const acc = React.useContext(AccountContext);
  const eth = useWallet();
  const handleError = useErrorHandler();

  React.useEffect(() => {
    // (async () => {
    //   let txs;

    //   try {
    //     txs = await bscscan.txlist(eth.selectedAddress());
    //   } catch(e) {
    //     handleError(e);
    //   }
    // })();

    bscscan.txlist(eth.selectedAddress())
      .then(data => acc.setTxs([...data]))
      .catch(handleError);
  }, []);

  return (
    <section id="tokens">
      <div></div>
    </section>
  );
}