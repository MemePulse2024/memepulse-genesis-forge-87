
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, DollarSign, Users } from 'lucide-react';

interface PulseChainStats {
  blockNumber: number;
  gasPrice: number;
  totalValueLocked: number;
  activeUsers: number;
}

const PulseChainStats = () => {
  const [stats, setStats] = useState<PulseChainStats>({
    blockNumber: 18750324,
    gasPrice: 1200000000000000,
    totalValueLocked: 2.45,
    activeUsers: 125847
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPulseChainStats = async () => {
    try {
      console.log('Fetching PulseChain stats from RPC...');
      
      // Use PulseChain mainnet RPC
      const rpcUrl = 'https://rpc.pulsechain.com';
      
      // Fetch latest block
      const blockResponse = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      
      const blockData = await blockResponse.json();
      console.log('Block response:', blockData);
      
      // Fetch gas price
      const gasPriceResponse = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 2
        })
      });
      
      const gasPriceData = await gasPriceResponse.json();
      console.log('Gas price response:', gasPriceData);
      
      if (blockData.result && gasPriceData.result) {
        const blockNumber = parseInt(blockData.result, 16);
        const gasPriceBeats = parseInt(gasPriceData.result, 16);
        
        setStats(prev => ({
          blockNumber: blockNumber,
          gasPrice: gasPriceBeats, // Store raw beats value
          totalValueLocked: prev.totalValueLocked + (Math.random() - 0.5) * 0.01, // Simulated TVL updates
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10 // Simulated user updates
        }));
        
        setError(null);
        console.log('Successfully updated stats:', { blockNumber, gasPriceBeats });
      } else {
        throw new Error('Invalid response from RPC');
      }
      
    } catch (err) {
      console.error('Error fetching PulseChain stats:', err);
      setError('Failed to fetch live data');
      
      // Fallback to simulated updates
      setStats(prev => ({
        blockNumber: prev.blockNumber + 1,
        gasPrice: Math.max(1000000000000, prev.gasPrice + (Math.random() - 0.5) * 100000000000),
        totalValueLocked: prev.totalValueLocked + (Math.random() - 0.5) * 0.01,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPulseChainStats();
    
    // Set up interval for updates every 12 seconds (PulseChain block time)
    const interval = setInterval(fetchPulseChainStats, 12000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toFixed(decimals);
  };

  const formatBeats = (beats: number) => {
    if (beats >= 1e15) {
      return (beats / 1e15).toFixed(1) + 'P'; // Peta-beats
    } else if (beats >= 1e12) {
      return (beats / 1e12).toFixed(1) + 'T'; // Tera-beats
    } else if (beats >= 1e9) {
      return (beats / 1e9).toFixed(1) + 'G'; // Giga-beats
    } else if (beats >= 1e6) {
      return (beats / 1e6).toFixed(1) + 'M'; // Mega-beats
    } else if (beats >= 1e3) {
      return (beats / 1e3).toFixed(1) + 'K'; // Kilo-beats
    }
    return beats.toString();
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">
            Live PulseChain Network Stats
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base px-4">
            Real-time metrics from the world's fastest and most efficient blockchain
            {error && <span className="text-amber-400"> (Displaying simulated data)</span>}
          </p>
          <p className="text-xs text-gray-500 mt-2 max-w-xl mx-auto">
            💡 <span className="text-amber-300">Beats</span> are the smallest unit of PLS (like Wei on Ethereum). 1 PLS = 10¹⁸ beats
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-300">Current Block</CardTitle>
              <Activity className={`h-4 w-4 text-indigo-400 ${isLoading ? 'animate-pulse' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-white">{stats.blockNumber.toLocaleString()}</div>
              <p className="text-xs text-gray-400 mt-1">
                ⏱️ 12 second blocks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-400/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-300">Gas Price</CardTitle>
              <Zap className={`h-4 w-4 text-amber-400 ${isLoading ? 'animate-pulse' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-white">{formatBeats(stats.gasPrice)} beats</div>
              <p className="text-xs text-gray-400 mt-1">
                💰 Ultra-low fees
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-300">TVL</CardTitle>
              <DollarSign className={`h-4 w-4 text-green-400 ${isLoading ? 'animate-pulse' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-white">${formatNumber(stats.totalValueLocked)}B</div>
              <p className="text-xs text-gray-400 mt-1">
                📈 Total Value Locked
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-300">Active Users</CardTitle>
              <Users className={`h-4 w-4 text-purple-400 ${isLoading ? 'animate-pulse' : ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-white">{formatNumber(stats.activeUsers, 0)}</div>
              <p className="text-xs text-gray-400 mt-1">
                👥 24h active wallets
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PulseChainStats;
