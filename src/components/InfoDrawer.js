import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ClipboardJS from 'clipboard';
import { toChecksumAddress } from 'web3-utils';
// import { Contract } from '@ethersproject/contracts';
import AccountContext from '../contexts/AccountContext';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';
import TokenImage from './TokenImage';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import BscImg from '../../public/img/bscscan.png';
import {router as PancakeSwapV2RouterAddress} from '../abis/PancakeSwapRouterV2';
import './styles/InfoDrawer.css';

function TxnItem(props) {
  const date = new Date(props.txn.timeStamp * 1000);
  return (
    <li>
      <h4>{date.getMonth()}/{date.getDate()}/{date.getFullYear()} - {date.getHours()}:{date.getMinutes()}</h4>
      <p>{props.txn.input}</p>
    </li>
  );
}

function TokenData(props) {
  const [txnItems, setTxnItems] = useState([]);

  React.useEffect(() => {
    const arr = props.txns.filter(txn => txn.to === props.address);
    setTxnItems(arr.map(txn => <TxnItem key={txn.hash} txn={txn} />));
  }, [props.txns, props.address]);

  return (
    <section id="token-data">
      <h3>transactions</h3>
      <ul>
        {txnItems}
      </ul>
    </section>
  );
}

export default function InfoDrawer(props) {
  const acc = React.useContext(AccountContext);
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
      // props.setInfoDrawerAddress(null);
    }, 500);
  };

  // React.useEffect(() => {
  //   return function cleanup() {
  //     props.setInfoDrawerAddress(null);
  //   };
  // }, []);

  // might not need this at all......
  // const tryPancakeSwapV2Contract = async () => {
  //   let contract;
  //   console.log('pancakeswap LP')

  //   try {
  //     contract = new Contract(PancakeSwapV2RouterAddress, PancakeSwapV2Abi, eth.provider);
  //   } catch(e) {
  //     handleError(e);
  //     return;
  //   }
  // };

  // window.pancakeabi = PancakeSwapV2Abi;
  // window.sha3 = sha3;

  React.useEffect(() => {
    if(!props.tokenAddress) {
      close();
      return;
    }

    const t = acc.tokens.find(t => t.address === props.tokenAddress),
      addr = toChecksumAddress(t.address);
      
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
          <TokenImage address={token.address} />
          <h2>{token.name || <em>unknown token</em>}</h2>

          {checksumAddress && 
            <button id="btn-copy" data-clipboard-text={checksumAddress} aria-label={`Copy ${token.name} contract address`}>
              <FontAwesomeIcon icon={faCopy} /> {checksumAddress}
            </button> }

          <div id="drawer-ctrls">
            <div>
              <a href={`https://bscscan.com/address/${token.address}`} className="btn btn-bsc" target="_blank"><img src={BscImg} className="icon" /> BscScan</a>
            </div>
            <div id="drawer-balance">
              <p>{token && token.computedBalance ? token.computedBalance : '---'}</p>
            </div>
          </div>
        </header>
        <button className="btn btn-close" onClick={() => props.setInfoDrawerAddress(null)} aria-label="close info drawer">X</button>

        <TokenData txns={acc.txns} address={token.address} />
      </>}
    </dialog>
  );
}