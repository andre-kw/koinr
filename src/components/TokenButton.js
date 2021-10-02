import React, {useState} from 'react';
import TokenImage from './TokenImage';

export default function TokenButton(props) {
  const [balance, setBalance] = useState('');
  const [clicked, setClicked] = useState(false);

  const onClick = (e) => {
    props.onClick();
    setClicked(true);

    setTimeout(() => setClicked(false), 150);
    setTimeout(() => {
      const closeBtn = document.querySelector('#info-drawer .btn-close');
      closeBtn.onclick = () => e.target.focus();
      closeBtn.focus();
    }, 300);
  };

  React.useEffect(() => {
    if(!props.token || !props.token.balance)
      return;
    
    const b = Number(props.token.balance.toBigInt() / BigInt(10 ** props.token.decimals));
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
        let bb = String(b / i);

        if(suffixes[i]) {
          bb = bb.slice(0, bb.indexOf('.') + 3) + suffixes[i];
        } else {
          bb = b / i;
        }

        return setBalance(bb);
      }
    }
  }, [props.token]);

  return (
    <button className={'token' + (clicked ? ' active' : '')} key={props.token.address} onClick={onClick}>
      <TokenImage address={props.token.address} />

      <div className="token-stats">
        <p><strong>{balance}</strong> {props.token.symbol || "???"}</p>
      </div>
    </button>
  );
}