import React, {useState} from 'react';
import TokenImage from './TokenImage';

export default function TokenButton(props) {
  const [balance, setBalance] = useState('');

  const onClick = (e) => {
    props.onClick();
  };

  React.useEffect(() => {
    if(!props.token) return;
    
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
  }, [props.token]);

  return (
    <button className="token" key={props.token.address} onClick={onClick}>
      <TokenImage address={props.token.address} />

      <div className="token-stats">
        <p><strong>{balance}</strong> {props.token.symbol || "???"}</p>
      </div>
    </button>
  );
}