import React, { useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { abi as BEP20_ABI } from '../abis/BEP20';
import { WBNB as WBNB_ADDR } from '../constants';
import useWallet from '../hooks/Wallet';
import useErrorHandler from '../hooks/ErrorHandler';

const TokenContext = React.createContext({
  tokens: [], setTokens: () => {}, // TODO: rename this to smartChain (???)
  pancakeV1Tokens: [], setPancakeV1Tokens: () => {}, // TODO: remove "Tokens" from variable name
  pancakeV2Tokens: [], setPancakeV2Tokens: () => {},
  constants: [],
  getAll: () => {},
});

export default TokenContext;

export function TokenProvider(props) {
  const eth = useWallet();
  const handleError = useErrorHandler();
  const [tokens, setTokens] = useState([]);
  const [pancakeV1Tokens, setPancakeV1Tokens] = useState([]);
  const [pancakeV2Tokens, setPancakeV2Tokens] = useState([]);
  const [constants, setConstants] = useState([]);

  const getAll = () => [...constants, ...tokens, ...pancakeV1Tokens, ...pancakeV2Tokens];

  React.useEffect(() => {
    (async () => {
      const wbnb = {address: WBNB_ADDR.toLowerCase()};
      try {
        wbnb.contract = new Contract(wbnb.address, BEP20_ABI, eth.provider);
        wbnb.name = await wbnb.contract.name();
        wbnb.symbol = await wbnb.contract.symbol();
        wbnb.balance = await wbnb.contract.balanceOf(eth.selectedAddress());
        wbnb.decimals = await wbnb.contract.decimals();
      } catch(e) {
        handleError(e);
      }

      setConstants([wbnb]);
    })();
  }, []);

  const value = {
    tokens, setTokens,
    pancakeV1Tokens, setPancakeV1Tokens,
    pancakeV2Tokens, setPancakeV2Tokens,
    constants,
    getAll,
  };

  return (
    <TokenContext.Provider value={value}>
      {props.children}
    </TokenContext.Provider>
  );
}