
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  toggleDark: () => void;
}

const Header: React.FC<{isDark: boolean, toggleDark: () => void}> = ({isDark, toggleDark}) => (
  <header className="glass sticky top-0 z-[60] border-b border-white/20 dark:border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-brand-violet to-brand-pink p-2 rounded-2xl shadow-lg shadow-brand-violet/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
            NiveshIPO
          </span>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-10">
          <a href="#" className="text-sm font-bold text-brand-violet">Marketplace</a>
          <a href="#" className="text-sm font-bold text-slate-500 hover:text-brand-violet dark:text-slate-400 transition-colors">Risk Radar</a>
          <a href="#" className="text-sm font-bold text-slate-500 hover:text-brand-violet dark:text-slate-400 transition-colors">Community</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDark}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:scale-110 transition-transform"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>
          <div className="hidden sm:block px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 text-[10px] font-black tracking-widest uppercase">
            Live Feed
          </div>
        </div>
      </div>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-20 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-brand-violet p-1.5 rounded-xl">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <span className="text-xl font-black dark:text-white">NiveshIPO</span>
          </div>
          <p className="max-w-xs text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
            Next-gen financial tools for the modern Indian investor. Empowering your journey from IPO to Moon.
          </p>
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-6">Playbook</h3>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-brand-violet transition-colors">Mainboard</a></li>
            <li><a href="#" className="hover:text-brand-violet transition-colors">SME Zone</a></li>
            <li><a href="#" className="hover:text-brand-violet transition-colors">Risk Engine</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-6">The Boring Stuff</h3>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-brand-violet transition-colors">Disclaimer</a></li>
            <li><a href="#" className="hover:text-brand-violet transition-colors">SEBI Rules</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 text-[10px] text-center font-bold text-slate-400 tracking-[0.2em] uppercase">
        * Market Risk is Real. Be Smart. Power by Gemini AI.
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode, isDark: boolean, toggleDark: () => void }> = ({ children, isDark, toggleDark }) => (
  <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
    <Header isDark={isDark} toggleDark={toggleDark} />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);
