const apiKey = 'S5IBRSZ2DRSAY69XYNE8MHJKCA2PRB3HVK';

const bscscan = {
  txlist: (address, startBlock = 1, endBlock = 99999999, sort = 'asc') => {
    return fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=${sort}&apikey=${apiKey}`)
      .then(res => res.json());
  },
};

export default bscscan;