import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import useErrorHandler from 'hooks/ErrorHandler';
import useWallet from 'hooks/Wallet';
import './styles/Buttons.css';

export default function ConnectButton(props) {
  const eth = useWallet();
  const handleError = useErrorHandler();

  const requestAccounts = async (e) => {
    if(!window.ethereum)
      return;
      
    try {
      const res = await eth.requestAccounts();
      props.setAddress(res[0]);
    } catch(e) {
      handleError(e);
    }
  };

  return (
    <button 
      type="button" 
      onClick={requestAccounts} 
      className={window.ethereum ? '' : 'btn-err'} 
      aria-disabled={window.ethereum ? 'false' : 'true'} 
      id="connect">
        <FontAwesomeIcon icon={window.ethereum ? faArrowCircleRight : faExclamationCircle} />
    </button>
  );
}