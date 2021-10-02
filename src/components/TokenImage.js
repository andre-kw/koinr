import React, {useState} from 'react';
import { toChecksumAddress } from 'web3-utils';
import BnbImg from '../../public/img/bnb.png';

export default function TokenImage(props) {
  const containerRef = React.useRef();
  const [img, setImg] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  const fetchImg = () => {
    const address = toChecksumAddress(props.address);
    const myImg = new Image();
    myImg.src = `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
    myImg.width = props.logo ? '24' : '73';
    myImg.height = props.logo ? '24' : '73';
    myImg.classList.add('token-icon');
    props.logo && myImg.classList.add('small');
    myImg.onerror = e => {e.target.onerror = null; setUseFallback(true)};
    setImg(myImg);
    containerRef.current.appendChild(myImg);
  };

  React.useEffect(() => {
    const c = containerRef.current;

    if(c.firstChild)
      c.removeChild(c.firstChild);

    fetchImg();
  }, [props.address]);

  React.useEffect(() => {
    if(!useFallback) return;

    img.src = BnbImg;
    img.classList.add('no-logo');
  }, [useFallback]);


  return <span ref={containerRef}></span>;
}