import React from 'react';
import {Web3Provider} from '@ethersproject/providers';
import eth from '../apis/ethereum';
import useErrorHandler from './ErrorHandler';

export default function useWallet() {
  const [provider, setProvider] = React.useState(null);
  const handleError = useErrorHandler();

  React.useEffect(() => {
    if(!window.ethereum || !eth.selectedAddress())
      return;
    
    setProvider(new Web3Provider(window.ethereum));
  }, [window.ethereum]);
  
  return {
    provider,
    selectedAddress: () => {
      eth.checkMetaMask();
      return eth.selectedAddress();
    },
    requestAccounts: () => {
      eth.checkMetaMask();
      return eth.requestAccounts().catch(handleError);
    },
    getCode: (address) => {
      eth.checkMetaMask();
      return eth.getCode(address).catch(handleError);
    },
    getLogs: (address) => {
      eth.checkMetaMask();
      return eth.getLogs(address).catch(handleError);
    },
    getBlockByNumber(blockNumber) {
      eth.checkMetaMask();
      return eth.getBlockByNumber(blockNumber).catch(handleError);
    },
    blockNumber() {
      eth.checkMetaMask();
      return eth.blockNumber().catch(handleError);
    }
  };
}