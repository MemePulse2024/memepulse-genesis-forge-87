
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title: string;
}

export const TokenomicsPieChart = ({ data, title }: ChartProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle className="font-orbitron text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}> {/* Increased height */}
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90} {/* Slightly larger */}
              dataKey="value"
              labelLine={false}
              label={({ name, value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                // Only show label if the segment is large enough
                if (value < 5) return null;
                
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                
                return (
                  <text 
                    x={x} 
                    y={y} 
                    fill="#fff" 
                    textAnchor={x > cx ? 'start' : 'end'} 
                    dominantBaseline="central"
                    fontSize="12"
                  >
                    {`${name}: ${value}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Allocation']}
              contentStyle={{ backgroundColor: '#333', borderColor: '#666', color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
