
import React, { useState, useEffect } from 'react';
import { IPO, RiskAnalysis, WeightPreferences } from '../types';
import { getRiskAnalysis } from '../services/geminiService';

interface RiskEngineProps {
  ipo: IPO;
}

export const RiskEngine: React.FC<RiskEngineProps> = ({ ipo }) => {
  const [weights, setWeights] = useState<WeightPreferences>({
    fundamentals: 40,
    valuation: 40,
    sentiment: 20
  });
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const result = await getRiskAnalysis(ipo, weights);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performAnalysis();
  }, [ipo]);

  return (
    <div className="space-y-12">
      <div className="bg-slate-950/40 border border-white/10 rounded-[3rem] p-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-violet via-brand-pink to-brand-cyan opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white flex items-center tracking-tighter">
              <span className="bg-gradient-to-br from-brand-violet to-brand-pink p-3 rounded-2xl mr-4 shadow-xl shadow-brand-violet/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </span>
              AI Bias Calibration
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">Dynamic Weighting</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(['fundamentals', 'valuation', 'sentiment'] as const).map((key) => (
              <div key={key} className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{key}</span>
                  <span className="text-sm font-black text-brand-violet bg-brand-violet/10 px-3 py-1 rounded-lg">{weights[key]}%</span>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-violet to-brand-pink transition-all duration-500"
                    style={{ width: `${weights[key]}%` }}
                  ></div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights[key]}
                    onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value) })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={performAnalysis}
            disabled={loading}
            className="mt-14 w-full py-6 bg-gradient-to-r from-brand-violet via-brand-pink to-brand-cyan bg-[length:200%_auto] hover:bg-right text-white rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-700 shadow-2xl shadow-brand-violet/20 disabled:opacity-50 active:scale-95 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Decrypting Signals...</span>
              </>
            ) : (
              <span>Launch AI Risk Scan</span>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-72 bg-white/5 rounded-[3rem] animate-pulse" />
            <div className="h-72 bg-white/5 rounded-[3rem] animate-pulse" />
          </div>
          <div className="h-48 bg-white/5 rounded-[3rem] animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-56 bg-white/5 rounded-[3rem] animate-pulse" />
            <div className="h-56 bg-white/5 rounded-[3rem] animate-pulse" />
          </div>
        </div>
      ) : analysis ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Verdict Box */}
            <div className="lg:col-span-2 bg-slate-950/40 border border-white/10 p-12 rounded-[3.5rem] flex flex-col justify-between relative overflow-hidden group">
              {/* Decorative Corner Icon */}
              <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01701C7.91244 16 7.01701 16.8954 7.01701 18V21M14.017 21H18.017C19.1216 21 20.017 20.1046 20.017 19V5C20.017 3.89543 19.1216 3 18.017 3H5.01701C3.91244 3 3.01701 3.89543 3.01701 5V19C3.01701 20.1046 3.91244 21 5.01701 21H9.01701M14.017 21V19C14.017 17.8954 13.1216 17 12.017 17H9.01701C7.91244 17 7.01701 17.8954 7.01701 19V21"/>
                </svg>
              </div>
              
              <div>
                <h4 className="text-[10px] font-black text-brand-violet uppercase tracking-[0.4em] mb-8 flex items-center">
                  <span className="w-10 h-[1px] bg-brand-violet/50 mr-4"></span>
                  The Verdict
                </h4>
                <div className="relative">
                  <svg className="absolute -left-6 -top-4 w-12 h-12 text-white opacity-[0.03]" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8v8h6v1h-6v4h7V8h-7zm10 0v8h6v1h-6v4h7V8h-7z"/></svg>
                  <p className="text-2xl font-bold text-white leading-relaxed mb-10 tracking-tight">
                    {analysis.summary && analysis.summary !== "Analysis unavailable." ? (
                      `"${analysis.summary}"`
                    ) : (
                      <span className="text-slate-500 italic font-medium">Synthesizing market sentiment based on recent GMP activity and retail subscription velocity...</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center space-x-3">
                  <span className="text-[9px] font-black text-brand-violet uppercase tracking-widest opacity-60">Persona</span>
                  <span className="text-xs font-black text-white">{analysis.investorPersona}</span>
                </div>
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center space-x-3">
                  <span className="text-[9px] font-black text-brand-cyan uppercase tracking-widest opacity-60">Strategy</span>
                  <span className="text-xs font-black text-white">{analysis.listingStrategy}</span>
                </div>
              </div>
            </div>
            
            {/* Suitability Box - Fixed Centering */}
            <div className="bg-gradient-to-br from-brand-violet/10 to-brand-cyan/10 border border-white/10 p-12 rounded-[3.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex flex-col items-center justify-center flex-1 w-full space-y-8">
                <div className="relative w-44 h-44 flex items-center justify-center drop-shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={502}
                      strokeDashoffset={502 - (502 * (analysis.suitabilityScore || 50)) / 100}
                      className="text-brand-violet transition-all duration-[1.8s] ease-out drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">{analysis.suitabilityScore || 0}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Retail Suitability</h4>
                  <p className="text-[9px] font-bold text-brand-violet/70 uppercase tracking-[0.2em] italic">Calculated Alpha</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-white/10 p-12 rounded-[3.5rem] group hover:border-brand-cyan/30 transition-all duration-500 shadow-xl">
            <h4 className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.4em] mb-8 flex items-center">
              <span className="p-3 bg-brand-cyan/10 rounded-xl mr-5">📡</span> 
              Sector Intelligence
            </h4>
            <p className="text-slate-300 leading-relaxed font-bold text-xl lg:text-2xl tracking-tight">
              {analysis.sectorOutlook || "Sector evaluation pending real-time industry benchmark comparison."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-12 rounded-[3.5rem] transition-all duration-500 hover:bg-emerald-500/[0.08] hover:border-emerald-500/30 group">
              <h4 className="font-black text-emerald-400 mb-10 flex items-center uppercase tracking-[0.3em] text-[10px]">
                <span className="bg-emerald-500 text-white w-10 h-10 rounded-2xl mr-4 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </span>
                Bulls Eye Factors
              </h4>
              <ul className="space-y-6">
                {analysis.strengths && analysis.strengths.length > 0 ? (
                   analysis.strengths.map((s, idx) => (
                    <li key={idx} className="text-lg text-slate-300 flex items-start font-bold leading-tight group-hover:text-white transition-colors">
                      <span className="mr-5 mt-2.5 w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
                      {s}
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-40">
                    <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Scan Incomplete</p>
                  </div>
                )}
              </ul>
            </div>
            
            <div className="bg-rose-500/5 border border-rose-500/10 p-12 rounded-[3.5rem] transition-all duration-500 hover:bg-rose-500/[0.08] hover:border-rose-500/30 group">
              <h4 className="font-black text-rose-400 mb-10 flex items-center uppercase tracking-[0.3em] text-[10px]">
                <span className="bg-rose-500 text-white w-10 h-10 rounded-2xl mr-4 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </span>
                Bearish Red Flags
              </h4>
              <ul className="space-y-6">
                {analysis.redFlags && analysis.redFlags.length > 0 ? (
                  analysis.redFlags.map((f, idx) => (
                    <li key={idx} className="text-lg text-slate-300 flex items-start font-bold leading-tight group-hover:text-white transition-colors">
                      <span className="mr-5 mt-2.5 w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]" /> 
                      {f}
                    </li>
                  ))
                ) : (
                   <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-40">
                    <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">No Flags Detected</p>
                  </div>
                )}
              </ul>
            </div>
          </div>

          {analysis.sources && analysis.sources.length > 0 && (
            <div className="bg-slate-950/40 border border-white/10 p-12 rounded-[3.5rem] shadow-inner">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 text-center">Intelligence Grounding Nodes</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {analysis.sources.map((src, i) => (
                  <a 
                    key={i} 
                    href={src.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-black text-slate-400 hover:text-brand-violet flex items-center bg-white/5 border border-white/5 px-6 py-4 rounded-2xl transition-all hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                  >
                    {src.title} <span className="ml-2 opacity-50">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
