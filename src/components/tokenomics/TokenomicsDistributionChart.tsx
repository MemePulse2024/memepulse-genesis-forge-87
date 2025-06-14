
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart } from '@/components/tokenomics/DonutChart';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface TokenomicsDistributionChartProps {
  taxData: ChartData[];
  supplyData: ChartData[];
}

export const TokenomicsDistributionChart = ({ taxData, supplyData }: TokenomicsDistributionChartProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle className="font-orbitron text-center text-xl">Tokenomics Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <h3 className="text-center text-gray-300 mb-6 font-semibold text-lg">Tax Allocation</h3>
            <div className="h-[300px]">
              <DonutChart 
                data={taxData} 
                innerRadius={60}
                outerRadius={90}
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-center text-gray-300 mb-6 font-semibold text-lg">Supply Allocation</h3>
            <div className="h-[300px]">
              <DonutChart 
                data={supplyData} 
                innerRadius={60}
                outerRadius={90}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
