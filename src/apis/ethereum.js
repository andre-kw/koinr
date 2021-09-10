const ethereum = {
  checkMetaMask: () => {
    if(!window.ethereum)
      throw Error('MetaMask not installed');

    return true;
  },
  selectedAddress: () => window.ethereum.selectedAddress,
  requestAccounts: () => {
    return window.ethereum.request({method: 'eth_requestAccounts'})
      .then(res => {
        console.log(res)
        return res;
      })
  },
  getLogs: (address) => {
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
  },
  getBlockByNumber: (blockNumber) => {
    return window.ethereum.request({method: 'eth_getBlockByNumber', params: [blockNumber, true]})
      .then(res => {
        // console.log(res);
        return res;
      })
      .catch(handleError);
  },
  blockNumber: () => {
    return window.ethereum.request({method: 'eth_blockNumber', params: []})
  },
};

export default ethereum;