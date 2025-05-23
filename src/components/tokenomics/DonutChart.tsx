
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
          // Simplified labels to prevent overlap
          label={({ name, value, cx, cy, midAngle, innerRadius, outerRadius }) => {
            // Only show the label if the segment is large enough
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
        <Legend 
          formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: '10px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
