import React, {useState} from 'react';
import { toChecksumAddress } from 'web3-utils';
import BnbImg from '../../public/img/bnb.png';

export default function TokenImage(props) {
  const imgRef = React.useRef();
  const [img, setImg] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  const onClick = () => {
    img.classList.add('clicked');
    setTimeout(() => {img.classList.remove('clicked')}, 500);
  };

  React.useEffect(() => {
    const address = toChecksumAddress(props.address);
    const myImg = new Image();
    myImg.src = `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
    myImg.width = props.logo ? '24' : '73';
    myImg.height = props.logo ? '24' : '73';
    myImg.classList.add('token-icon');
    props.logo && myImg.classList.add('small');
    myImg.onerror = e => {e.target.onerror = null; setUseFallback(true)};
    setImg(myImg);
    imgRef.current.appendChild(myImg);
  }, []);

  React.useEffect(() => {
    if(!useFallback) return;

    img.src = BnbImg;
    img.classList.add('no-logo');
  }, [useFallback]);


  return <span ref={imgRef}></span>;
}