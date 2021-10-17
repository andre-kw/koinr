import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import ClipboardJS from 'clipboard';
import { toChecksumAddress } from 'web3-utils';
import { DateTime } from 'luxon';
import AccountContext from '../contexts/AccountContext';
import TokenContext from '../contexts/TokenContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import TokenImage from './TokenImage';
import {router as PancakeSwapV1RouterAddress} from '../abis/PancakeSwapV1Router';
import {router as PancakeSwapV2RouterAddress} from '../abis/PancakeSwapV2Router';
import PancakeSwapLogo from '../../public/img/pancakeswap.png';
import './styles/InfoDrawer.css';

export default function InfoDrawer(props) {
  const acc = React.useContext(AccountContext);
  const tkn = React.useContext(TokenContext);
  const eth = useWallet();
  const handleError = useErrorHandler();
  const [token, setToken] = useState(null);
  const [checksumAddress, setChecksumAddress] = useState('');
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
    }, 500);
  };

  React.useEffect(() => {
    if(!props.tokenAddress) {
      close();
      return;
    }

    let t = [...tkn.getAll(), ...tkn.constants]
      .find(tk => tk.address === props.tokenAddress);

    const addr = toChecksumAddress(t.address);
      
    setToken({...t});
    setChecksumAddress(addr);
    document.querySelector('#bg-overlay').classList.add('show'); // i know, ew
  }, [props.tokenAddress]);

  React.useEffect(() => {
    if(!token || !props.tokenAddress || token.computedBalance)
      return;

    (async () => {
      let b;

      try {
        b = await token.contract.balanceOf(eth.selectedAddress());
      } catch(e) {
        handleError(e);
        
        if(props.tokenAddress.toLowerCase() === PancakeSwapV2RouterAddress.toLowerCase())
          console.log('ahoy matey its pancakeswarp');
      }

      const bb = b ? Number(b.toBigInt() / BigInt(10 ** token.decimals)).toLocaleString() : '---';
      setToken({...token, computedBalance: bb});
    })();
  }, [token]);

  return (
    <dialog open={token} id="info-drawer" className={token ? 'open' : ''} ref={dialogRef}>
      {token && <>
        <header>
          <button className="btn btn-close" onClick={() => props.setInfoDrawerAddress(null)} aria-label="close info drawer" tabIndex="0">X</button>
          
          <TokenImage address={token.address} />
          <h2>{token.name || <em>unknown token</em>}</h2>

          {checksumAddress && 
            <button id="btn-copy" data-clipboard-text={checksumAddress} aria-label={`Copy ${token.name} contract address`}>
              <FontAwesomeIcon icon={faCopy} /> {checksumAddress}
            </button> }

          <div id="drawer-ctrls">
            <div>
              <a href={`https://bscscan.com/address/${token.address}`} className="btn btn-bsc" target="_blank" aria-label={`${token.name} on BSC scan`}></a>
              <a href={`https://poocoin.app/tokens/${token.address}`} className="btn btn-poo" target="_blank" aria-label={`${token.name} on PooCoin`}></a>
            </div>
            <div id="drawer-balance">
              <p>{token && token.computedBalance ? token.computedBalance : '---'}</p>
            </div>
          </div>
        </header>

        <TokenData txns={[...acc.txns, ...acc.pancakeV1Txns, ...acc.pancakeV2Txns]} address={token.address} />
      </>}
    </dialog>
  );
}


function TokenData(props) {
  const [buyTxns, setBuyTxns] = useState([]);
  const [sellTxns, setSellTxns] = useState([]);

  React.useEffect(() => {
    const buys = props.txns.filter(txn => {
      if(txn.to === props.address)
        return true;
      if(txn.inputData && Array.isArray(txn.inputData[1])) {
        const i = txn.inputData[1]; // internal transactions

        if(i.includes(props.address) && i[i.length - 1] === props.address)
          return true;
      }
    });
    
    const sells = props.txns.filter(txn => {
      if(txn.from === props.address)
        return true;
      if(txn.inputData && Array.isArray(txn.inputData[1])) {
        const i = txn.inputData[1]; // internal transactions

        if(i.includes(props.address) && i[i.length - 1] !== props.address)
          return true;
      }
    });
    
    setBuyTxns(buys.map(txn => <TxnItem key={txn.hash} txn={txn} type="buy" />));
    setSellTxns(sells.map(txn => <TxnItem key={txn.hash} txn={txn} type="sell" />));
  }, [props.txns, props.address]);

  return (
    <section id="token-data">
      <h3>transactions</h3>
      <ul>
        {[...buyTxns, ...sellTxns]
          .sort((a,b) => b.props.txn.timeStamp - a.props.txn.timeStamp)}
      </ul>
    </section>
  );
}


function TxnItem(props) {
  // const date = new Date(props.txn.timeStamp * 1000);
  const formattedDate = DateTime.fromSeconds(Number(props.txn.timeStamp)).toLocaleString(DateTime.DATETIME_MED);
  const isPancakeV1 = props.txn.to === PancakeSwapV1RouterAddress.toLowerCase();
  const isPancakeV2 = props.txn.to === PancakeSwapV2RouterAddress.toLowerCase();
  let logo, fn = '';
  
  if(isPancakeV1 || isPancakeV2)
    logo = <img src={PancakeSwapLogo} className="logo pancake" alt="Transaction made with PancakeSwap V2" />;
  else
    logo = <TokenImage address={props.txn.to} logo />;

  if(props.txn.extraData) {
    if(props.txn.extraData['fn'].includes('swap'))
      fn = 'swap';
    else if(props.txn.extraData['fn'].includes('approve'))
      fn = 'approve';
  }

  return (
    <li className={'token-txn ' + (props.type === 'buy' ? 'token-txn-buy' : 'token-txn-sell')}>
      <header>
        <div>
          <FontAwesomeIcon icon={faArrowAltCircleRight} />
          {logo}
        </div>
        <h4>{formattedDate}</h4>
      </header>
      <footer>
        <a href={`https://bscscan.com/tx/${props.txn.hash}`} target="_blank">{props.txn.hash.slice(0, 20)}...</a>
        <p className={'token-txn-status' + (fn ? ` token-txn-${fn}` : '')}>
          {fn === 'swap' && <strong>{String(props.txn.value / 1000000000000000000).slice(0, 8)} BNB</strong>}
          {fn === 'approve' && <strong>Approve</strong>}
        </p>
      </footer>
    </li>
  );
}