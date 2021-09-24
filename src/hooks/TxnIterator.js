import useErrorHandler from './ErrorHandler';

export default function useTxnIterator(eth) {
  const handleError = useErrorHandler();

  return async (txns) => ({
    async *[Symbol.asyncIterator]() {
      for(let i = 0; i < txns.length; i++) {
        if(txns.isError === "1")
          yield;

        if(txns[i].from === eth.selectedAddress()) {
          // sending/swapping
          let code;

          try {
            code = await eth.getCode(txns[i].to);
          } catch(e) {
            handleError(e);
          }

          if(code && code !== '0x')
            yield {address: txns[i].to};

        } else if(txns[i].to === eth.selectedAddress()) {
          // TODO: receiving
        }
      }
    }
  });
};
