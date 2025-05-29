
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
    const preset = tokenomicsPresets.find(p => p.name === value);
    if (preset) {
      onSelectPreset(preset);
    }
  }

  const selectedPresetData = tokenomicsPresets.find(p => p.name === selectedPreset);

  return (
    <div className="mb-6">
      <div className="w-full md:w-96 mx-auto">
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
          <SelectTrigger className="bg-gray-800/70 border-purple-500/20 text-white h-[50px]">
            <SelectValue placeholder="Select a template">
              {selectedPreset && (
                <span className="text-white font-medium">{selectedPreset}</span>
              )}
            </SelectValue>
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
      
      {selectedPreset && selectedPresetData && (
        <div className="bg-gradient-to-r from-purple-900/30 to-orange-900/30 border border-purple-500/30 rounded-lg mt-4 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400 text-lg">✨</span>
            <h4 className="text-white font-orbitron font-bold text-lg">Selected Template</h4>
          </div>
          <div className="space-y-1">
            <p className="text-pulse-orange font-semibold text-base">{selectedPreset}</p>
            <p className="text-gray-300 text-sm">{selectedPresetData.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
