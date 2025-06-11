import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Code, Shield, Wallet, DollarSign } from 'lucide-react';
import ParticleBackground from "../ParticleBackground";
import ResourcesSection from "../ResourcesSection";

// Import modular components
import { BasicSettingsForm } from './forms/BasicSettingsForm';
import { ContractTypeSelector } from './forms/ContractTypeSelector';
import { SecurityFeaturesForm } from './forms/SecurityFeaturesForm';
import { TaxSettingsForm } from './forms/TaxSettingsForm';
import { WalletSettingsForm } from './forms/WalletSettingsForm';
import { CodePreviewSection } from './sections/CodePreviewSection';

// Import types
import { ContractSettings, ContractCodeGeneratorProps } from './types/interfaces';

const defaultSettings: ContractSettings = {
  tokenName: '',
  tokenSymbol: '',
  totalSupply: '1000000',
  decimals: 9,
  contractType: 'standard',
  networkId: 369,
  securityFeatures: {
    antiWhale: false,
    blacklist: false,
    pausable: false,
    reflection: false,
    burnable: false,
    mintable: false,
    snapshot: false,
    voting: false,
    deflationary: false,
    rewardToken: false,
  },
  taxSettings: {
    buyTax: 5,
    sellTax: 5,
    transferTax: 0,
    maxTax: 25,
    liquidityShare: 40,
    marketingShare: 40,
    devShare: 20,
    burnShare: 0,
    reflectionShare: 0,
    charityShare: 0,
  },
  walletSettings: {
    marketingWallet: '',
    devWallet: '',
    autoLiquidityWallet: '',
    charityWallet: '',
    treasuryWallet: '',
  },
  limitSettings: {
    maxTxPercent: 2,
    maxWalletPercent: 4,
    maxSellPercent: 1,
    tradingCooldown: 30,
    launchProtection: true,
    antiSnipe: true,
    antiBotEnabled: true,
  },
  routerAddress: '0x165C3410fC91EF562C50559f7d2289fEbed552d9',
  autoLiquidity: true,
  liquidityLockDays: 365,
};

export const ContractCodeGenerator: React.FC<ContractCodeGeneratorProps> = ({ 
  tokenomics, 
  coinIdea 
}) => {
  const [settings, setSettings] = useState<ContractSettings>(defaultSettings);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize settings from tokenomics data if provided
  useEffect(() => {
    if (tokenomics) {
      setSettings(prev => ({
        ...prev,
        totalSupply: tokenomics.totalSupply || prev.totalSupply,
        taxSettings: {
          ...prev.taxSettings,
          buyTax: parseFloat(tokenomics.buyTax) || prev.taxSettings.buyTax,
          sellTax: parseFloat(tokenomics.sellTax) || prev.taxSettings.sellTax,
          liquidityShare: parseFloat(tokenomics.taxAllocation.liquidity) || prev.taxSettings.liquidityShare,
          marketingShare: parseFloat(tokenomics.taxAllocation.marketing) || prev.taxSettings.marketingShare,
          burnShare: parseFloat(tokenomics.taxAllocation.burn) || prev.taxSettings.burnShare,
        },
      }));
    }
  }, [tokenomics]);

  // Initialize from coin idea if provided
  useEffect(() => {
    if (coinIdea) {
      setSettings(prev => ({
        ...prev,
        tokenName: coinIdea.name || prev.tokenName,
        tokenSymbol: coinIdea.symbol || prev.tokenSymbol,
      }));
    }
  }, [coinIdea]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 relative">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Smart Contract Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create professional smart contracts with advanced features, security measures, and customizable tokenomics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic" className="flex items-center space-x-1">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Basic</span>
                </TabsTrigger>
                <TabsTrigger value="type" className="flex items-center space-x-1">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Type</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="tax" className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Tax</span>
                </TabsTrigger>
                <TabsTrigger value="wallets" className="flex items-center space-x-1">
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Wallets</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-6">
                <BasicSettingsForm 
                  settings={settings} 
                  onSettingsChange={setSettings} 
                />
              </TabsContent>

              <TabsContent value="type" className="mt-6">
                <ContractTypeSelector 
                  settings={settings} 
                  onSettingsChange={setSettings} 
                />
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <SecurityFeaturesForm 
                  settings={settings} 
                  onSettingsChange={setSettings} 
                />
              </TabsContent>

              <TabsContent value="tax" className="mt-6">
                <TaxSettingsForm 
                  settings={settings} 
                  onSettingsChange={setSettings} 
                />
              </TabsContent>

              <TabsContent value="wallets" className="mt-6">
                <WalletSettingsForm 
                  settings={settings} 
                  onSettingsChange={setSettings} 
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CodePreviewSection 
                settings={settings} 
                isGenerating={isGenerating} 
              />
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-12">
          <ResourcesSection />
        </div>
      </div>
    </div>
  );
};
