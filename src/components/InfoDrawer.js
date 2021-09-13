import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ClipboardJS from 'clipboard';
import AccountContext from '../contexts/AccountContext';
import './styles/InfoDrawer.css';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export default function InfoDrawer(props) {
  const acc = React.useContext(AccountContext);
  const [token, setToken] = React.useState(null);
  const [imgSrc, setImgSrc] = React.useState(`https://pancakeswap.finance/images/tokens/${props.tokenAddress}.png`);
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

  const openBscScan = (e) => {
    window.open(`https://bscscan.com/token/${token.address}`, '_blank');
  };

  React.useEffect(() => {
    if(!props.tokenAddress) {
      close();
      return;
    }

    setToken(acc.tokens.find(t => t.address === props.tokenAddress));
    setImgSrc(`https://pancakeswap.finance/images/tokens/${props.tokenAddress}.png`);
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
          <div id="drawer-ctrls">
            <button className="btn" id="btn-copy" data-clipboard-text={token.address}><FontAwesomeIcon icon={faCopy} /> Copy address</button>
            <button className="btn btn-bsc" onClick={openBscScan}><img src="/img/bscscan.png" className="icon" /> BscScan</button>
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