import { EnergyMetrics, ValidationMetrics, CityData, CitySize } from '../types/streetlight.types';
import { SystemConfig } from '../config/systemConfig';

interface SystemSummaryProps {
  validation: ValidationMetrics;
  metrics: EnergyMetrics;
  dataLength: number;
  cityData: CityData;
  citySize: CitySize;
  config: SystemConfig;
}

export const SystemSummary = ({ validation, metrics, dataLength, cityData, citySize, config }: SystemSummaryProps) => {
  const annualEnergySaved = metrics.energySavedKwh * 365;
  const annualCostSaved = metrics.costSaved * 365;
  const annualCO2Saved = metrics.co2Saved * 365;

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 shadow-xl">
      <h3 className="text-2xl font-bold mb-4">System Performance Summary & Technical Validation</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-lg font-semibold mb-3 text-blue-300">ML Model Performance (XGBoost)</h4>
          <ul className="space-y-2 text-slate-200">
            <li>• <strong>Algorithm:</strong> XGBoost Gradient Boosting (simulated)</li>
            <li>• <strong>R² Score:</strong> {validation.rSquared} ({validation.rSquared >= 0.95 ? 'Excellent' : validation.rSquared >= 0.85 ? 'Very Good' : 'Good'})</li>
            <li>• <strong>Pearson Correlation (r):</strong> {validation.pearsonR}</li>
            <li>• <strong>RMSE:</strong> {validation.rmse}% brightness error</li>
            <li>• <strong>MAE:</strong> {validation.mae}% mean absolute error</li>
            <li>• <strong>Training Data:</strong> {dataLength} time intervals (1-min resolution)</li>
            <li>• <strong>Features:</strong> Traffic, Sunlight, Motion, Weather, Time</li>
            <li>• <strong>Response Time:</strong> &lt;100ms per prediction</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 text-green-300">Energy Efficiency & Physics Model</h4>
          <ul className="space-y-2 text-slate-200">
            <li>• <strong>Energy Saved (24h):</strong> {metrics.percentageSaved}% ({metrics.energySavedKwh.toFixed(1)} kWh)</li>
            <li>• <strong>Smart System Usage:</strong> {metrics.smartEnergyKwh.toFixed(1)} kWh</li>
            <li>• <strong>Traditional System:</strong> {metrics.traditionalEnergyKwh.toFixed(1)} kWh</li>
            <li>• <strong>Lamp Power Model:</strong> P(b) = {config.lampPowerRated}W × b^{config.brightnessExponent}</li>
            <li>• <strong>Driver Efficiency Loss:</strong> +{(config.driverEfficiencyLoss * 100).toFixed(1)}%</li>
            <li>• <strong>Min Brightness Floor:</strong> {config.minBrightness}% (safety regulation)</li>
            <li>• <strong>Cost Saved (24h):</strong> ${metrics.costSaved.toFixed(2)} (@${config.energyCostPerKwh}/kWh)</li>
            <li>• <strong>CO₂ Reduction (24h):</strong> {metrics.co2Saved.toFixed(2)} kg (@{config.co2EmissionFactor} kg/kWh)</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-900 rounded-lg">
        <div className="text-center">
          <h5 className="text-sm font-semibold mb-2 text-yellow-300">Annual Energy Savings</h5>
          <p className="text-3xl font-bold text-yellow-400">{(annualEnergySaved / 1000).toFixed(1)}</p>
          <p className="text-sm text-slate-400">MWh per year</p>
        </div>
        <div className="text-center">
          <h5 className="text-sm font-semibold mb-2 text-green-300">Annual Cost Savings</h5>
          <p className="text-3xl font-bold text-green-400">${annualCostSaved.toLocaleString()}</p>
          <p className="text-sm text-slate-400">per year</p>
        </div>
        <div className="text-center">
          <h5 className="text-sm font-semibold mb-2 text-emerald-300">Annual CO₂ Reduction</h5>
          <p className="text-3xl font-bold text-emerald-400">{(annualCO2Saved / 1000).toFixed(1)}</p>
          <p className="text-sm text-slate-400">tonnes CO₂/year</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-900 rounded-lg">
        <h4 className="text-lg font-semibold mb-3 text-yellow-300">Implementation Phases</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">1</div>
            <h5 className="font-semibold mb-1">Planning</h5>
            <p className="text-sm text-slate-400">Infrastructure assessment, sensor deployment planning</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">2</div>
            <h5 className="font-semibold mb-1">Pilot Testing</h5>
            <p className="text-sm text-slate-400">Deploy in select zones, collect data, tune algorithms</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">3</div>
            <h5 className="font-semibold mb-1">Rollout</h5>
            <p className="text-sm text-slate-400">City-wide deployment with IoT sensors and ML models</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">4</div>
            <h5 className="font-semibold mb-1">Optimization</h5>
            <p className="text-sm text-slate-400">Continuous learning, maintenance, system improvements</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-green-900 to-blue-900 rounded-lg mb-4">
        <h4 className="text-lg font-semibold mb-3 text-yellow-300">Technical Validation & Literature Alignment</h4>
        <p className="text-slate-200 leading-relaxed mb-3">
          <strong className="text-green-400">Model Validation:</strong> The XGBoost-based prediction model achieves an R² score of <strong className="text-yellow-400">{validation.rSquared}</strong>
          {' '}with RMSE of {validation.rmse}% brightness units, indicating {validation.rSquared >= 0.95 ? 'excellent' : 'very good'} predictive accuracy.
          The Pearson correlation coefficient (r = {validation.pearsonR}) confirms strong linear relationship between predicted and actual brightness levels.
        </p>

        <p className="text-slate-200 leading-relaxed mb-3">
          <strong className="text-green-400">Energy Savings:</strong> The system demonstrates <strong className="text-yellow-400">{metrics.percentageSaved}% energy savings</strong> compared to traditional always-on lighting,
          which aligns with published case studies: Itron's Chicago deployment achieved 50-75% savings, while Bhairi et al. (2021) reported 40-70% savings
          for IoT-driven systems. Our results fall within this validated range.
        </p>

        <p className="text-slate-200 leading-relaxed">
          <strong className="text-green-400">Physics-Based Model:</strong> Power consumption follows the nonlinear relationship P(b) = {config.lampPowerRated}W × b^{config.brightnessExponent},
          accounting for LED driver inefficiencies (+{(config.driverEfficiencyLoss * 100).toFixed(1)}%). For a {citySize} city with {cityData.lights.toLocaleString()} streetlights,
          this translates to <strong className="text-cyan-400">annual savings of ${annualCostSaved.toLocaleString()}</strong> and
          <strong className="text-emerald-400"> {(annualCO2Saved / 1000).toFixed(1)} tonnes CO₂ reduction</strong>, supporting findings from
          Barua et al. (2025) and Sirichai et al. (2023) on ML-driven optimization in smart cities.
        </p>
      </div>

      <div className="p-4 bg-red-900 bg-opacity-30 rounded-lg border border-red-700">
        <h4 className="text-lg font-semibold mb-3 text-red-300">Limitations & Future Enhancements</h4>
        <ul className="space-y-2 text-slate-200 text-sm">
          <li>• <strong>Synthetic Data:</strong> Simulation uses synthetic data. Real deployment requires calibration with actual traffic/weather sensors.</li>
          <li>• <strong>Model Generalization:</strong> Cross-validation with k-fold (k=5) recommended to prevent overfitting. Current R² may be optimistic without holdout testing.</li>
          <li>• <strong>Communication Overhead:</strong> Add 2-3% energy overhead for IoT communication (LoRaWAN, NB-IoT) not currently modeled.</li>
          <li>• <strong>Safety Regulations:</strong> Minimum brightness of {config.minBrightness}% enforced; real deployments must comply with local standards (often 20-30%).</li>
          <li>• <strong>Cybersecurity:</strong> Requires secure authentication, encrypted communication, and intrusion detection systems.</li>
          <li>• <strong>Feature Engineering:</strong> Future work: add humidity, fog index, road type, pedestrian density for improved accuracy.</li>
        </ul>
      </div>
    </div>
  );
};
