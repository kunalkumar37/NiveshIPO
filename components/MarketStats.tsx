
import React from 'react';

export const MarketStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard label="Live Plays" value="03" color="violet" />
      <StatCard label="30D Closed" value="15" color="cyan" />
      <StatCard label="Mainboard" value="04" color="pink" />
      <StatCard label="SME Trends" value="11" color="indigo" />
      <StatCard label="Market Mood" value="Greed" color="emerald" extra="74 Index" />
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; color: string; extra?: string }> = ({ label, value, color, extra }) => {
  const colorMap: Record<string, string> = {
    violet: 'bg-brand-violet/10 text-brand-violet border-brand-violet/20',
    cyan: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    pink: 'bg-brand-pink/10 text-brand-pink border-brand-pink/20',
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border-2 ${colorMap[color]} shadow-xl flex flex-col items-center justify-center transition-all hover:-translate-y-1 backdrop-blur-md`}>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">{label}</p>
      <p className="text-3xl font-black tracking-tighter">{value}</p>
      {extra && <p className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">{extra}</p>}
    </div>
  );
};
