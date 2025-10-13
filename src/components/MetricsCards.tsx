import { TrendingDown, Zap, Activity, Eye, MapPin } from 'lucide-react';
import { EnergyMetrics, CityData } from '../types/streetlight.types';

interface MetricsCardsProps {
  metrics: EnergyMetrics;
  correlation: string;
  progress: string;
  cityData: CityData;
}

export const MetricsCards = ({ metrics, correlation, progress, cityData }: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={24} />
          <h3 className="text-sm font-semibold">Energy Saved</h3>
        </div>
        <p className="text-3xl font-bold">{metrics.savings}%</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={24} />
          <h3 className="text-sm font-semibold">Smart Energy</h3>
        </div>
        <p className="text-3xl font-bold">{(parseFloat(metrics.smartEnergy) / 1000).toFixed(1)}k</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={24} />
          <h3 className="text-sm font-semibold">Accuracy (r)</h3>
        </div>
        <p className="text-3xl font-bold">{correlation}</p>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Eye size={24} />
          <h3 className="text-sm font-semibold">Progress</h3>
        </div>
        <p className="text-3xl font-bold">{progress}%</p>
      </div>

      <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={24} />
          <h3 className="text-sm font-semibold">City Lights</h3>
        </div>
        <p className="text-3xl font-bold">{cityData.lights.toLocaleString()}</p>
      </div>
    </div>
  );
};
