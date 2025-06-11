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
import { Button } from '@/components/ui/button';
import { Wand2, Lightbulb, Sparkles } from 'lucide-react';

interface TokenomicsEngineProps {
  tokenomics: TokenomicsData;
  setTokenomics: React.Dispatch<React.SetStateAction<TokenomicsData>>;
}

const TokenomicsEngine = ({ tokenomics, setTokenomics }: TokenomicsEngineProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [aiExplain, setAiExplain] = useState<string>('');
  const [aiTip, setAiTip] = useState<string>('');
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

  // AI-powered suggestion logic
  const handleAISuggest = () => {
    // Fun, context-aware suggestions for allocations
    const tips = [
      "Try a 4/4/4/4/4/4/4/4/4/4 split for ultimate fairness!",
      "Consider a higher marketing allocation for viral potential.",
      "Airdrop more to the community for instant hype!",
      "Burn tokens for that spicy deflationary meme magic.",
      "Balance taxes for both moon and utility!",
      "Add more to liquidity for smoother trading.",
      "Dev team needs snacks too—don't forget a small dev allocation!",
      "Try a wild 0% buy tax for instant degen appeal!",
      "Mix it up: high burn, low marketing, or vice versa!",
      "Remember: meme coins are about fun, not just numbers!"
    ];
    setAiSuggestion(tips[Math.floor(Math.random()*tips.length)]);
  };

  const handleAIExplain = () => {
    // Playful explanation of current tokenomics
    setAiExplain(
      `Your meme coin has a total supply of ${tokenomics.totalSupply} tokens, with a buy tax of ${tokenomics.buyTax}% and sell tax of ${tokenomics.sellTax}%. Taxes are split for liquidity, marketing, and burn. The supply is distributed across PulseX, airdrop, dev, marketing, and burn. This setup is ${parseFloat(tokenomics.buyTax) + parseFloat(tokenomics.sellTax) > 10 ? 'degen and spicy' : 'balanced and friendly'}! 🚀`
    );
  };

  const handleAIRandomize = () => {
    // AI-powered randomization for fun, balanced tokenomics
    const random = (min: number, max: number) => (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    setTokenomics({
      ...tokenomics,
      totalSupply: (10 ** (6 + Math.floor(Math.random() * 4))).toString(),
      buyTax: random(0, 10),
      sellTax: random(0, 10),
      taxAllocation: {
        liquidity: random(10, 60),
        marketing: random(10, 60),
        burn: random(0, 30)
      },
      supplyAllocation: {
        pulsex: random(10, 60),
        airdrop: random(5, 40),
        dev: random(1, 20),
        marketing: random(5, 30),
        burn: random(0, 20)
      }
    });
    setAiTip('AI randomized your tokenomics for max meme potential!');
  };

  return (
    <section id="tokenomics" className="relative py-16 md:py-24 bg-gradient-to-br from-black via-gray-900/50 to-black min-h-[60vh] backdrop-blur-3xl">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Removed internal header and description to avoid duplication */}
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
              <div className="flex flex-wrap gap-4 mb-4">
                <Button size="sm" variant="outline" onClick={handleAISuggest} className="border-pulse-orange/40 text-pulse-orange hover:bg-pulse-orange/10"><Lightbulb className="w-4 h-4 mr-1" />AI Suggest</Button>
                <Button size="sm" variant="outline" onClick={handleAIExplain} className="border-pulse-purple/40 text-pulse-purple hover:bg-pulse-purple/10"><Wand2 className="w-4 h-4 mr-1" />AI Explain</Button>
                <Button size="sm" variant="outline" onClick={handleAIRandomize} className="border-green-400/40 text-green-400 hover:bg-green-900/10"><Sparkles className="w-4 h-4 mr-1" />AI Randomize</Button>
                {aiSuggestion && <span className="ml-4 text-pulse-orange animate-pulse">💡 {aiSuggestion}</span>}
                {aiExplain && <span className="ml-4 text-pulse-purple animate-pulse">✨ {aiExplain}</span>}
                {aiTip && <span className="ml-4 text-green-400 animate-pulse">🎲 {aiTip}</span>}
              </div>
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
              <div className="flex flex-wrap gap-4 mb-4">
                <Button size="sm" variant="outline" onClick={handleAISuggest} className="border-pulse-orange/40 text-pulse-orange hover:bg-pulse-orange/10"><Lightbulb className="w-4 h-4 mr-1" />AI Suggest</Button>
                <Button size="sm" variant="outline" onClick={handleAIExplain} className="border-pulse-purple/40 text-pulse-purple hover:bg-pulse-purple/10"><Wand2 className="w-4 h-4 mr-1" />AI Explain</Button>
                <Button size="sm" variant="outline" onClick={handleAIRandomize} className="border-green-400/40 text-green-400 hover:bg-green-900/10"><Sparkles className="w-4 h-4 mr-1" />AI Randomize</Button>
                {aiSuggestion && <span className="ml-4 text-pulse-orange animate-pulse">💡 {aiSuggestion}</span>}
                {aiExplain && <span className="ml-4 text-pulse-purple animate-pulse">✨ {aiExplain}</span>}
                {aiTip && <span className="ml-4 text-green-400 animate-pulse">🎲 {aiTip}</span>}
              </div>
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
