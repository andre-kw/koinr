import React from 'react';
import eth from 'ethereum';
import useErrorHandler from 'hooks/ErrorHandler';
import './styles/ConnectButton.css';

export default function ConnectButton(props) {
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
    <button type="button" onClick={requestAccounts} id="connect">connect</button>
  );
}