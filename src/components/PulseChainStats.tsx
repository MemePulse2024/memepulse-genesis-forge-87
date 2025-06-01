
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, DollarSign, Users } from 'lucide-react';

const PulseChainStats = () => {
  const [blockNumber, setBlockNumber] = useState(18750324);
  const [gasPrice, setGasPrice] = useState(1.2);
  const [totalValueLocked, setTotalValueLocked] = useState(2.45);
  const [activeUsers, setActiveUsers] = useState(125847);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setBlockNumber(prev => prev + Math.floor(Math.random() * 3) + 1);
      setGasPrice(prev => Math.max(0.5, prev + (Math.random() - 0.5) * 0.1));
      setTotalValueLocked(prev => prev + (Math.random() - 0.5) * 0.01);
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);

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

  return (
    <section className="py-16 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">
            Live PulseChain Network Stats
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-time metrics from the world's fastest and most efficient blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Current Block</CardTitle>
              <Activity className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{blockNumber.toLocaleString()}</div>
              <p className="text-xs text-gray-400 mt-1">
                ⚡ 3 second blocks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-400/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Gas Price</CardTitle>
              <Zap className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{gasPrice.toFixed(2)} Gwei</div>
              <p className="text-xs text-gray-400 mt-1">
                💰 Ultra-low fees
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">TVL</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${formatNumber(totalValueLocked)}B</div>
              <p className="text-xs text-gray-400 mt-1">
                📈 Total Value Locked
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNumber(activeUsers, 0)}</div>
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
