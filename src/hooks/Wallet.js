import React from 'react';
import eth from '../apis/ethereum';
import useErrorHandler from './ErrorHandler';

export default function useWallet() {
  const handleError = useErrorHandler();
  
  return {
    selectedAddress: () => {
      eth.checkMetaMask();
      return eth.selectedAddress();
    },
    requestAccounts: () => {
      eth.checkMetaMask();
      return eth.requestAccounts().catch(handleError);
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