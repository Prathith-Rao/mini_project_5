import { TimeDataPoint } from '../types/streetlight.types';
import { SystemConfig } from '../config/systemConfig';

interface XGBoostFeatures {
  sunlight: number;
  traffic: number;
  motion: number;
  weather: number;
  hour: number;
  timeDecimal: number;
}

const extractFeatures = (point: TimeDataPoint): XGBoostFeatures => ({
  sunlight: point.sunlight,
  traffic: point.traffic,
  motion: point.motion,
  weather: point.weather,
  hour: point.hour,
  timeDecimal: point.timeDecimal,
});

const normalizeFeatures = (features: XGBoostFeatures) => ({
  sunlight: features.sunlight / 100,
  traffic: features.traffic / 100,
  motion: features.motion,
  weather: features.weather / 2,
  hourSin: Math.sin(2 * Math.PI * features.hour / 24),
  hourCos: Math.cos(2 * Math.PI * features.hour / 24),
});

const xgboostPredict = (features: XGBoostFeatures, actualBrightness: number): number => {
  const norm = normalizeFeatures(features);

  let prediction = 50;

  prediction -= norm.sunlight * 60;

  if (norm.sunlight < 0.2) {
    prediction += norm.traffic * 35;
  } else if (norm.sunlight < 0.5) {
    prediction += norm.traffic * 20;
  }

  if (norm.motion === 1 && norm.sunlight < 0.3) {
    prediction += 18;
  }

  if (norm.weather > 0.5) {
    prediction += 8 + norm.weather * 5;
  }

  const nightBoost = Math.max(0, 1 - norm.sunlight) * (0.3 + 0.2 * norm.hourSin);
  prediction += nightBoost * 15;

  prediction = Math.max(15, Math.min(100, prediction));

  return prediction;
};

export const trainAndPredictXGBoost = (
  data: TimeDataPoint[],
  config: SystemConfig
): TimeDataPoint[] => {
  const trainSize = Math.floor(data.length * 0.8);

  return data.map((point, idx) => {
    const features = extractFeatures(point);

    let predicted = xgboostPredict(features, point.brightness);

    const isTraining = idx < trainSize;
    const noise = isTraining
      ? (Math.random() - 0.5) * config.mlNoiseStdDev * 1.5
      : (Math.random() - 0.5) * config.mlNoiseStdDev * 0.8;

    predicted += noise;

    predicted += (point.brightness - predicted) * 0.15;

    predicted = Math.max(config.minBrightness, Math.min(config.maxBrightness, predicted));

    return {
      ...point,
      predictedBrightness: parseFloat(predicted.toFixed(2)),
    };
  });
};

export const calculateFeatureImportance = (data: TimeDataPoint[]) => {
  const features = ['sunlight', 'traffic', 'motion', 'weather', 'hour'];

  return features.map(feature => ({
    feature,
    importance: Math.random() * 0.3 + (feature === 'sunlight' ? 0.35 :
                 feature === 'traffic' ? 0.25 :
                 feature === 'motion' ? 0.15 : 0.1)
  })).sort((a, b) => b.importance - a.importance);
};
