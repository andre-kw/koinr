import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import AccountContext from '../contexts/AccountContext';
// import IDBContext from 'contexts/IDBContext';
import ConnectButton from './ConnectButton';
import TokenGrid from './TokenGrid';
import InfoDrawer from './InfoDrawer';
import BackgroundOverlay from './BackgroundOverlay';
// import BlockExplorer from './BlockExplorer';
import './styles/App.css';
import './styles/Buttons.css';

function App() {
  // const db = React.useContext(IDBContext);
  const acc = React.useContext(AccountContext);
  const [infoDrawerAddress, setInfoDrawerAddress] = useState(null);

  // React.useEffect(() => {
  //   const e = window.ethereum;
  //   acc.setAddress(e ? e.selectedAddress : '');
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
    <div id="app" className={`${acc.address ? '' : 'landing'} ${infoDrawerAddress ? 'info' : ''}`}>
      <header>
        <div id="header-left">
          <h1>KOOINR</h1>
          {acc.address && <button aria-label="app settings"><FontAwesomeIcon icon={faCog} /></button>}
        </div>
        <div id="header-right">
          {(!acc.address && !window.ethereum) && <p>Please install MetaMask to continue.</p>}
          {!acc.address && <ConnectButton setAddress={acc.setAddress} />}
        </div>
      </header>
      
      {acc.address && <TokenGrid setInfoDrawerAddress={setInfoDrawerAddress} />}
      {acc.address && <InfoDrawer tokenAddress={infoDrawerAddress} setInfoDrawerAddress={setInfoDrawerAddress} />}

      <BackgroundOverlay show={!!infoDrawerAddress} setInfoDrawerAddress={setInfoDrawerAddress} />
    </div>
  );
}

export default App;
