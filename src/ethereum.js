const eth = {
  checkMetaMask: () => {
    if(!window.ethereum)
      throw Error('MetaMask not installed');
  },
  requestAccounts: () => {
    eth.checkMetaMask();

    return window.ethereum.request({method: 'eth_requestAccounts'})
      .then(res => {
        console.log(res)
        return res;
      });
  },
  getLogs: (address) => {
    eth.checkMetaMask();

    const params = [{
      fromBlock: 'latest',
      toBlock: 'latest',
      address,
    }];

    return window.ethereum.request({method: 'eth_getLogs', params})
      .then(res => {
        console.log(res);
        return res;
      });
  },
};

export default eth;