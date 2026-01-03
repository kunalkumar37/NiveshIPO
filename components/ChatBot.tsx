
import React, { useState, useRef, useEffect } from 'react';
import { chatWithFinancialAI, transcribeAudio } from '../services/geminiService';
import { GroundingSource } from '../types';

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const isBullet = line.trim().startsWith('-') || line.trim().startsWith('*');
        return (
          <p key={idx} className={`${isBullet ? 'pl-3 relative before:content-["•"] before:absolute before:left-0 before:text-brand-yellow' : ''} leading-normal text-[11px] sm:text-xs`}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-black text-brand-yellow">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, sources?: GroundingSource[] }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading, micError]);

  const handleSend = async (e?: React.FormEvent, overrideMsg?: string) => {
    e?.preventDefault();
    const userMsg = overrideMsg || input;
    if (!userMsg.trim() || isLoading) return;

    setInput('');
    setMicError(null);
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
    const result = await chatWithFinancialAI(userMsg, history as any);
    setMessages(prev => [...prev, { role: 'ai', text: result.text, sources: result.sources }]);
    
    setIsLoading(false);
  };

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsLoading(true);
          const transcription = await transcribeAudio(base64Audio);
          setIsLoading(false);
          if (transcription) setInput(transcription);
        };
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      setMicError("Microphone access denied. Please enable permissions in your browser settings.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-[340px] sm:w-[420px] h-[550px] sm:h-[600px] bg-[#0A0A0A] rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,1)] border border-brand-yellow/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-400">
          <div className="bg-brand-yellow p-5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-xl">
                <svg className="w-6 h-6 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /></svg>
              </div>
              <div>
                <h3 className="text-black font-black text-sm uppercase tracking-wider">NiveshAI Analysis</h3>
                <p className="text-black/70 text-[9px] font-black uppercase tracking-widest">Financial Terminal v3</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-black/10 hover:bg-black/20 text-black transition-all p-2 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-black/40">
            {messages.length === 0 && (
              <div className="text-center py-12 border border-white/5 bg-white/5 rounded-3xl mt-2 px-6">
                <div className="w-16 h-16 bg-brand-yellow/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-yellow/20">
                   <svg className="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-white text-xl font-black mb-2 tracking-tight uppercase">MARKET EXPERT</p>
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                   Strictly Financial Analytics, IPO Insights, and Market Valuations.
                </p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] font-medium shadow-2xl ${
                  m.role === 'user' 
                    ? 'bg-brand-yellow text-black rounded-tr-none' 
                    : 'bg-[#121212] text-slate-200 border border-white/10 rounded-tl-none'
                }`}>
                  <FormattedMessage text={m.text} />
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                      {m.sources.slice(0, 3).map((s, idx) => (
                        <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-brand-yellow/5 text-brand-yellow border border-brand-yellow/20 px-2.5 py-1.5 rounded-lg hover:bg-brand-yellow/10 transition-colors font-black uppercase tracking-tighter">
                          {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {micError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                {micError}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#121212] border border-white/10 p-4 rounded-2xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-brand-yellow rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest ml-2">Analyzing Trends...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/10 bg-[#080808]">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query Market intelligence..."
                className="w-full bg-[#111] border border-white/20 rounded-2xl pl-6 pr-32 py-4 text-sm font-black tracking-tight focus:outline-none focus:border-brand-yellow text-white shadow-inner placeholder-slate-800"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <button 
                  type="button" 
                  onMouseDown={startRecording} 
                  onMouseUp={stopRecording} 
                  onMouseLeave={stopRecording} 
                  className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white/5 text-slate-500 hover:text-brand-yellow hover:bg-white/10 border border-white/10'}`}
                  title="Voice Research"
                >
                  <svg className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                </button>
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading} 
                  className="p-2.5 bg-brand-yellow text-black rounded-xl hover:scale-105 active:scale-95 shadow-xl shadow-brand-yellow/10 disabled:opacity-30 transition-all"
                  title="Submit Query"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-16 h-16 bg-brand-yellow text-black rounded-2xl shadow-[0_10px_50px_rgba(250,204,21,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-2 border-brand-yellow/30"
        >
          <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>
          <div className="absolute inset-0 border-2 border-brand-yellow/50 rounded-2xl animate-ping opacity-30"></div>
        </button>
      )}
    </div>
  );
};
