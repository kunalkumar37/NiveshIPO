
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  toggleDark: () => void;
  currentView: 'marketplace' | 'community';
  setView: (view: 'marketplace' | 'community') => void;
}

const Header: React.FC<{
  isDark: boolean, 
  toggleDark: () => void,
  currentView: 'marketplace' | 'community',
  setView: (view: 'marketplace' | 'community') => void
}> = ({isDark, toggleDark, currentView, setView}) => (
  <header className="sticky top-0 z-[60] border-b border-slate-200 dark:border-white/10 dark:bg-black/90 bg-white/90 backdrop-blur-xl transition-all duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setView('marketplace')}
        >
          <div className="bg-brand-yellow p-2 rounded-xl shadow-lg shadow-brand-yellow/20 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tighter dark:text-white text-slate-900">
            NIVESH<span className="text-brand-yellow">IPO</span>
          </span>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-10">
          <button 
            onClick={() => setView('marketplace')}
            className={`text-xs font-black uppercase tracking-widest transition-all ${currentView === 'marketplace' ? 'text-brand-yellow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Terminal
          </button>
          <button 
            onClick={() => setView('community')}
            className={`text-xs font-black uppercase tracking-widest transition-all ${currentView === 'community' ? 'text-brand-yellow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Network
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDark}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-brand-yellow hover:border-brand-yellow/30 transition-all flex items-center justify-center"
            title="Toggle Visual Mode"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-brand-yellow text-black rounded-lg border border-brand-yellow/20 text-[10px] font-black tracking-widest uppercase shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
            <span>LIVE OPS</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const BottomNav: React.FC<{
  currentView: 'marketplace' | 'community',
  setView: (view: 'marketplace' | 'community') => void
}> = ({ currentView, setView }) => (
  <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
    <nav className="dark:bg-slate-900/90 bg-white/90 backdrop-blur-xl border border-slate-200 dark:border-brand-yellow/20 rounded-2xl p-2 flex justify-around items-center shadow-2xl">
      <button 
        onClick={() => setView('marketplace')}
        className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all ${
          currentView === 'marketplace' ? 'bg-brand-yellow text-black' : 'text-slate-500'
        }`}
      >
        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        <span className="text-[8px] font-black uppercase">Term</span>
      </button>
      <button 
        onClick={() => setView('community')}
        className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all ${
          currentView === 'community' ? 'bg-brand-yellow text-black' : 'text-slate-500'
        }`}
      >
        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
        <span className="text-[8px] font-black uppercase">Net</span>
      </button>
    </nav>
  </div>
);

export const Layout: React.FC<{ 
  children: React.ReactNode, 
  isDark: boolean, 
  toggleDark: () => void,
  currentView: 'marketplace' | 'community',
  setView: (view: 'marketplace' | 'community') => void
}> = ({ children, isDark, toggleDark, currentView, setView }) => (
  <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
    <Header isDark={isDark} toggleDark={toggleDark} currentView={currentView} setView={setView} />
    <main className="flex-grow">
      {children}
    </main>
    <BottomNav currentView={currentView} setView={setView} />
    <footer className="py-20 border-t border-slate-200 dark:border-brand-yellow/5 text-center mt-20">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Quantum Intelligence Terminal © 2025</p>
    </footer>
  </div>
);
