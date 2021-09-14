import React from 'react';
import { toChecksumAddress } from 'web3-utils';

export default function TokenButton(props) {
  const imgRef = React.useRef();
  // const [imgSrc, setImgSrc] = React.useState(`https://pancakeswap.finance/images/tokens/${props.token.address}.png`);
  const address = toChecksumAddress(props.token.address);
  const [imgSrc, setImgSrc] = React.useState(`https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`);
  const [balance, setBalance] = React.useState('');
  const fallbackImgSrc = '/img/bnb.png';

  const onClick = (e) => {
    imgRef.current.classList.add('clicked');
    setTimeout(() => {imgRef.current.classList.remove('clicked')}, 500);

    props.onClick();
  };

  React.useEffect(() => {
    const b = props.token.balance ? Number(props.token.balance.toBigInt() / BigInt(10 ** props.token.decimals)) : 0;
    const suffixes = {
      1000: 'K',
      1000000: 'M',
      1000000000: 'B',
      1000000000000: 'T',
    };

    for(let i = 1; i < 1000000000000; i *= 1000) {
      if(b === 0)
        return setBalance(0);

      if(b >= i && b < i * 1000) {
        let bb;

        if(suffixes[i]) {
          bb = (b / i).toPrecision(4) + suffixes[i];
        } else {
          bb = b / i;
        }

        return setBalance(bb);
      }
    }
  }, []);

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
        <p><strong>{balance}</strong> {props.token.symbol || "???"}</p>
      </div>
    </button>
  );
}