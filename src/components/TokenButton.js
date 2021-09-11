import React from 'react';

export default function TokenButton(props) {
  //`https://assets.trustwalletapp.com/blockchains/smartchain/assets/${props.token.address}/logo.png`
  const [imgSrc, setImgSrc] = React.useState(`https://pancakeswap.finance/images/tokens/${props.token.address}.png`);

  React.useEffect(() => {
    fetch(imgSrc, {mode: 'no-cors'})
      .then(res => console.log(res))
      // .then(blob => {
      //   console.log(blob)
      // });
  }, []);

  return (
    <button className="token" key={props.token.address}>
      <img src={imgSrc} />
      <div className="token-stats">
        <p>1.25B {props.token.symbol || "???"}</p>
      </div>
    </button>
  );
}