
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SupplyAllocationFormProps {
  supplyAllocation: {
    pulsex: string;
    airdrop: string;
    dev: string;
    marketing: string;
    burn: string;
  };
  error?: string;
  onUpdate: (field: string, value: string, subField: string) => void;
}

export const SupplyAllocationForm = ({ supplyAllocation, error, onUpdate }: SupplyAllocationFormProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle className="font-orbitron">Supply Allocation</CardTitle>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pulsex">PulseX Liquidity (%)</Label>
          <Input
            id="pulsex"
            type="number"
            value={supplyAllocation.pulsex}
            onChange={(e) => onUpdate('supplyAllocation', e.target.value, 'pulsex')}
            className="bg-black/50 border-gray-600"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="airdrop">Airdrop (%)</Label>
            <Input
              id="airdrop"
              type="number"
              value={supplyAllocation.airdrop}
              onChange={(e) => onUpdate('supplyAllocation', e.target.value, 'airdrop')}
              className="bg-black/50 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="dev">Dev Team (%)</Label>
            <Input
              id="dev"
              type="number"
              value={supplyAllocation.dev}
              onChange={(e) => onUpdate('supplyAllocation', e.target.value, 'dev')}
              className="bg-black/50 border-gray-600"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="marketingSupply">Marketing (%)</Label>
            <Input
              id="marketingSupply"
              type="number"
              value={supplyAllocation.marketing}
              onChange={(e) => onUpdate('supplyAllocation', e.target.value, 'marketing')}
              className="bg-black/50 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="burn">Burn (%)</Label>
            <Input
              id="burn"
              type="number"
              value={supplyAllocation.burn}
              onChange={(e) => onUpdate('supplyAllocation', e.target.value, 'burn')}
              className="bg-black/50 border-gray-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
