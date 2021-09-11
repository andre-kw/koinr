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
  getCode: (address) => {
    return window.ethereum.request({method: 'eth_getCode', params: [address, 'latest']})
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
  },
  blockNumber: () => {
    return window.ethereum.request({method: 'eth_blockNumber', params: []})
  },
};

export default ethereum;