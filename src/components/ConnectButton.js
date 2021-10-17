import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import useErrorHandler from 'hooks/ErrorHandler';
import useWallet from 'hooks/Wallet';

export default function ConnectButton(props) {
  const eth = useWallet();
  const handleError = useErrorHandler();

  const requestAccounts = async (e) => {
    try {
      const res = await eth.requestAccounts();
      props.setAddress(res[0]);
    } catch(e) {
      handleError(e);
    }
  };

  return (
    <button type="button" onClick={requestAccounts} id="connect">
      <FontAwesomeIcon icon={faArrowCircleRight} />
    </button>
  );
}