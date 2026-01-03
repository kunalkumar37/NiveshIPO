
import React, { useState, useEffect } from 'react';
import { IPO, RiskAnalysis, WeightPreferences } from '../types';
import { getRiskAnalysis } from '../services/geminiService';

interface RiskEngineProps {
  ipo: IPO;
}

export const RiskEngine: React.FC<RiskEngineProps> = ({ ipo }) => {
  const [weights, setWeights] = useState<WeightPreferences>({ fundamentals: 40, valuation: 40, sentiment: 20 });
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const result = await getRiskAnalysis(ipo, weights);
      setAnalysis(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { performAnalysis(); }, [ipo]);

  return (
    <div className="space-y-12">
      <div className="bg-[#0A0A0A] border border-brand-yellow/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow to-transparent opacity-30"></div>
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-xl font-black text-white flex items-center tracking-tighter">
            <span className="bg-brand-yellow p-3 rounded-xl mr-5 flex items-center justify-center text-black shadow-lg shadow-brand-yellow/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
            Quantum Risk Calibration
          </h3>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded-lg">AI Weighted System</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {(['fundamentals', 'valuation', 'sentiment'] as const).map((key) => (
            <div key={key} className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{key}</span>
                <span className="text-sm font-black text-brand-yellow">{weights[key]}%</span>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="absolute inset-y-0 left-0 bg-brand-yellow transition-all duration-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]" style={{ width: `${weights[key]}%` }}></div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={weights[key]} 
                  onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value) })} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={performAnalysis} 
          disabled={loading} 
          className="mt-12 w-full py-6 bg-brand-yellow text-black rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-[0_10px_40px_rgba(250,204,21,0.2)] hover:scale-[1.02] hover:shadow-brand-yellow/30 active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
              <span>Calibrating Neural Map...</span>
            </>
          ) : (
            <>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               <span>RE-INITIALIZE DEEP SCAN</span>
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
      ) : analysis ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="bg-[#111] border border-brand-yellow/20 p-10 rounded-[2.5rem] shadow-2xl relative">
            <div className="absolute top-4 left-4">
               <svg className="w-8 h-8 text-brand-yellow opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01705C7.91248 16 7.01705 16.8954 7.01705 18L7.01705 21H14.017ZM14.017 21H21V10H3V21H10.017L10.017 18C10.017 17.4477 10.4647 17 11.017 17H13.017C13.5693 17 14.017 17.4477 14.017 18V21ZM3 8V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V8H3Z" /></svg>
            </div>
            <h4 className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.5em] mb-6 pl-2">Executive Summary Verdict</h4>
            <p className="text-2xl font-black text-white leading-[1.3] tracking-tight italic">"{analysis.summary}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[2.5rem] group hover:border-emerald-500/30 transition-all">
              <h4 className="font-black text-emerald-400 mb-8 text-[11px] uppercase tracking-[0.3em] flex items-center">
                <span className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-4">↑</span> 
                Bullish Market Signals
              </h4>
              <ul className="space-y-5">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-[13px] text-slate-300 font-bold flex items-start">
                    <span className="text-emerald-500 mr-3 text-lg font-black mt-[-4px]">›</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 p-10 rounded-[2.5rem] group hover:border-red-500/30 transition-all">
              <h4 className="font-black text-red-400 mb-8 text-[11px] uppercase tracking-[0.3em] flex items-center">
                <span className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center mr-4">↓</span> 
                Bearish Risk Factors
              </h4>
              <ul className="space-y-5">
                {analysis.redFlags.map((f, i) => (
                  <li key={i} className="text-[13px] text-slate-300 font-bold flex items-start">
                    <span className="text-red-500 mr-3 text-lg font-black mt-[-4px]">›</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
