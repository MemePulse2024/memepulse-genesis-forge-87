import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContractSettings, WalletSettings } from '../types/interfaces';
import { Wallet, TrendingUp, Users, Droplets, Heart } from 'lucide-react';

interface WalletSettingsFormProps {
  settings: ContractSettings;
  onSettingsChange: (settings: ContractSettings) => void;
}

export const WalletSettingsForm: React.FC<WalletSettingsFormProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const updateWalletSettings = (field: keyof WalletSettings, value: string) => {
    onSettingsChange({
      ...settings,
      walletSettings: {
        ...settings.walletSettings,
        [field]: value
      }
    });
  };

  const walletFields = [
    { 
      key: 'marketingWallet', 
      label: 'Marketing Wallet', 
      icon: TrendingUp, 
      description: 'Receives marketing tax allocation',
      required: settings.taxSettings.marketingShare > 0
    },
    { 
      key: 'devWallet', 
      label: 'Development Wallet', 
      icon: Users, 
      description: 'Receives development tax allocation',
      required: settings.taxSettings.devShare > 0
    },
    { 
      key: 'autoLiquidityWallet', 
      label: 'Auto Liquidity Wallet', 
      icon: Droplets, 
      description: 'Receives liquidity tokens after auto-LP',
      required: settings.taxSettings.liquidityShare > 0
    },
    { 
      key: 'charityWallet', 
      label: 'Charity Wallet', 
      icon: Heart, 
      description: 'Receives charity tax allocation',
      required: settings.taxSettings.charityShare > 0
    },
    { 
      key: 'treasuryWallet', 
      label: 'Treasury Wallet', 
      icon: Wallet, 
      description: 'Multi-purpose treasury wallet',
      required: false
    },
  ] as const;

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Show wallet settings only for tax-enabled contracts
  if (!['tax', 'meme-advanced', 'reflection', 'deflationary'].includes(settings.contractType)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {walletFields.map((field) => {
          const IconComponent = field.icon;
          const address = settings.walletSettings[field.key];
          const isValid = !address || isValidAddress(address);
          
          return (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <Label htmlFor={field.key} className="flex items-center space-x-1">
                  <span>{field.label}</span>
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
              </div>
              
              <Input
                id={field.key}
                value={address}
                onChange={(e) => updateWalletSettings(field.key, e.target.value)}
                placeholder="0x742d35Cc6634C0532925a3b8D489319B4db3F3C2"
                className={!isValid ? 'border-red-500' : ''}
              />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">{field.description}</p>
                {!isValid && (
                  <p className="text-xs text-red-500">Invalid address format</p>
                )}
              </div>
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Wallet Security Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use multi-signature wallets for important functions</li>
            <li>• Never use exchange addresses for tax wallets</li>
            <li>• Test with small amounts first</li>
            <li>• Keep private keys secure and backed up</li>
            <li>• Consider using hardware wallets for large amounts</li>
          </ul>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Wallet addresses can be changed after deployment by the contract owner. 
            Make sure to set them before enabling trading.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
