import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
          <SelectTrigger className="bg-gray-800/70 border-purple-500/20 text-white flex items-center justify-between px-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500">
            <span className="font-orbitron text-base">{selectedPreset ? selectedPreset : 'Select a template'}</span>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectGroup>
              <SelectLabel>Preset Templates</SelectLabel>
              {tokenomicsPresets.map((preset) => (
                <SelectItem 
                  key={preset.name} 
                  value={preset.name}
                  className="text-white hover:bg-gray-700 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span>{preset.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="h-6 w-6 p-0 ml-2">
                            <Info className="h-3 w-3" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 border-gray-700">
                          <p>{preset.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
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
