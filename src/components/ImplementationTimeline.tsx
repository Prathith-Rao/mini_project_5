import { Calendar, MapPin, Zap, DollarSign, TrendingDown } from 'lucide-react';
import { CityData, CitySize } from '../types/streetlight.types';

interface ImplementationTimelineProps {
  citySize: CitySize;
  cityData: CityData;
}

export const ImplementationTimeline = ({ citySize, cityData }: ImplementationTimelineProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-4 shadow-xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="text-blue-400" size={24} />
        Implementation Timeline for {citySize.charAt(0).toUpperCase() + citySize.slice(1)} City
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-700 rounded-lg p-4">
          <MapPin className="text-blue-400 mb-2" size={28} />
          <h4 className="font-semibold mb-1">Coverage Area</h4>
          <p className="text-2xl font-bold text-blue-300">{cityData.area}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <Zap className="text-yellow-400 mb-2" size={28} />
          <h4 className="font-semibold mb-1">Smart Lights</h4>
          <p className="text-2xl font-bold text-yellow-300">{cityData.lights.toLocaleString()}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <DollarSign className="text-green-400 mb-2" size={28} />
          <h4 className="font-semibold mb-1">Est. Cost</h4>
          <p className="text-2xl font-bold text-green-300">{cityData.cost}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <Calendar className="text-cyan-400" size={28} />
          <h4 className="font-semibold mb-1">Timeline</h4>
          <p className="text-2xl font-bold text-cyan-300">{cityData.time}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <TrendingDown className="text-red-400 mb-2" size={28} />
          <h4 className="font-semibold mb-1">ROI Period</h4>
          <p className="text-2xl font-bold text-red-300">3-5 years</p>
        </div>
      </div>
    </div>
  );
};
