import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TokenomicsData, validateAllocations } from '@/utils/tokenomicsValidation';
import { BasicSettingsForm } from './tokenomics/BasicSettingsForm';
import { TaxAllocationForm } from './tokenomics/TaxAllocationForm';
import { SupplyAllocationForm } from './tokenomics/SupplyAllocationForm';
import { TokenomicsDistributionChart } from './tokenomics/TokenomicsDistributionChart';
import { ActionButtons } from './tokenomics/ActionButtons';
import { PresetSelector } from './tokenomics/PresetSelector';
import { TokenLockSchedule } from './tokenomics/TokenLockSchedule';
import { TokenUtilitySuggestions } from './tokenomics/TokenUtilitySuggestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { useState as useTabState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const TokenomicsEngine = () => {
  const [tokenomics, setTokenomics] = useState<TokenomicsData>({
    totalSupply: '1000000000',
    buyTax: '5',
    sellTax: '5',
    taxAllocation: {
      liquidity: '40',
      marketing: '40',
      reflection: '20'
    },
    supplyAllocation: {
      pulsex: '80',
      airdrop: '10',
      dev: '5',
      marketing: '3',
      burn: '2'
    }
  });

  const [activeTab, setActiveTab] = useTabState('basic');
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
    { name: 'Reflection', value: parseFloat(tokenomics.taxAllocation.reflection || '0'), color: '#33ff57' },
  ];

  const supplyChartData = [
    { name: 'PulseX', value: parseFloat(tokenomics.supplyAllocation.pulsex || '0'), color: '#6a0dad' },
    { name: 'Airdrop', value: parseFloat(tokenomics.supplyAllocation.airdrop || '0'), color: '#ff5733' },
    { name: 'Dev Team', value: parseFloat(tokenomics.supplyAllocation.dev || '0'), color: '#33ff57' },
    { name: 'Marketing', value: parseFloat(tokenomics.supplyAllocation.marketing || '0'), color: '#ffff33' },
    { name: 'Burn', value: parseFloat(tokenomics.supplyAllocation.burn || '0'), color: '#ff3333' },
  ];

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <section id="tokenomics" className="py-20 bg-gradient-to-br from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
            ⚙️ Tokenomics Engine
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Configure your meme coin's tokenomics with built-in validation and visual charts
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <PresetSelector onSelectPreset={setTokenomicsData} />
          
          {/* Mobile view: Show select dropdown */}
          <div className="md:hidden w-full mb-6">
            <div className="w-full md:w-96 mx-auto">
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="w-full bg-gray-800/70 border-purple-500/20 text-white h-[50px]">
                  <SelectValue placeholder="Select Section">
                    {activeTab === 'basic' ? 'Basic Configuration' : 
                     activeTab === 'advanced' ? 'Advanced Features' : 
                     'Visualizations'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
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
          </div>
          
          {/* Desktop view */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="hidden md:grid md:grid-cols-3 mb-8 bg-gray-800/70 backdrop-blur-md border-purple-500/20">
              <TabsTrigger value="basic" className="text-white data-[state=active]:bg-purple-800/50">
                <div className="flex items-center justify-between px-4 py-3 w-full">
                  <span className="font-orbitron">Basic Configuration</span>
                  <svg className="w-5 h-5 ml-2 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
                </div>
                
                <div className="space-y-6">
                  <TokenomicsDistributionChart 
                    taxData={taxChartData}
                    supplyData={supplyChartData}
                  />
                  
                  <ActionButtons 
                    tokenomics={tokenomics}
                    hasErrors={Object.keys(errors).length > 0}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <TokenLockSchedule />
                <TokenUtilitySuggestions />
              </div>
            </TabsContent>
            
            <TabsContent value="visualization" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <TokenomicsDistributionChart 
                  taxData={taxChartData}
                  supplyData={supplyChartData}
                />
                
                <div className="space-y-6">
                  <ActionButtons 
                    tokenomics={tokenomics}
                    hasErrors={Object.keys(errors).length > 0}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsEngine;
