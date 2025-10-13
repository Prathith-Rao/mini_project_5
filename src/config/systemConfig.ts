export interface SystemConfig {
  lampPowerRated: number;
  brightnessExponent: number;
  driverEfficiencyLoss: number;
  minBrightness: number;
  maxBrightness: number;
  hysteresisThreshold: number;
  energyCostPerKwh: number;
  co2EmissionFactor: number;
  timeIntervalMinutes: number;
  mlNoiseStdDev: number;
  operatingHoursPerDay: number;
}

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  lampPowerRated: 60,
  brightnessExponent: 1.15,
  driverEfficiencyLoss: 0.04,
  minBrightness: 15,
  maxBrightness: 100,
  hysteresisThreshold: 5,
  energyCostPerKwh: 0.12,
  co2EmissionFactor: 0.45,
  timeIntervalMinutes: 1,
  mlNoiseStdDev: 3.5,
  operatingHoursPerDay: 12,
};

export const CITY_LAMP_CONFIGS = {
  small: {
    numLamps: 5000,
    lampPowerRated: 50,
  },
  medium: {
    numLamps: 25000,
    lampPowerRated: 60,
  },
  large: {
    numLamps: 100000,
    lampPowerRated: 70,
  },
};

export const XGBOOST_PARAMS = {
  learning_rate: 0.05,
  max_depth: 6,
  n_estimators: 100,
  subsample: 0.8,
  colsample_bytree: 0.8,
  reg_alpha: 0.1,
  reg_lambda: 1.0,
  min_child_weight: 3,
};
