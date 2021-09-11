import React from 'react';

export default function TokenButton(props) {
  const [imgSrc, setImgSrc] = React.useState(`https://pancakeswap.finance/images/tokens/${props.token.address}.png`);
  // const [imgSrc, setImgSrc] = React.useState(`https://assets.trustwalletapp.com/blockchains/smartchain/assets/${props.token.address}/logo.png`);
  const fallbackImgSrc = 'https://cdn.pixabay.com/photo/2021/04/30/16/47/bnb-6219388_1280.png';

  return (
    <button className="token" key={props.token.address}>
      <img 
        src={imgSrc} 
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