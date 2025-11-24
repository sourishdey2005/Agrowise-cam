import React, { useState } from 'react';
import { Search, TrendingUp, ExternalLink, ArrowRight, DollarSign } from 'lucide-react';
import { getMarketInsights } from '../services/geminiService';
import { GroundingSource } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

const MarketTrends: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string | undefined; sources: GroundingSource[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const predefinedQueries = [
    "Wheat prices in India",
    "Global coffee market trends",
    "Fertilizer price forecast 2024",
    "Corn prices USA this week"
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setResult(null);
    setQuery(searchQuery);
    
    try {
      const data = await getMarketInsights(searchQuery);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 pb-24 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-green-600" />
          Market Insights
        </h2>
        <p className="text-slate-600 mt-2">Get real-time agricultural prices, news, and trends powered by Google Search.</p>
      </div>

      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="E.g., Soybean prices in Brazil..."
          className="flex-1 p-2 outline-none text-slate-700 placeholder:text-slate-400"
        />
        <button 
          onClick={() => handleSearch(query)}
          disabled={loading || !query}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-200 transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predefinedQueries.map((q, i) => (
            <button 
              key={i}
              onClick={() => handleSearch(q)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-green-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
            >
              <span className="text-slate-700 font-medium group-hover:text-green-700">{q}</span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-green-500" />
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-32 bg-slate-100 rounded-xl mt-6"></div>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Market Summary
            </h3>
            <MarkdownRenderer content={result.text || ''} />
          </div>

          {result.sources.length > 0 && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Sources</h4>
              <ul className="space-y-3">
                {result.sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-green-700 hover:underline group"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-green-500" />
                      <span className="text-sm font-medium truncate">{source.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketTrends;
