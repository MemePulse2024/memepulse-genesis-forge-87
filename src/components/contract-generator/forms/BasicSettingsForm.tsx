import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContractSettings } from '../types/interfaces';
import { NETWORK_OPTIONS } from '../types/constants';

interface BasicSettingsFormProps {
  settings: ContractSettings;
  onSettingsChange: (settings: ContractSettings) => void;
}

export const BasicSettingsForm: React.FC<BasicSettingsFormProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const updateSettings = (field: keyof ContractSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Token Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name</Label>
            <Input
              id="tokenName"
              value={settings.tokenName}
              onChange={(e) => updateSettings('tokenName', e.target.value)}
              placeholder="My Awesome Token"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tokenSymbol">Token Symbol</Label>
            <Input
              id="tokenSymbol"
              value={settings.tokenSymbol}
              onChange={(e) => updateSettings('tokenSymbol', e.target.value.toUpperCase())}
              placeholder="MAT"
              maxLength={6}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalSupply">Total Supply</Label>
            <Input
              id="totalSupply"
              type="number"
              value={settings.totalSupply}
              onChange={(e) => updateSettings('totalSupply', e.target.value)}
              placeholder="1000000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="decimals">Decimals</Label>
            <Select value={settings.decimals.toString()} onValueChange={(value) => updateSettings('decimals', parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9">9 (Recommended)</SelectItem>
                <SelectItem value="18">18 (Standard)</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="network">Network</Label>
          <Select value={settings.networkId.toString()} onValueChange={(value) => {
            const networkId = parseInt(value);
            const network = NETWORK_OPTIONS.find(n => n.id === networkId);
            updateSettings('networkId', networkId);
            if (network) {
              updateSettings('routerAddress', network.routerAddress);
            }
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NETWORK_OPTIONS.map((network) => (
                <SelectItem key={network.id} value={network.id.toString()}>
                  {network.name} ({network.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
