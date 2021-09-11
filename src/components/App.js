import React, {useState} from 'react';
import AccountContext from '../contexts/AccountContext';
// import IDBContext from 'contexts/IDBContext';
import ConnectButton from './ConnectButton';
import TokenGrid from './TokenGrid';
import BlockExplorer from './BlockExplorer';
import BlockExplorerWorker from '../workers/BlockExplorer.worker';
import './styles/App.css';

function App() {
  // const db = React.useContext(IDBContext);
  const ctx = React.useContext(AccountContext);

  // React.useEffect(() => {
  //   const e = window.ethereum;
  //   ctx.setAddress(e ? e.selectedAddress : '');
  // }, []);

  /*React.useEffect(() => {
    let worker;
    async function wrapper() {
      worker = new BlockExplorerWorker();

      worker.postMessage({payload: { yo: 'what up' }});
    }

    wrapper();

    return () => { if(worker) worker.terminate(); };
  }, []);*/

  /* React.useEffect(() => {
    if(address) db.open(e.selectedAddress);
  }, [address]); */

  return (
    <div id="app" className={`${ctx.address ? '' : 'landing'}`}>
      <header>
        <div id="header-left"></div>
        <div id="header-center">
          <h1>koinview</h1>
        </div>
        <div id="header-right"></div>
      </header>
      
      {ctx.address && <TokenGrid address={ctx.address} />}
      {!ctx.address && <ConnectButton setAddress={ctx.setAddress} />}
    </div>
  );
}

export default App;
