import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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
    const preset = tokenomicsPresets.find(p => p.name === value);
    if (preset) {
      // Ensure 'burn' property exists in taxAllocation
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

  return (
    <div className="mb-6">
      <div className="w-full md:w-96 mx-auto">
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
          <SelectTrigger className="bg-gray-800 border border-purple-500 text-white h-[50px]">
            <span className="text-white">
              {selectedPreset || 'Select a template'}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {tokenomicsPresets.map((preset) => (
              <SelectItem
                key={preset.name}
                value={preset.name}
                className="text-white hover:bg-gray-700 cursor-pointer font-normal"
              >
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-2 gap-4">
        <div>
          <h3 className="font-orbitron text-lg font-bold text-white mb-1">🧩 Tokenomics Templates</h3>
          <p className="text-gray-400 text-sm">Jump-start with proven tokenomics models</p>
        </div>
      </div>
      
      {selectedPreset && (
        <div className="bg-gradient-to-r from-purple-900/20 to-orange-900/20 rounded mt-2 p-2 text-xs text-gray-300">
          <p>Selected: <span className="text-pulse-orange">{selectedPreset}</span> - {tokenomicsPresets.find(p => p.name === selectedPreset)?.description}</p>
        </div>
      )}
    </div>
  );
};
