import React, {useState} from 'react';
import useEthereum from '../hooks/Ethereum';

const chunkSize = 10;

export default function BlockExplorer(props) {
  const eth = useEthereum();
  const [currentBlock, setCurrentBlock] = useState(Number(10349289).toString(16));
  const [isExploring, setIsExploring] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const getIterator = async () => {
    const from = currentBlock || await eth.blockNumber();
    return {
      from,
      to: '0x' + Number(parseInt(from, 16) - chunkSize).toString(16),

      async *[Symbol.asyncIterator]() {
        for(let i = parseInt(this.from, 16) - 1; i > parseInt(this.to, 16); i--) {
          setCurrentBlock(Number(i).toString(16));

          const prevBlock = await eth.getBlockByNumber('0x' + Number(i - 1).toString(16));
          yield {...prevBlock, endBlock: this.to};
        }
      }
    };
  };

  const explore = async () => {
    if(!enabled) {
      return;
    } else if (enabled && !isExploring) {
      return setIsExploring(true);
    }

    for await (let data of await getIterator()) {
      if(data.number === data.endBlock) {
        console.log(`[DEBUG] processing block ${parseInt(data.endBlock, 16)} + ${chunkSize}`);
        console.log(data);
      }
    }

    setIsExploring(false);

    if(enabled)
      setIsExploring(true);
  };

  React.useEffect(() => explore(), [enabled, isExploring]);
  
  return (
    <div>
      {isExploring
        ? <>
          <p>one block down, <strong>{parseInt(currentBlock, 16).toLocaleString()}</strong> more to go</p>
        </>
        : <>
          <p>paused exploring {currentBlock ? 'on block ' + currentBlock : ''}</p>
        </>}

        <button type="button" onClick={() => setEnabled(!enabled)}>toggle</button>
    </div>
  );
}