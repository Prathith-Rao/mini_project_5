import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { TimeDataPoint } from '../../types/streetlight.types';

interface MLAccuracyProps {
  data: TimeDataPoint[];
  correlation: string;
}

export const MLAccuracy = ({ data, correlation }: MLAccuracyProps) => {
  const scatterData = data.slice(0, 300).map(d => ({
    actual: d.brightness,
    predicted: d.predictedBrightness,
  }));

  const idealLine = [
    { actual: 0, predicted: 0 },
    { actual: 100, predicted: 100 }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3">
        ML Prediction Accuracy (r = {correlation})
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey="actual"
            name="Actual"
            stroke="#9CA3AF"
            domain={[0, 100]}
          />
          <YAxis
            type="number"
            dataKey="predicted"
            name="Predicted"
            stroke="#9CA3AF"
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter
            data={scatterData}
            fill="#F59E0B"
            opacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
