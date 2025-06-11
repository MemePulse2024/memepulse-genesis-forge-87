import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TokenomicsData, validateAllocations } from '@/utils/tokenomicsValidation';
import { BasicSettingsForm } from './tokenomics/BasicSettingsForm';
import { TaxAllocationForm } from './tokenomics/TaxAllocationForm';
import { SupplyAllocationForm } from './tokenomics/SupplyAllocationForm';
import { TokenomicsDistributionChart } from './tokenomics/TokenomicsDistributionChart';
import { ActionButtons } from './tokenomics/ActionButtons';
import { PresetSelector } from './tokenomics/PresetSelector';
import { TokenUtilitySuggestions } from './tokenomics/TokenUtilitySuggestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface TokenomicsEngineProps {
  tokenomics: TokenomicsData;
  setTokenomics: React.Dispatch<React.SetStateAction<TokenomicsData>>;
}

const TokenomicsEngine = ({ tokenomics, setTokenomics }: TokenomicsEngineProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    const validationErrors = validateAllocations(tokenomics);
    setErrors(validationErrors);
  }, [tokenomics]);

  // Update tokenomics values
  const updateTokenomics = (field: string, value: string, subField?: string) => {
    if (subField) {
      setTokenomics(prev => {
        if (field === 'taxAllocation') {
          return {
            ...prev,
            taxAllocation: {
              ...prev.taxAllocation,
              [subField]: value
            }
          };
        } else if (field === 'supplyAllocation') {
          return {
            ...prev,
            supplyAllocation: {
              ...prev.supplyAllocation,
              [subField]: value
            }
          };
        }
        return prev;
      });
    } else {
      setTokenomics(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Set entire tokenomics data (for presets)
  const setTokenomicsData = (data: TokenomicsData) => {
    setTokenomics(data);
    toast({
      title: "Preset Applied! 🎯",
      description: "Tokenomics values have been updated.",
    });
  };

  // Chart data
  const taxChartData = [
    { name: 'Liquidity', value: parseFloat(tokenomics.taxAllocation.liquidity || '0'), color: '#6a0dad' },
    { name: 'Marketing', value: parseFloat(tokenomics.taxAllocation.marketing || '0'), color: '#ff5733' },
    { name: 'Burn', value: parseFloat(tokenomics.taxAllocation.burn || '0'), color: '#ff3333' },
  ];

  const supplyChartData = [
    { name: 'PulseX', value: parseFloat(tokenomics.supplyAllocation.pulsex || '0'), color: '#6a0dad' },
    { name: 'Airdrop', value: parseFloat(tokenomics.supplyAllocation.airdrop || '0'), color: '#ff5733' },
    { name: 'Dev Team', value: parseFloat(tokenomics.supplyAllocation.dev || '0'), color: '#33ff57' },
    { name: 'Marketing', value: parseFloat(tokenomics.supplyAllocation.marketing || '0'), color: '#ffff33' },
    { name: 'Burn', value: parseFloat(tokenomics.supplyAllocation.burn || '0'), color: '#ff3333' },
  ];

  return (
    <section id="tokenomics" className="relative py-16 md:py-24 bg-gradient-to-br from-black via-gray-900/50 to-black min-h-[60vh] backdrop-blur-3xl">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple bg-clip-text text-transparent">
            ⚙️ Tokenomics Engine
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Configure your meme coin's tokenomics with built-in validation and visual charts
          </p>
        </div>
        <div className="max-w-6xl mx-auto space-y-8">
          <PresetSelector onSelectPreset={setTokenomicsData} />
          <div className="md:hidden w-full mb-6">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-gray-800/70 border-purple-500/20 text-white h-[50px]">
                <SelectValue>
                  {activeTab === 'basic' ? 'Basic Configuration' : 
                   activeTab === 'advanced' ? 'Advanced Features' : 
                   'Visualizations'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                <SelectItem value="basic" className="text-white hover:bg-gray-700 cursor-pointer font-normal">
                  Basic Configuration
                </SelectItem>
                <SelectItem value="advanced" className="text-white hover:bg-gray-700 cursor-pointer font-normal">
                  Advanced Features
                </SelectItem>
                <SelectItem value="visualization" className="text-white hover:bg-gray-700 cursor-pointer font-normal">
                  Visualizations
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden md:grid md:grid-cols-3 mb-8 bg-gray-800/70 backdrop-blur-md border-purple-500/20">
              <TabsTrigger value="basic" className="text-white data-[state=active]:bg-purple-800/50">
                Basic Configuration
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-purple-800/50">
                Advanced Features
              </TabsTrigger>
              <TabsTrigger value="visualization" className="text-white data-[state=active]:bg-purple-800/50">
                Visualizations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="bg-black/40 border-2 border-purple-500/20 rounded-2xl shadow-xl">
                    <CardContent className="space-y-6">
                      <BasicSettingsForm 
                        totalSupply={tokenomics.totalSupply}
                        buyTax={tokenomics.buyTax}
                        sellTax={tokenomics.sellTax}
                        onUpdate={updateTokenomics}
                      />
                      <TaxAllocationForm 
                        taxAllocation={tokenomics.taxAllocation}
                        error={errors.taxAllocation}
                        onUpdate={updateTokenomics}
                      />
                      <SupplyAllocationForm 
                        supplyAllocation={tokenomics.supplyAllocation}
                        error={errors.supplyAllocation}
                        onUpdate={updateTokenomics}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card className="bg-black/40 border-2 border-green-500/20 rounded-2xl shadow-xl">
                    <CardContent>
                      <TokenomicsDistributionChart 
                        taxData={taxChartData}
                        supplyData={supplyChartData}
                      />
                    </CardContent>
                  </Card>
                  <ActionButtons 
                    tokenomics={tokenomics}
                    hasErrors={Object.keys(errors).length > 0}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-6">
              <TokenUtilitySuggestions />
            </TabsContent>
            <TabsContent value="visualization" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <TokenomicsDistributionChart 
                  taxData={taxChartData}
                  supplyData={supplyChartData}
                />
                
                <ActionButtons 
                  tokenomics={tokenomics}
                  hasErrors={Object.keys(errors).length > 0}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Animated divider for flow */}
        <div className="w-full flex justify-center mt-12">
          <div className="h-2 w-32 rounded-full bg-gradient-to-r from-pulse-purple via-pulse-orange to-pulse-purple animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default TokenomicsEngine;
