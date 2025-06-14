import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { ContractSettings, SecurityFeatures } from '../types/interfaces';
import { getFeatureDescription } from '../types/constants';

interface SecurityFeaturesFormProps {
  settings: ContractSettings;
  onSettingsChange: (settings: ContractSettings) => void;
}

export const SecurityFeaturesForm: React.FC<SecurityFeaturesFormProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const updateSecurityFeature = (feature: keyof SecurityFeatures, value: boolean) => {
    onSettingsChange({
      ...settings,
      securityFeatures: {
        ...settings.securityFeatures,
        [feature]: value
      }
    });
  };

  const securityFeatures = [
    { key: 'antiWhale', label: 'Anti-Whale Protection', category: 'Trading Limits' },
    { key: 'blacklist', label: 'Blacklist Function', category: 'Security' },
    { key: 'pausable', label: 'Emergency Pause', category: 'Security' },
    { key: 'burnable', label: 'Token Burning', category: 'Supply Management' },
    { key: 'mintable', label: 'Mintable Tokens', category: 'Supply Management' },
    { key: 'reflection', label: 'Reflection Rewards', category: 'Tokenomics' },
    { key: 'deflationary', label: 'Deflationary Mechanism', category: 'Tokenomics' },
    { key: 'rewardToken', label: 'Reward Distribution', category: 'Tokenomics' },
    { key: 'snapshot', label: 'Snapshot Capability', category: 'Governance' },
    { key: 'voting', label: 'Voting Rights', category: 'Governance' },
  ] as const;

  const groupedFeatures = securityFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Array<typeof securityFeatures[number]>>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedFeatures).map(([category, features]) => (
          <div key={category} className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">{category}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={feature.key} className="font-medium">
                        {feature.label}
                      </Label>
                      {getFeatureDescription(feature.key) && (
                        <Info className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    {getFeatureDescription(feature.key) && (
                      <p className="text-xs text-gray-600">
                        {getFeatureDescription(feature.key)}
                      </p>
                    )}
                  </div>
                  
                  <Switch
                    id={feature.key}
                    checked={settings.securityFeatures[feature.key as keyof SecurityFeatures]}
                    onCheckedChange={(checked) => 
                      updateSecurityFeature(feature.key as keyof SecurityFeatures, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Security Recommendations</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Enable Anti-Whale protection to prevent large dumps</li>
            <li>• Use Emergency Pause for critical situations</li>
            <li>• Consider Blacklist function for security purposes</li>
            <li>• Be careful with Mintable tokens - affects tokenomics</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
      <CardHeader>
        <CardTitle>Security Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedFeatures).map(([category, features]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700 flex items-center">
              <Badge variant="outline" className="mr-2">{category}</Badge>
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              {features.map((feature) => (
                <div 
                  key={feature.key}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Label htmlFor={feature.key} className="font-medium cursor-pointer">
                        {feature.label}
                      </Label>
                      {getFeatureDescription(feature.key) && (
                        <Info className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    {getFeatureDescription(feature.key) && (
                      <p className="text-xs text-gray-600">
                        {getFeatureDescription(feature.key)}
                      </p>
                    )}
                  </div>
                  
                  <Switch
                    id={feature.key}
                    checked={settings.securityFeatures[feature.key]}
                    onCheckedChange={(checked) => updateSecurityFeature(feature.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Security Notice:</p>
              <p>More security features increase contract complexity and gas costs. Enable only features you need for your project.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
