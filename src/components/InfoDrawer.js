import React from 'react';
import AccountContext from '../contexts/AccountContext';
import './styles/InfoDrawer.css';

export default function InfoDrawer(props) {
  const acc = React.useContext(AccountContext);
  const [token, setToken] = React.useState(null);
  const [imgSrc, setImgSrc] = React.useState(`https://pancakeswap.finance/images/tokens/${props.tokenAddress}.png`);
  const dialogRef = React.useRef();

  const close = (e) => {
    dialogRef.current.classList.add('closing');
    document.querySelector('#bg-overlay').classList.add('closing');

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
        </header>
        <button onClick={() => props.setInfoDrawerAddress(null)}>close</button>

        <div>
          <p>blah blah</p>
        </div>
      </>}
    </dialog>
  );
}