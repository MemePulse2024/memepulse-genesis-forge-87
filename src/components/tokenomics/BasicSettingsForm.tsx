import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BasicSettingsFormProps {
  totalSupply: string;
  buyTax: string;
  sellTax: string;
  onUpdate: (field: string, value: string) => void;
}

export const BasicSettingsForm = ({ totalSupply, buyTax, sellTax, onUpdate }: BasicSettingsFormProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle className="font-orbitron">Basic Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="totalSupply">Total Supply (Tokens)</Label>
          <Input
            id="totalSupply"
            type="number"
            value={totalSupply}
            onChange={(e) => onUpdate('totalSupply', e.target.value)}
            className="bg-black/50 border-gray-600"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="buyTax">Buy Tax (%)</Label>
            <Input
              id="buyTax"
              type="number"
              max="25"
              value={buyTax}
              onChange={(e) => onUpdate('buyTax', e.target.value)}
              className="bg-black/50 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="sellTax">Sell Tax (%)</Label>
            <Input
              id="sellTax"
              type="number"
              max="25"
              value={sellTax}
              onChange={(e) => onUpdate('sellTax', e.target.value)}
              className="bg-black/50 border-gray-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
