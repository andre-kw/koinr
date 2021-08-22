import React, {useState} from 'react';
import IDBContext from 'contexts/IDBContext';
import ConnectButton from './ConnectButton';
import TokenGrid from './TokenGrid';
import './styles/App.css';

function App() {
  // const db = React.useContext(IDBContext);
  const [address, setAddress] = useState('');

  React.useEffect(() => {
    const e = window.ethereum;
    setAddress(e ? e.selectedAddress : '');
  }, []);

  React.useEffect(() => {
    // if(address) db.open(e.selectedAddress);
  }, [address]);

  return (
    <div id="app" className={`${address ? '' : 'landing'}`}>
      <h1>koinichi</h1>
      
      {address && <TokenGrid address={address} />}
      {!address && <ConnectButton setAddress={setAddress} />}
    </div>
  );
}

export default App;
