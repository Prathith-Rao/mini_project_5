import { CitySize, CityData } from '../types/streetlight.types';

export const CITY_DATA: Record<CitySize, CityData> = {
  small: {
    lights: 5000,
    area: '50 km²',
    population: '100K',
    cost: '$2M',
    time: '6-12 months'
  },
  medium: {
    lights: 25000,
    area: '250 km²',
    population: '500K',
    cost: '$10M',
    time: '12-18 months'
  },
  large: {
    lights: 100000,
    area: '1000 km²',
    population: '2M+',
    cost: '$40M',
    time: '24-36 months'
  }
};
