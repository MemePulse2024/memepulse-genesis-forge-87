
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart } from '@/components/tokenomics/DonutChart';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';

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
        <CardTitle className="font-orbitron text-center">Tokenomics Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-center text-gray-300 mb-2">Tax Allocation</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {taxData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                    contentStyle={{ backgroundColor: '#333', borderColor: '#666', color: '#fff' }}
                  />
                  <Legend formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-center text-gray-300 mb-2">Supply Allocation</h3>
            <div className="h-[200px]">
              <DonutChart 
                data={supplyData} 
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
