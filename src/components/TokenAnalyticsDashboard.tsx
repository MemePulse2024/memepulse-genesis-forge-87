import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TokenMetrics {
  price: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  totalSupply: number;
  circulatingSupply: number;
  priceChange24h: number;
  liquidityValue: number;
}

const TokenAnalyticsDashboard = () => {
  const { toast } = useToast();
  const [contractAddress, setContractAddress] = useState('');
  const [metrics, setMetrics] = useState<TokenMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockMetrics: TokenMetrics = {
    price: 0.000000012,
    marketCap: 1250000,
    volume24h: 45000,
    holders: 2847,
    totalSupply: 1000000000,
    circulatingSupply: 800000000,
    priceChange24h: 15.7,
    liquidityValue: 125000
  };

  const volumeData = [
    { name: 'Mon', volume: 32000 },
    { name: 'Tue', volume: 45000 },
    { name: 'Wed', volume: 38000 },
    { name: 'Thu', volume: 52000 },
    { name: 'Fri', volume: 45000 },
    { name: 'Sat', volume: 41000 },
    { name: 'Sun', volume: 48000 },
  ];

  const holderDistribution = [
    { name: 'Top 10 Holders', value: 25, color: '#8b5cf6' },
    { name: 'Large Holders', value: 35, color: '#f97316' },
    { name: 'Medium Holders', value: 25, color: '#10b981' },
    { name: 'Small Holders', value: 15, color: '#f59e0b' },
  ];

  const fetchTokenMetrics = async () => {
    if (!contractAddress) {
      toast({
        title: "Contract Address Required",
        description: "Please enter a valid contract address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      setTimeout(() => {
        setMetrics(mockMetrics);
        setIsLoading(false);
        toast({
          title: "Metrics Updated! 📊",
          description: "Token analytics have been refreshed.",
        });
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error Fetching Data",
        description: "Unable to fetch token metrics. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  const formatPrice = (price: number) => {
    if (price < 0.000001) {
      return price.toExponential(3);
    }
    return price.toFixed(8);
  };

  return (
    <section id="analytics" className="py-20 bg-gradient-to-br from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
            📊 Token Analytics
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Track your meme coin's performance with real-time analytics and insights
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Contract Input */}
          <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron">Token Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="contractAddress" className="text-white">Contract Address</Label>
                  <Input
                    id="contractAddress"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="bg-black/50 border-gray-600 text-white"
                    placeholder="0x..."
                  />
                </div>
                <div className="flex flex-col items-end gap-2 justify-end">
                  <Button
                    onClick={fetchTokenMetrics}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-pulse-purple to-pulse-orange hover:from-pulse-orange hover:to-pulse-purple"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Fetch Metrics
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800 w-full"
                    disabled={!contractAddress || contractAddress.length < 10}
                    onClick={() => {
                      if (contractAddress) {
                        window.open(`https://midgard.wtf/token/${contractAddress}`, '_blank');
                      }
                    }}
                  >
                    View on Midgard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {metrics && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="text-2xl font-bold text-white">${formatPrice(metrics.price)}</p>
                        <div className={`flex items-center text-sm ${metrics.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {metrics.priceChange24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          {Math.abs(metrics.priceChange24h)}%
                        </div>
                      </div>
                      <DollarSign className="w-8 h-8 text-pulse-orange" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Market Cap</p>
                        <p className="text-2xl font-bold text-white">${formatNumber(metrics.marketCap)}</p>
                        <p className="text-sm text-gray-400">Fully Diluted</p>
                      </div>
                      <Target className="w-8 h-8 text-pulse-purple" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">24h Volume</p>
                        <p className="text-2xl font-bold text-white">${formatNumber(metrics.volume24h)}</p>
                        <p className="text-sm text-gray-400">Trading Activity</p>
                      </div>
                      <BarChart className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Holders</p>
                        <p className="text-2xl font-bold text-white">{formatNumber(metrics.holders)}</p>
                        <p className="text-sm text-gray-400">Community Size</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron">7-Day Trading Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #6B7280',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }} 
                        />
                        <Bar dataKey="volume" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron">Holder Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={holderDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {holderDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #6B7280',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron text-lg">Supply Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Supply:</span>
                      <span className="text-white">{formatNumber(metrics.totalSupply)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Circulating:</span>
                      <span className="text-white">{formatNumber(metrics.circulatingSupply)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Burned:</span>
                      <span className="text-white">{formatNumber(metrics.totalSupply - metrics.circulatingSupply)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron text-lg">Liquidity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Value:</span>
                      <span className="text-white">${formatNumber(metrics.liquidityValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">🔒 Locked</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="font-orbitron text-lg">Health Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">87/100</div>
                      <div className="text-sm text-gray-400">
                        🟢 Healthy Distribution<br/>
                        🟢 Good Liquidity<br/>
                        🟡 Moderate Activity
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {!metrics && (
            <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                    Enter Contract Address
                  </h3>
                  <p className="text-gray-400">
                    Input your token's contract address to view detailed analytics and performance metrics
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default TokenAnalyticsDashboard;
