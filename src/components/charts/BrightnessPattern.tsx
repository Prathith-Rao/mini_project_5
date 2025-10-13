import { Sun } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HourlyData } from '../../types/streetlight.types';

interface BrightnessPatternProps {
  data: HourlyData[];
}

export const BrightnessPattern = ({ data }: BrightnessPatternProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Sun className="text-yellow-400" size={20} />
        24-Hour Adaptive Brightness Pattern
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="hour" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="brightness"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name="Smart Brightness (%)"
          />
          <Area
            type="monotone"
            dataKey="sunlight"
            stroke="#FBBF24"
            fill="#FBBF24"
            fillOpacity={0.3}
            name="Sunlight (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
