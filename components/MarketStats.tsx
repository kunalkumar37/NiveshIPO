
import React from 'react';

export const MarketStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
      <StatCard label="Active Issues" value="03" active />
      <StatCard label="30D Closed" value="15" />
      <StatCard label="Mainboard" value="04" />
      <StatCard label="SME Trends" value="11" />
      <StatCard label="Market Mood" value="Greed" extra="74 Index" />
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; active?: boolean; extra?: string }> = ({ label, value, active, extra }) => {
  return (
    <div className={`p-6 rounded-2xl border ${active ? 'bg-brand-yellow border-brand-yellow text-black' : 'bg-white/5 border-white/10 text-white'} shadow-xl flex flex-col items-center justify-center transition-all hover:-translate-y-1`}>
      <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${active ? 'text-black/60' : 'text-slate-500'}`}>{label}</p>
      <p className="text-2xl font-black tracking-tighter">{value}</p>
      {extra && <p className="text-[7px] font-bold uppercase mt-1 opacity-60">{extra}</p>}
    </div>
  );
};
