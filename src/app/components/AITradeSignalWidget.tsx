import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAITradeSignal } from '../hooks/useAITradeSignal';
import { Target, Crosshair, TrendingUp, TrendingDown, ShieldAlert, Cpu, Activity, Minus, Zap, BarChart2, ChevronUp, ChevronDown, Coins } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface AITradeSignalWidgetProps {
  marketContext: string;
  assetSymbol?: string;
  timeframe: number;
  mtfEnabled: boolean;
  mtfSmallTimeframe: number;
  mtfLargeTimeframe: number;
  indicatorName?: string;
}
export function AITradeSignalWidget({ marketContext, assetSymbol, timeframe, mtfEnabled, mtfSmallTimeframe, mtfLargeTimeframe, indicatorName }: AITradeSignalWidgetProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
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

  // Fake progress bar for the "Scanning" sci-fi effect
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

  // Theming colors based on signal Action
  const getSignalColors = () => {
    if (!signal) return { bg: 'rgba(30, 41, 59, 0.4)', border: 'rgba(51, 65, 85, 0.5)', text: '#94a3b8', glow: 'transparent' };
    
    switch (signal.action) {
      case 'BUY':
        return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.4)', text: '#34d399', glow: '0 0 20px rgba(16, 185, 129, 0.2)' };
      case 'SELL':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.4)', text: '#f87171', glow: '0 0 20px rgba(239, 68, 68, 0.2)' };
      case 'HOLD':
        return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24', glow: '0 0 20px rgba(245, 158, 11, 0.2)' };
      default:
        return { bg: 'rgba(30, 41, 59, 0.4)', border: 'rgba(51, 65, 85, 0.5)', text: '#94a3b8', glow: 'transparent' };
    }
  };

  const colors = getSignalColors();

  return (
    <div 
      className="rounded-2xl overflow-hidden relative flex flex-col font-mono flex-shrink-0"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.glow,
        transition: 'all 0.5s ease'
      }}
    >
      {/* Sci-Fi Decorative Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-900/40 relative overflow-hidden">
        {/* Animated Scan Line Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent w-1/2"
          animate={{ x: ['-200%', '300%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex items-center gap-2 relative z-10">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-cyan-100 hidden sm:inline-block">PHASE-X CORE</span>
          <span className="ml-2 text-[10px] bg-cyan-900/40 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/50 flex items-center gap-1 font-bold">
             <Zap size={10} /> {aiTokens}
          </span>
        </div>
        
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-[10px] text-slate-400 tracking-wider font-bold">
            {isScanning ? txt.analyzing : signal ? txt.systemReady : txt.standby}
          </span>
          <motion.div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: isScanning ? '#06b6d4' : signal ? colors.text : '#475569' }}
            animate={{ opacity: isScanning ? [0.4, 1, 0.4] : 1 }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 w-6 h-6 flex items-center justify-center rounded-md bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/50"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
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
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Main Body */}
            <div className="p-4 flex-1 relative overflow-y-auto max-h-[60vh] custom-scrollbar">

        {/* Scan Progress Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm"
            >
              <Activity className="w-8 h-8 text-cyan-400 mb-4 animate-pulse" />
              <div className="w-3/4 h-1 bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-cyan-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(scanProgress, 100)}%` }}
                  transition={{ ease: "circOut" }}
                />
              </div>
              <span className="text-[10px] text-cyan-400 mt-2 tracking-widest">{txt.extracting} {Math.round(scanProgress)}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && !isScanning && (
          <div className="text-center py-6 text-red-400">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">{error}</p>
          </div>
        )}

        {/* Initial / Empty State */}
        {!signal && !isScanning && !error && !tokenError && (
          <div className="text-center py-8">
            <Target className="w-10 h-10 mx-auto text-slate-600 mb-3 opacity-50" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
              {txt.initScan}
            </p>
          </div>
        )}

        {/* Token Error State */}
        {tokenError && !isScanning && (
          <div className="text-center py-6 text-amber-500 bg-amber-500/10 rounded-xl border border-amber-500/20 m-4 p-4">
            <Coins className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <h3 className="font-bold mb-1">
              {language === "ar" ? "رصيد التوكن غير كافٍ" : language === "fr" ? "Jetons IA insuffisants" : language === "es" ? "Tokens de IA insuficientes" : language === "ru" ? "Недостаточно ИИ токенов" : language === "tr" ? "Yetersiz YZ Jetonu" : "Insufficient AI Tokens"}
            </h3>
            <p className="text-xs opacity-80">
              {language === "ar" ? "يرجى شحن رصيدك من صفحة الملف الشخصي لإجراء مسوحات الذكاء الاصطناعي." : language === "fr" ? "Veuillez recharger vos jetons dans le profil utilisateur pour lancer des analyses IA." : language === "es" ? "Por favor recarga tus tokens en el perfil de usuario para ejecutar escaneos de IA." : language === "ru" ? "Пожалуйста, пополните свои токены в профиле пользователя для запуска ИИ-сканирований." : language === "tr" ? "YZ taramalarını çalıştırmak için lütfen kullanıcı profilinizden jeton yükleyin." : "Please top up your tokens in the user profile to run AI scans."}
            </p>
          </div>
        )}

        {/* Result State */}
        {signal && !isScanning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4"
          >
            {/* The Huge Signal Text */}
            <div className="text-center py-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900 px-3 py-0.5 rounded-full border border-slate-800 shadow-md whitespace-nowrap">
                <span className="text-[10px] text-slate-400 tracking-widest font-bold">{txt.focus}</span>
                <span className="text-[10px] text-purple-400 font-bold tracking-widest bg-purple-900/40 px-1.5 rounded-md border border-purple-800/50">
                  {indicatorName || 'PHASE X'}
                </span>
                <span className="text-[10px] text-cyan-400 font-black tracking-widest bg-cyan-900/40 px-1.5 rounded-md border border-cyan-800/50">
                  {signal.timeframeString}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-3 mt-3">
                {signal.action === 'BUY' && <TrendingUp className="w-6 h-6" style={{ color: colors.text }} />}
                {signal.action === 'SELL' && <TrendingDown className="w-6 h-6" style={{ color: colors.text }} />}
                {signal.action === 'HOLD' && <Minus className="w-6 h-6" style={{ color: colors.text }} />}
                <h1 
                  className="text-4xl font-black tracking-widest"
                  style={{ color: colors.text, textShadow: `0 0 15px ${colors.glow}` }}
                >
                  {signal.action}
                </h1>
              </div>
              <div className="mt-1 text-[10px] text-slate-500 tracking-wider">
                CONFIDENCE RATIO: <strong style={{ color: colors.text }}>{signal.confidence}%</strong>
              </div>
            </div>

            {/* Targets Section */}
            {(signal.targets?.entry || signal.targets?.tp1 || signal.targets?.sl) && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {signal.targets.entry && (
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                    <div className="text-[9px] text-slate-400">{txt.entryProtocol}</div>
                    <div className="text-xs font-bold text-white truncate">{signal.targets.entry}</div>
                  </div>
                )}
                {signal.targets.tp1 && (
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-emerald-900/30">
                    <div className="text-[9px] text-slate-400">{txt.targetPrimary}</div>
                    <div className="text-xs font-bold text-emerald-400 truncate">{signal.targets.tp1}</div>
                  </div>
                )}
                {signal.targets.sl && (
                  <div className="flex flex-col gap-2 mt-2 col-span-2">
                    <div className="flex gap-3">
                      <div className="flex-1 bg-slate-900/50 rounded-lg p-3 border" style={{ borderColor: colors?.border || 'rgba(51, 65, 85, 0.5)' }}>
                        <div className="text-[9px] text-slate-400 mb-1">{txt.entryProtocol}</div>
                        <div className="text-sm font-bold text-slate-200">{signal.targets?.entry || 'Market'}</div>
                      </div>
                      <div className="flex-1 bg-slate-900/50 rounded-lg p-3 border" style={{ borderColor: colors?.border || 'rgba(51, 65, 85, 0.5)' }}>
                        <div className="text-[9px] text-slate-400 mb-1">{txt.targetPrimary}</div>
                        <div className="text-sm font-bold text-emerald-400">{signal.targets?.tp1 || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-3 border" style={{ borderColor: colors?.border || 'rgba(51, 65, 85, 0.5)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[9px] text-slate-400">{txt.abortLevel}</div>
                        <ShieldAlert className="w-3 h-3 text-red-500/50" />
                      </div>
                      <div className="text-sm font-bold text-red-400">{signal.targets?.sl || 'N/A'}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Metrics Section */}
            {signal.metrics && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/30 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[9px] font-bold tracking-widest text-slate-300">{txt.volatility}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200">{signal.metrics.volatility}</div>
                </div>
                
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/30 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[9px] font-bold tracking-widest text-slate-300">{txt.trendStrength}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-bold text-slate-200">{signal.metrics.trendStrength}%</div>
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, Math.max(0, signal.metrics.trendStrength))}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/30 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[9px] font-bold tracking-widest text-slate-300">{txt.support}</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-400/90">{signal.metrics.support}</div>
                </div>

                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/30 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                    <BarChart2 className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[9px] font-bold tracking-widest text-slate-300">{txt.resistance}</span>
                  </div>
                  <div className="text-xs font-bold text-rose-400/90">{signal.metrics.resistance}</div>
                </div>
              </div>
            )}

            {/* AI Reasoning */}
            <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-[10px] font-bold tracking-widest text-cyan-500/80">{txt.aiLogic}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans" dir={isRTL ? "rtl" : "ltr"}>
                {signal.reasoning}
              </p>
            </div>

            {/* Risk Warnings */}
            {signal.risks && (
              <div className="bg-red-900/10 rounded-lg p-4 border border-red-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[10px] font-bold tracking-widest text-red-400/80">{txt.riskVectors}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans" dir={isRTL ? "rtl" : "ltr"}>
                  {signal.risks}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex gap-2">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex-1 relative group overflow-hidden rounded-lg py-2.5 transition-all outline-none"
          style={{ 
            background: isScanning ? 'rgba(51, 65, 85, 0.5)' : 'linear-gradient(90deg, #0f172a, #1e293b, #0f172a)',
            border: `1px solid ${isScanning ? '#334155' : '#06b6d4'}`
          }}
        >
          {/* Hover glow effect for button */}
          {!isScanning && (
            <motion.div 
              className="absolute inset-0 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
            />
          )}

          <div className="relative z-10 flex items-center justify-center gap-2">
            <Crosshair className={`w-4 h-4 ${isScanning ? 'text-slate-500' : 'text-cyan-400'}`} />
            <span className={`text-xs font-bold tracking-widest ${isScanning ? 'text-slate-500' : 'text-cyan-100'}`}>
              {isScanning ? txt.scanningBtn : (signal ? txt.rescanBtn : txt.executeBtn)}
            </span>
          </div>
        </button>

        {/* Reset / Cancel Button */}
        {signal && !isScanning && (
          <button
            onClick={resetSignal}
            className="w-10 relative group overflow-hidden rounded-lg py-2.5 transition-all outline-none flex items-center justify-center"
            style={{ 
              background: 'rgba(51, 65, 85, 0.3)',
              border: `1px solid #334155`
            }}
            title="Reset Scan"
          >
            <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
          </button>
        )}
      </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
