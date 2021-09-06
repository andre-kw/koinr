import React from 'react';
import useErrorHandler from './ErrorHandler';

export default function useEthereum() {
  const handleError = useErrorHandler();
  
  return {
    checkMetaMask: () => {
      if(!window.ethereum)
        throw Error('MetaMask not installed');
    },
    requestAccounts: () => {
      this.checkMetaMask();
  
      return window.ethereum.request({method: 'eth_requestAccounts'})
        .then(res => {
          console.log(res)
          return res;
        })
        .catch(handleError);
    },
    getLogs: (address) => {
      this.checkMetaMask();
  
      const params = [{
        fromBlock: 'latest',
        toBlock: 'latest',
        address,
      }];
  
      return window.ethereum.request({method: 'eth_getLogs', params})
        .then(res => {
          console.log(res);
          return res;
        })
        .catch(handleError);
    },
    getBlockByNumber(blockNumber) {
      this.checkMetaMask();
  
      return window.ethereum.request({method: 'eth_getBlockByNumber', params: [blockNumber, true]})
        .then(res => {
          // console.log(res);
          return res;
        })
        .catch(handleError);
    },
    blockNumber() {
      this.checkMetaMask();
  
      return window.ethereum.request({method: 'eth_blockNumber', params: []})
        .catch(handleError);
    }
  };
}