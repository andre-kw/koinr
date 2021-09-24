import { Contract } from '@ethersproject/contracts';
import { BigNumber,isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
// import { router as PancakeSwapV2RouterAddress } from '../abis/PancakeSwapV2Router';
import useWallet from './Wallet';
import useErrorHandler from './ErrorHandler';
import {abi as BEP20} from '../abis/BEP20';
import { WBNB } from '../constants';

export default function usePancakeTxnIterator() {
  const eth = useWallet();
  const handleError = useErrorHandler();

  const iterator = async (txns) => ({
    async *[Symbol.asyncIterator]() {
      for(let i = 0; i < txns.length; i++) {
        if(txns[i].isError === "1")
          yield;

        // if(txns[i].from === eth.selectedAddress()) {
        //   // sending/swapping
        //   let code;

        //   try {
        //     code = await eth.getCode(txns[i].to);
        //   } catch(e) {
        //     handleError(e);
        //   }

        //   if(code && code !== '0x')
        //     yield {address: txns[i].to};

        // } else if(txns[i].to === eth.selectedAddress()) {
        //   // TODO: receiving
        // }

        const arr = txns[i].args[1];

        // buy
        if(Array.isArray(arr) && arr[0] === WBNB) {
          yield {address: arr[arr.length - 1]};
        }
      }
    }
  });

  const getTokens = async (txns) => {
    const temp = [];

    for await (let token of await iterator(txns)) {
      if(!token 
          || temp.findIndex(t => token.address === t.address) > -1)
        continue;

      let contract, name, symbol, balance, decimals;

      try {
        contract = new Contract(token.address, BEP20, eth.provider);
        name = await contract.name();
        symbol = await contract.symbol();
        balance = await contract.balanceOf(eth.selectedAddress());
        decimals = await contract.decimals();
      } catch(e) {
        e.data.origin = 'getTokens';
        e.data.address = token.address;
        handleError(e);
        // continue;
      }

      if(!isBigNumberish(balance))
        balance = BigNumber.from(0);

      if(!isBigNumberish(decimals))
        decimals = BigNumber.from(1); // TODO: need to know when this would actually be a thing
      
      temp.push({...token, contract, name, symbol, balance, decimals});
    }

    return temp;
  };

  return {
    iterator,
    getTokens
  }
};
