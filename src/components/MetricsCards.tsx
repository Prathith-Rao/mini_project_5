import { TrendingDown, Zap, Activity, DollarSign, Leaf } from 'lucide-react';
import { EnergyMetrics, ValidationMetrics, CityData } from '../types/streetlight.types';

interface MetricsCardsProps {
  metrics: EnergyMetrics;
  validation: ValidationMetrics;
  cityData: CityData;
}

export const MetricsCards = ({ metrics, validation, cityData }: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={24} />
          <h3 className="text-sm font-semibold">Energy Saved</h3>
        </div>
        <p className="text-3xl font-bold">{metrics.percentageSaved}%</p>
        <p className="text-xs opacity-80">{metrics.energySavedKwh.toFixed(1)} kWh</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={24} />
          <h3 className="text-sm font-semibold">Smart Energy</h3>
        </div>
        <p className="text-3xl font-bold">{metrics.smartEnergyKwh.toFixed(1)}</p>
        <p className="text-xs opacity-80">kWh consumed</p>
      </div>

      <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={24} />
          <h3 className="text-sm font-semibold">Model R²</h3>
        </div>
        <p className="text-3xl font-bold">{validation.rSquared}</p>
        <p className="text-xs opacity-80">RMSE: {validation.rmse}</p>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign size={24} />
          <h3 className="text-sm font-semibold">Cost Saved</h3>
        </div>
        <p className="text-3xl font-bold">${metrics.costSaved}</p>
        <p className="text-xs opacity-80">24-hour period</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={24} />
          <h3 className="text-sm font-semibold">CO₂ Reduced</h3>
        </div>
        <p className="text-3xl font-bold">{metrics.co2Saved.toFixed(1)}</p>
        <p className="text-xs opacity-80">kg CO₂</p>
      </div>
    </div>
  );
};
