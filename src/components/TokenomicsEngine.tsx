
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TokenomicsData, validateAllocations } from '@/utils/tokenomicsValidation';
import { BasicSettingsForm } from './tokenomics/BasicSettingsForm';
import { TaxAllocationForm } from './tokenomics/TaxAllocationForm';
import { SupplyAllocationForm } from './tokenomics/SupplyAllocationForm';
import { TokenomicsPieChart } from './tokenomics/TokenomicsCharts';
import { ActionButtons } from './tokenomics/ActionButtons';

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
        // Create a safe copy for the nested field
        const fieldCopy = { ...prev[field as keyof TokenomicsData] } as Record<string, string>;
        // Update the subfield in the copy
        fieldCopy[subField] = value;
        // Return new state with the updated copy
        return {
          ...prev,
          [field]: fieldCopy
        };
      });
    } else {
      setTokenomics(prev => ({
        ...prev,
        [field]: value
      }));
    }
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

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Input Controls */}
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

          {/* Charts and Actions */}
          <div className="space-y-6">
            <TokenomicsPieChart 
              data={taxChartData}
              title="Tax Allocation"
            />
            
            <TokenomicsPieChart 
              data={supplyChartData}
              title="Supply Allocation"
            />
            
            <ActionButtons 
              tokenomics={tokenomics}
              hasErrors={Object.keys(errors).length > 0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsEngine;
