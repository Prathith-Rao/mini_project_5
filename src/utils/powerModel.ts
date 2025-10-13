import { SystemConfig } from '../config/systemConfig';

export const calculatePowerConsumption = (
  brightnessPercent: number,
  config: SystemConfig
): number => {
  const b = Math.max(config.minBrightness, Math.min(config.maxBrightness, brightnessPercent)) / 100;

  const basePower = config.lampPowerRated * Math.pow(b, config.brightnessExponent);

  const powerWithDriver = basePower * (1 + config.driverEfficiencyLoss);

  return powerWithDriver;
};

export const calculateTraditionalPower = (config: SystemConfig): number => {
  return config.lampPowerRated * (1 + config.driverEfficiencyLoss);
};

export const calculateEnergyFromPower = (
  powerWatts: number,
  timeIntervalMinutes: number
): number => {
  return (powerWatts * timeIntervalMinutes) / 60;
};

export const wattsToKilowatts = (watts: number): number => {
  return watts / 1000;
};

export const watthourToKilowattHour = (wh: number): number => {
  return wh / 1000;
};

export const applyHysteresis = (
  currentBrightness: number,
  targetBrightness: number,
  hysteresisThreshold: number
): number => {
  const diff = Math.abs(targetBrightness - currentBrightness);
  if (diff < hysteresisThreshold) {
    return currentBrightness;
  }
  return targetBrightness;
};
