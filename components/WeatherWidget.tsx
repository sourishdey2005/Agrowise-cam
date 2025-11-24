import React, { useEffect, useState } from 'react';
import { CloudSun, Droplets, Wind, MapPin, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { getWeatherForecast } from '../services/geminiService';

const WeatherWidget: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationAndWeather = () => {
    setLoading(true);
    setError(null);
    setWeatherInfo(null);

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
        } catch (err: any) {
          console.error(err);
          // Show the specific error message to help debug deployment
          setError(err.message || "Failed to fetch weather data.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied. Please enable permissions.");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchLocationAndWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-full">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Agri-Forecast</h3>
              {location && !error && <p className="text-xs text-green-100 flex items-center gap-1"><MapPin className="w-3 h-3"/> Localized</p>}
            </div>
          </div>
          <button 
            onClick={fetchLocationAndWeather} 
            disabled={loading}
            className="text-white/80 hover:text-white transition-colors p-1"
            title="Refresh Weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-6 text-green-100 flex-1">
             <Loader2 className="w-8 h-8 animate-spin mb-2" />
             <p className="text-sm">Reading local conditions...</p>
           </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="bg-red-500/20 p-3 rounded-full mb-3">
              <AlertTriangle className="w-6 h-6 text-red-100" />
            </div>
            <p className="text-sm font-medium text-red-50 mb-2">Unavailable</p>
            <p className="text-xs text-red-100/80 mb-4 max-w-[200px]">{error}</p>
            <button 
              onClick={fetchLocationAndWeather}
              className="bg-white/20 hover:bg-white/30 text-xs px-3 py-1.5 rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : weatherInfo ? (
          <div className="flex-1 overflow-hidden relative">
             <div className="prose prose-invert prose-sm max-h-[160px] overflow-y-auto pr-2 custom-scrollbar text-sm leading-relaxed">
               <div className="whitespace-pre-line">
                 {weatherInfo.split('\n').filter(line => line.trim() !== '').slice(0, 6).join('\n')}
                 {weatherInfo.length > 250 && "..."}
               </div>
             </div>
          </div>
        ) : (
          <div className="text-sm text-green-100 opacity-80 flex-1 flex items-center justify-center">
            Click refresh to get insights.
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10 shrink-0">
             <div className="flex items-center gap-3">
               <Droplets className="w-5 h-5 text-green-200" />
               <div>
                 <p className="text-xs text-green-200">Precipitation</p>
                 <p className="font-semibold text-sm">Check Forecast</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <Wind className="w-5 h-5 text-green-200" />
               <div>
                 <p className="text-xs text-green-200">Wind Speed</p>
                 <p className="font-semibold text-sm">Check Forecast</p>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;