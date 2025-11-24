import React, { useState } from 'react';
import { Leaf, MessageCircle, BarChart3, Home, Menu } from 'lucide-react';
import { AppView } from './types';
import PlantDoctor from './components/PlantDoctor';
import FarmAdvisor from './components/FarmAdvisor';
import MarketTrends from './components/MarketTrends';
import WeatherWidget from './components/WeatherWidget';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <div className="p-6 max-w-5xl mx-auto w-full pb-24">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Welcome to AgroWise</h1>
              <p className="text-slate-600 mt-2">Your AI-powered companion for smarter farming.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                 <WeatherWidget />
              </div>
              <div 
                onClick={() => setCurrentView(AppView.PLANT_DOCTOR)}
                className="bg-green-50 rounded-2xl p-6 border border-green-100 cursor-pointer hover:shadow-md transition-all flex flex-col justify-center items-center text-center group"
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Scan Crops</h3>
                <p className="text-slate-600 text-sm mt-1">Detect diseases instantly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div 
                 onClick={() => setCurrentView(AppView.ADVISOR)}
                 className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-green-400 transition-all group"
               >
                 <div className="flex justify-between items-start mb-4">
                   <div className="bg-blue-50 p-3 rounded-xl">
                     <MessageCircle className="w-6 h-6 text-blue-600" />
                   </div>
                   <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">AI Chat</span>
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 group-hover:text-green-700 transition-colors">Farm Advisor</h3>
                 <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                   Ask complex questions about irrigation cycles, fertilizers, and seasonal planning.
                 </p>
               </div>

               <div 
                 onClick={() => setCurrentView(AppView.MARKET)}
                 className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-green-400 transition-all group"
               >
                 <div className="flex justify-between items-start mb-4">
                   <div className="bg-orange-50 p-3 rounded-xl">
                     <BarChart3 className="w-6 h-6 text-orange-600" />
                   </div>
                   <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">Live Data</span>
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 group-hover:text-green-700 transition-colors">Market Insights</h3>
                 <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                   Track real-time crop prices and global agricultural trends using Google Search.
                 </p>
               </div>
            </div>
          </div>
        );
      case AppView.PLANT_DOCTOR:
        return <PlantDoctor />;
      case AppView.ADVISOR:
        return <FarmAdvisor />;
      case AppView.MARKET:
        return <MarketTrends />;
      default:
        return null;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-full md:w-auto md:flex-row md:px-4 md:py-3 ${
        currentView === view 
          ? 'text-green-600 bg-green-50 md:bg-green-100/50' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
      }`}
    >
      <Icon className={`w-6 h-6 md:w-5 md:h-5 ${currentView === view ? 'fill-current' : ''}`} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-[10px] md:text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4">
        <div className="flex items-center gap-2 px-2 mb-8 mt-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">AgroWise</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavItem view={AppView.HOME} icon={Home} label="Dashboard" />
          <NavItem view={AppView.PLANT_DOCTOR} icon={Leaf} label="Plant Doctor" />
          <NavItem view={AppView.ADVISOR} icon={MessageCircle} label="Advisor Chat" />
          <NavItem view={AppView.MARKET} icon={BarChart3} label="Market Trends" />
        </nav>

        <div className="text-xs text-slate-400 px-4">
          v1.0.0 • Gemini 2.5
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-1.5 rounded-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">AgroWise</span>
        </div>
        <div className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">BETA</div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe px-2 py-1 z-30 flex justify-between items-center shadow-lg shadow-slate-200/50">
        <NavItem view={AppView.HOME} icon={Home} label="Home" />
        <NavItem view={AppView.PLANT_DOCTOR} icon={Leaf} label="Doctor" />
        <NavItem view={AppView.ADVISOR} icon={MessageCircle} label="Advisor" />
        <NavItem view={AppView.MARKET} icon={BarChart3} label="Market" />
      </div>
    </div>
  );
};

export default App;
