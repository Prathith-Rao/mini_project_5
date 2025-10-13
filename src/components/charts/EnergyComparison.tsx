import { Zap } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HourlyData } from '../../types/streetlight.types';

interface EnergyComparisonProps {
  data: HourlyData[];
}

export const EnergyComparison = ({ data }: EnergyComparisonProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Zap className="text-blue-400" size={20} />
        Hourly Energy Consumption Comparison
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="hour" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="smartEnergy" fill="#3B82F6" name="Smart System" />
          <Bar dataKey="traditionalEnergy" fill="#EF4444" name="Traditional" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
