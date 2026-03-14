import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User, Sparkles, Loader2, Maximize2, Minimize2, Trash2, Zap, Coins } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useThemeTokens } from '../hooks/useThemeTokens';
import { useAuth } from '../contexts/AuthContext';
import { useAIChat } from '../hooks/useAIChat';

interface AIChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  // Context to send to AI
  marketContext: string;
  assetSymbol?: string;
}

// Helper to parse basic markdown since react-markdown is not installed
const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Check for headers
    if (line.startsWith('### ')) {
      return <h4 key={idx} className="font-bold text-[15px] mb-2 mt-3" style={{ color: '#fff' }}>{parseInline(line.slice(4))}</h4>;
    }
    if (line.startsWith('## ')) {
      return <h3 key={idx} className="font-bold text-[16px] mb-2 mt-3" style={{ color: '#fff' }}>{parseInline(line.slice(3))}</h3>;
    }
    if (line.startsWith('# ')) {
      return <h2 key={idx} className="font-bold text-[17px] mb-2 mt-4" style={{ color: '#fff' }}>{parseInline(line.slice(2))}</h2>;
    }
    // Check for lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return (
        <div key={idx} className="flex gap-2 mb-1.5 ml-2 mr-2">
          <span className="text-[14px]">•</span>
          <span className="flex-1 leading-relaxed">{parseInline(line.trim().slice(2))}</span>
        </div>
      );
    }
    // Empty line
    if (line.trim() === '') {
      return <div key={idx} className="h-2"></div>;
    }
    // Normal paragraph
    return <p key={idx} className="mb-2 last:mb-0 leading-relaxed">{parseInline(line)}</p>;
  });
};

const parseInline = (text: string) => {
  // Very simple regex to find **bold** text
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold" style={{ color: '#f8fafc' }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

export function AIChatBot({ isOpen, onClose, marketContext, assetSymbol }: AIChatBotProps) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const tk = useThemeTokens();
  
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const { aiTokens, consumeTokens } = useAuth();
  const [tokenError, setTokenError] = useState(false);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    
    setTokenError(false);
    if (!consumeTokens(2)) {
      setTokenError(true);
      return;
    }
    
    sendMessage(inputVal, marketContext);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed z-50 flex flex-col shadow-2xl overflow-hidden pointer-events-auto"
          style={{
            bottom: isExpanded ? '24px' : '24px',
            right: isRTL ? 'auto' : '24px',
            left: isRTL ? '24px' : 'auto',
            width: isExpanded ? Math.min(600, window.innerWidth - 48) : 380,
            height: isExpanded ? Math.min(800, window.innerHeight - 100) : 550,
            background: tk.isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${tk.border}`,
            borderRadius: '24px',
            transformOrigin: isRTL ? 'bottom left' : 'bottom right'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b relative" style={{ borderColor: tk.border }}>
            {/* Glowing Accent */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ 
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
              opacity: 0.8 
            }} />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ 
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
                border: '1px solid rgba(99,102,241,0.3)'
              }}>
                <Sparkles className="w-5 h-5" style={{ color: '#818cf8' }} />
                <motion.div 
                   className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2"
                   style={{ borderColor: tk.surface }}
                   animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                   transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide flex items-center gap-2" style={{ color: tk.textPrimary }}>
                  Phase X AI <span style={{ color: '#a855f7' }}>Analytics</span>
                </h3>
                <div className="flex items-center gap-2 whitespace-nowrap mt-1 text-[11px] font-medium" style={{ color: tk.textDim }}>
                  {assetSymbol ? `${isRTL ? 'يحلل' : 'Analyzing'} ${assetSymbol}` : (isRTL ? 'محلل السوق' : 'Smart Market Analyst')}
                  <span className="flex items-center gap-1 bg-fuchsia-900/40 text-fuchsia-400 px-1.5 py-0.5 rounded border border-fuchsia-800/50">
                    <Zap size={10} /> {aiTokens}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button onClick={clearChat} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" title={isRTL ? "مسح المحادثة" : "Clear Chat"}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              )}
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-2 rounded-lg transition-colors cursor-pointer"
                style={{ color: tk.textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={onClose} 
                className="p-2 rounded-lg transition-colors cursor-pointer"
                style={{ color: tk.textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 pb-2 flex flex-col gap-6" style={{
            scrollBehavior: 'smooth'
          }}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-70">
                <Bot className="w-16 h-16 mb-4" style={{ color: '#6366f1' }} />
                <h4 className="text-lg font-bold mb-2" style={{ color: tk.textPrimary }}>
                  {isRTL ? 'كيف يمكنني مساعدتك؟' : 'How can I assist you?'}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: tk.textMuted }}>
                  {isRTL 
                    ? `أنا هنا لتحليل حالة السوق الحالية لـ ${assetSymbol || 'العملة المختارة'}. اسألني عن الاتجاهات، أو الإزاحة، أو اطلب نصيحة عامة.`
                    : `I am here to analyze the current market state for ${assetSymbol || 'the selected asset'}. Ask me about trends, displacement, or for general advice.`
                  }
                </p>
                <div className="mt-6 flex flex-col gap-2 w-full max-w-[280px]">
                  {['What is the current Phase State?', 'Are there any buy signals?', 'Explain the displacement trend.'].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInputVal(isRTL ? (q === 'What is the current Phase State?' ? 'ما هي حالة المرحلة الحالية؟' : q === 'Are there any buy signals?' ? 'هل توجد إشارات شراء؟' : 'اشرح اتجاه الإزاحة.') : q)}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors border"
                      style={{ 
                        background: 'rgba(99,102,241,0.05)', 
                        color: tk.textPrimary,
                        borderColor: 'rgba(99,102,241,0.1)' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                    >
                      {isRTL 
                        ? (q === 'What is the current Phase State?' ? 'ما هي حالة المرحلة الحالية؟' : q === 'Are there any buy signals?' ? 'هل توجد إشارات شراء؟' : 'اشرح اتجاه الإزاحة.') 
                        : q}
                    </button>
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-fuchsia-500/20 text-fuchsia-400'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  {/* Message Bubble */}
                  <div 
                    className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-sm' : 'bg-slate-800/50 text-slate-300 rounded-tl-sm'}`}
                    style={{
                      border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.3)' : tk.border}`,
                      boxShadow: msg.role === 'user' ? '0 4px 15px rgba(99,102,241,0.1)' : 'none',
                      fontSize: '13px',
                      lineHeight: '1.6',
                    }}
                    dir="auto"
                  >
                    {renderMarkdown(msg.content)}
                  </div>
                </motion.div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
               <motion.div
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className={`flex gap-3 max-w-[90%] ${isRTL ? '' : ''}`}
               >
                 <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-fuchsia-500/20 text-fuchsia-400">
                    <Bot className="w-4 h-4" />
                 </div>
                 <div className="px-4 py-3 rounded-2xl bg-slate-800/50 rounded-tl-sm border" style={{ borderColor: tk.border }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div 
                          key={i}
                          className="w-2 h-2 rounded-full bg-fuchsia-400"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                 </div>
               </motion.div>
            )}

            {error && (
              <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            {tokenError && (
              <div className="flex items-center justify-center gap-2 text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold my-2">
                <Coins className="w-4 h-4" />
                {language === "ar" ? "رصيد التوكن غير كافٍ. يرجى الشحن من خلال ملفك الشخصي." : language === "fr" ? "Jetons IA insuffisants. Veuillez recharger dans votre profil." : language === "es" ? "Tokens de IA insuficientes. Por favor recarga en tu perfil." : language === "ru" ? "Недостаточно ИИ токенов. Пожалуйста, пополните счет в вашем профиле." : language === "tr" ? "Yetersiz YZ Jetonu. Lütfen profilinizden yükleme yapın." : "Insufficient AI Tokens. Please top up in your profile."}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-transparent border-t" style={{ borderColor: tk.border }}>
            <form onSubmit={handleSubmit} className="relative flex items-end">
              <textarea
                ref={inputRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRTL ? 'اسأل المحلل الذكي...' : 'Ask the Smart Analyst...'}
                className="w-full bg-slate-800/50 rounded-xl px-4 py-3 pr-12 resize-none text-sm outline-none transition-all focus:ring-1"
                style={{ 
                  color: tk.textPrimary,
                  border: `1px solid ${tk.border}`,
                  minHeight: '52px',
                  maxHeight: '120px'
                }}
                rows={1}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="absolute right-2 bottom-2 w-9 h-9 flex items-center justify-center rounded-lg disabled:opacity-50 transition-all cursor-pointer"
                style={{ 
                  background: inputVal.trim() && !isLoading ? 'linear-gradient(135deg, #6366f1, #a855f7)' : tk.buttonGhost,
                  color: inputVal.trim() && !isLoading ? '#fff' : tk.textMuted
                }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />}
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-medium">✨ Powered by Gemini AI</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
