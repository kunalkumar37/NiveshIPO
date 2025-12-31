
import React from 'react';
import { IPO } from '../types';
import { RiskEngine } from './RiskEngine';

interface IPODetailModalProps {
  ipo: IPO;
  onClose: () => void;
}

export const IPODetailModal: React.FC<IPODetailModalProps> = ({ ipo, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="bg-slate-900 dark:bg-slate-900 w-full max-w-7xl rounded-[4rem] shadow-[0_0_150px_rgba(139,92,246,0.2)] relative animate-in zoom-in-95 duration-500 border border-white/10 overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-[1.5rem] transition-all z-[110] text-slate-400 hover:text-white group border border-white/5"
        >
          <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[92vh]">
          {/* Left Panel - Core Info */}
          <div className="w-full lg:w-[32%] bg-slate-950/80 p-10 lg:p-14 overflow-y-auto border-r border-white/10 scrollbar-hide">
            <div className="mb-14">
              <div className="flex items-center space-x-3 mb-8">
                 <span className="text-[10px] font-black text-brand-violet bg-brand-violet/10 px-5 py-2.5 rounded-[1.25rem] uppercase tracking-[0.3em] border border-brand-violet/20">{ipo.status}</span>
                 <span className="text-[10px] font-black text-brand-cyan bg-brand-cyan/10 px-5 py-2.5 rounded-[1.25rem] uppercase tracking-[0.3em] border border-brand-cyan/20">{ipo.ipoType}</span>
              </div>
              <h2 className="text-5xl font-black text-white mt-4 leading-tight tracking-tighter drop-shadow-sm">{ipo.companyName}</h2>
              <div className="flex items-center space-x-4 mt-6">
                 <p className="text-sm text-brand-violet font-mono font-black tracking-[0.2em] opacity-80">{ipo.symbol}</p>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                 <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{ipo.sector}</p>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 flex items-center">
                  <span className="w-6 h-[1px] bg-slate-800 mr-4"></span>
                  Financial DNA
                </h4>
                <div className="space-y-8">
                  <DetailRow label="Total Issue" value={ipo.issueSize} />
                  <DetailRow label="Valuation Band" value={ipo.priceBand} />
                  <DetailRow label="Minimum Lot" value={`${ipo.lotSize} Shares`} />
                  <DetailRow label="Listing ETA" value={ipo.listingDate} />
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 flex items-center">
                   <span className="w-6 h-[1px] bg-slate-800 mr-4"></span>
                   Stakeholders
                </h4>
                <div className="space-y-8">
                  <DetailRow label="Registrar" value={ipo.registrar} />
                  <DetailRow label="Lead Desk" value={ipo.leadManager} />
                </div>
              </section>

              <div className="pt-12 border-t border-white/5">
                <p className="text-sm text-slate-400 leading-relaxed font-medium italic opacity-70">
                  {ipo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Analysis & Risk */}
          <div className="w-full lg:w-[68%] p-10 lg:p-14 overflow-y-auto space-y-20 bg-slate-900/60 backdrop-blur-3xl scrollbar-hide">
            <section>
              <h3 className="text-3xl font-black text-white mb-10 flex items-center tracking-tighter">
                <span className="mr-6 bg-emerald-500/20 p-3 rounded-2xl">⚡</span> 
                Market Sentiment Pulse
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 transition-all hover:bg-white/10 hover:border-emerald-500/20 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
                  <p className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.3em]">Estimated GMP Gain</p>
                  <p className="text-4xl font-black text-emerald-400 group-hover:scale-105 transition-transform origin-left tracking-tighter">{ipo.gmp}</p>
                </div>
                {ipo.subscription && (
                  <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 transition-all hover:bg-white/10 hover:border-brand-violet/20 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-brand-violet/10 transition-colors"></div>
                    <p className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.3em]">Total Subscription</p>
                    <p className="text-4xl font-black text-brand-violet group-hover:scale-105 transition-transform origin-left tracking-tighter">{ipo.subscription.total}x</p>
                    <p className="text-[9px] text-slate-500 mt-6 font-bold uppercase tracking-widest opacity-60">Sync: {ipo.subscription.updatedAt}</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-black text-white mb-10 flex items-center tracking-tighter">
                <span className="mr-6 bg-brand-cyan/20 p-3 rounded-2xl">📈</span> 
                Fiscal Intelligence
              </h3>
              <div className="bg-white/5 rounded-[3.5rem] border border-white/5 overflow-hidden backdrop-blur-xl group hover:border-brand-cyan/20 transition-colors">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 border-b border-white/5">
                    <tr>
                      <th className="px-12 py-8 font-black text-slate-500 uppercase tracking-[0.4em] text-[10px]">Strategic Metric</th>
                      <th className="px-12 py-8 font-black text-slate-500 uppercase tracking-[0.4em] text-[10px]">Real-Time Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ipo.financials.map((f, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-12 py-8 text-slate-300 font-bold text-base">{f.label}</td>
                        <td className={`px-12 py-8 font-black text-lg ${
                          f.trend === 'up' ? 'text-emerald-400' : f.trend === 'down' ? 'text-rose-400' : 'text-slate-200'
                        }`}>{f.value}</td>
                      </tr>
                    ))}
                    {ipo.valuation.map((v, i) => (
                      <tr key={`val-${i}`} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-12 py-8 text-slate-300 font-bold text-base">{v.label}</td>
                        <td className="px-12 py-8 font-black text-lg text-brand-cyan">{v.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="pb-10">
              <h3 className="text-3xl font-black text-white mb-12 flex items-center tracking-tighter">
                <span className="mr-6 bg-brand-pink/20 p-3 rounded-2xl">🎯</span> 
                Deep Risk Scan (AI Powered)
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
  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-6 last:border-0 group">
    <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest group-hover:text-slate-300 transition-colors">{label}</span>
    <span className="text-white font-black tracking-tight text-base group-hover:text-brand-violet transition-colors">{value}</span>
  </div>
);
