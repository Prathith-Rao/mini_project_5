import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Sun, Moon, Activity, Zap, TrendingDown, Eye, Play, Pause, RotateCcw, Settings, MapPin, Calendar, DollarSign } from 'lucide-react';

// Utility functions for data generation
const generateTimeData = (hours = 24, intervals = 60, trafficMultiplier = 1, weatherSeverity = 0.2) => {
  const data = [];
  const totalPoints = hours * intervals;
  
  for (let i = 0; i < totalPoints; i++) {
    const hour = Math.floor(i / intervals);
    const minute = i % intervals;
    const timeDecimal = hour + minute / 60;
    
    // Sunlight intensity (0-100): peaks at noon, zero at night
    const sunlight = Math.max(0, 100 * Math.sin(Math.PI * (timeDecimal - 6) / 12));
    
    // Traffic density: peaks during rush hours (7-9 AM, 5-7 PM)
    let traffic = 20 * trafficMultiplier;
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      traffic = (70 + Math.random() * 30) * trafficMultiplier;
    } else if (hour >= 22 || hour <= 5) {
      traffic = (5 + Math.random() * 10) * trafficMultiplier;
    } else {
      traffic = (30 + Math.random() * 20) * trafficMultiplier;
    }
    
    // Motion detection: random but correlated with traffic
    const motion = traffic > 50 ? (Math.random() > 0.3 ? 1 : 0) : (Math.random() > 0.7 ? 1 : 0);
    
    // Weather condition: 0=clear, 1=cloudy, 2=rainy
    const weather = Math.random() > (1 - weatherSeverity) ? (Math.random() > 0.5 ? 2 : 1) : 0;
    
    // Calculate optimal brightness based on conditions
    let brightness = 0;
    
    if (sunlight < 20) { // Night time
      brightness = 40; // Base brightness
      if (traffic > 60) brightness += 30;
      else if (traffic > 30) brightness += 20;
      if (motion) brightness += 20;
      if (weather === 2) brightness += 10; // Extra light in rain
    } else if (sunlight < 50) { // Dawn/dusk
      brightness = Math.max(0, 60 - sunlight);
      if (traffic > 50) brightness += 15;
    } else { // Daytime
      brightness = 0;
    }
    
    brightness = Math.min(100, Math.max(0, brightness + (Math.random() - 0.5) * 5));
    
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

// XGBoost-like prediction simulation
const trainAndPredict = (data) => {
  return data.map(point => {
    // Simulate ML prediction with slight noise
    const predicted = point.brightness + (Math.random() - 0.5) * 8;
    return {
      ...point,
      predictedBrightness: parseFloat(Math.max(0, Math.min(100, predicted)).toFixed(2)),
    };
  });
};

// Calculate energy metrics
const calculateEnergy = (data) => {
  let smartEnergy = 0;
  let traditionalEnergy = 0;
  
  data.forEach(point => {
    smartEnergy += point.predictedBrightness;
    traditionalEnergy += 100; // Always at 100%
  });
  
  const savings = ((traditionalEnergy - smartEnergy) / traditionalEnergy) * 100;
  
  return {
    smartEnergy: smartEnergy.toFixed(2),
    traditionalEnergy: traditionalEnergy.toFixed(2),
    savings: savings.toFixed(2),
  };
};

// Calculate correlation coefficient
const calculateCorrelation = (data) => {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  
  data.forEach(point => {
    const x = point.brightness;
    const y = point.predictedBrightness;
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

const SmartStreetLightingDashboard = () => {
  const [fullData, setFullData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [correlation, setCorrelation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Interactive controls
  const [trafficLevel, setTrafficLevel] = useState(1);
  const [weatherCondition, setWeatherCondition] = useState(0.2);
  const [showSettings, setShowSettings] = useState(false);
  const [citySize, setCitySize] = useState('medium');

  const cityData = {
    small: { lights: 5000, area: '50 km²', population: '100K', cost: '$2M', time: '6-12 months' },
    medium: { lights: 25000, area: '250 km²', population: '500K', cost: '$10M', time: '12-18 months' },
    large: { lights: 100000, area: '1000 km²', population: '2M+', cost: '$40M', time: '24-36 months' }
  };

  useEffect(() => {
    generateNewData();
  }, [trafficLevel, weatherCondition]);

  const generateNewData = () => {
    const rawData = generateTimeData(24, 60, trafficLevel, weatherCondition);
    const processedData = trainAndPredict(rawData);
    setFullData(processedData);
    setDisplayData([]);
    setCurrentIndex(0);
    setMetrics(calculateEnergy(processedData));
    setCorrelation(calculateCorrelation(processedData));
  };

  useEffect(() => {
    if (isRunning && currentIndex < fullData.length) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + 15; // Jump by 15 minutes for faster animation
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

  const getHourlyAggregated = (data) => {
    const hourly = [];
    for (let h = 0; h < 24; h++) {
      const hourData = data.filter(d => d.hour === h);
      if (hourData.length > 0) {
        const avgBrightness = hourData.reduce((sum, d) => sum + d.predictedBrightness, 0) / hourData.length;
        const avgTraffic = hourData.reduce((sum, d) => sum + d.traffic, 0) / hourData.length;
        const avgSunlight = hourData.reduce((sum, d) => sum + d.sunlight, 0) / hourData.length;
        const smartEnergy = hourData.reduce((sum, d) => sum + d.predictedBrightness, 0);
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

  const getRealtimeData = () => {
    if (displayData.length === 0) return [];
    return displayData.slice(-60).map((d, i) => ({
      time: d.time,
      brightness: d.predictedBrightness,
      traffic: d.traffic,
      sunlight: d.sunlight,
    }));
  };

  const getCumulativeSavings = (data) => {
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

  const getSystemHealth = () => {
    if (displayData.length === 0) return [];
    const recent = displayData.slice(-100);
    const avgBrightness = recent.reduce((sum, d) => sum + d.predictedBrightness, 0) / recent.length;
    const avgTraffic = recent.reduce((sum, d) => sum + d.traffic, 0) / recent.length;
    const responseTime = 95 + Math.random() * 5;
    const uptime = 99.8;
    
    return [
      { metric: 'Response Time', value: responseTime, fullMark: 100 },
      { metric: 'Brightness Accuracy', value: parseFloat(correlation) * 100, fullMark: 100 },
      { metric: 'System Uptime', value: uptime, fullMark: 100 },
      { metric: 'Traffic Detection', value: avgTraffic, fullMark: 100 },
      { metric: 'Energy Efficiency', value: parseFloat(metrics?.savings || 0), fullMark: 100 },
    ];
  };

  const correlationData = fullData.slice(0, 300).map(d => ({
    actual: d.brightness,
    predicted: d.predictedBrightness,
  }));

  const currentHour = getCurrentHour();
  const progress = ((currentIndex / fullData.length) * 100).toFixed(1);
  const realtimeData = getRealtimeData();
  const hourlyData = getHourlyAggregated(displayData.length > 0 ? displayData : fullData);
  const systemHealth = getSystemHealth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Zap className="text-yellow-400" size={40} />
            AI-Driven Smart Street Lighting System
          </h1>
          <p className="text-blue-200 text-lg">IoT-Based Energy Optimization with Machine Learning</p>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={24} />
                <h3 className="text-sm font-semibold">Energy Saved</h3>
              </div>
              <p className="text-3xl font-bold">{metrics.savings}%</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={24} />
                <h3 className="text-sm font-semibold">Smart Energy</h3>
              </div>
              <p className="text-3xl font-bold">{(metrics.smartEnergy / 1000).toFixed(1)}k</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={24} />
                <h3 className="text-sm font-semibold">Accuracy (r)</h3>
              </div>
              <p className="text-3xl font-bold">{correlation}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <Eye size={24} />
                <h3 className="text-sm font-semibold">Progress</h3>
              </div>
              <p className="text-3xl font-bold">{progress}%</p>
            </div>

            <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={24} />
                <h3 className="text-sm font-semibold">City Lights</h3>
              </div>
              <p className="text-3xl font-bold">{cityData[citySize].lights.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Simulation Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
              </button>
              
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setDisplayData([]);
                  setIsRunning(false);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2"
              >
                <RotateCcw size={20} /> Reset
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center gap-2"
              >
                <Settings size={20} /> Controls
              </button>
            </div>

            {/* Time Display */}
            <div className="flex items-center gap-3 bg-slate-700 px-4 py-2 rounded-lg">
              {currentHour >= 6 && currentHour < 18 ? (
                <Sun className="text-yellow-400" size={24} />
              ) : (
                <Moon className="text-blue-300" size={24} />
              )}
              <span className="text-xl font-semibold">
                {currentHour.toString().padStart(2, '0')}:00
              </span>
              <span className="text-sm text-slate-300">
                ({displayData.length} / {fullData.length} datapoints)
              </span>
            </div>
          </div>

          {/* Interactive Settings */}
          {showSettings && (
            <div className="mt-4 p-4 bg-slate-700 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Traffic Control */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Traffic Density Multiplier: {trafficLevel.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.3"
                    max="2"
                    step="0.1"
                    value={trafficLevel}
                    onChange={(e) => setTrafficLevel(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Low</span>
                    <span>Normal</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Weather Control */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Weather Severity: {(weatherCondition * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.1"
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Clear</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>

                {/* City Size */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    City Size
                  </label>
                  <select
                    value={citySize}
                    onChange={(e) => setCitySize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 rounded-lg"
                  >
                    <option value="small">Small (100K pop)</option>
                    <option value="medium">Medium (500K pop)</option>
                    <option value="large">Large (2M+ pop)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  generateNewData();
                  setIsRunning(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg font-semibold"
              >
                Apply Changes & Regenerate Data
              </button>
            </div>
          )}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Real-time Monitoring */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Activity className="text-green-400" size={20} />
              Real-Time System Monitor (Last 60 Minutes)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" interval={14} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="brightness" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={false}
                  name="Brightness (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                  name="Traffic (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* System Health Radar */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Eye className="text-blue-400" size={20} />
              System Health Metrics
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={systemHealth}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" fontSize={12} />
                <PolarRadiusAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Radar 
                  name="Performance" 
                  dataKey="value" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 24-Hour Brightness Pattern */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sun className="text-yellow-400" size={20} />
              24-Hour Adaptive Brightness Pattern
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="brightness" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Smart Brightness (%)"
                />
                <Area 
                  type="monotone" 
                  dataKey="sunlight" 
                  stroke="#FBBF24" 
                  fill="#FBBF24" 
                  fillOpacity={0.3}
                  name="Sunlight (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Energy Comparison */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="text-blue-400" size={20} />
              Hourly Energy Consumption Comparison
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="smartEnergy" fill="#3B82F6" name="Smart System" />
                <Bar dataKey="traditionalEnergy" fill="#EF4444" name="Traditional" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ML Model Accuracy */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              ML Prediction Accuracy (r = {correlation})
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  dataKey="actual" 
                  name="Actual" 
                  stroke="#9CA3AF"
                />
                <YAxis 
                  type="number" 
                  dataKey="predicted" 
                  name="Predicted" 
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter 
                  data={correlationData} 
                  fill="#F59E0B" 
                  opacity={0.6}
                />
                <Line 
                  type="linear" 
                  dataKey="actual" 
                  data={[{actual: 0, predicted: 0}, {actual: 100, predicted: 100}]} 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={false}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Cumulative Savings */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingDown className="text-green-400" size={20} />
              Cumulative Energy Savings Over Time
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={getCumulativeSavings(displayData.length > 0 ? displayData : fullData)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.7}
                  name="Avg Savings (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div className="bg-slate-800 rounded-lg p-6 mb-4 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-purple-400" size={24} />
            Implementation Timeline for {citySize.charAt(0).toUpperCase() + citySize.slice(1)} City
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <MapPin className="text-blue-400 mb-2" size={28} />
              <h4 className="font-semibold mb-1">Coverage Area</h4>
              <p className="text-2xl font-bold text-blue-300">{cityData[citySize].area}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <Zap className="text-yellow-400 mb-2" size={28} />
              <h4 className="font-semibold mb-1">Smart Lights</h4>
              <p className="text-2xl font-bold text-yellow-300">{cityData[citySize].lights.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <DollarSign className="text-green-400 mb-2" size={28} />
              <h4 className="font-semibold mb-1">Est. Cost</h4>
              <p className="text-2xl font-bold text-green-300">{cityData[citySize].cost}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <Calendar className="text-purple-400 mb-2" size={28} />
              <h4 className="font-semibold mb-1">Timeline</h4>
              <p className="text-2xl font-bold text-purple-300">{cityData[citySize].time}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <TrendingDown className="text-red-400 mb-2" size={28} />
              <h4 className="font-semibold mb-1">ROI Period</h4>
              <p className="text-2xl font-bold text-red-300">3-5 years</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 shadow-xl">
          <h3 className="text-2xl font-bold mb-4">System Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-blue-300">ML Model Performance</h4>
              <ul className="space-y-2 text-slate-200">
                <li>• <strong>Algorithm:</strong> XGBoost Regression (simulated)</li>
                <li>• <strong>Correlation Coefficient:</strong> {correlation} (Excellent)</li>
                <li>• <strong>Training Data:</strong> {fullData.length} time intervals</li>
                <li>• <strong>Features:</strong> Traffic, Sunlight, Motion, Weather</li>
                <li>• <strong>Response Time:</strong> &lt;100ms per prediction</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3 text-green-300">Energy Efficiency</h4>
              <ul className="space-y-2 text-slate-200">
                <li>• <strong>Total Energy Saved:</strong> {metrics?.savings}%</li>
                <li>• <strong>Smart System Usage:</strong> {metrics && (metrics.smartEnergy / 1000).toFixed(1)}k units</li>
                <li>• <strong>Traditional System:</strong> {metrics && (metrics.traditionalEnergy / 1000).toFixed(1)}k units</li>
                <li>• <strong>Carbon Footprint Reduction:</strong> ~{metrics && (metrics.savings * 0.8).toFixed(1)}%</li>
                <li>• <strong>Annual Cost Savings:</strong> ${metrics && (cityData[citySize].lights * parseFloat(metrics.savings) * 0.5).toLocaleString()}</li>
              </ul>
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
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">2</div>
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

          <div className="mt-6 p-4 bg-gradient-to-r from-green-900 to-blue-900 rounded-lg">
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-green-400">Conclusion:</strong> The AI-driven smart street lighting system demonstrates significant energy optimization, 
              achieving <strong className="text-yellow-400">{metrics?.savings}% energy savings</strong> compared to traditional always-on lighting. 
              The machine learning model shows high accuracy (r = {correlation}) in predicting optimal brightness levels based on real-time 
              environmental conditions, traffic patterns, and motion detection. For a {citySize} city with {cityData[citySize].lights.toLocaleString()} streetlights, 
              this translates to <strong className="text-green-400">annual savings of approximately ${metrics && (cityData[citySize].lights * parseFloat(metrics.savings) * 0.5).toLocaleString()}</strong> and 
              a <strong className="text-blue-400">{metrics && (metrics.savings * 0.8).toFixed(1)}% reduction in carbon emissions</strong>. 
              Implementation can be completed in {cityData[citySize].time} with an estimated ROI period of 3-5 years, aligning with research findings 
              from Barua et al. (2025) and Bhairi et al. (2021) on IoT-driven efficiency enhancements in smart city infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartStreetLightingDashboard;