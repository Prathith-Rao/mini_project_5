import { TrendingDown, DollarSign } from 'lucide-react';
import { ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CumulativeSavingsPoint } from '../../types/streetlight.types';

interface CumulativeSavingsEnhancedProps {
  data: CumulativeSavingsPoint[];
}

export const CumulativeSavingsEnhanced = ({ data }: CumulativeSavingsEnhancedProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <TrendingDown className="text-green-400" size={20} />
        Cumulative Savings Over 24 Hours
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="hour" stroke="#9CA3AF" />
          <YAxis yAxisId="left" stroke="#9CA3AF" label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" label={{ value: 'Cost ($)', angle: 90, position: 'insideRight' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
            formatter={(value: number, name: string) => {
              if (name === 'Cumulative Energy Saved') return `${value.toFixed(2)} kWh`;
              if (name === 'Cumulative Cost Saved') return `$${value.toFixed(2)}`;
              if (name === 'Hourly Savings') return `${value.toFixed(3)} kWh`;
              return value;
            }}
          />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="cumulativeEnergySavedKwh"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name="Cumulative Energy Saved"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativeCostSaved"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={false}
            name="Cumulative Cost Saved"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="energySavedKwh"
            stroke="#3B82F6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Hourly Savings"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
