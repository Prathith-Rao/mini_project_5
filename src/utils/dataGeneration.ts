import { TimeDataPoint } from '../types/streetlight.types';
import { SystemConfig } from '../config/systemConfig';

export const generateTimeData = (
  hours = 24,
  intervals = 60,
  trafficMultiplier = 1,
  weatherSeverity = 0.2,
  config: SystemConfig
): TimeDataPoint[] => {
  const data: TimeDataPoint[] = [];
  const totalPoints = hours * intervals;

  for (let i = 0; i < totalPoints; i++) {
    const hour = Math.floor(i / intervals);
    const minute = i % intervals;
    const timeDecimal = hour + minute / 60;

    const sunlight = Math.max(0, 100 * Math.sin(Math.PI * (timeDecimal - 6) / 12));

    let traffic = 20 * trafficMultiplier;
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      traffic = (70 + Math.random() * 30) * trafficMultiplier;
    } else if (hour >= 22 || hour <= 5) {
      traffic = (5 + Math.random() * 10) * trafficMultiplier;
    } else {
      traffic = (30 + Math.random() * 20) * trafficMultiplier;
    }

    const motion = traffic > 50 ? (Math.random() > 0.3 ? 1 : 0) : (Math.random() > 0.7 ? 1 : 0);

    const weather = Math.random() > (1 - weatherSeverity) ? (Math.random() > 0.5 ? 2 : 1) : 0;

    let brightness = config.minBrightness;

    if (sunlight < 20) {
      brightness = 40;
      if (traffic > 60) brightness += 30;
      else if (traffic > 30) brightness += 20;
      if (motion) brightness += 20;
      if (weather === 2) brightness += 10;
    } else if (sunlight < 50) {
      brightness = Math.max(config.minBrightness, 60 - sunlight);
      if (traffic > 50) brightness += 15;
    } else {
      brightness = 0;
    }

    brightness = Math.min(
      config.maxBrightness,
      Math.max(config.minBrightness, brightness + (Math.random() - 0.5) * 5)
    );

    data.push({
      index: i,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      hour,
      minute,
      timeDecimal,
      sunlight: parseFloat(sunlight.toFixed(2)),
      traffic: parseFloat(traffic.toFixed(2)),
      motion,
      weather,
      brightness: parseFloat(brightness.toFixed(2)),
    });
  }

  return data;
};
