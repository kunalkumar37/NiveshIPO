
import React from 'react';
import { IPO } from '../types';
import { RiskBadge } from './RiskBadge';

interface IPOCardProps {
  ipo: IPO;
  onClick: (ipo: IPO) => void;
}

export const IPOCard: React.FC<IPOCardProps> = ({ ipo, onClick }) => {
  return (
    <div 
      onClick={() => onClick(ipo)}
      className="group relative bg-[#0F172A] border border-white/5 rounded-[2.5rem] p-7 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-violet/20 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full -mr-16 -mt-16 group-hover:bg-brand-violet/10 transition-colors duration-500" />
      
      <div className="flex justify-between items-start mb-6 relative">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-white/90 uppercase tracking-[0.2em] bg-brand-cyan/20 px-2 py-0.5 rounded-md border border-brand-cyan/20">{ipo.ipoType}</span>
            <span className="text-[8px] font-black text-white/70 uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{ipo.sector}</span>
          </div>
          <h3 className="text-2xl font-black text-white group-hover:text-brand-violet transition-colors leading-tight mt-2">{ipo.companyName}</h3>
          <p className="text-[10px] text-slate-500 font-mono font-bold tracking-widest">{ipo.symbol}</p>
        </div>
        <div className="flex flex-col items-end">
          <RiskBadge level={ipo.riskLevel} />
          {ipo.listingGainEstimate && (
            <div className="mt-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black text-emerald-400 animate-pulse">
              AI PREDICT: {ipo.listingGainEstimate}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/5 p-5 rounded-[1.5rem]">
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2">Issue Size</p>
          <p className="text-lg font-black text-white">{ipo.issueSize}</p>
        </div>
        <div className="bg-white/5 border border-white/5 p-5 rounded-[1.5rem]">
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2">GMP Hype</p>
          <p className="text-lg font-black text-emerald-400">{ipo.gmp}</p>
        </div>
      </div>

      <div className="mt-auto space-y-6">
        {ipo.subscription && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Subscription Play</span>
              <span className="text-xs font-black text-brand-violet">{ipo.subscription.retail}x</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-brand-violet to-brand-cyan h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
                style={{ width: `${Math.min(ipo.subscription.retail * 10, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Deadline</span>
            <span className="text-xs font-black text-white/90">{ipo.closeDate}</span>
          </div>
          
          <button className="relative overflow-hidden bg-gradient-to-r from-brand-violet to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-4 rounded-[1.25rem] transition-all duration-300 transform active:scale-95 shadow-lg shadow-brand-violet/20 hover:shadow-brand-violet/40">
             Deep Risk Scan
          </button>
        </div>
      </div>
    </div>
  );
};
