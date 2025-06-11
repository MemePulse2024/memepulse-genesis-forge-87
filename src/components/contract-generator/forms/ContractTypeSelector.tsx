import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContractSettings } from '../types/interfaces';
import { CONTRACT_TYPES, getComplexityColor } from '../types/constants';

interface ContractTypeSelectorProps {
  settings: ContractSettings;
  onSettingsChange: (settings: ContractSettings) => void;
}

export const ContractTypeSelector: React.FC<ContractTypeSelectorProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const updateContractType = (contractType: string) => {
    onSettingsChange({ ...settings, contractType });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Contract Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTRACT_TYPES.map((type) => {
            const IconComponent = type.icon;
            const isSelected = settings.contractType === type.id;
            
            return (
              <div
                key={type.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateContractType(type.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{type.name}</h3>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getComplexityColor(type.complexity)}
                  >
                    {type.complexity}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {type.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Est. Gas: {type.gasEstimate}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
