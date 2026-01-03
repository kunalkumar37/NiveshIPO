
import React from 'react';
import { IPO } from '../types';
import { RiskEngine } from './RiskEngine';

interface IPODetailModalProps {
  ipo: IPO;
  onClose: () => void;
}

export const IPODetailModal: React.FC<IPODetailModalProps> = ({ ipo, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#050505] w-full max-w-6xl rounded-[3rem] shadow-[0_0_150px_rgba(250,204,21,0.15)] relative animate-in zoom-in-95 duration-500 border border-brand-yellow/10 overflow-hidden">
        {/* Fixed Close Button with High Visibility */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3.5 bg-brand-yellow text-black hover:scale-110 active:scale-90 rounded-2xl transition-all z-[110] shadow-2xl shadow-brand-yellow/20"
          title="Close Terminal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Sidebar Info */}
          <div className="w-full lg:w-[38%] bg-black p-12 overflow-y-auto border-r border-white/10 scrollbar-hide">
            <div className="mb-12">
              <div className="flex flex-wrap items-center gap-2 mb-8">
                 <span className="text-[10px] font-black text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1.5 rounded-lg uppercase tracking-[0.2em]">{ipo.status}</span>
                 <span className="text-[10px] font-black text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg uppercase tracking-[0.2em]">{ipo.ipoType}</span>
              </div>
              <h2 className="text-5xl font-black text-white leading-[0.9] tracking-tighter mb-4">{ipo.companyName}</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-brand-yellow font-mono font-black uppercase tracking-widest">{ipo.symbol}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">{ipo.sector}</span>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-1 h-6 bg-brand-yellow rounded-full"></div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Asset Parameters</h4>
                </div>
                <div className="space-y-4">
                  <DetailRow label="Issue Size" value={ipo.issueSize} />
                  <DetailRow label="Price Band" value={ipo.priceBand} />
                  <DetailRow label="Lot Multiplier" value={`${ipo.lotSize} Shares`} />
                  <DetailRow label="Listing Date" value={ipo.listingDate} />
                  <DetailRow label="Registrar" value={ipo.registrar} />
                </div>
              </section>
              <div className="pt-10 border-t border-white/10">
                <p className="text-sm text-slate-400 leading-relaxed font-medium italic opacity-80">{ipo.description}</p>
              </div>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="w-full lg:w-[62%] p-12 overflow-y-auto space-y-16 scrollbar-hide bg-[#080808]">
            <section>
              <h3 className="text-3xl font-black text-white mb-10 flex items-center tracking-tighter">
                <span className="w-12 h-12 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl flex items-center justify-center mr-5">
                  <svg className="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </span> 
                Market Gravity Data
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 group hover:border-brand-yellow/20 transition-all">
                  <p className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.3em]">GMP Premium Delta</p>
                  <p className="text-5xl font-black text-brand-yellow tracking-tighter">{ipo.gmp}</p>
                </div>
                <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 group hover:border-brand-yellow/20 transition-all">
                  <p className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.3em]">Subscription Load</p>
                  <p className="text-5xl font-black text-white tracking-tighter">{ipo.subscription?.total || 'N/A'}<span className="text-2xl text-slate-600 ml-1 font-black">X</span></p>
                </div>
              </div>
            </section>

            <section className="pb-16">
              <h3 className="text-3xl font-black text-white mb-10 flex items-center tracking-tighter">
                <span className="w-12 h-12 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl flex items-center justify-center mr-5">
                   <svg className="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                Deep Risk Scan Result
              </h3>
              <RiskEngine ipo={ipo} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-5 last:border-0 group hover:border-brand-yellow/20 transition-all">
    <span className="text-slate-500 font-black uppercase text-[9px] tracking-[0.2em] group-hover:text-slate-400 transition-colors">{label}</span>
    <span className="text-white font-black group-hover:text-brand-yellow transition-colors">{value}</span>
  </div>
);
