import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ClipboardJS from 'clipboard';
import { toChecksumAddress } from 'web3-utils';
import AccountContext from '../contexts/AccountContext';
import './styles/InfoDrawer.css';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export default function InfoDrawer(props) {
  const acc = React.useContext(AccountContext);
  const [token, setToken] = useState(null);
  const [checksumAddress, setChecksumAddress] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  // const [imgSrc, setImgSrc] = React.useState(`https://pancakeswap.finance/images/tokens/${props.tokenAddress}.png`);
  const dialogRef = React.useRef();
  const clipboard = new ClipboardJS('#btn-copy');

  const close = (e) => {
    dialogRef.current.classList.add('closing');
    document.querySelector('#bg-overlay').classList.add('closing');
    clipboard.destroy();

    setTimeout(() => {
      dialogRef.current.classList.remove('closing');
      document.querySelector('#bg-overlay').classList.remove(...['closing', 'show']);
      setToken(null);
      // props.setInfoDrawerAddress(null);
    }, 500);
  };

  React.useEffect(() => {
    if(!props.tokenAddress) {
      close();
      return;
    }

    const t = acc.tokens.find(t => t.address === props.tokenAddress),
      addr = toChecksumAddress(t.address);
    setToken(t);
    setChecksumAddress(addr);
    setImgSrc(`https://assets.trustwalletapp.com/blockchains/smartchain/assets/${addr}/logo.png`);
    document.querySelector('#bg-overlay').classList.add('show'); // i know, ew
  }, [props.tokenAddress]);

  return (
    <dialog open={token} id="info-drawer" className={token ? 'open' : ''} ref={dialogRef}>
      {token && <>
        <header>
          <img 
            src={imgSrc} 
            width="73" 
            height="73" 
            onError={e => {e.target.onerror = null; setImgSrc('/img/bnb.png')}} />
          <h2>{token.name || <em>unknown token</em>}</h2>

          {checksumAddress && 
            <button id="btn-copy" data-clipboard-text={checksumAddress} aria-label={`Copy ${token.name} contract address`}>
              <FontAwesomeIcon icon={faCopy} /> {checksumAddress}
            </button> }

          <div id="drawer-ctrls">
            <a href={`https://bscscan.com/address/${token.address}`} className="btn btn-bsc" target="_blank"><img src="/img/bscscan.png" className="icon" /> BscScan</a>
          </div>
        </header>
        <button className="close" onClick={() => props.setInfoDrawerAddress(null)} aria-label="close info drawer">X</button>

        <div>
          <p>a fine choice</p>
        </div>
      </>}
    </dialog>
  );
}