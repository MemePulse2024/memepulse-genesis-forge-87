
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LockPeriod {
  id: string;
  months: string;
  percentage: string;
  description: string;
}

export const TokenLockSchedule = () => {
  const [lockPeriods, setLockPeriods] = useState<LockPeriod[]>([
    { id: '1', months: '3', percentage: '25', description: 'Initial unlock' },
    { id: '2', months: '6', percentage: '25', description: 'Second unlock' },
    { id: '3', months: '9', percentage: '25', description: 'Third unlock' },
    { id: '4', months: '12', percentage: '25', description: 'Final unlock' }
  ]);

  const addLockPeriod = () => {
    const newId = (lockPeriods.length + 1).toString();
    setLockPeriods([...lockPeriods, { 
      id: newId, 
      months: '', 
      percentage: '', 
      description: `Unlock ${lockPeriods.length + 1}` 
    }]);
  };

  const removeLockPeriod = (id: string) => {
    setLockPeriods(lockPeriods.filter(period => period.id !== id));
  };

  const updateLockPeriod = (id: string, field: keyof LockPeriod, value: string) => {
    setLockPeriods(lockPeriods.map(period => 
      period.id === id ? { ...period, [field]: value } : period
    ));
  };

  // Check if percentages sum to 100%
  const totalPercentage = lockPeriods.reduce((sum, period) => 
    sum + (parseFloat(period.percentage) || 0), 0
  );
  
  const hasError = Math.abs(totalPercentage - 100) > 0.01;

  // Sort data by months for chart
  const chartData = [...lockPeriods]
    .sort((a, b) => (parseInt(a.months) || 0) - (parseInt(b.months) || 0))
    .map(period => ({
      months: `${period.months}m`,
      value: parseFloat(period.percentage) || 0,
      description: period.description
    }));

  return (
    <Card className="bg-card/80 backdrop-blur-md border-purple-500/20">
      <CardHeader>
        <CardTitle className="font-orbitron flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Token Lock Schedule
        </CardTitle>
        {hasError && (
          <p className="text-red-400 text-sm">Total allocation must equal 100% (currently {totalPercentage.toFixed(1)}%)</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {lockPeriods.map((period) => (
            <div key={period.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor={`months-${period.id}`}>Months</Label>
                <Input
                  id={`months-${period.id}`}
                  type="number"
                  min="1"
                  value={period.months}
                  onChange={(e) => updateLockPeriod(period.id, 'months', e.target.value)}
                  className="bg-black/50 border-gray-600"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`percentage-${period.id}`}>Percentage (%)</Label>
                <Input
                  id={`percentage-${period.id}`}
                  type="number"
                  min="0"
                  max="100"
                  value={period.percentage}
                  onChange={(e) => updateLockPeriod(period.id, 'percentage', e.target.value)}
                  className="bg-black/50 border-gray-600"
                />
              </div>
              <div className="flex-[2]">
                <Label htmlFor={`description-${period.id}`}>Description</Label>
                <Input
                  id={`description-${period.id}`}
                  value={period.description}
                  onChange={(e) => updateLockPeriod(period.id, 'description', e.target.value)}
                  className="bg-black/50 border-gray-600"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLockPeriod(period.id)}
                className="text-gray-400 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={addLockPeriod}
          className="mt-2 border-gray-600 hover:bg-gray-800 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Lock Period
        </Button>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-300 text-sm mb-2">Token Release Schedule</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="months" tick={{ fill: '#aaa' }} axisLine={{ stroke: '#666' }} />
                <YAxis tick={{ fill: '#aaa' }} axisLine={{ stroke: '#666' }} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#666' }}
                  formatter={(value: number) => [`${value}%`, 'Unlock']}
                  labelFormatter={(label) => `${label} Months`}
                />
                <Bar dataKey="value" name="Unlock" fill="#6a0dad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
