
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { IPOCard } from './components/IPOCard';
import { IPODetailModal } from './components/IPODetailModal';
import { MarketStats } from './components/MarketStats';
import { Community } from './components/Community';
import { NewsTicker } from './components/NewsTicker';
import { ChatBot } from './components/ChatBot';
import { IPO, GroundingSource, MarketNews } from './types';
import { getLiveIPOData } from './services/geminiService';
import { MOCK_IPOS } from './constants';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [currentView, setView] = useState<'marketplace' | 'community'>('marketplace');
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [dashboardSources, setDashboardSources] = useState<GroundingSource[]>([]);
  const [selectedIpo, setSelectedIpo] = useState<IPO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Closed'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Mainboard' | 'SME'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const toggleDark = () => {
    const nextValue = !isDark;
    setIsDark(nextValue);
    if (nextValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync initial theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const calculateStatus = (item: any): 'Live' | 'Upcoming' | 'Closed' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const openDate = item.openDate ? new Date(item.openDate) : null;
    const closeDate = item.closeDate ? new Date(item.closeDate) : null;
    if (closeDate && today > closeDate) return 'Closed';
    if (openDate && today < openDate) return 'Upcoming';
    return 'Live';
  };

  const fetchData = useCallback(async (isRefresh: boolean = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const { data, sources, news: fetchedNews } = await getLiveIPOData();
      setDashboardSources(sources);
      setNews(fetchedNews);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      const processItems = (items: any[]) => {
        if (!Array.isArray(items)) return [];
        return items.map((item: any) => ({
          ...MOCK_IPOS[0],
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9),
          status: calculateStatus(item),
          riskLevel: (item.riskScore || 50) < 40 ? 'Low' : (item.riskScore || 50) < 70 ? 'Moderate' : 'High'
        } as IPO));
      };

      const aiData = processItems(data);
      const mockData = processItems(MOCK_IPOS);
      const merged = [...aiData, ...mockData].filter((v, i, a) => a.findIndex(t => (t.symbol === v.symbol)) === i);
      setIpos(merged);
    } catch (e) {
      console.error(e);
      setIpos(MOCK_IPOS.map(i => ({...i, status: calculateStatus(i)})));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 120000); // Refresh news every 2 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredIpos = ipos.filter(i => {
    const matchesSearch = i.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          i.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'All' && i.status !== statusFilter) return false;
    if (typeFilter !== 'All' && i.ipoType !== typeFilter) return false;
    return true;
  });

  return (
    <Layout isDark={isDark} toggleDark={toggleDark} currentView={currentView} setView={setView}>
      <NewsTicker news={news} />
      <div className="min-h-screen pb-20 dark:bg-black bg-slate-50 transition-colors duration-300">
        <div className="relative pt-16 pb-24 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col items-center mb-8 space-y-3">
              <button 
                onClick={() => fetchData(true)} 
                disabled={isRefreshing} 
                className="flex items-center space-x-3 px-8 py-3 rounded-full dark:bg-white/5 bg-white border border-brand-yellow/30 dark:hover:bg-brand-yellow/10 hover:bg-brand-yellow/5 transition-all shadow-xl shadow-brand-yellow/5 group"
              >
                <div className={`w-2.5 h-2.5 rounded-full bg-brand-yellow ${isRefreshing ? 'animate-ping' : ''}`}></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow group-hover:dark:text-white group-hover:text-black">
                  {isRefreshing ? 'Syncing...' : `Last Update: ${lastRefreshed || 'Ready'}`}
                </span>
              </button>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <span className="text-brand-yellow mr-1.5">*</span> click on ready to get real time data
              </p>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter dark:text-white text-slate-900 leading-none">
              NIVESH<span className="text-brand-yellow">IPO</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-16 font-bold uppercase tracking-[0.3em] leading-relaxed">
              Real-time High-Precision Intelligence Terminal
            </p>
            <MarketStats />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
          {currentView === 'marketplace' ? (
            <div className="dark:bg-[#050505] bg-white border dark:border-white/5 border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col space-y-10 mb-16">
                <div className="flex flex-wrap items-center gap-4">
                  {(['All', 'Live', 'Upcoming', 'Closed'] as const).map((t) => (
                    <button key={t} onClick={() => setStatusFilter(t)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === t ? 'bg-brand-yellow text-black' : 'text-slate-500 bg-slate-50 dark:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>{t}</button>
                  ))}
                  <div className="w-[2px] h-6 dark:bg-white/5 bg-slate-200 mx-2 hidden sm:block"></div>
                  {(['All', 'Mainboard', 'SME'] as const).map((t) => (
                    <button key={t} onClick={() => setTypeFilter(t)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-brand-yellow text-black' : 'text-slate-500 bg-slate-50 dark:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>{t}</button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Access specific ticker or sector intelligence..." 
                    className="w-full dark:bg-white/5 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-2xl pl-12 pr-8 py-5 text-sm font-bold focus:outline-none focus:border-brand-yellow transition-all dark:text-white text-slate-900 shadow-inner" 
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => <div key={i} className="h-64 dark:bg-white/5 bg-slate-100 rounded-3xl animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredIpos.map((ipo) => <IPOCard key={ipo.id} ipo={ipo} onClick={setSelectedIpo} />)}
                </div>
              )}
            </div>
          ) : <Community />}
        </div>
      </div>
      <ChatBot />
      {selectedIpo && <IPODetailModal ipo={selectedIpo} onClose={() => setSelectedIpo(null)} />}
    </Layout>
  );
};

export default App;
