import { TimeDataPoint, EnergyMetrics, HourlyData, SystemHealthMetric } from '../types/streetlight.types';

export const calculateEnergy = (data: TimeDataPoint[]): EnergyMetrics => {
  let smartEnergy = 0;
  let traditionalEnergy = 0;

  data.forEach(point => {
    smartEnergy += point.predictedBrightness || 0;
    traditionalEnergy += 100;
  });

  const savings = ((traditionalEnergy - smartEnergy) / traditionalEnergy) * 100;

  return {
    smartEnergy: smartEnergy.toFixed(2),
    traditionalEnergy: traditionalEnergy.toFixed(2),
    savings: savings.toFixed(2),
  };
};

export const calculateCorrelation = (data: TimeDataPoint[]): string => {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  data.forEach(point => {
    const x = point.brightness;
    const y = point.predictedBrightness || 0;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  });

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return (numerator / denominator).toFixed(4);
};

export const getHourlyAggregated = (data: TimeDataPoint[]): HourlyData[] => {
  const hourly: HourlyData[] = [];

  for (let h = 0; h < 24; h++) {
    const hourData = data.filter(d => d.hour === h);
    if (hourData.length > 0) {
      const avgBrightness = hourData.reduce((sum, d) => sum + (d.predictedBrightness || 0), 0) / hourData.length;
      const avgTraffic = hourData.reduce((sum, d) => sum + d.traffic, 0) / hourData.length;
      const avgSunlight = hourData.reduce((sum, d) => sum + d.sunlight, 0) / hourData.length;
      const smartEnergy = hourData.reduce((sum, d) => sum + (d.predictedBrightness || 0), 0);
      const tradEnergy = hourData.length * 100;

      hourly.push({
        hour: `${h}:00`,
        hourNum: h,
        brightness: parseFloat(avgBrightness.toFixed(2)),
        traffic: parseFloat(avgTraffic.toFixed(2)),
        sunlight: parseFloat(avgSunlight.toFixed(2)),
        smartEnergy: parseFloat(smartEnergy.toFixed(2)),
        traditionalEnergy: parseFloat(tradEnergy.toFixed(2)),
        savings: parseFloat(((tradEnergy - smartEnergy) / tradEnergy * 100).toFixed(2)),
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

export const getCumulativeSavings = (data: TimeDataPoint[]) => {
  const hourly = getHourlyAggregated(data);
  let cumulative = 0;

  return hourly.map(h => {
    cumulative += h.savings;
    return {
      hour: h.hour,
      savings: parseFloat((cumulative / (h.hourNum + 1)).toFixed(2)),
    };
  });
};

export const getSystemHealth = (
  displayData: TimeDataPoint[],
  correlation: string,
  savingsPercent: string
): SystemHealthMetric[] => {
  if (displayData.length === 0) return [];

  const recent = displayData.slice(-100);
  const avgTraffic = recent.reduce((sum, d) => sum + d.traffic, 0) / recent.length;
  const responseTime = 95 + Math.random() * 5;
  const uptime = 99.8;

  return [
    { metric: 'Response Time', value: responseTime, fullMark: 100 },
    { metric: 'Brightness Accuracy', value: parseFloat(correlation) * 100, fullMark: 100 },
    { metric: 'System Uptime', value: uptime, fullMark: 100 },
    { metric: 'Traffic Detection', value: avgTraffic, fullMark: 100 },
    { metric: 'Energy Efficiency', value: parseFloat(savingsPercent), fullMark: 100 },
  ];
};
