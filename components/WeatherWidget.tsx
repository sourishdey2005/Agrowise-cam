import React, { useEffect, useState } from 'react';
import { CloudSun, Droplets, Wind, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { getWeatherForecast } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';

const WeatherWidget: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationAndWeather = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        try {
          const forecast = await getWeatherForecast(latitude, longitude);
          setWeatherInfo(forecast || "No forecast available.");
        } catch (err) {
          setError("Failed to fetch weather data.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable permissions.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchLocationAndWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Agri-Forecast</h3>
              {location && <p className="text-xs text-green-100 flex items-center gap-1"><MapPin className="w-3 h-3"/> Localized</p>}
            </div>
          </div>
          <button 
            onClick={fetchLocationAndWeather} 
            disabled={loading}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-6 text-green-100">
             <Loader2 className="w-8 h-8 animate-spin mb-2" />
             <p className="text-sm">Reading local conditions...</p>
           </div>
        ) : error ? (
          <div className="text-red-100 bg-red-500/20 p-3 rounded-lg text-sm border border-red-500/30">
            {error}
          </div>
        ) : weatherInfo ? (
          <div className="prose prose-invert prose-sm max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {/* We render a simplified version or just the text */}
            <div className="text-sm leading-relaxed whitespace-pre-line">
               {weatherInfo.split('\n').filter(line => line.trim() !== '').slice(0, 5).join('\n')} 
               {/* Just showing summary to keep widget small, user implies dashboard view */}
               {weatherInfo.length > 200 && <span className="text-xs italic opacity-70 block mt-2">...scroll for more or ask Advisor.</span>}
            </div>
          </div>
        ) : (
          <div className="text-sm text-green-100 opacity-80">
            Click refresh to get local farming insights.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
           <div className="flex items-center gap-3">
             <Droplets className="w-5 h-5 text-green-200" />
             <div>
               <p className="text-xs text-green-200">Precipitation</p>
               <p className="font-semibold">Check Forecast</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <Wind className="w-5 h-5 text-green-200" />
             <div>
               <p className="text-xs text-green-200">Wind Speed</p>
               <p className="font-semibold">Check Forecast</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
