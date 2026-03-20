import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAITradeSignal } from '../hooks/useAITradeSignal';
import { Target, Crosshair, TrendingUp, TrendingDown, ShieldAlert, Cpu, Activity, Minus, Zap, BarChart2, ChevronUp, ChevronDown, Coins, Sparkles, Gauge, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useThemeTokens } from '../hooks/useThemeTokens';

interface AITradeSignalWidgetProps {
  marketContext: string;
  assetSymbol?: string;
  timeframe: number;
  mtfEnabled: boolean;
  mtfSmallTimeframe: number;
  mtfLargeTimeframe: number;
  indicatorName?: string;
  onExecuteTrade?: (action: string, sl?: number, tp?: number, lot?: number) => void;
}
export function AITradeSignalWidget({ marketContext, assetSymbol, timeframe, mtfEnabled, mtfSmallTimeframe, mtfLargeTimeframe, indicatorName, onExecuteTrade }: AITradeSignalWidgetProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const tk = useThemeTokens();
  
  const txtDict = {
    ar: { analyzing: "جاري التحليل...", systemReady: "جاهز", standby: "وضع الاستعداد", extracting: "استخراج البيانات...", initScan: "ابدأ الفحص لمعالجة ديناميكيات المرحلة مباشرة.", focus: "التركيز", entryProtocol: "نقطة الدخول", targetPrimary: "الهدف الرئيسي", abortLevel: "مستوى الإلغاء (SL)", volatility: "التقلب", trendStrength: "قوة الاتجاه", support: "الدعم", resistance: "المقاومة", aiLogic: "منطق الذكاء الاصطناعي", riskVectors: "مؤشرات الخطر", scanningBtn: "جاري المسح...", rescanBtn: "إعادة المسح", executeBtn: "تنفيذ المسح" },
    en: { analyzing: "ANALYZING...", systemReady: "SYSTEM READY", standby: "STANDBY", extracting: "EXTRACTING METRICS...", initScan: "Initiate scan to process live Phase X dynamics.", focus: "FOCUS", entryProtocol: "ENTRY PROTOCOL", targetPrimary: "TARGET PRIMARY", abortLevel: "ABORT LEVEL (SL)", volatility: "VOLATILITY", trendStrength: "TREND STRENGTH", support: "SUPPORT", resistance: "RESISTANCE", aiLogic: "AI LOGIC", riskVectors: "RISK VECTORS & FACTORS", scanningBtn: "SCANNING...", rescanBtn: "RE-SCAN", executeBtn: "EXECUTE SCAN" },
    ru: { analyzing: "АНАЛИЗ...", systemReady: "СИСТЕМА ГОТОВА", standby: "ОЖИДАНИЕ", extracting: "ИЗВЛЕЧЕНИЕ МЕТРИК...", initScan: "Начать сканирование для обработки динамики Phase X.", focus: "ФОКУС", entryProtocol: "ПРОТОКОЛ ВХОДА", targetPrimary: "ОСНОВНАЯ ЦЕЛЬ", abortLevel: "УРОВЕНЬ ОТМЕНЫ (SL)", volatility: "ВОЛАТИЛЬНОСТЬ", trendStrength: "СИЛА ТРЕНДА", support: "ПОДДЕРЖКА", resistance: "СОПРОТИВЛЕНИЕ", aiLogic: "ЛОГИКА ИИ", riskVectors: "ФАКТОРЫ РИСКА", scanningBtn: "СКАНИРОВАНИЕ...", rescanBtn: "ПОВТОРНОЕ СКАНИРОВАНИЕ", executeBtn: "НАЧАТЬ СКАНИРОВАНИЕ" },
    tr: { analyzing: "ANALİZ EDİLİYOR...", systemReady: "SİSTEM HAZIR", standby: "BEKLEMEDE", extracting: "METRİKLER ÇIKARILIYOR...", initScan: "Canlı Phase X dinamiklerini işlemek için taramayı başlatın.", focus: "ODAK", entryProtocol: "GİRİŞ PROTOKOLÜ", targetPrimary: "BİRİNCİL HEDEF", abortLevel: "İPTAL SEVİYESİ (SL)", volatility: "VOLATİLİTE", trendStrength: "TREND GÜCÜ", support: "DESTEK", resistance: "DİRENÇ", aiLogic: "YZ MANTIĞI", riskVectors: "RİSK FAKTÖRLERİ", scanningBtn: "TARANIYOR...", rescanBtn: "YENİDEN TARA", executeBtn: "TARAMAYI BAŞLAT" },
    fr: { analyzing: "ANALYSE...", systemReady: "PRÊT", standby: "VEILLE", extracting: "EXTRACTION DE DONNÉES...", initScan: "Lancer l'analyse pour traiter la dynamique Phase X en direct.", focus: "FOCUS", entryProtocol: "PROTOCOLE D'ENTRÉE", targetPrimary: "CIBLE PRINCIPALE", abortLevel: "NIVEAU D'ABANDON (SL)", volatility: "VOLATILITÉ", trendStrength: "FORCE DE TENDANCE", support: "SUPPORT", resistance: "RÉSISTANCE", aiLogic: "LOGIQUE IA", riskVectors: "VECTEURS DE RISQUE", scanningBtn: "ANALYSE EN COURS...", rescanBtn: "NOUVELLE ANALYSE", executeBtn: "EXÉCUTER L'ANALYSE" },
    es: { analyzing: "ANALIZANDO...", systemReady: "LISTO", standby: "ESPERA", extracting: "EXTRAYENDO MÉTRICAS...", initScan: "Iniciar escaneo para procesar las dinámicas en vivo de Phase X.", focus: "FOCO", entryProtocol: "PROTOCOLO DE ENTRADA", targetPrimary: "OBJETIVO PRINCIPAL", abortLevel: "NIVEL DE ABORTO (SL)", volatility: "VOLATILIDAD", trendStrength: "FUERZA DE TENDENCIA", support: "SOPORTE", resistance: "RESISTENCIA", aiLogic: "LÓGICA DE IA", riskVectors: "VECTORES DE RIESGO", scanningBtn: "ESCANEANDO...", rescanBtn: "VOLVER A ESCANEAR", executeBtn: "EJECUTAR ESCANEO" }
  };
  const txt = txtDict[language as keyof typeof txtDict] || txtDict.en;
  
  const { signal, isScanning, error, scanMarket, resetSignal } = useAITradeSignal(assetSymbol, timeframe, mtfEnabled, mtfSmallTimeframe, mtfLargeTimeframe);
  const { aiTokens, consumeTokens } = useAuth();
  const [scanProgress, setScanProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const [aiLot, setAiLot] = useState("0.01");

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);
    } else {
      setScanProgress(100);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleScan = () => {
    if (isScanning) return;
    setTokenError(false);
    if (!consumeTokens(1)) {
        setTokenError(true);
        return;
    }
    scanMarket(marketContext, language);
  };

  const getSignalColors = () => {
    if (!signal) return { bg: tk.accentGlow08, border: tk.accentGlow25, text: tk.accent, glow: 'transparent', rgb: '99,102,241' };
    switch (signal.action) {
      case 'BUY': {
        const c = tk.positive;
        return { bg: tk.positiveBg, border: tk.positiveBorder, text: c, glow: `0 0 25px ${tk.positiveBg}`, rgb: '16,185,129' };
      }
      case 'SELL': {
        const c = tk.negative;
        return { bg: tk.negativeBg, border: tk.negativeBorder, text: c, glow: `0 0 25px ${tk.negativeBg}`, rgb: '239,68,68' };
      }
      case 'HOLD':
        return { bg: tk.warningBg, border: `${tk.warning}4d`, text: tk.warning, glow: `0 0 25px ${tk.warningBg}`, rgb: '245,158,11' };
      default:
        return { bg: tk.accentGlow08, border: tk.accentGlow25, text: tk.accent, glow: 'transparent', rgb: '99,102,241' };
    }
  };

  const colors = getSignalColors();

  return (
    <div 
      className="rounded-2xl overflow-hidden relative flex flex-col font-mono flex-shrink-0"
      style={{
        background: tk.isDark ? `radial-gradient(ellipse at 50% 0%, rgba(${colors.rgb},0.06) 0%, ${tk.bgPage} 60%)` : tk.surface,
        backdropFilter: tk.isDark ? 'blur(16px)' : undefined,
        border: `1px solid ${colors.border}`,
        boxShadow: tk.isDark ? `${colors.glow}, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)` : `0 8px 30px rgba(0,0,0,0.06)`,
        transition: 'all 0.5s ease'
      }}
    >
      {/* Top LED strip */}
      <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
        style={{ background: `linear-gradient(90deg, transparent 5%, ${colors.text} 30%, ${colors.text} 70%, transparent 95%)` }}
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity }} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, rgba(${colors.rgb},0.06) 0%, transparent 100%)`, borderBottom: `1px solid rgba(${colors.rgb},0.1)` }}>
        
        {/* Animated scan line */}
        <motion.div 
          className="absolute inset-0 w-1/3"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${colors.rgb},0.08), transparent)` }}
          animate={{ x: ['-200%', '500%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex items-center gap-2.5 relative z-10">
          <motion.div className="w-8 h-8 rounded-lg flex items-center justify-center relative"
            style={{ background: `linear-gradient(135deg, rgba(${colors.rgb},0.2), rgba(${colors.rgb},0.05))`, border: `1px solid rgba(${colors.rgb},0.25)` }}
            animate={{ boxShadow: [`0 0 10px rgba(${colors.rgb},0.1)`, `0 0 20px rgba(${colors.rgb},0.25)`, `0 0 10px rgba(${colors.rgb},0.1)`] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            <Cpu className="w-4 h-4" style={{ color: colors.text }} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.2em]" style={{ color: colors.text }}>PHASE-X</span>
            <span className="text-[8px] font-bold tracking-[0.15em]" style={{ color: tk.textDim }}>AI CORE ENGINE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative z-10">
          {/* Token badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black"
            style={{ background: `rgba(${colors.rgb},0.08)`, border: `1px solid rgba(${colors.rgb},0.2)`, color: colors.text }}>
            <Zap size={10} /> {aiTokens}
          </div>
          {/* Status dot */}
          <motion.div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: isScanning ? colors.text : signal ? colors.text : tk.textDim, boxShadow: `0 0 6px ${isScanning ? colors.text : 'transparent'}` }}
            animate={{ opacity: isScanning ? [0.4, 1, 0.4] : 1, scale: isScanning ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          {/* Collapse */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            style={{ background: `rgba(${colors.rgb},0.06)`, border: `1px solid rgba(${colors.rgb},0.15)` }}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" style={{ color: colors.text }} /> : <ChevronDown className="w-3.5 h-3.5" style={{ color: colors.text }} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col flex-1 overflow-hidden relative"
          >
            {/* Scan Progress Overlay - covers entire expanded area */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-sm rounded-b-2xl"
                  style={{ background: `radial-gradient(circle, rgba(${colors.rgb},0.05) 0%, rgba(6,10,16,0.95) 70%)` }}
                >
                  {/* Spinning ring */}
                  <div className="relative w-20 h-20 mb-5">
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ border: `2px solid rgba(${colors.rgb},0.15)`, borderTopColor: colors.text }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                    <div className="absolute inset-2 rounded-full flex items-center justify-center"
                      style={{ background: `rgba(${colors.rgb},0.05)` }}>
                      <Cpu className="w-6 h-6" style={{ color: colors.text }} />
                    </div>
                  </div>
                  <div className="w-3/4 h-1 rounded-full overflow-hidden relative" style={{ background: `rgba(${colors.rgb},0.1)` }}>
                    <motion.div 
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${colors.text}, rgba(${colors.rgb},0.5))` }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${Math.min(scanProgress, 100)}%` }}
                      transition={{ ease: "circOut" }}
                    />
                  </div>
                  <span className="text-[10px] mt-2.5 tracking-[0.2em] font-bold" style={{ color: colors.text }}>{txt.extracting} {Math.round(scanProgress)}%</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Body */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">


        {/* Error State */}
        {error && !isScanning && (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}>
              <ShieldAlert className="w-7 h-7" style={{ color: tk.negative }} />
            </div>
            <p className="text-xs font-medium" style={{ color: tk.negative }}>{error}</p>
          </div>
        )}

        {/* Initial / Empty State */}
        {!signal && !isScanning && !error && !tokenError && (
          <div className="text-center py-8">
            <motion.div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center relative"
              style={{ background: `rgba(${colors.rgb},0.06)`, border: `1px solid rgba(${colors.rgb},0.15)` }}
              animate={{ boxShadow: [`0 0 0 rgba(${colors.rgb},0)`, `0 0 30px rgba(${colors.rgb},0.15)`, `0 0 0 rgba(${colors.rgb},0)`] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <Target className="w-8 h-8" style={{ color: colors.text, opacity: 0.5 }} />
            </motion.div>
            <p className="text-[11px] leading-relaxed max-w-[200px] mx-auto font-medium" style={{ color: tk.textMuted }}>
              {txt.initScan}
            </p>
          </div>
        )}

        {/* Token Error State */}
        {tokenError && !isScanning && (
          <div className="text-center py-4 m-1 rounded-xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-black text-amber-400 text-xs mb-1">
              {language === "ar" ? "رصيد التوكن غير كافٍ" : "Insufficient AI Tokens"}
            </h3>
            <p className="text-[10px] text-gray-500 px-3 leading-relaxed">
              {language === "ar" ? "يرجى شحن رصيدك من صفحة الملف الشخصي." : "Please top up your tokens in the user profile."}
            </p>
          </div>
        )}

        {/* Result State */}
        {signal && !isScanning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-3"
          >
            {/* The Huge Signal */}
            <div className="text-center py-3 relative rounded-xl overflow-hidden"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
              {/* Grid bg inside signal */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(${colors.rgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${colors.rgb},0.04) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }} />
              
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full z-10 backdrop-blur-md"
                style={{ background: tk.isDark ? 'rgba(6,10,16,0.9)' : 'rgba(255,255,255,0.9)', border: `1px solid ${colors.border}`, boxShadow: tk.isDark ? 'none' : `0 2px 8px rgba(0,0,0,0.08)` }}>
                <span className="text-[8px] tracking-[0.15em] font-bold" style={{ color: colors.text }}>{txt.focus}</span>
                <span className="text-[8px] font-black tracking-widest px-1.5 rounded" style={{ background: `rgba(${colors.rgb},0.15)`, color: colors.text }}>
                  {indicatorName || 'PHASE X'}
                </span>
                <span className="text-[8px] font-black tracking-widest px-1.5 rounded" style={{ background: `rgba(${colors.rgb},0.1)`, color: colors.text }}>
                  {signal.timeframeString}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-2.5 mt-4 relative z-10">
                {signal.action === 'BUY' && <TrendingUp className="w-5 h-5" style={{ color: colors.text }} />}
                {signal.action === 'SELL' && <TrendingDown className="w-5 h-5" style={{ color: colors.text }} />}
                {signal.action === 'HOLD' && <Minus className="w-5 h-5" style={{ color: colors.text }} />}
                <motion.h1 
                  className="text-3xl font-black tracking-[0.3em]"
                  style={{ color: colors.text, textShadow: `0 0 20px rgba(${colors.rgb},0.4)` }}
                  animate={{ textShadow: [`0 0 15px rgba(${colors.rgb},0.3)`, `0 0 30px rgba(${colors.rgb},0.5)`, `0 0 15px rgba(${colors.rgb},0.3)`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {signal.action}
                </motion.h1>
              </div>
              <div className="mt-1 text-[9px] tracking-[0.15em] font-bold relative z-10" style={{ color: tk.textDim }}>
                CONFIDENCE · <strong style={{ color: colors.text }}>{signal.confidence}%</strong>
              </div>
            </div>

            {/* Targets Section */}
            {(signal.targets?.entry || signal.targets?.tp1 || signal.targets?.sl) && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {signal.targets.entry && (
                    <div className="p-2.5 rounded-xl" style={{ background: `rgba(${colors.rgb},0.04)`, border: `1px solid rgba(${colors.rgb},0.1)` }}>
                      <div className="text-[8px] tracking-[0.15em] font-bold mb-1" style={{ color: tk.textDim }}>{txt.entryProtocol}</div>
                      <div className="text-xs font-black truncate" style={{ color: tk.textBright }}>{signal.targets.entry}</div>
                    </div>
                  )}
                  {signal.targets.tp1 && (
                    <div className="p-2.5 rounded-xl" style={{ background: tk.positiveBg, border: `1px solid ${tk.positiveBorder}` }}>
                      <div className="text-[8px] tracking-[0.15em] font-bold mb-1" style={{ color: tk.textDim }}>{txt.targetPrimary}</div>
                      <div className="text-xs font-black truncate" style={{ color: tk.positive }}>{signal.targets.tp1}</div>
                    </div>
                  )}
                </div>
                {signal.targets.sl && (
                  <div className="p-2.5 rounded-xl" style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[8px] tracking-[0.15em] font-bold" style={{ color: tk.textDim }}>{txt.abortLevel}</div>
                      <ShieldAlert className="w-3 h-3" style={{ color: tk.negative, opacity: 0.4 }} />
                    </div>
                    <div className="text-xs font-black" style={{ color: tk.negative }}>{signal.targets?.sl || 'N/A'}</div>
                  </div>
                )}
              </div>
            )}

            {/* Metrics Section */}
            {signal.metrics && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl" style={{ background: tk.infoBg, border: `1px solid ${tk.info}1a` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Activity className="w-3 h-3" style={{ color: tk.info }} />
                      <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>{txt.volatility}</span>
                    </div>
                    <div className="text-[11px] font-black" style={{ color: tk.textBright }}>{signal.metrics.volatility}</div>
                  </div>
                  
                  <div className="p-2.5 rounded-xl" style={{ background: tk.warningBg, border: `1px solid ${tk.warning}1a` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Zap className="w-3 h-3" style={{ color: tk.warning }} />
                      <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>{txt.trendStrength}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[11px] font-black" style={{ color: tk.textBright }}>{signal.metrics.trendStrength}%</div>
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: tk.warningBg }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${tk.warning}, ${tk.warning})`, width: `${Math.min(100, Math.max(0, signal.metrics.trendStrength))}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(0, signal.metrics.trendStrength))}%` }}
                          transition={{ duration: 1, delay: 0.3 }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl" style={{ background: tk.positiveBg, border: `1px solid ${tk.positiveBorder}` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BarChart2 className="w-3 h-3" style={{ color: tk.positive }} />
                      <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>{txt.support}</span>
                    </div>
                    <div className="text-[11px] font-black" style={{ color: tk.positive }}>{signal.metrics.support}</div>
                  </div>

                  <div className="p-2.5 rounded-xl" style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BarChart2 className="w-3 h-3" style={{ color: tk.negative }} />
                      <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>{txt.resistance}</span>
                    </div>
                    <div className="text-[11px] font-black" style={{ color: tk.negative }}>{signal.metrics.resistance}</div>
                  </div>
                </div>

                {/* New metrics row */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Momentum Score */}
                  <div className="p-2.5 rounded-xl" style={{ background: (signal.metrics.momentumScore ?? 0) >= 0 ? tk.positiveBg : tk.negativeBg, border: `1px solid ${(signal.metrics.momentumScore ?? 0) >= 0 ? tk.positiveBorder : tk.negativeBorder}` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Gauge className="w-3 h-3" style={{ color: (signal.metrics.momentumScore ?? 0) >= 0 ? tk.positive : tk.negative }} />
                      <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>MOMENTUM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[11px] font-black" style={{ color: (signal.metrics.momentumScore ?? 0) >= 0 ? tk.positive : tk.negative }}>{signal.metrics.momentumScore ?? 0}</div>
                      <div className="flex-1 h-1 rounded-full overflow-hidden relative" style={{ background: tk.surfaceHover }}>
                        <motion.div className="absolute h-full rounded-full"
                          style={{
                            background: (signal.metrics.momentumScore ?? 0) >= 0 ? tk.positive : tk.negative,
                            width: `${Math.abs(signal.metrics.momentumScore ?? 0) / 2}%`,
                            left: (signal.metrics.momentumScore ?? 0) >= 0 ? '50%' : `${50 - Math.abs(signal.metrics.momentumScore ?? 0) / 2}%`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.abs(signal.metrics.momentumScore ?? 0) / 2}%` }}
                          transition={{ duration: 1, delay: 0.5 }} />
                        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: tk.textDim }} />
                      </div>
                    </div>
                  </div>

                  {/* Market Sentiment */}
                  <div className="p-2.5 rounded-xl" style={{ background: signal.metrics.marketSentiment === 'Bullish' ? tk.positiveBg : signal.metrics.marketSentiment === 'Bearish' ? tk.negativeBg : tk.warningBg, border: `1px solid ${signal.metrics.marketSentiment === 'Bullish' ? tk.positiveBorder : signal.metrics.marketSentiment === 'Bearish' ? tk.negativeBorder : tk.warning + '2d'}` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3 h-3" style={{ color: signal.metrics.marketSentiment === 'Bullish' ? tk.positive : signal.metrics.marketSentiment === 'Bearish' ? tk.negative : tk.warning }} />
                      <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>SENTIMENT</span>
                    </div>
                    <div className="text-[11px] font-black" style={{ color: signal.metrics.marketSentiment === 'Bullish' ? tk.positive : signal.metrics.marketSentiment === 'Bearish' ? tk.negative : tk.warning }}>{signal.metrics.marketSentiment}</div>
                  </div>

                  {/* Timeframe Alignment */}
                  <div className="p-2.5 rounded-xl" style={{ background: signal.metrics.timeframeAlignment === 'Aligned' ? tk.positiveBg : signal.metrics.timeframeAlignment === 'Conflicting' ? tk.negativeBg : tk.warningBg, border: `1px solid ${signal.metrics.timeframeAlignment === 'Aligned' ? tk.positiveBorder : signal.metrics.timeframeAlignment === 'Conflicting' ? tk.negativeBorder : tk.warning + '2d'}` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Layers className="w-3 h-3" style={{ color: signal.metrics.timeframeAlignment === 'Aligned' ? tk.positive : signal.metrics.timeframeAlignment === 'Conflicting' ? tk.negative : tk.warning }} />
                      <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>TF ALIGN</span>
                    </div>
                    <div className="text-[11px] font-black" style={{ color: signal.metrics.timeframeAlignment === 'Aligned' ? tk.positive : signal.metrics.timeframeAlignment === 'Conflicting' ? tk.negative : tk.warning }}>{signal.metrics.timeframeAlignment}</div>
                  </div>

                  {/* Risk/Reward */}
                  <div className="p-2.5 rounded-xl" style={{ background: tk.accentGlow08, border: `1px solid ${tk.accentGlow15}` }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Target className="w-3 h-3" style={{ color: tk.accent }} />
                      <span className="text-[8px] font-bold tracking-[0.1em]" style={{ color: tk.textDim }}>R:R RATIO</span>
                    </div>
                    <div className="text-[11px] font-black" style={{ color: tk.accent }}>{signal.metrics.riskRewardRatio || 'N/A'}</div>
                  </div>
                </div>
              </>
            )}

            {/* AI Reasoning */}
            <div className="rounded-xl p-3.5 relative overflow-hidden" style={{ background: `rgba(${colors.rgb},0.03)`, border: `1px solid rgba(${colors.rgb},0.1)` }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: colors.text }} />
                <span className="text-[9px] font-black tracking-[0.2em]" style={{ color: colors.text }}>{txt.aiLogic}</span>
              </div>
              <p className="text-[11px] leading-relaxed font-sans" style={{ color: tk.textSecondary }} dir={isRTL ? "rtl" : "ltr"}>
                {signal.reasoning}
              </p>
            </div>

            {/* Risk Warnings */}
            {signal.risks && (
              <div className="rounded-xl p-3.5" style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" style={{ color: tk.negative }} />
                  <span className="text-[9px] font-black tracking-[0.2em]" style={{ color: tk.negative, opacity: 0.8 }}>{txt.riskVectors}</span>
                </div>
                <p className="text-[11px] leading-relaxed font-sans" style={{ color: tk.textMuted }} dir={isRTL ? "rtl" : "ltr"}>
                  {signal.risks}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-3 flex gap-2" style={{ borderTop: `1px solid rgba(${colors.rgb},0.08)` }}>
        <motion.button
          onClick={handleScan}
          disabled={isScanning}
          whileHover={!isScanning ? { scale: 1.02, boxShadow: `0 8px 30px rgba(${colors.rgb},0.25)` } : {}}
          whileTap={!isScanning ? { scale: 0.98 } : {}}
          className="flex-1 relative group overflow-hidden rounded-xl py-2.5 transition-all outline-none cursor-pointer"
          style={{ 
            background: isScanning ? 'rgba(30,41,59,0.3)' : `linear-gradient(135deg, rgba(${colors.rgb},0.15), rgba(${colors.rgb},0.05))`,
            border: `1px solid ${isScanning ? 'rgba(51,65,85,0.3)' : `rgba(${colors.rgb},0.25)`}`,
            boxShadow: isScanning ? 'none' : `0 4px 20px rgba(${colors.rgb},0.1)`
          }}
        >
          {!isScanning && (
            <motion.div 
              className="absolute inset-0 rounded-xl"
              style={{ background: `linear-gradient(90deg, transparent, rgba(${colors.rgb},0.1), transparent)` }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          )}

          <div className="relative z-10 flex items-center justify-center gap-2">
            <Crosshair className="w-4 h-4" style={{ color: isScanning ? '#475569' : colors.text }} />
            <span className="text-[10px] font-black tracking-[0.2em]" style={{ color: isScanning ? '#475569' : colors.text }}>
              {isScanning ? txt.scanningBtn : (signal ? txt.rescanBtn : txt.executeBtn)}
            </span>
          </div>
        </motion.button>

        {signal && !isScanning && (
          <motion.button
            onClick={resetSignal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 rounded-xl py-2.5 flex items-center justify-center cursor-pointer"
            style={{ background: tk.negativeBg, border: `1px solid ${tk.negativeBorder}` }}
            title="Reset Scan"
          >
            <ShieldAlert className="w-4 h-4" style={{ color: tk.negative, opacity: 0.6 }} />
          </motion.button>
        )}
      </div>

      {/* Execute AI Trade Button */}
      {signal && !isScanning && signal.action !== 'HOLD' && onExecuteTrade && (
      <div className="px-3 pb-3 space-y-2">
          {/* Lot Size Input */}
          <div className="flex items-center gap-2">
            <label className="text-[8px] font-black tracking-[0.15em] uppercase whitespace-nowrap" style={{ color: tk.textDim }}>LOT</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="100"
              value={aiLot}
              onChange={(e) => setAiLot(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg text-[12px] font-black text-center outline-none"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#fbbf24',
                width: '60px',
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 8px 30px rgba(${colors.rgb},0.3)` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const slVal = signal.targets?.sl ? parseFloat(String(signal.targets.sl)) : undefined;
              const tpVal = signal.targets?.tp1 ? parseFloat(String(signal.targets.tp1)) : undefined;
              const lotVal = parseFloat(aiLot) || 0.1;
              onExecuteTrade(signal.action, isNaN(slVal!) ? undefined : slVal, isNaN(tpVal!) ? undefined : tpVal, lotVal);
            }}
            className="w-full py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer"
            style={{
              background: signal.action === 'BUY' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${signal.action === 'BUY' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: signal.action === 'BUY' ? '#34d399' : '#f87171',
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            Execute {signal.action}
            {signal.targets?.sl && <span className="opacity-60">SL:{signal.targets.sl}</span>}
            {signal.targets?.tp1 && <span className="opacity-60">TP:{signal.targets.tp1}</span>}
          </motion.button>
        </div>
      )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom branding */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-[7px] tracking-[0.3em] uppercase font-semibold" style={{ color: `rgba(${colors.rgb},0.15)` }}>
          PHASE-X · CORE
        </span>
      </div>
    </div>
  );
}
