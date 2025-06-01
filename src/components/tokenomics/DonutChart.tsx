
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
  outerRadius = 100, 
  dataKey = 'value' 
}: DonutChartProps) => {
  // Custom label rendering function
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    // Only show labels for segments that are 3% or larger
    if (value < 3) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="11"
        fontWeight="600"
        className="drop-shadow-sm"
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          stroke="#374151"
          strokeWidth={1}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => [`${value}%`, 'Allocation']}
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            borderColor: '#4b5563', 
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Legend 
          formatter={(value: string) => (
            <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: '500' }}>
              {value}
            </span>
          )}
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ 
            paddingTop: '15px',
            fontSize: '12px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
