
import React from 'react';
import { MarketNews } from '../types';

interface NewsTickerProps {
  news: MarketNews[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
  if (news.length === 0) return null;

  const doubleNews = [...news, ...news]; // For seamless scrolling

  return (
    <div className="w-full bg-slate-900 text-white py-3 overflow-hidden border-y border-white/5 ticker-container group relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex whitespace-nowrap animate-marquee">
        {doubleNews.map((item, idx) => (
          <a
            key={`${item.id}-${idx}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center mx-8 hover:text-brand-cyan transition-colors"
          >
            <span className="px-2 py-0.5 bg-brand-violet/20 border border-brand-violet/30 rounded text-[9px] font-black uppercase tracking-widest mr-3">
              {item.source}
            </span>
            <span className="text-sm font-bold tracking-tight mr-3">{item.title}</span>
            <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
            <span className="mx-6 text-slate-700">•</span>
          </a>
        ))}
      </div>
    </div>
  );
};
