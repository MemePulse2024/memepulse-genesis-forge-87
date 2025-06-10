
import { useState, useEffect } from 'react';

const BlockTimeDisplay = () => {
  const [blockTime, setBlockTime] = useState<string>('12 second block times');
  const [lastBlockTime, setLastBlockTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const response = await fetch('https://rpc.pulsechain.com', {
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

        const data = await response.json();
        if (data.result) {
          const timestamp = parseInt(data.result.timestamp, 16) * 1000;
          const blockDate = new Date(timestamp);
          setLastBlockTime(blockDate);
          
          // Format the time display
          const now = new Date();
          const secondsAgo = Math.floor((now.getTime() - blockDate.getTime()) / 1000);
          
          if (secondsAgo < 60) {
            setBlockTime(`${secondsAgo}s ago`);
          } else {
            const minutesAgo = Math.floor(secondsAgo / 60);
            setBlockTime(`${minutesAgo}m ago`);
          }
        }
      } catch (error) {
        console.log('Block data fetch error:', error);
        setBlockTime('12 second block times');
      }
    };

    fetchBlockData();
    const interval = setInterval(fetchBlockData, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="px-3 md:px-4 py-2 bg-indigo-600/30 border border-indigo-400/50 text-indigo-300 font-semibold rounded-full text-xs md:text-sm backdrop-blur-sm">
      ⚡ {blockTime}
    </span>
  );
};

export default BlockTimeDisplay;
