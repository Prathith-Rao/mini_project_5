import { Activity } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TimeDataPoint } from '../../types/streetlight.types';

interface ResidualPlotProps {
  data: TimeDataPoint[];
}

export const ResidualPlot = ({ data }: ResidualPlotProps) => {
  const residualData = data.slice(0, 500).map(d => ({
    predicted: d.predictedBrightness || 0,
    residual: d.brightness - (d.predictedBrightness || 0),
  }));

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Activity className="text-orange-400" size={20} />
        Residual Analysis (Prediction Errors)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey="predicted"
            name="Predicted"
            stroke="#9CA3AF"
            label={{ value: 'Predicted Brightness (%)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey="residual"
            name="Residual"
            stroke="#9CA3AF"
            label={{ value: 'Residual (Actual - Predicted)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <ReferenceLine y={0} stroke="#EF4444" strokeWidth={2} />
          <Scatter
            data={residualData}
            fill="#F59E0B"
            opacity={0.5}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2">
        Residuals should be randomly scattered around zero. Patterns indicate model bias or missing features.
      </p>
    </div>
  );
};
