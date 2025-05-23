
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
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
