import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ContractSettings, TaxSettings } from '../types/interfaces';
import { DollarSign, TrendingUp, Flame, Users, Droplets } from 'lucide-react';

interface TaxSettingsFormProps {
  settings: ContractSettings;
  onSettingsChange: (settings: ContractSettings) => void;
}

export const TaxSettingsForm: React.FC<TaxSettingsFormProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const updateTaxSettings = (field: keyof TaxSettings, value: number) => {
    onSettingsChange({
      ...settings,
      taxSettings: {
        ...settings.taxSettings,
        [field]: value
      }
    });
  };

  const taxDistribution = [
    { key: 'liquidityShare', label: 'Auto Liquidity', icon: Droplets, color: 'bg-blue-100 text-blue-800' },
    { key: 'marketingShare', label: 'Marketing', icon: TrendingUp, color: 'bg-green-100 text-green-800' },
    { key: 'devShare', label: 'Development', icon: Users, color: 'bg-purple-100 text-purple-800' },
    { key: 'burnShare', label: 'Token Burn', icon: Flame, color: 'bg-red-100 text-red-800' },
    { key: 'reflectionShare', label: 'Reflections', icon: DollarSign, color: 'bg-yellow-100 text-yellow-800' },
    { key: 'charityShare', label: 'Charity', icon: Users, color: 'bg-pink-100 text-pink-800' },
  ] as const;

  const totalDistribution = taxDistribution.reduce((sum, item) => 
    sum + settings.taxSettings[item.key], 0
  );

  // Show tax settings only for tax-enabled contracts
  if (!['tax', 'meme-advanced', 'reflection', 'deflationary'].includes(settings.contractType)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tax Rates */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Tax Rates (%)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyTax">Buy Tax</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.taxSettings.buyTax]}
                  onValueChange={([value]) => updateTaxSettings('buyTax', value)}
                  max={25}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <Badge variant="outline">{settings.taxSettings.buyTax}%</Badge>
                  <span>25%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sellTax">Sell Tax</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.taxSettings.sellTax]}
                  onValueChange={([value]) => updateTaxSettings('sellTax', value)}
                  max={25}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <Badge variant="outline">{settings.taxSettings.sellTax}%</Badge>
                  <span>25%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transferTax">Transfer Tax</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.taxSettings.transferTax]}
                  onValueChange={([value]) => updateTaxSettings('transferTax', value)}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <Badge variant="outline">{settings.taxSettings.transferTax}%</Badge>
                  <span>10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Distribution */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-700">Tax Distribution</h4>
            <Badge 
              variant={totalDistribution === 100 ? "default" : "destructive"}
              className="text-xs"
            >
              Total: {totalDistribution}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxDistribution.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4" />
                    <Label htmlFor={item.key}>{item.label}</Label>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.taxSettings[item.key]]}
                      onValueChange={([value]) => updateTaxSettings(item.key, value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <Badge variant="outline" className={item.color}>
                        {settings.taxSettings[item.key]}%
                      </Badge>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {totalDistribution !== 100 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Tax distribution must total 100%. 
                Current total: {totalDistribution}%
              </p>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Quick Tax Presets</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button
              className="p-3 border rounded-lg text-left hover:bg-gray-50 text-sm"
              onClick={() => {
                onSettingsChange({
                  ...settings,
                  taxSettings: {
                    ...settings.taxSettings,
                    buyTax: 5,
                    sellTax: 5,
                    transferTax: 0,
                    liquidityShare: 40,
                    marketingShare: 40,
                    devShare: 20,
                    burnShare: 0,
                    reflectionShare: 0,
                    charityShare: 0
                  }
                });
              }}
            >
              <div className="font-medium">Conservative</div>
              <div className="text-xs text-gray-500">5% Buy/Sell</div>
            </button>
            
            <button
              className="p-3 border rounded-lg text-left hover:bg-gray-50 text-sm"
              onClick={() => {
                onSettingsChange({
                  ...settings,
                  taxSettings: {
                    ...settings.taxSettings,
                    buyTax: 10,
                    sellTax: 15,
                    transferTax: 2,
                    liquidityShare: 30,
                    marketingShare: 30,
                    devShare: 20,
                    burnShare: 10,
                    reflectionShare: 10,
                    charityShare: 0
                  }
                });
              }}
            >
              <div className="font-medium">Balanced</div>
              <div className="text-xs text-gray-500">10% Buy / 15% Sell</div>
            </button>
            
            <button
              className="p-3 border rounded-lg text-left hover:bg-gray-50 text-sm"
              onClick={() => {
                onSettingsChange({
                  ...settings,
                  taxSettings: {
                    ...settings.taxSettings,
                    buyTax: 15,
                    sellTax: 20,
                    transferTax: 5,
                    liquidityShare: 25,
                    marketingShare: 25,
                    devShare: 15,
                    burnShare: 15,
                    reflectionShare: 15,
                    charityShare: 5
                  }
                });
              }}
            >
              <div className="font-medium">High Yield</div>
              <div className="text-xs text-gray-500">15% Buy / 20% Sell</div>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
