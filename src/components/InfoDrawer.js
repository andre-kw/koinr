import React from 'react';
import AccountContext from '../contexts/AccountContext';
import './styles/InfoDrawer.css';

export default function InfoDrawer(props) {
  const acc = React.useContext(AccountContext);
  const [token, setToken] = React.useState(null);
  const dialogRef = React.useRef();

  React.useEffect(() => {
    if(!props.tokenAddress) return;

    setToken(acc.tokens.find(t => t.address === props.tokenAddress));
    document.querySelector('#bg-overlay').classList.add('show'); // i know, ew
  }, [props.tokenAddress]);

  const close = (e) => {
    dialogRef.current.classList.add('closing');
    document.querySelector('#bg-overlay').classList.add('closing');

    setTimeout(() => {
      dialogRef.current.classList.remove('closing');
      document.querySelector('#bg-overlay').classList.remove(...['closing', 'show']);
      props.setInfoDrawerAddress(null);
    }, 500);
  };

  return (
    <dialog open={props.tokenAddress} id="info-drawer" className={props.tokenAddress ? 'open' : ''} ref={dialogRef}>
      {(props.tokenAddress && token) && <>
        <h2>{token.name || <em>unknown token</em>}</h2>
        <button onClick={close}>close</button>
      </>}
    </dialog>
  );
}