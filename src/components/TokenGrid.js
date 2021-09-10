import React from 'react';
import AccountContext from 'contexts/AccountContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import bscscan from '../apis/bscscan';

export default function TokenGrid(props) {
  const ctx = React.useContext(AccountContext);
  const eth = useWallet();
  const handleError = useErrorHandler();

  React.useEffect(() => {
    // get abis
    // eth.getLogs(props.address);

    bscscan.txlist(eth.selectedAddress())
      .then(data => {
        console.log(data);
      })
      .catch(handleError);
  }, []);

  return (
    <section id="tokens">
      <div></div>
    </section>
  );
}