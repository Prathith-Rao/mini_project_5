import { Eye } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { SystemHealthMetric } from '../../types/streetlight.types';

interface SystemHealthRadarProps {
  data: SystemHealthMetric[];
}

export const SystemHealthRadar = ({ data }: SystemHealthRadarProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Eye className="text-blue-400" size={20} />
        System Health Metrics
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" fontSize={12} />
          <PolarRadiusAxis stroke="#9CA3AF" domain={[0, 100]} />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
