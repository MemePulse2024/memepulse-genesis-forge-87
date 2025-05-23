
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: ChartData[];
  innerRadius?: number;
  outerRadius?: number;
  dataKey?: string;
}

export const DonutChart = ({ 
  data, 
  innerRadius = 60, 
  outerRadius = 80, 
  dataKey = 'value' 
}: DonutChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey={dataKey}
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}%`}
        >
          {data.map((entry, index) => (
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
  );
};
