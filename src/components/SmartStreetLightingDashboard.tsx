import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { TimeDataPoint, CitySize } from '../types/streetlight.types';
import { generateTimeData } from '../utils/dataGeneration';
import { trainAndPredictXGBoost } from '../utils/mlModel';
import { calculateEnergy, calculateValidationMetrics, getHourlyAggregated, getRealtimeData, getCumulativeSavings, getSystemHealth } from '../utils/calculations';
import { DEFAULT_SYSTEM_CONFIG, CITY_LAMP_CONFIGS } from '../config/systemConfig';
import { CITY_DATA } from '../constants/cityData';
import { MetricsCards } from './MetricsCards';
import { ControlPanel } from './ControlPanel';
import { RealtimeMonitor } from './charts/RealtimeMonitor';
import { SystemHealthRadar } from './charts/SystemHealthRadar';
import { BrightnessPattern } from './charts/BrightnessPattern';
import { EnergyComparison } from './charts/EnergyComparison';
import { MLAccuracy } from './charts/MLAccuracy';
import { CumulativeSavingsEnhanced } from './charts/CumulativeSavingsEnhanced';
import { ValidationMetricsCard } from './charts/ValidationMetricsCard';
import { ResidualPlot } from './charts/ResidualPlot';
import { ImplementationTimeline } from './ImplementationTimeline';
import { SystemSummary } from './SystemSummary';

const SmartStreetLightingDashboard = () => {
  const [fullData, setFullData] = useState<TimeDataPoint[]>([]);
  const [displayData, setDisplayData] = useState<TimeDataPoint[]>([]);
  const [metrics, setMetrics] = useState(calculateEnergy([], DEFAULT_SYSTEM_CONFIG, 25000));
  const [validation, setValidation] = useState(calculateValidationMetrics([]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [trafficLevel, setTrafficLevel] = useState(1);
  const [weatherCondition, setWeatherCondition] = useState(0.2);
  const [showSettings, setShowSettings] = useState(false);
  const [citySize, setCitySize] = useState<CitySize>('medium');

  useEffect(() => {
    generateNewData();
  }, [trafficLevel, weatherCondition, citySize]);

  const generateNewData = () => {
    const numLamps = CITY_LAMP_CONFIGS[citySize].numLamps;
    const config = {
      ...DEFAULT_SYSTEM_CONFIG,
      lampPowerRated: CITY_LAMP_CONFIGS[citySize].lampPowerRated,
    };

    const rawData = generateTimeData(24, 60, trafficLevel, weatherCondition, config);
    const processedData = trainAndPredictXGBoost(rawData, config);

    setFullData(processedData);
    setDisplayData([]);
    setCurrentIndex(0);
    setMetrics(calculateEnergy(processedData, config, numLamps));
    setValidation(calculateValidationMetrics(processedData));
  };

  useEffect(() => {
    if (isRunning && currentIndex < fullData.length) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + 15;
          if (next >= fullData.length) {
            setIsRunning(false);
            return fullData.length;
          }
          setDisplayData(fullData.slice(0, next));
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning, currentIndex, fullData]);

  const getCurrentHour = () => {
    if (currentIndex >= fullData.length) return 23;
    return fullData[currentIndex]?.hour || 0;
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setDisplayData([]);
    setIsRunning(false);
  };

  const handleApplyChanges = () => {
    generateNewData();
    setIsRunning(false);
  };

  const currentHour = getCurrentHour();
  const progress = ((currentIndex / fullData.length) * 100).toFixed(1);
  const realtimeData = getRealtimeData(displayData);

  const numLamps = CITY_LAMP_CONFIGS[citySize].numLamps;
  const config = {
    ...DEFAULT_SYSTEM_CONFIG,
    lampPowerRated: CITY_LAMP_CONFIGS[citySize].lampPowerRated,
  };

  const hourlyData = getHourlyAggregated(
    displayData.length > 0 ? displayData : fullData,
    config,
    numLamps
  );
  const systemHealth = getSystemHealth(displayData, validation, metrics.percentageSaved);
  const cumulativeSavings = getCumulativeSavings(
    displayData.length > 0 ? displayData : fullData,
    config,
    numLamps
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Zap className="text-yellow-400" size={40} />
            AI-Driven Smart Street Lighting System
          </h1>
          <p className="text-blue-200 text-lg">IoT-Based Energy Optimization with XGBoost Machine Learning</p>
        </div>

        <MetricsCards
          metrics={metrics}
          validation={validation}
          cityData={CITY_DATA[citySize]}
        />

        <ControlPanel
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          onReset={handleReset}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          currentHour={currentHour}
          displayDataLength={displayData.length}
          fullDataLength={fullData.length}
          trafficLevel={trafficLevel}
          setTrafficLevel={setTrafficLevel}
          weatherCondition={weatherCondition}
          setWeatherCondition={setWeatherCondition}
          citySize={citySize}
          setCitySize={setCitySize}
          onApplyChanges={handleApplyChanges}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <RealtimeMonitor data={realtimeData} />
          <SystemHealthRadar data={systemHealth} />
          <BrightnessPattern data={hourlyData} />
          <EnergyComparison data={hourlyData} />
          <MLAccuracy data={fullData} correlation={validation.pearsonR.toString()} />
          <ValidationMetricsCard metrics={validation} />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <CumulativeSavingsEnhanced data={cumulativeSavings} />
          <ResidualPlot data={fullData} />
        </div>

        <ImplementationTimeline citySize={citySize} cityData={CITY_DATA[citySize]} />

        <SystemSummary
          validation={validation}
          metrics={metrics}
          dataLength={fullData.length}
          cityData={CITY_DATA[citySize]}
          citySize={citySize}
          config={config}
        />
      </div>
    </div>
  );
};

export default SmartStreetLightingDashboard;
