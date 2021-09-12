import React from 'react';
import './styles/BackgroundOverlay.css';

export default function BackgroundOverlay(props) {
  const ref = React.useRef();

  // React.useEffect(() => {
  //   if(props.show) {
  //     ref.current.classList.add('show');
  //   } else {
  //     ref.current.classList.add('closing');

  //     setTimeout(() => {
  //       ref.current.classList.remove('closing');
  //       ref.current.classList.remove('show');
  //     }, 500);
  //   }
  // }, [props.show]);

  return (
    <div id="bg-overlay" ref={ref}></div>
  );
}