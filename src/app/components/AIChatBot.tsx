import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User, Sparkles, Loader2, Maximize2, Minimize2, Trash2, Zap, Coins, Cpu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useThemeTokens } from '../hooks/useThemeTokens';
import { useAuth } from '../contexts/AuthContext';
import { useAIChat } from '../hooks/useAIChat';

interface AIChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  marketContext: string;
  assetSymbol?: string;
}

const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    if (line.startsWith('### ')) return <h4 key={idx} className="font-black text-[14px] mb-2 mt-3 text-white">{parseInline(line.slice(4))}</h4>;
    if (line.startsWith('## ')) return <h3 key={idx} className="font-black text-[15px] mb-2 mt-3 text-white">{parseInline(line.slice(3))}</h3>;
    if (line.startsWith('# ')) return <h2 key={idx} className="font-black text-[16px] mb-2 mt-4 text-white">{parseInline(line.slice(2))}</h2>;
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return (
        <div key={idx} className="flex gap-2 mb-1.5 ml-2 mr-2">
          <span className="text-indigo-400 text-[13px]">▹</span>
          <span className="flex-1 leading-relaxed">{parseInline(line.trim().slice(2))}</span>
        </div>
      );
    }
    if (line.trim() === '') return <div key={idx} className="h-2" />;
    return <p key={idx} className="mb-2 last:mb-0 leading-relaxed">{parseInline(line)}</p>;
  });
};

const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-black text-white">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

export function AIChatBot({ isOpen, onClose, marketContext, assetSymbol }: AIChatBotProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const tk = useThemeTokens();
  
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const { aiTokens, consumeTokens } = useAuth();
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    setTokenError(false);
    if (!consumeTokens(2)) { setTokenError(true); return; }
    sendMessage(inputVal, marketContext);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const accentRgb = '99,102,241';
  const accentColor = '#818cf8';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed z-50 flex flex-col overflow-hidden pointer-events-auto"
          style={{
            bottom: '24px',
            right: isRTL ? 'auto' : '24px',
            left: isRTL ? '24px' : 'auto',
            width: isExpanded ? Math.min(600, window.innerWidth - 48) : 380,
            height: isExpanded ? Math.min(800, window.innerHeight - 100) : 550,
            background: `radial-gradient(ellipse at 50% 0%, rgba(${accentRgb},0.06) 0%, rgba(6,10,16,0.97) 60%)`,
            backdropFilter: 'blur(24px)',
            border: `1px solid rgba(${accentRgb},0.15)`,
            borderRadius: '24px',
            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(${accentRgb},0.08), inset 0 1px 0 rgba(255,255,255,0.03)`,
            transformOrigin: isRTL ? 'bottom left' : 'bottom right'
          }}
        >
          {/* Top LED strip */}
          <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, transparent 5%, ${accentColor} 30%, #a855f7 50%, ${accentColor} 70%, transparent 95%)` }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }} />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 relative overflow-hidden"
            style={{ borderBottom: `1px solid rgba(${accentRgb},0.1)`, background: `linear-gradient(180deg, rgba(${accentRgb},0.04) 0%, transparent 100%)` }}>
            
            {/* Animated scan */}
            <motion.div className="absolute inset-0 w-1/3"
              style={{ background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.06), transparent)` }}
              animate={{ x: ['-200%', '500%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />

            <div className="flex items-center gap-3 relative z-10">
              <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, rgba(${accentRgb},0.15), rgba(168,85,247,0.15))`, border: `1px solid rgba(${accentRgb},0.25)` }}
                animate={{ boxShadow: [`0 0 10px rgba(${accentRgb},0.1)`, `0 0 25px rgba(${accentRgb},0.2)`, `0 0 10px rgba(${accentRgb},0.1)`] }}
                transition={{ duration: 2.5, repeat: Infinity }}>
                <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
                <motion.div 
                   className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                   style={{ background: '#34d399', borderColor: 'rgba(6,10,16,0.9)' }}
                   animate={{ scale: [1, 1.3, 1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-[0.15em]" style={{ color: accentColor }}>PHASE-X</span>
                  <span className="text-[11px] font-black tracking-[0.15em] text-purple-400">AI</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-gray-500 font-bold tracking-wider">
                    {assetSymbol ? `${isRTL ? 'يحلل' : 'Analyzing'} ${assetSymbol}` : (isRTL ? 'محلل السوق' : 'Smart Market Analyst')}
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black"
                    style={{ background: `rgba(${accentRgb},0.08)`, border: `1px solid rgba(${accentRgb},0.2)`, color: accentColor }}>
                    <Zap size={8} /> {aiTokens}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 relative z-10">
              {messages.length > 0 && (
                <button onClick={clearChat} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}
                  title={isRTL ? "مسح المحادثة" : "Clear Chat"}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400/60" />
                </button>
              )}
              <button onClick={() => setIsExpanded(!isExpanded)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                style={{ background: `rgba(${accentRgb},0.05)`, border: `1px solid rgba(${accentRgb},0.15)` }}>
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" style={{ color: accentColor }} /> : <Maximize2 className="w-3.5 h-3.5" style={{ color: accentColor }} />}
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <X className="w-3.5 h-3.5 text-red-400/60" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 pb-2 flex flex-col gap-5" style={{ scrollBehavior: 'smooth' }}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                {/* Animated icon */}
                <motion.div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 relative"
                  style={{ background: `linear-gradient(135deg, rgba(${accentRgb},0.08), rgba(168,85,247,0.08))`, border: `1px solid rgba(${accentRgb},0.15)` }}
                  animate={{ boxShadow: [`0 0 0 rgba(${accentRgb},0)`, `0 0 40px rgba(${accentRgb},0.15)`, `0 0 0 rgba(${accentRgb},0)`] }}
                  transition={{ duration: 3, repeat: Infinity }}>
                  <Bot className="w-10 h-10" style={{ color: accentColor, opacity: 0.7 }} />
                </motion.div>
                <h4 className="text-base font-black mb-2 text-white">
                  {isRTL ? 'كيف يمكنني مساعدتك؟' : 'How can I assist you?'}
                </h4>
                <p className="text-[11px] leading-relaxed text-gray-500 max-w-[250px] mb-6">
                  {isRTL 
                    ? `أنا هنا لتحليل حالة السوق الحالية لـ ${assetSymbol || 'العملة المختارة'}. اسألني عن الاتجاهات أو اطلب نصيحة.`
                    : `I am here to analyze the current market state for ${assetSymbol || 'the selected asset'}. Ask me about trends or for advice.`
                  }
                </p>
                <div className="flex flex-col gap-2 w-full max-w-[280px]">
                  {[
                    { en: 'What is the current Phase State?', ar: 'ما هي حالة المرحلة الحالية؟' },
                    { en: 'Are there any buy signals?', ar: 'هل توجد إشارات شراء؟' },
                    { en: 'Explain the displacement trend.', ar: 'اشرح اتجاه الإزاحة.' }
                  ].map((q, i) => (
                    <motion.button key={i}
                      onClick={() => setInputVal(isRTL ? q.ar : q.en)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2.5 rounded-xl text-[11px] font-medium text-left transition-all cursor-pointer"
                      style={{ 
                        background: `rgba(${accentRgb},0.04)`,
                        color: '#94a3b8',
                        border: `1px solid rgba(${accentRgb},0.1)`
                      }}>
                      <span className="mr-2 text-indigo-400">▹</span>
                      {isRTL ? q.ar : q.en}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? (isRTL ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row-reverse') : ''}`}
                >
                  {/* Avatar */}
                  <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))'
                        : 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.2)' : 'rgba(168,85,247,0.2)'}`,
                    }}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-indigo-400" /> : <Bot className="w-3.5 h-3.5 text-purple-400" />}
                  </motion.div>
                  
                  {/* Message Bubble */}
                  <div 
                    className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                    style={{
                      background: msg.role === 'user'
                        ? `rgba(${accentRgb},0.06)`
                        : 'rgba(15,23,42,0.6)',
                      border: `1px solid ${msg.role === 'user' ? `rgba(${accentRgb},0.15)` : 'rgba(168,85,247,0.1)'}`,
                      boxShadow: msg.role === 'user' ? `0 4px 20px rgba(${accentRgb},0.08)` : 'none',
                      fontSize: '12px',
                      lineHeight: '1.7',
                      color: '#c8d0dc'
                    }}
                    dir="auto"
                  >
                    {renderMarkdown(msg.content)}
                  </div>
                </motion.div>
              ))
            )}

            {/* Loading */}
            {isLoading && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[90%]">
                 <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                 </div>
                 <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(168,85,247,0.1)' }}>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: '#a855f7' }}
                          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                 </div>
               </motion.div>
            )}

            {error && (
              <div className="text-center p-2.5 rounded-xl text-red-400 text-[11px] font-medium" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
                {error}
              </div>
            )}

            {tokenError && (
              <div className="flex items-center justify-center gap-2 text-center p-3 rounded-xl text-amber-400 text-[11px] font-black gap-2" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)' }}>
                <Coins className="w-4 h-4" />
                {isRTL ? "رصيد التوكن غير كافٍ. يرجى الشحن من خلال ملفك الشخصي." : "Insufficient AI Tokens. Please top up in your profile."}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 relative" style={{ borderTop: `1px solid rgba(${accentRgb},0.08)` }}>
            <form onSubmit={handleSubmit} className="relative flex items-end">
              <textarea
                ref={inputRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRTL ? 'اسأل المحلل الذكي...' : 'Ask the Smart Analyst...'}
                className="w-full rounded-xl px-4 py-3 pr-12 resize-none text-[12px] outline-none transition-all font-medium"
                style={{ 
                  color: '#e2e8f0',
                  background: `rgba(${accentRgb},0.04)`,
                  border: `1px solid rgba(${accentRgb},0.12)`,
                  minHeight: '52px',
                  maxHeight: '120px',
                  caretColor: accentColor
                }}
                rows={1}
              />
              <motion.button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                whileHover={inputVal.trim() && !isLoading ? { scale: 1.1 } : {}}
                whileTap={inputVal.trim() && !isLoading ? { scale: 0.9 } : {}}
                className="absolute right-2 bottom-2 w-9 h-9 flex items-center justify-center rounded-xl disabled:opacity-30 transition-all cursor-pointer"
                style={{ 
                  background: inputVal.trim() && !isLoading ? `linear-gradient(135deg, ${accentColor}, #a855f7)` : `rgba(${accentRgb},0.06)`,
                  color: inputVal.trim() && !isLoading ? '#fff' : '#475569',
                  boxShadow: inputVal.trim() && !isLoading ? `0 4px 15px rgba(${accentRgb},0.25)` : 'none'
                }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />}
              </motion.button>
            </form>
            <div className="text-center mt-2.5">
              <span className="text-[8px] tracking-[0.3em] uppercase font-semibold" style={{ color: `rgba(${accentRgb},0.2)` }}>
                PHASE-X · AI ANALYTICS · CORE
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
