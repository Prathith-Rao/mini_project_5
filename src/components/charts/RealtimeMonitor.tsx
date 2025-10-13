import { Activity } from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RealtimeMonitorProps {
  data: Array<{
    time: string;
    brightness?: number;
    traffic: number;
    sunlight: number;
  }>;
}

export const RealtimeMonitor = ({ data }: RealtimeMonitorProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Activity className="text-green-400" size={20} />
        Real-Time System Monitor (Last 60 Minutes)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" interval={14} />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="brightness"
            stroke="#10B981"
            strokeWidth={3}
            dot={false}
            name="Brightness (%)"
          />
          <Line
            type="monotone"
            dataKey="traffic"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
            name="Traffic (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
