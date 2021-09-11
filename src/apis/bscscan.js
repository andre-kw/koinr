const apiKey = 'S5IBRSZ2DRSAY69XYNE8MHJKCA2PRB3HVK';

const bscscan = {
  txlist: (address, startBlock = 1, endBlock = 99999999, sort = 'asc') => {
    return fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=${sort}&apikey=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if(data.message !== "OK")
          throw Error('BscScan API call failed with status ' + data.status);

        return data.result;
      })
  },
};

export default bscscan;
