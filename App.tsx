
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { IPOCard } from './components/IPOCard';
import { IPODetailModal } from './components/IPODetailModal';
import { MarketStats } from './components/MarketStats';
import { IPO, GroundingSource } from './types';
import { getLiveIPOData } from './services/geminiService';
import { MOCK_IPOS } from './constants';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [dashboardSources, setDashboardSources] = useState<GroundingSource[]>([]);
  const [selectedIpo, setSelectedIpo] = useState<IPO | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Closed'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Mainboard' | 'SME'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, sources } = await getLiveIPOData();
        setDashboardSources(sources);
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        
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
        
        const merged = [...aiData, ...mockData].filter((v, i, a) => 
          a.findIndex(t => (t.symbol === v.symbol)) === i
        );
        
        setIpos(merged);
      } catch (e) {
        console.error(e);
        setIpos(MOCK_IPOS.map(i => ({...i, status: calculateStatus(i)})));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredIpos = ipos.filter(i => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesSearch = 
      i.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sector.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Status Filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Closed') {
        if (i.status !== 'Closed') return false;
        const closeDate = new Date(i.closeDate);
        const diffDays = Math.ceil(Math.abs(today.getTime() - closeDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 30) return false;
      } else if (i.status !== statusFilter) {
        return false;
      }
    }

    // Type Filter
    if (typeFilter !== 'All' && i.ipoType !== typeFilter) return false;

    return true;
  });

  return (
    <Layout isDark={isDark} toggleDark={() => setIsDark(!isDark)}>
      <div className="min-h-screen pb-20 transition-colors duration-300">
        <div className="relative overflow-hidden pt-6 pb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-violet opacity-30 blur-[120px] rounded-full"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-cyan opacity-20 blur-[100px] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
             <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
               * Syncing data from NSE / BSE takes a bit of time...
             </p>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-violet/10 text-brand-violet text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-brand-violet/20 backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
              AI Pulse Sync: {lastRefreshed || 'Syncing...'}
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
              Nivesh<span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-violet via-brand-pink to-brand-cyan">IPO</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
              Revolutionizing Indian IPO analysis with real-time AI intelligence.
            </p>
            <div className="max-w-5xl mx-auto">
              <MarketStats />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="glass dark:bg-slate-900/40 rounded-[3rem] shadow-2xl border border-white/10 p-6 md:p-10 backdrop-blur-2xl">
            {/* Extended Controls */}
            <div className="flex flex-col space-y-8 mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-violet"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Status</span>
                  </div>
                  <div className="flex flex-wrap bg-slate-200/50 dark:bg-white/5 p-1.5 rounded-2xl backdrop-blur-md border border-white/10 gap-2">
                    {(['All', 'Live', 'Upcoming', 'Closed'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setStatusFilter(t)}
                        className={`flex-1 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                          statusFilter === t 
                            ? 'bg-gradient-to-br from-brand-violet to-indigo-600 text-white shadow-lg shadow-brand-violet/20 scale-[1.02]' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Listing Category</span>
                  </div>
                  <div className="flex bg-slate-200/50 dark:bg-white/5 p-1.5 rounded-2xl backdrop-blur-md border border-white/10 gap-2">
                    {(['All', 'Mainboard', 'SME'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`flex-1 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                          typeFilter === t 
                            ? 'bg-gradient-to-br from-brand-cyan to-blue-600 text-white shadow-lg shadow-brand-cyan/20 scale-[1.02]' 
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative w-full group">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Scan company name, symbol or industry vertical..." 
                  className="w-full bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-[2rem] pl-14 pr-6 py-5 text-sm font-medium focus:outline-none focus:border-brand-violet dark:focus:border-brand-violet transition-all shadow-inner dark:text-white placeholder-slate-400"
                />
                <svg className="w-6 h-6 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {loading && ipos.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[450px] bg-slate-100 dark:bg-white/5 rounded-[3rem] animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredIpos.map((ipo) => (
                    <IPOCard 
                      key={ipo.id} 
                      ipo={ipo} 
                      onClick={setSelectedIpo} 
                    />
                  ))}
                </div>
                {filteredIpos.length === 0 && (
                  <div className="text-center py-32 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                    <div className="text-7xl mb-8">🛸</div>
                    <p className="text-slate-500 dark:text-slate-400 text-2xl font-black tracking-tight mb-2">No active data match.</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-8">Try adjusting your filters or search keywords.</p>
                    <button 
                      onClick={() => {setStatusFilter('All'); setTypeFilter('All'); setSearchTerm('');}}
                      className="px-10 py-4 bg-gradient-to-r from-brand-violet to-brand-pink text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-transform"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
                
                {dashboardSources.length > 0 && (
                  <div className="mt-20 pt-12 border-t border-slate-100 dark:border-white/10">
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-8 text-center">Intelligence Verification Nodes</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                      {dashboardSources.map((src, i) => (
                        <a 
                          key={i} 
                          href={src.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-brand-violet dark:hover:text-brand-violet flex items-center bg-slate-100 dark:bg-white/5 border border-white/5 px-6 py-4 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                          {src.title} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedIpo && (
        <IPODetailModal 
          ipo={selectedIpo} 
          onClose={() => setSelectedIpo(null)} 
        />
      )}
    </Layout>
  );
};

export default App;
