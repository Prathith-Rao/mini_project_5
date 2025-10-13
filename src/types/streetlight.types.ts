export interface TimeDataPoint {
  index: number;
  time: string;
  hour: number;
  minute: number;
  timeDecimal: number;
  sunlight: number;
  traffic: number;
  motion: number;
  weather: number;
  brightness: number;
  predictedBrightness?: number;
}

export interface HourlyData {
  hour: string;
  hourNum: number;
  brightness: number;
  traffic: number;
  sunlight: number;
  smartEnergy: number;
  traditionalEnergy: number;
  savings: number;
}

export interface EnergyMetrics {
  smartEnergy: string;
  traditionalEnergy: string;
  savings: string;
}

export interface SystemHealthMetric {
  metric: string;
  value: number;
  fullMark: number;
}

export interface CityData {
  lights: number;
  area: string;
  population: string;
  cost: string;
  time: string;
}

export type CitySize = 'small' | 'medium' | 'large';
