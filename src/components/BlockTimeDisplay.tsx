
import { useState, useEffect } from 'react';

const BlockTimeDisplay = () => {
  const [averageBlockTime, setAverageBlockTime] = useState<string>('Loading...');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        console.log('Fetching recent blocks to calculate average block time...');
        
        // Fetch the latest block first
        const latestResponse = await fetch('https://rpc.pulsechain.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: ['latest', false],
            id: 1,
          }),
        });

        if (!latestResponse.ok) {
          throw new Error(`HTTP error! status: ${latestResponse.status}`);
        }

        const latestData = await latestResponse.json();
        console.log('Latest block data received:', latestData);

        if (!latestData.result || !latestData.result.number) {
          throw new Error('Invalid latest block response');
        }

        const latestBlockNumber = parseInt(latestData.result.number, 16);
        const blocksToFetch = 10; // Get last 10 blocks for average
        const blockPromises = [];

        // Fetch the last 10 blocks
        for (let i = 0; i < blocksToFetch; i++) {
          const blockNumber = `0x${(latestBlockNumber - i).toString(16)}`;
          blockPromises.push(
            fetch('https://rpc.pulsechain.com', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBlockByNumber',
                params: [blockNumber, false],
                id: i + 2,
              }),
            }).then(res => res.json())
          );
        }

        const blockResponses = await Promise.all(blockPromises);
        const validBlocks = blockResponses
          .filter(response => response.result && response.result.timestamp)
          .map(response => ({
            number: parseInt(response.result.number, 16),
            timestamp: parseInt(response.result.timestamp, 16)
          }))
          .sort((a, b) => a.number - b.number);

        if (validBlocks.length < 2) {
          throw new Error('Not enough valid blocks to calculate average');
        }

        // Calculate average block time
        const timeDifferences = [];
        for (let i = 1; i < validBlocks.length; i++) {
          const timeDiff = validBlocks[i].timestamp - validBlocks[i - 1].timestamp;
          timeDifferences.push(timeDiff);
        }

        const averageSeconds = timeDifferences.reduce((sum, diff) => sum + diff, 0) / timeDifferences.length;
        
        console.log(`Average block time calculated: ${averageSeconds.toFixed(1)}s`);
        setAverageBlockTime(`${averageSeconds.toFixed(1)}s blocks`);
        setError(false);

      } catch (error) {
        console.error('Block data fetch error:', error);
        setError(true);
        setAverageBlockTime('~12s blocks');
      }
    };

    // Initial fetch
    fetchBlockData();
    
    // Update every 30 seconds since we're showing average, not real-time
    const interval = setInterval(fetchBlockData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="px-3 md:px-4 py-2 bg-indigo-600/30 border border-indigo-400/50 text-indigo-300 font-semibold rounded-full text-xs md:text-sm backdrop-blur-sm">
      ⚡ {averageBlockTime}
    </span>
  );
};

export default BlockTimeDisplay;
