
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { tokenomicsPresets } from '@/utils/tokenomicsPresets';
import { TokenomicsData } from '@/utils/tokenomicsValidation';

interface PresetSelectorProps {
  onSelectPreset: (preset: TokenomicsData) => void;
}

export const PresetSelector = ({ onSelectPreset }: PresetSelectorProps) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    if (value === "NoTaxStandalone") {
      const noTaxPreset: TokenomicsData = {
        totalSupply: "1000000000",
        buyTax: "0",
        sellTax: "0",
        taxAllocation: {
          burn: "0",
          liquidity: "0",
          marketing: "0"
        },
        supplyAllocation: {
          pulsex: "100",
          airdrop: "0",
          dev: "0",
          marketing: "0",
          burn: "0"
        }
      };
      onSelectPreset(noTaxPreset);
      return;
    }
    const preset = tokenomicsPresets.find(p => p.name === value);
    if (preset) {
      const presetWithBurn: TokenomicsData = {
        ...preset,
        taxAllocation: {
          ...preset.taxAllocation,
          burn: preset.taxAllocation.burn ?? "0",
        },
      };
      onSelectPreset(presetWithBurn);
    }
  }

  const getSelectedPresetInfo = () => {
    if (selectedPreset === "NoTaxStandalone") {
      return "A standard PRC20 token with zero buy/sell tax and no auto-distribution.";
    }
    return tokenomicsPresets.find(p => p.name === selectedPreset)?.description;
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="font-orbitron text-lg font-bold text-white mb-1">🧩 Tokenomics Templates</h3>
          <p className="text-gray-400 text-sm">Jump-start with proven tokenomics models</p>
        </div>
      </div>

      <div className="w-full md:w-96 mx-auto mb-4">
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
          <SelectTrigger className="bg-gray-800/70 border border-purple-500/30 text-white h-[50px] hover:bg-gray-700/70 transition-colors">
            <SelectValue placeholder="Select a template">
              {selectedPreset || 'Select a template'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600 z-50">
            <SelectItem
              key="NoTaxStandalone"
              value="NoTaxStandalone"
              className="text-white hover:bg-gray-700 cursor-pointer font-normal focus:bg-gray-700"
            >
              No Tax (Standard PRC20)
            </SelectItem>
            {tokenomicsPresets.map((preset) => (
              <SelectItem
                key={preset.name}
                value={preset.name}
                className="text-white hover:bg-gray-700 cursor-pointer font-normal focus:bg-gray-700"
              >
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedPreset && (
        <div className="bg-gradient-to-r from-purple-900/30 to-orange-900/30 rounded-lg border border-purple-500/20 p-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-pulse-orange font-semibold">{selectedPreset}</span>
            <span className="text-green-400">✓ Applied</span>
          </div>
          <p className="text-gray-300">{getSelectedPresetInfo()}</p>
        </div>
      )}
    </div>
  );
};
