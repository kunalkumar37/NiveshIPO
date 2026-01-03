
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
      className="group relative bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 transition-all duration-500 hover:border-brand-yellow/40 hover:shadow-[0_0_40px_-10px_rgba(250,204,21,0.2)] cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-all duration-700 blur-2xl" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black text-brand-yellow uppercase tracking-widest bg-brand-yellow/10 px-2 py-1 rounded">
              {ipo.ipoType}
            </span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
              {ipo.sector}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white group-hover:text-brand-yellow transition-colors leading-none tracking-tighter">
            {ipo.companyName}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">{ipo.symbol}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <RiskBadge level={ipo.riskLevel} />
          {ipo.listingGainEstimate && (
            <div className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded text-[8px] font-black text-yellow-400 uppercase">
              Est: {ipo.listingGainEstimate}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
          <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Issue Size</p>
          <p className="text-lg font-black text-white">{ipo.issueSize}</p>
        </div>
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
          <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">GMP Alpha</p>
          <p className="text-lg font-black text-brand-yellow">{ipo.gmp}</p>
        </div>
      </div>

      <div className="mt-auto space-y-6 relative z-10">
        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Closing</span>
            <span className="text-xs font-black text-white">{ipo.closeDate}</span>
          </div>
          
          <button className="bg-brand-yellow text-black text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-yellow/10">
             Deep Risk Scan
          </button>
        </div>
      </div>
    </div>
  );
};
