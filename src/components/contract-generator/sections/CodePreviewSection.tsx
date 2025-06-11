import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContractSettings } from '../types/interfaces';
import { generateContractCode, generateDeploymentInstructions } from '../utils/contractGenerator';
import { CONTRACT_TYPES } from '../types/constants';

interface CodePreviewSectionProps {
  settings: ContractSettings;
  isGenerating: boolean;
}

export const CodePreviewSection: React.FC<CodePreviewSectionProps> = ({ 
  settings, 
  isGenerating 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<'contract' | 'instructions'>('contract');
  
  const contractCode = React.useMemo(() => 
    generateContractCode(settings), 
    [settings]
  );
  
  const deploymentInstructions = React.useMemo(() => 
    generateDeploymentInstructions(settings), 
    [settings]
  );

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getValidationStatus = () => {
    const issues = [];
    
    if (!settings.tokenName.trim()) issues.push("Token name is required");
    if (!settings.tokenSymbol.trim()) issues.push("Token symbol is required");
    if (!settings.totalSupply || parseInt(settings.totalSupply) <= 0) issues.push("Valid total supply is required");
    
    // Tax-specific validations
    if (['tax', 'meme-advanced'].includes(settings.contractType)) {
      const totalTaxDistribution = Object.values(settings.taxSettings).reduce((sum, val) => {
        if (typeof val === 'number' && val > 0) return sum + val;
        return sum;
      }, 0) - settings.taxSettings.buyTax - settings.taxSettings.sellTax - settings.taxSettings.transferTax - settings.taxSettings.maxTax;
      
      if (Math.abs(totalTaxDistribution - 100) > 0.01) {
        issues.push("Tax distribution must total 100%");
      }
      
      if (settings.taxSettings.marketingShare > 0 && !settings.walletSettings.marketingWallet) {
        issues.push("Marketing wallet address required");
      }
      
      if (settings.taxSettings.devShare > 0 && !settings.walletSettings.devWallet) {
        issues.push("Development wallet address required");
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const validation = getValidationStatus();
  const contractType = CONTRACT_TYPES.find(t => t.id === settings.contractType);

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Smart Contract Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={validation.isValid ? "default" : "destructive"}>
              {validation.isValid ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Ready</>
              ) : (
                <><AlertCircle className="h-3 w-3 mr-1" /> Issues</>
              )}
            </Badge>
            {contractType && (
              <Badge variant="outline">
                {contractType.name}
              </Badge>
            )}
          </div>
        </div>
        
        {!validation.isValid && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900 mb-1">Please fix these issues:</p>
            <ul className="text-sm text-red-800 space-y-1">
              {validation.issues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-2 border-b">
          <button
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'contract' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('contract')}
          >
            Contract Code
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'instructions' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('instructions')}
          >
            Deployment Guide
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute top-2 right-2 z-10">
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(
                  activeTab === 'contract' ? contractCode : deploymentInstructions,
                  activeTab === 'contract' ? 'Contract code' : 'Deployment instructions'
                )}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadFile(
                  activeTab === 'contract' ? contractCode : deploymentInstructions,
                  activeTab === 'contract' ? `${settings.tokenSymbol}.sol` : `${settings.tokenSymbol}_deployment.md`
                )}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {activeTab === 'contract' ? contractCode : deploymentInstructions}
            </pre>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1" 
            disabled={!validation.isValid || isGenerating}
            onClick={() => {
              toast({
                title: "Contract Generated!",
                description: `${settings.tokenName} contract is ready for deployment`,
              });
            }}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                <span>Generate Contract</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Contract will be generated for {settings.tokenName} ({settings.tokenSymbol})</p>
          <p>• Estimated gas cost: {contractType?.gasEstimate || 'N/A'}</p>
          <p>• Network: {settings.networkId === 369 ? 'PulseChain Mainnet' : 'Other Network'}</p>
        </div>
      </CardContent>
    </Card>
  );
};
