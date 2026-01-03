
import React, { useState, useEffect } from 'react';
import { CommunityMessage } from '../types';

const generateCodename = () => {
  const adjectives = ['Neon', 'Cyber', 'Quant', 'Alpha', 'SME', 'Bull', 'Void', 'Lunar', 'Global', 'Prime'];
  const nouns = ['Hunter', 'Rider', 'Whale', 'Prophet', 'Node', 'Pulse', 'Ape', 'Analyst', 'Seeker', 'Ghost'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(100 + Math.random() * 899);
  return `${randomAdj} ${randomNoun} #${num}`;
};

export const Community: React.FC = () => {
  const [messages, setMessages] = useState<(CommunityMessage & { codename: string })[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [msgType, setMsgType] = useState<'suggestion' | 'feedback' | 'general'>('suggestion');
  const [isTransmitting, setIsTransmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nivesh_community_v3');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        { 
          id: '1', 
          text: 'The AI risk scoring is a game changer for retail. Can we get a "Compare" feature for SME vs Mainboard stats?', 
          timestamp: '2 hours ago', 
          type: 'suggestion',
          codename: 'Alpha Seeker #882'
        },
        { 
          id: '2', 
          text: 'Design is 10/10. Dark mode is very easy on the eyes during late-night market research.', 
          timestamp: '5 hours ago', 
          type: 'feedback',
          codename: 'Cyber Whale #104'
        }
      ]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || isTransmitting) return;

    setIsTransmitting(true);
    setTimeout(() => {
      const msg = {
        id: Math.random().toString(36).substr(2, 9),
        text: newMsg,
        timestamp: 'Just now',
        type: msgType,
        codename: generateCodename()
      };

      const updated = [msg, ...messages];
      setMessages(updated);
      localStorage.setItem('nivesh_community_v3', JSON.stringify(updated));
      setNewMsg('');
      setIsTransmitting(false);
    }, 1200);
  };

  const handleTypeChange = (type: 'suggestion' | 'feedback' | 'general') => {
    setMsgType(type);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-black">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10 pt-10">
        <div className="text-left flex-1">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
            NETWORK<span className="text-brand-yellow">PULSE</span>
          </h2>
          <p className="text-slate-500 font-bold text-lg uppercase tracking-widest max-w-xl">
            Encrypted anonymous transmission hub for retail intelligence.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#0A0A0A] border border-brand-yellow/20 px-8 py-5 rounded-3xl text-center shadow-xl">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Live Nodes</p>
            <p className="text-2xl font-black text-brand-yellow">1.2K</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12">
          <div className="bg-[#050505] rounded-[2.5rem] p-10 border border-brand-yellow/10 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow/20"></div>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-6">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center sm:text-left">SELECT CHANNEL</label>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  {(['suggestion', 'feedback', 'general'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTypeChange(t)}
                      className={`flex-1 min-w-[140px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                        msgType === t 
                          ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow shadow-[0_0_20px_rgba(250,204,21,0.2)]' 
                          : 'bg-white/5 text-slate-600 border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center sm:text-left">ENCRYPTION INPUT</label>
                <textarea
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Initiate market signal transmission..."
                  className="w-full h-40 bg-[#080808] border border-white/5 rounded-[2rem] p-8 text-white focus:outline-none focus:border-brand-yellow/50 transition-all resize-none placeholder-slate-800 font-bold text-lg shadow-inner"
                />
              </div>

              <div className="flex justify-center">
                <button 
                  type="submit"
                  disabled={isTransmitting || !newMsg.trim()}
                  className="w-full max-w-md py-6 bg-brand-yellow text-black rounded-[1.5rem] font-black uppercase text-xs tracking-[0.5em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center space-x-3"
                >
                  {isTransmitting ? (
                    <>
                      <div className="w-5 h-5 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      <span>POST TRANSMISSION</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-12 space-y-10">
          <div className="flex items-center justify-between px-4 border-b border-white/5 pb-6">
            <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em]">Live Intelligence Feed</h3>
            <div className="flex items-center space-x-3">
               <span className="w-2.5 h-2.5 bg-brand-yellow rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest">Secure Link Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pr-2">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-brand-yellow/20 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs bg-brand-yellow text-black shadow-lg">
                      {m.codename.split(' ')[0][0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white tracking-tight">{m.codename}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-yellow/60">
                        {m.type}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-slate-700 font-mono uppercase">{m.timestamp}</span>
                </div>

                <p className="text-slate-300 font-bold text-lg leading-relaxed tracking-tight group-hover:text-white transition-colors">
                  "{m.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
