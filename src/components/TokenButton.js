import React from 'react';
import { toChecksumAddress } from 'web3-utils';

export default function TokenButton(props) {
  const imgRef = React.useRef();
  // const [imgSrc, setImgSrc] = React.useState(`https://pancakeswap.finance/images/tokens/${props.token.address}.png`);
  const address = toChecksumAddress(props.token.address);
  const [imgSrc, setImgSrc] = React.useState(`https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`);
  const fallbackImgSrc = '/img/bnb.png';

  const onClick = (e) => {
    imgRef.current.classList.add('clicked');
    setTimeout(() => {imgRef.current.classList.remove('clicked')}, 500);

    props.onClick();
  };

  return (
    <button className="token" key={props.token.address} onClick={onClick}>
      <img 
        src={imgSrc} 
        ref={imgRef} 
        width="73" 
        height="73" 
        className={imgSrc === fallbackImgSrc ? 'no-logo':''}
        onError={e => {e.target.onerror = null; setImgSrc(fallbackImgSrc)}} />

      <div className="token-stats">
        <p><strong>1.25B</strong> {props.token.symbol || "???"}</p>
      </div>
    </button>
  );
}