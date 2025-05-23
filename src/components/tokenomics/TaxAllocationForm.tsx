
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaxAllocationFormProps {
  taxAllocation: {
    liquidity: string;
    marketing: string;
    reflection: string;
  };
  error?: string;
  onUpdate: (field: string, value: string, subField: string) => void;
}

export const TaxAllocationForm = ({ taxAllocation, error, onUpdate }: TaxAllocationFormProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle className="font-orbitron">Tax Allocation</CardTitle>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="liquidity">Liquidity (%)</Label>
          <Input
            id="liquidity"
            type="number"
            value={taxAllocation.liquidity}
            onChange={(e) => onUpdate('taxAllocation', e.target.value, 'liquidity')}
            className="bg-black/50 border-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="marketing">Marketing (%)</Label>
          <Input
            id="marketing"
            type="number"
            value={taxAllocation.marketing}
            onChange={(e) => onUpdate('taxAllocation', e.target.value, 'marketing')}
            className="bg-black/50 border-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="reflection">Reflection (%)</Label>
          <Input
            id="reflection"
            type="number"
            value={taxAllocation.reflection}
            onChange={(e) => onUpdate('taxAllocation', e.target.value, 'reflection')}
            className="bg-black/50 border-gray-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};
