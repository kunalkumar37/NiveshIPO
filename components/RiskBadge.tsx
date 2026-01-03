
import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const styles = {
    Low: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
    Moderate: 'border-brand-yellow/50 text-brand-yellow bg-brand-yellow/10',
    High: 'border-red-500/50 text-red-400 bg-red-500/10'
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles[level]}`}>
      {level} RISK
    </span>
  );
};
