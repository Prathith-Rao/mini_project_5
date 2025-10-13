import { Sun, Moon, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { CitySize } from '../types/streetlight.types';

interface ControlPanelProps {
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  onReset: () => void;
  showSettings: boolean;
  setShowSettings: (value: boolean) => void;
  currentHour: number;
  displayDataLength: number;
  fullDataLength: number;
  trafficLevel: number;
  setTrafficLevel: (value: number) => void;
  weatherCondition: number;
  setWeatherCondition: (value: number) => void;
  citySize: CitySize;
  setCitySize: (value: CitySize) => void;
  onApplyChanges: () => void;
}

export const ControlPanel = ({
  isRunning,
  setIsRunning,
  onReset,
  showSettings,
  setShowSettings,
  currentHour,
  displayDataLength,
  fullDataLength,
  trafficLevel,
  setTrafficLevel,
  weatherCondition,
  setWeatherCondition,
  citySize,
  setCitySize,
  onApplyChanges,
}: ControlPanelProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
            onClick={onReset}
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
            ({displayDataLength} / {fullDataLength} datapoints)
          </span>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-sm font-semibold mb-2">
                City Size
              </label>
              <select
                value={citySize}
                onChange={(e) => setCitySize(e.target.value as CitySize)}
                className="w-full px-3 py-2 bg-slate-600 rounded-lg"
              >
                <option value="small">Small (100K pop)</option>
                <option value="medium">Medium (500K pop)</option>
                <option value="large">Large (2M+ pop)</option>
              </select>
            </div>
          </div>

          <button
            onClick={onApplyChanges}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-semibold"
          >
            Apply Changes & Regenerate Data
          </button>
        </div>
      )}
    </div>
  );
};
