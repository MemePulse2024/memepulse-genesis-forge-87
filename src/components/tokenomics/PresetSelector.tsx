import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  

  return (
    <div className="mb-6">
      <div className="w-full md:w-96 mx-auto">
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full bg-gray-800/70 border border-purple-500/20 text-white font-orbitron px-4 py-3 h-[50px] rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1.5em'
          }}
        >
          <option value="" className="bg-gray-800 text-white">Select a template</option>
          {tokenomicsPresets.map((preset) => (
            <option 
              key={preset.name} 
              value={preset.name}
              className="bg-gray-800 text-white"
            >
              {preset.name}
            </option>
          ))}
        </select>
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
