
import { useState, useEffect } from 'react';

const BlockTimeDisplay = () => {
  const [blockTime, setBlockTime] = useState<string>('Loading...');
  const [lastBlockTime, setLastBlockTime] = useState<Date | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        console.log('Fetching latest block data from PulseChain...');
        
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Block data received:', data);

        if (data.result && data.result.timestamp) {
          const timestamp = parseInt(data.result.timestamp, 16) * 1000;
          const blockDate = new Date(timestamp);
          setLastBlockTime(blockDate);
          setError(false);
          
          // Calculate time difference
          const now = new Date();
          const secondsAgo = Math.floor((now.getTime() - blockDate.getTime()) / 1000);
          
          console.log(`Block timestamp: ${blockDate.toISOString()}, ${secondsAgo}s ago`);
          
          if (secondsAgo < 60) {
            setBlockTime(`${secondsAgo}s ago`);
          } else if (secondsAgo < 3600) {
            const minutesAgo = Math.floor(secondsAgo / 60);
            setBlockTime(`${minutesAgo}m ago`);
          } else {
            const hoursAgo = Math.floor(secondsAgo / 3600);
            setBlockTime(`${hoursAgo}h ago`);
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Block data fetch error:', error);
        setError(true);
        setBlockTime('~12s blocks');
      }
    };

    // Initial fetch
    fetchBlockData();
    
    // Update every 10 seconds for more accurate timing
    const interval = setInterval(fetchBlockData, 10000);

    return () => clearInterval(interval);
  }, []);

  // Update the display every second when we have real data
  useEffect(() => {
    if (!lastBlockTime || error) return;

    const updateTimer = setInterval(() => {
      const now = new Date();
      const secondsAgo = Math.floor((now.getTime() - lastBlockTime.getTime()) / 1000);
      
      if (secondsAgo < 60) {
        setBlockTime(`${secondsAgo}s ago`);
      } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        setBlockTime(`${minutesAgo}m ago`);
      } else {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        setBlockTime(`${hoursAgo}h ago`);
      }
    }, 1000);

    return () => clearInterval(updateTimer);
  }, [lastBlockTime, error]);

  return (
    <span className="px-3 md:px-4 py-2 bg-indigo-600/30 border border-indigo-400/50 text-indigo-300 font-semibold rounded-full text-xs md:text-sm backdrop-blur-sm">
      ⚡ {blockTime}
    </span>
  );
};

export default BlockTimeDisplay;
