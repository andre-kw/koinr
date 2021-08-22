import React from 'react';
import eth from 'ethereum';
import AccountContext from 'contexts/AccountContext';

export default function TokenGrid(props) {
  const ctx = React.useContext(AccountContext);

  React.useEffect(() => {
    // get abis
    eth.getLogs(props.address);
  }, []);

  return (
    <section id="tokens">
      <div></div>
    </section>
  );
}