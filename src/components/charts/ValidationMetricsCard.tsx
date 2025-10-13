import { Activity, TrendingUp, BarChart3 } from 'lucide-react';
import { ValidationMetrics } from '../../types/streetlight.types';

interface ValidationMetricsCardProps {
  metrics: ValidationMetrics;
}

export const ValidationMetricsCard = ({ metrics }: ValidationMetricsCardProps) => {
  const getQualityLabel = (r2: number): string => {
    if (r2 >= 0.95) return 'Excellent';
    if (r2 >= 0.85) return 'Very Good';
    if (r2 >= 0.70) return 'Good';
    if (r2 >= 0.50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Activity className="text-cyan-400" size={20} />
        ML Model Validation Metrics
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-blue-400" size={16} />
            <span className="text-xs text-slate-300">Pearson R</span>
          </div>
          <p className="text-2xl font-bold text-blue-300">{metrics.pearsonR}</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="text-green-400" size={16} />
            <span className="text-xs text-slate-300">R² Score</span>
          </div>
          <p className="text-2xl font-bold text-green-300">{metrics.rSquared}</p>
          <p className="text-xs text-slate-400">{getQualityLabel(metrics.rSquared)}</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-orange-400" size={16} />
            <span className="text-xs text-slate-300">RMSE</span>
          </div>
          <p className="text-2xl font-bold text-orange-300">{metrics.rmse}</p>
          <p className="text-xs text-slate-400">brightness units</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-yellow-400" size={16} />
            <span className="text-xs text-slate-300">MAE</span>
          </div>
          <p className="text-2xl font-bold text-yellow-300">{metrics.mae}</p>
          <p className="text-xs text-slate-400">brightness units</p>
        </div>
      </div>

      <div className="mt-3 p-3 bg-slate-900 rounded-lg">
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-cyan-400">Model Performance:</strong> R² = {metrics.rSquared} indicates {getQualityLabel(metrics.rSquared).toLowerCase()}
          {' '}prediction accuracy. RMSE of {metrics.rmse}% shows predictions are within ±{(metrics.rmse * 1.5).toFixed(1)}%
          of actual values 68% of the time (assuming normal distribution).
        </p>
      </div>
    </div>
  );
};
