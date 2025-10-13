import { TrendingDown } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CumulativeSavingsProps {
  data: Array<{
    hour: string;
    savings: number;
  }>;
}

export const CumulativeSavings = ({ data }: CumulativeSavingsProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <TrendingDown className="text-green-400" size={20} />
        Cumulative Energy Savings Over Time
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="hour" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
          />
          <Area
            type="monotone"
            dataKey="savings"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.7}
            name="Avg Savings (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
