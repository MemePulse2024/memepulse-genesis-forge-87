
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Lightbulb, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UtilityOption {
  id: string;
  name: string;
  description: string;
  complexity: 'Easy' | 'Medium' | 'Advanced';
}

export const TokenUtilitySuggestions = () => {
  const { toast } = useToast();
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);

  const utilityOptions: UtilityOption[] = [
    {
      id: 'governance',
      name: 'Governance Voting',
      description: 'Token holders can vote on project decisions and proposals',
      complexity: 'Medium'
    },
    {
      id: 'staking',
      name: 'Staking Rewards',
      description: 'Lock tokens to earn passive rewards over time',
      complexity: 'Medium'
    },
    {
      id: 'access',
      name: 'Access Passes',
      description: 'Tokens grant access to exclusive community features or content',
      complexity: 'Easy'
    },
    {
      id: 'burn',
      name: 'Buyback & Burn',
      description: 'Project revenue used to buy and burn tokens, reducing supply',
      complexity: 'Medium'
    },
    {
      id: 'nft',
      name: 'NFT Integration',
      description: 'Tokens can be used to mint or unlock special NFTs',
      complexity: 'Advanced'
    },
    {
      id: 'games',
      name: 'Games & Contests',
      description: 'Token-based games and community competitions with rewards',
      complexity: 'Easy'
    },
    {
      id: 'merch',
      name: 'Merchandise Discounts',
      description: 'Token holders get discounts on project merchandise',
      complexity: 'Easy'
    },
    {
      id: 'launchpad',
      name: 'Launchpad Access',
      description: 'Hold tokens to participate in future project launches',
      complexity: 'Advanced'
    }
  ];

  const toggleUtility = (utilityId: string) => {
    setSelectedUtilities(prev => 
      prev.includes(utilityId) 
        ? prev.filter(id => id !== utilityId)
        : [...prev, utilityId]
    );
  };

  const getComplexityColor = (complexity: 'Easy' | 'Medium' | 'Advanced') => {
    switch (complexity) {
      case 'Easy': return 'bg-green-600/20 text-green-400';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-400';
      case 'Advanced': return 'bg-red-600/20 text-red-400';
      default: return '';
    }
  };

  const copyUtilitiesToClipboard = () => {
    if (selectedUtilities.length === 0) {
      toast({
        title: "No utilities selected",
        description: "Please select at least one utility to copy",
        variant: "destructive"
      });
      return;
    }

    const selectedOptions = utilityOptions.filter(option => selectedUtilities.includes(option.id));
    const text = `🛠️ PLANNED TOKEN UTILITIES 🛠️\n\n${selectedOptions.map(option => 
      `• ${option.name} (${option.complexity})\n  ${option.description}`
    ).join('\n\n')}`;

    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard! 📋",
      description: `${selectedUtilities.length} utility ideas copied`,
    });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle className="font-orbitron flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Token Utility Ideas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm mb-4">
          Select utility features to enhance your token's value proposition
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {utilityOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-start space-x-2 p-3 rounded-md bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
            >
              <Checkbox
                id={option.id}
                checked={selectedUtilities.includes(option.id)}
                onCheckedChange={() => toggleUtility(option.id)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label
                  htmlFor={option.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  {option.name}
                  <span className={`text-xs px-2 py-0.5 rounded ${getComplexityColor(option.complexity)}`}>
                    {option.complexity}
                  </span>
                </Label>
                <p className="text-xs text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {selectedUtilities.length} utilities selected
          </div>
          <Button
            onClick={copyUtilitiesToClipboard}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-800"
            disabled={selectedUtilities.length === 0}
          >
            <Copy className="h-4 w-4 mr-2" /> Copy Utilities
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
