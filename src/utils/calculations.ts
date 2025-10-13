import { TimeDataPoint, EnergyMetrics, HourlyData, SystemHealthMetric, ValidationMetrics, CumulativeSavingsPoint } from '../types/streetlight.types';
import { SystemConfig } from '../config/systemConfig';
import { calculatePowerConsumption, calculateTraditionalPower, watthourToKilowattHour } from './powerModel';

export const calculateEnergy = (
  data: TimeDataPoint[],
  config: SystemConfig,
  numLamps: number
): EnergyMetrics => {
  let smartEnergyWh = 0;
  let traditionalEnergyWh = 0;

  const traditionalPowerPerLamp = calculateTraditionalPower(config);

  data.forEach(point => {
    const brightnessPercent = point.predictedBrightness || 0;
    const smartPowerPerLamp = calculatePowerConsumption(brightnessPercent, config);

    const timeIntervalHours = config.timeIntervalMinutes / 60;

    smartEnergyWh += smartPowerPerLamp * timeIntervalHours * numLamps;
    traditionalEnergyWh += traditionalPowerPerLamp * timeIntervalHours * numLamps;
  });

  const smartEnergyKwh = watthourToKilowattHour(smartEnergyWh);
  const traditionalEnergyKwh = watthourToKilowattHour(traditionalEnergyWh);
  const energySavedKwh = traditionalEnergyKwh - smartEnergyKwh;
  const percentageSaved = (energySavedKwh / traditionalEnergyKwh) * 100;

  const costSaved = energySavedKwh * config.energyCostPerKwh;

  const co2Saved = energySavedKwh * config.co2EmissionFactor;

  return {
    smartEnergy: smartEnergyWh,
    traditionalEnergy: traditionalEnergyWh,
    energySaved: energySavedKwh * 1000,
    percentageSaved: parseFloat(percentageSaved.toFixed(2)),
    costSaved: parseFloat(costSaved.toFixed(2)),
    co2Saved: parseFloat(co2Saved.toFixed(2)),
    smartEnergyKwh: parseFloat(smartEnergyKwh.toFixed(2)),
    traditionalEnergyKwh: parseFloat(traditionalEnergyKwh.toFixed(2)),
    energySavedKwh: parseFloat(energySavedKwh.toFixed(2)),
  };
};

export const calculateValidationMetrics = (data: TimeDataPoint[]): ValidationMetrics => {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  let sumSquaredError = 0, sumAbsError = 0, sumMape = 0;

  data.forEach(point => {
    const actual = point.brightness;
    const predicted = point.predictedBrightness || 0;
    const error = actual - predicted;

    sumX += actual;
    sumY += predicted;
    sumXY += actual * predicted;
    sumX2 += actual * actual;
    sumY2 += predicted * predicted;
    sumSquaredError += error * error;
    sumAbsError += Math.abs(error);

    if (actual !== 0) {
      sumMape += Math.abs(error / actual);
    }
  });

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const pearsonR = numerator / denominator;

  const rSquared = pearsonR * pearsonR;

  const rmse = Math.sqrt(sumSquaredError / n);

  const mae = sumAbsError / n;

  const mape = (sumMape / n) * 100;

  return {
    pearsonR: parseFloat(pearsonR.toFixed(4)),
    rSquared: parseFloat(rSquared.toFixed(4)),
    rmse: parseFloat(rmse.toFixed(3)),
    mae: parseFloat(mae.toFixed(3)),
    mape: parseFloat(mape.toFixed(2)),
  };
};

export const calculateCorrelation = (data: TimeDataPoint[]): string => {
  const metrics = calculateValidationMetrics(data);
  return metrics.pearsonR.toFixed(4);
};

export const getHourlyAggregated = (
  data: TimeDataPoint[],
  config: SystemConfig,
  numLamps: number
): HourlyData[] => {
  const hourly: HourlyData[] = [];

  for (let h = 0; h < 24; h++) {
    const hourData = data.filter(d => d.hour === h);
    if (hourData.length > 0) {
      const avgBrightness = hourData.reduce((sum, d) => sum + (d.predictedBrightness || 0), 0) / hourData.length;
      const avgTraffic = hourData.reduce((sum, d) => sum + d.traffic, 0) / hourData.length;
      const avgSunlight = hourData.reduce((sum, d) => sum + d.sunlight, 0) / hourData.length;

      let smartEnergyWh = 0;
      let traditionalEnergyWh = 0;

      hourData.forEach(point => {
        const smartPower = calculatePowerConsumption(point.predictedBrightness || 0, config);
        const tradPower = calculateTraditionalPower(config);
        const timeHours = config.timeIntervalMinutes / 60;

        smartEnergyWh += smartPower * timeHours * numLamps;
        traditionalEnergyWh += tradPower * timeHours * numLamps;
      });

      const smartEnergyKwh = watthourToKilowattHour(smartEnergyWh);
      const tradEnergyKwh = watthourToKilowattHour(traditionalEnergyWh);

      hourly.push({
        hour: `${h}:00`,
        hourNum: h,
        brightness: parseFloat(avgBrightness.toFixed(2)),
        traffic: parseFloat(avgTraffic.toFixed(2)),
        sunlight: parseFloat(avgSunlight.toFixed(2)),
        smartEnergy: parseFloat(smartEnergyKwh.toFixed(3)),
        traditionalEnergy: parseFloat(tradEnergyKwh.toFixed(3)),
        savings: parseFloat(((tradEnergyKwh - smartEnergyKwh) / tradEnergyKwh * 100).toFixed(2)),
        smartPower: parseFloat((smartEnergyWh / hourData.length).toFixed(2)),
        traditionalPower: parseFloat((traditionalEnergyWh / hourData.length).toFixed(2)),
      });
    }
  }

  return hourly;
};

export const getRealtimeData = (displayData: TimeDataPoint[]) => {
  if (displayData.length === 0) return [];
  return displayData.slice(-60).map(d => ({
    time: d.time,
    brightness: d.predictedBrightness,
    traffic: d.traffic,
    sunlight: d.sunlight,
  }));
};

export const getCumulativeSavings = (
  data: TimeDataPoint[],
  config: SystemConfig,
  numLamps: number
): CumulativeSavingsPoint[] => {
  const hourly = getHourlyAggregated(data, config, numLamps);
  let cumulativeEnergyKwh = 0;
  let cumulativeCost = 0;
  let cumulativeCO2 = 0;

  return hourly.map(h => {
    const hourEnergySaved = (h.traditionalEnergy - h.smartEnergy);
    cumulativeEnergyKwh += hourEnergySaved;
    cumulativeCost += hourEnergySaved * config.energyCostPerKwh;
    cumulativeCO2 += hourEnergySaved * config.co2EmissionFactor;

    return {
      hour: h.hour,
      hourNum: h.hourNum,
      energySavedKwh: parseFloat(hourEnergySaved.toFixed(3)),
      cumulativeEnergySavedKwh: parseFloat(cumulativeEnergyKwh.toFixed(2)),
      percentageSaved: h.savings,
      cumulativeCostSaved: parseFloat(cumulativeCost.toFixed(2)),
      cumulativeCO2Saved: parseFloat(cumulativeCO2.toFixed(2)),
    };
  });
};

export const getSystemHealth = (
  displayData: TimeDataPoint[],
  validation: ValidationMetrics,
  savingsPercent: number
): SystemHealthMetric[] => {
  if (displayData.length === 0) return [];

  const recent = displayData.slice(-100);
  const avgTraffic = recent.reduce((sum, d) => sum + d.traffic, 0) / recent.length;
  const responseTime = 95 + Math.random() * 5;
  const uptime = 99.8;

  return [
    { metric: 'Response Time', value: responseTime, fullMark: 100 },
    { metric: 'Model Accuracy (R²)', value: validation.rSquared * 100, fullMark: 100 },
    { metric: 'System Uptime', value: uptime, fullMark: 100 },
    { metric: 'Traffic Detection', value: Math.min(avgTraffic, 100), fullMark: 100 },
    { metric: 'Energy Efficiency', value: savingsPercent, fullMark: 100 },
  ];
};
