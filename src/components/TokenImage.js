import React, {useState} from 'react';
import { toChecksumAddress } from 'web3-utils';
import BnbImg from '../../public/img/bnb.png';

export default function TokenImage(props) {
  const containerRef = React.useRef();
  const [img, setImg] = useState(null);

  const setFallbackImg = (el) => {
    el.src = BnbImg;
    el.classList.add('no-logo');
  };

  const fetchImg = () => {
    const address = toChecksumAddress(props.address);
    const myImg = new Image();
    myImg.src = `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
    myImg.width = props.logo ? '24' : '73';
    myImg.height = props.logo ? '24' : '73';
    myImg.ariaHidden = 'true';
    myImg.onerror = e => {e.target.onerror = null; setFallbackImg(e.target)};
    myImg.classList.add('token-icon');
    props.logo && myImg.classList.add('small');
    setImg(myImg);
  };

  React.useEffect(() => {
    const c = containerRef.current;
    c.firstChild && c.removeChild(c.firstChild);
    img instanceof Node && c.appendChild(img);
  }, [img]);

  React.useEffect(() => {
    fetchImg();
  }, [props.address]);


  return <span ref={containerRef}></span>;
}