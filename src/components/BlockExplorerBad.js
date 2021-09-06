import React from 'react';
import useEthereum from '../hooks/Ethereum';

export default function BlockExplorer(props) {
  const eth = useEthereum();
  const [currentBlock, setCurrentBlock] = React.useState(null);
  const [isExploring, setIsExploring] = React.useState(false);

  // const getIterator = async () => ({
  //   from: oldestBlock || await eth.blockNumber(),
  //   to: 0,

  //   async *[Symbol.asyncIterator]() {
  //     for(let i = parseInt(this.from, 16); i > this.to; i--) {
  //       setOldestBlock(Number(i).toString(16));

  //       const prevBlock = await eth.getBlockByNumber('0x' + Number(i - 1).toString(16));
  //       yield prevBlock;
  //     }
  //   }
  // });

  React.useEffect(() => {
    (async () => setCurrentBlock(await eth.blockNumber()))();
  }, []);

  React.useEffect(() => {
    if(!isExploring)
      return;

    (async () => {
      while(isExploring) {
        const prevBlockNumber = '0x' + Number(parseInt(currentBlock, 16) - 1).toString(16);
        const prevBlock = await eth.getBlockByNumber(prevBlockNumber);
      }
    })();
  }, [isExploring]);
  

  return (
    <div>
      {isExploring
        ? <>
          <p>exploring block number {parseInt(currentBlock, 16)}</p>
        </>
        : <>
          <p>paused exploring on block {parseInt(currentBlock, 16)}</p>
        </>}

        <button type="button" onClick={() => setIsExploring(!isExploring)}>toggle</button>
    </div>
  );
}