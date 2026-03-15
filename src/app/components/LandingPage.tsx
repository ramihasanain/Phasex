import { useState, useMemo, useRef, useEffect } from "react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, Activity, TrendingUp, Shield, Zap, Globe, Cpu, ChevronRight, Menu, X, Play, Clock, BarChart2,
  Lock, RefreshCw, Server, Send, LayoutTemplate, Smartphone, Languages, ChevronDown,
  Gauge, Move, Target, Navigation, Users, BarChart3, Sparkles, ChevronLeft, Linkedin, Twitter, Mail,
  Briefcase, Brain, Eye, LineChart, Ban, BellOff, HeartOff, Layers
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import screenshot1 from "../../assets/screenshot1.png";
import screenshot2 from "../../assets/screenshot2.png";
import screenshot3 from "../../assets/screenshot3.png";
import screenshot4 from "../../assets/screenshot4.png";
import screenshot5 from "../../assets/screenshot5.png";
import screenshot6 from "../../assets/screenshot6.png";
import screenshot7 from "../../assets/screenshot7.png";
import { TermsModal, TermsButton, CookiePolicyModal, CookieButton, LegalDisclaimerModal, LegalDisclaimerButton, ManifestoModal, ManifestoButton, PrivacyPolicyModal, PrivacyPolicyButton, RiskDisclosureModal, RiskDisclosureButton } from "./TermsAndConditions";
import { BreakingNews } from "./BreakingNews";

interface LandingPageProps {
  onGetStarted: () => void;
  onRegister: () => void;
  onOpenDynamics: () => void;
}

export function LandingPage({ onGetStarted, onRegister, onOpenDynamics }: LandingPageProps) {
  const { language, setLanguageKey, t } = useLanguage();
  const isRTL = language === "ar";
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const [expandedState, setExpandedState] = useState<number | null>(null);
  const [flippedBroker, setFlippedBroker] = useState<number | null>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languageOptions = [
    { code: "ar", label: "العربية", flagUrl: "sa" },
    { code: "en", label: "English", flagUrl: "gb" },
    { code: "ru", label: "Русский", flagUrl: "ru" },
    { code: "tr", label: "Türkçe", flagUrl: "tr" },
    { code: "fr", label: "Français", flagUrl: "fr" },
    { code: "es", label: "Español", flagUrl: "es" }
  ];

  const currentLangObj = languageOptions.find(l => l.code === language) || languageOptions[1];

  const accent = "#00e5a0";
  const accentG = "rgba(0,229,160,";

  const navLinks = [
    { label: t("home") || (isRTL ? "الرئيسية" : "Home"), href: "#home" },
    { label: t("whatIsPhaseX") || (isRTL ? "ما هو PHASE X" : "What is PHASE X"), href: "#what-is" },
    { label: t("states") || (isRTL ? "المؤشرات" : "States"), href: "#states" },
    { label: t("access") || (isRTL ? "الوصول" : "Access"), href: "#access" },
    { label: t("structuralDynamics") || (isRTL ? "التحليل الهيكلي" : "Structural Dynamics"), href: "#dynamics", action: onOpenDynamics },
  ];

  const screenshots = [
    { url: screenshot1, title: isRTL ? "لوحة التحكم الرئيسية" : "Main Dashboard", description: isRTL ? "واجهة احترافية لعرض جميع الأسواق والمؤشرات" : "Professional interface displaying all markets and indicators" },
    { url: screenshot2, title: isRTL ? "المؤشرات الفنية" : "Technical Indicators", description: isRTL ? "5 مؤشرات فنية حصرية ومتطورة" : "5 exclusive and advanced technical indicators" },
    { url: screenshot3, title: isRTL ? "تحليل متعدد الأطر الزمنية" : "Multi-Timeframe Analysis", description: isRTL ? "رؤية شاملة للسوق عبر فريمات مختلفة" : "Comprehensive market view across different timeframes" },
    { url: screenshot4, title: isRTL ? "أسواق متعددة" : "Multiple Markets", description: isRTL ? "FOREX, CRYPTO, INDEX, COMMODITY" : "FOREX, CRYPTO, INDEX, COMMODITY" },
    { url: screenshot5, title: isRTL ? "تحليل الذكاء الاصطناعي" : "AI Analysis", description: isRTL ? "تحليل ذكي للسوق باستخدام الذكاء الاصطناعي" : "Smart market analysis powered by AI" },
    { url: screenshot6, title: isRTL ? "أدوات التداول" : "Trading Tools", description: isRTL ? "أدوات تداول متقدمة لتحليل دقيق" : "Advanced trading tools for precise analysis" },
    { url: screenshot7, title: isRTL ? "إدارة المحفظة" : "Portfolio Management", description: isRTL ? "إدارة وتتبع محفظتك بسهولة" : "Easily manage and track your portfolio" },
  ];

  const stateColors = ["#a855f7", "#448aff", "#00e676", "#ff9100", "#ff1744", "#00bcd4"];
  const states = [
    { icon: Gauge, name: t("statePhaseName"), nameAr: t("statePhaseNameAr"), question: t("statePhaseQuestion"), description: t("statePhaseDesc"), color: stateColors[0] },
    { icon: Move, name: t("stateDisplacementName"), nameAr: t("stateDisplacementNameAr"), question: t("stateDisplacementQuestion"), description: t("stateDisplacementDesc"), color: stateColors[1] },
    { icon: Target, name: t("stateReferenceName"), nameAr: t("stateReferenceNameAr"), question: t("stateReferenceQuestion"), description: t("stateReferenceDesc"), color: stateColors[2] },
    { icon: Activity, name: t("stateOscillationName"), nameAr: t("stateOscillationNameAr"), question: t("stateOscillationQuestion"), description: t("stateOscillationDesc"), color: stateColors[3] },
    { icon: Navigation, name: t("stateDirectionName"), nameAr: t("stateDirectionNameAr"), question: t("stateDirectionQuestion"), description: t("stateDirectionDesc"), color: stateColors[4] },
    { icon: Layers, name: t("stateEnvelopeName"), nameAr: t("stateEnvelopeNameAr"), question: t("stateEnvelopeQuestion"), description: t("stateEnvelopeDesc"), color: stateColors[5] },
  ];

  // Starfield - distant twinkling stars
  const stars = useMemo(() => Array.from({ length: 120 }).map((_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.6 + 0.2,
    twinkle: 2 + Math.random() * 5, delay: Math.random() * 4,
  })), []);

  // Warp speed streaks - horizontal light trails
  const warpStreaks = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i, y: Math.random() * 100, width: 100 + Math.random() * 300,
    height: 0.5 + Math.random() * 1.5, duration: 1 + Math.random() * 2,
    delay: Math.random() * 5, color: i % 3 === 0 ? accent : i % 3 === 1 ? "#448aff" : "#a855f7",
  })), []);

  // Comets - bright streaking objects with tails
  const comets = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    id: i, startY: 10 + Math.random() * 80,
    duration: 2 + Math.random() * 3, delay: i * 2.5 + Math.random() * 2,
    size: 3 + Math.random() * 4, tailLen: 80 + Math.random() * 120,
    color: [accent, "#448aff", "#a855f7", "#00e5ff", "#ffc400", "#ff6e40"][i],
  })), []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }
  };

  const SectionTitle = ({ children, sub, color = accent }: { children: React.ReactNode; sub?: string; color?: string }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{children}</h2>
      {sub && <p className="text-xl md:text-2xl font-light" style={{ color }}>{sub}</p>}
      <motion.div className="h-[2px] w-20 mx-auto mt-5" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        animate={{ width: ["80px", "160px", "80px"] }} transition={{ duration: 3, repeat: Infinity }} />
    </motion.div>
  );

  const GlassCard = ({ children, className = "", glow }: { children: React.ReactNode; className?: string; glow?: string }) => (
    <div className={`rounded-2xl relative overflow-hidden ${className}`} style={{
      background: "linear-gradient(160deg, rgba(14,20,33,0.9) 0%, rgba(8,12,22,0.95) 100%)",
      border: `1px solid ${glow || accent}18`,
      boxShadow: `0 15px 50px rgba(0,0,0,0.3), 0 0 30px ${glow || accent}06`,
    }}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"} style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ═══ SPACE BACKGROUND ═══ */}
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map(s => (
          <motion.div key={s.id} className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: s.twinkle, repeat: Infinity, delay: s.delay, ease: "easeInOut" }} />
        ))}
      </div>

      {/* Warp Speed Streaks */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {warpStreaks.map(s => (
          <motion.div key={s.id} className="absolute rounded-full"
            style={{
              top: `${s.y}%`, width: s.width, height: s.height,
              background: `linear-gradient(90deg, transparent, ${s.color}60, ${s.color}, ${s.color}60, transparent)`,
              boxShadow: `0 0 8px ${s.color}40`,
            }}
            animate={{ left: ["-20%", "120%"] }}
            transition={{ duration: s.duration, repeat: Infinity, ease: "linear", delay: s.delay }} />
        ))}
      </div>

      {/* Comets with tails */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {comets.map(c => (
          <motion.div key={c.id} className="absolute" style={{ top: `${c.startY}%` }}
            animate={{ left: ["-10%", "115%"] }}
            transition={{ duration: c.duration, repeat: Infinity, ease: "easeIn", delay: c.delay }}>
            {/* Tail */}
            <div className="absolute top-1/2 -translate-y-1/2" style={{
              right: c.size / 2, width: c.tailLen, height: c.size * 0.6,
              background: `linear-gradient(90deg, transparent 0%, ${c.color}10 30%, ${c.color}50 70%, ${c.color} 100%)`,
              borderRadius: "50% 0 0 50%", filter: `blur(1px)`,
            }} />
            {/* Head */}
            <div className="rounded-full relative" style={{
              width: c.size, height: c.size, backgroundColor: "#fff",
              boxShadow: `0 0 ${c.size * 3}px ${c.color}, 0 0 ${c.size * 6}px ${c.color}80, 0 0 ${c.size * 10}px ${c.color}30`,
            }} />
          </motion.div>
        ))}
      </div>

      {/* Space depth vignette */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(6,10,16,0.4) 70%, rgba(6,10,16,0.8) 100%)",
      }} />

      {/* Subtle nebula glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div className="absolute w-[800px] h-[800px] rounded-full" style={{ top: "-20%", left: "-15%", background: `radial-gradient(circle, ${accentG}0.04) 0%, transparent 60%)`, filter: "blur(100px)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute w-[600px] h-[600px] rounded-full" style={{ bottom: "-10%", right: "-10%", background: "radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 60%)", filter: "blur(80px)" }}
          animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 12, repeat: Infinity }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: "50%", left: "60%", background: "radial-gradient(circle, rgba(68,138,255,0.025) 0%, transparent 60%)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }} />
      </div>

      {/* ═══════════ HEADER ═══════════ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(6,10,16,0.85)", borderBottom: `1px solid ${accentG}0.08)` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <Logo size="sm" animated={true} />
            </motion.div>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link, i) => {
                const isSpecial = !!(link as any).action;
                return isSpecial ? (
                  <motion.a key={i} href={link.href}
                    onClick={(e) => { e.preventDefault(); (link as any).action(); }}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="text-sm font-bold relative group cursor-pointer flex items-center gap-1.5"
                    style={{ color: accent }}
                  >
                    <motion.span
                      animate={{ textShadow: [`0 0 8px ${accentG}0.3)`, `0 0 20px ${accentG}0.6)`, `0 0 8px ${accentG}0.3)`] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {link.label}
                    </motion.span>
                    <motion.span
                      className="text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-md"
                      style={{
                        background: `${accentG}0.15)`,
                        border: `1px solid ${accentG}0.3)`,
                        color: accent,
                        boxShadow: `0 0 10px ${accentG}0.2)`,
                      }}
                      animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ✦
                    </motion.span>
                    <motion.span className="absolute -bottom-1 left-0 h-[2px] rounded-full"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                      animate={{ width: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
                      transition={{ duration: 3, repeat: Infinity }} />
                  </motion.a>
                ) : (
                  <motion.a key={i} href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group cursor-pointer">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] group-hover:w-full transition-all" style={{ background: accent }} />
                  </motion.a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Language Dropdown */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                <motion.button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/5 hover:border-white/10"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <img src={`https://flagcdn.com/${currentLangObj.flagUrl}.svg`} alt={currentLangObj.code} className="w-5 h-auto rounded-sm object-cover" />
                  <span className="hidden lg:inline-block">{currentLangObj.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${langDropdownOpen ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {langDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 w-40 rounded-xl shadow-2xl border border-white/10 overflow-hidden"
                      style={{ background: "rgba(10,14,23,0.95)", backdropFilter: "blur(12px)", right: isRTL ? 'auto' : 0, left: isRTL ? 0 : 'auto' }}
                    >
                      <div className="py-1 flex flex-col">
                        {languageOptions.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguageKey(lang.code as any);
                              setLangDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${language === lang.code
                                ? "bg-white/10 text-white font-bold"
                                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                              }`}
                          >
                            <img src={`https://flagcdn.com/${lang.flagUrl}.svg`} alt={lang.code} className="w-5 h-auto rounded-sm object-cover" />
                            <span>{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button onClick={onGetStarted} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="hidden md:flex px-5 py-2 rounded-lg text-sm font-bold tracking-wider cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, color: "#060a10" }}>
                {t("loginBtn")}
              </motion.button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden">
                <div className="py-3 space-y-1">
                  {navLinks.map((link, i) => {
                    const isSpecial = !!(link as any).action;
                    return (
                      <a key={i} href={link.href}
                        onClick={(e) => { e.preventDefault(); isSpecial ? (link as any).action() : scrollToSection(link.href); }}
                        className={`block py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer ${isSpecial ? "font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                        style={isSpecial ? { color: accent, background: `${accentG}0.06)`, border: `1px solid ${accentG}0.15)` } : undefined}
                      >
                        {link.label} {isSpecial && <span className="text-[8px] ml-1">✦</span>}
                      </a>
                    );
                  })}
                  {/* Mobile Language Selector */}
                  <div className="pt-2 border-t border-white/5 md:hidden">
                    <div className="flex flex-wrap gap-2 px-4 py-2">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguageKey(lang.code as any); setMobileMenuOpen(false); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${language === lang.code ? "bg-white/10 text-white font-bold" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
                          style={{ border: language === lang.code ? `1px solid ${accent}40` : "1px solid rgba(255,255,255,0.05)" }}
                        >
                          <img src={`https://flagcdn.com/${lang.flagUrl}.svg`} alt={lang.code} className="w-4 h-auto rounded-sm" />
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <button onClick={onGetStarted} className="w-full py-2.5 rounded-lg text-sm font-bold cursor-pointer" style={{ background: accent, color: "#060a10" }}>
                      {t("loginBtn")}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ═══════════ GLOBAL BREAKING NEWS ═══════════ */}
      <div className="relative z-40 bg-black/40 border-b border-white/5 py-2 overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1700px]">
          <BreakingNews selectedSymbol="EURUSD" selectedCategory="All" />
        </div>
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section id="home" className="relative overflow-hidden scroll-mt-32">
        {/* Warp tunnel concentric rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div key={i} className="absolute rounded-full" style={{
              width: `${i * 250}px`, height: `${i * 250}px`,
              border: `1px solid ${accentG}${0.06 / i})`,
            }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.25 / i, 0.1] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }} />
          ))}
        </div>

        {/* Central energy glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div className="w-[400px] h-[400px] rounded-full" style={{
            background: `radial-gradient(circle, ${accentG}0.08) 0%, ${accentG}0.02) 40%, transparent 70%)`,
            filter: "blur(40px)",
          }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }} />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute w-[700px] h-[700px] rounded-full" style={{ top: "-30%", left: "-15%", background: `radial-gradient(circle, ${accentG}0.07) 0%, transparent 70%)`, filter: "blur(80px)" }}
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity }} />
          <motion.div className="absolute w-[500px] h-[500px] rounded-full" style={{ bottom: "-20%", right: "-10%", background: `radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)`, filter: "blur(60px)" }}
            animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 12, repeat: Infinity }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center max-w-4xl mx-auto">

            <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
              style={{ background: `${accentG}0.06)`, border: `1px solid ${accentG}0.15)` }}
              animate={{ boxShadow: [`0 0 15px ${accentG}0.1)`, `0 0 30px ${accentG}0.2)`, `0 0 15px ${accentG}0.1)`] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-4 h-4" style={{ color: accent }} />
              </motion.div>
              <span className="text-sm font-bold" style={{ color: accent }}>
                {t("marketPerceptionPlatform")}
              </span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-8xl font-black mb-5"
              animate={{ textShadow: [`0 0 30px ${accentG}0.2)`, `0 0 60px ${accentG}0.35)`, `0 0 30px ${accentG}0.2)`] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <span style={{ color: accent }}>PHASE X AI</span>
            </motion.h1>

            <h2 className="text-xl md:text-4xl mb-8 text-gray-500 font-light">{t("theMarketRewritten")}</h2>

            <motion.div className="h-[2px] w-24 mx-auto mb-8" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              animate={{ width: ["96px", "200px", "96px"] }} transition={{ duration: 2.5, repeat: Infinity }} />

            <div className="space-y-3 mb-10">
              <p className="text-lg md:text-xl text-gray-400">{t("newWayToSee")}</p>
              <p className="text-base md:text-lg text-gray-500">{t("notAsCharts")}</p>
              <div className="pt-3">
                <p className="text-base text-gray-500">{t("dontAnalyze")}</p>
                <motion.p className="text-xl md:text-2xl font-bold mt-2" style={{ color: accent }}
                  animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  {t("perceiveStructure")}
                </motion.p>
              </div>
            </div>

            <motion.button onClick={onGetStarted} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -8, 0] }} transition={{ y: { duration: 2.5, repeat: Infinity } }}
              className="text-base px-7 py-4 md:text-lg md:px-10 md:py-5 rounded-2xl font-black tracking-wider relative overflow-hidden cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, color: "#060a10", boxShadow: `0 15px 50px ${accentG}0.3), 0 0 80px ${accentG}0.1)` }}>
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                animate={{ left: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
              <span className="relative z-10 flex items-center gap-2">
                {t("enterPlatform")}
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}><ArrowRight className="w-5 h-5" /></motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHAT IS PHASE X ═══════════ */}
      <section id="what-is" className="py-20 scroll-mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={t("isPerceptionPlatform")}>
            {t("whatIsPhaseX")}
          </SectionTitle>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto mb-10">
            <GlassCard className="p-6 md:p-10 text-center">
              <p className="text-lg text-gray-300 leading-relaxed mb-4">{t("insteadOfCharts")}</p>
              <p className="text-base text-gray-500">{t("eachStateAnswers")}</p>
            </GlassCard>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Ban, text: t("noPredictions"), color: "#ff1744" },
              { icon: BellOff, text: t("noSignals"), color: "#ff9100" },
              { icon: HeartOff, text: t("noEmotionalNoise"), color: "#ff1744" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }}>
                  <div className="p-6 rounded-xl text-center" style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
                      <Icon className="w-7 h-7 mx-auto mb-3" style={{ color: item.color }} strokeWidth={2.5} />
                    </motion.div>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY PHASE X EXISTS ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle>{t("whyPhaseXExists")}</SectionTitle>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-5xl mx-auto mb-10">
            <GlassCard glow="#ff1744" className="p-5 md:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex w-14 h-14 rounded-xl items-center justify-center mb-3" style={{ background: "rgba(255,23,68,0.12)" }}>
                  <BarChart3 className="w-7 h-7" style={{ color: "#ff1744" }} />
                </div>
                <h3 className="text-2xl font-black text-white">{t("whyChartsFail")}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, text: t("candlesticksFragment") },
                  { icon: Zap, text: t("indicatorsOverlap") },
                  { icon: Brain, text: t("tradersInterpret") },
                  { icon: Eye, text: t("decisionsEmotional") }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(255,23,68,0.05)" }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,23,68,0.12)" }}>
                        <Icon className="w-4 h-4" style={{ color: "#ff1744" }} />
                      </div>
                      <p className="text-sm text-gray-400 pt-1.5">{item.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <GlassCard glow={accent} className="p-6 md:p-10 text-center">
              <p className="text-2xl font-black text-white mb-3">{t("marketsComplex")}</p>
              <p className="text-xl font-light" style={{ color: accent }}>{t("representationShouldntBe")}</p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FIVE STATES ═══════════ */}
      <section id="states" className="py-20 scroll-mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={t("oneMarketFiveStates")}>
            {t("marketLanguage")}
          </SectionTitle>

          <div className="grid gap-4 max-w-5xl mx-auto">
            {states.map((state, i) => {
              const Icon = state.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="rounded-2xl overflow-hidden" style={{
                    background: "linear-gradient(160deg, rgba(14,20,33,0.9) 0%, rgba(8,12,22,0.95) 100%)",
                    border: `1px solid ${state.color}18`,
                    boxShadow: `0 10px 40px rgba(0,0,0,0.2)`,
                  }}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 p-4 md:p-6 flex items-center justify-center relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${state.color}15, ${state.color}05)` }}>
                        <motion.div className="absolute inset-0 pointer-events-none"
                          style={{ background: `radial-gradient(circle at 50% 50%, ${state.color}10 0%, transparent 70%)` }}
                          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                        <div className="text-center relative z-10">
                          <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-3 mx-auto"
                            style={{ background: `${state.color}15`, border: `1px solid ${state.color}30`, boxShadow: `0 0 25px ${state.color}15` }}>
                            <Icon className="w-7 h-7 md:w-10 md:h-10" style={{ color: state.color }} />
                          </div>
                          <h3 className="text-lg font-black text-white mb-1">{state.name}</h3>
                          <p className="text-xs text-gray-500">{state.nameAr}</p>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-4 md:p-6">
                        <p className="text-base font-bold mb-3" style={{ color: state.color }}>{state.question}</p>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">{state.description}</p>
                        {(i === 0 || i === 1 || i === 2 || i === 3 || i === 4 || i === 5) && (
                          <button
                            onClick={() => setExpandedState(expandedState === i ? null : i)}
                            className="text-xs font-bold flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors group cursor-pointer"
                          >
                            {t("readMore")}
                            <motion.span animate={{ rotate: expandedState === i ? 90 : 0 }} transition={{ duration: 0.3 }}>
                              <ArrowRight className="w-3 h-3" />
                            </motion.span>
                          </button>
                        )}

                        {/* Expandable Read More Content for PHASE STATE */}
                        <AnimatePresence>
                          {i === 0 && expandedState === 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-5 pt-5 space-y-5" style={{ borderTop: `1px solid ${state.color}20` }}>
                                {/* Title */}
                                <h4 className="text-lg font-black" style={{ color: state.color }}>{t("statePhaseReadMoreTitle")}</h4>

                                {/* Section 1: Intro */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreIntro")}</p>
                                <div className="space-y-1">
                                  <p className="text-sm font-bold text-gray-300">{t("statePhaseReadMoreNotBuying")}</p>
                                  <p className="text-sm font-bold text-gray-300">{t("statePhaseReadMoreNotSelling")}</p>
                                  <p className="text-sm font-bold" style={{ color: state.color }}>{t("statePhaseReadMoreTransitioning")}</p>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreTraditional")}</p>
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("statePhaseReadMoreChallenge")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Section 2: Markets Move Through Phases */}
                                <h5 className="text-base font-black text-white">{t("statePhaseReadMoreS2Title")}</h5>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS2Intro")}</p>
                                <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
                                  {t("statePhaseReadMoreS2Sub")}
                                </p>
                                <div className="space-y-2">
                                  {["statePhaseReadMoreS2Bullet1", "statePhaseReadMoreS2Bullet2", "statePhaseReadMoreS2Bullet3"].map((key, bi) => (
                                    <div key={bi} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
                                      <span className="text-sm text-gray-300">{t(key)}</span>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS2Closing")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Section 3: Context Before Action */}
                                <h5 className="text-base font-black text-white">{t("statePhaseReadMoreS3Title")}</h5>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS3P1")}</p>
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("statePhaseReadMoreS3Question")}</p>
                                <p className="text-sm text-gray-400">{t("statePhaseReadMoreS3Helps")}</p>
                                <div className="space-y-2" style={{ paddingLeft: 4 }}>
                                  {["statePhaseReadMoreS3Bullet1", "statePhaseReadMoreS3Bullet2", "statePhaseReadMoreS3Bullet3"].map((key, ci) => (
                                    <div key={ci} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
                                      <span className="text-sm text-gray-300">{t(key)}</span>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS3Closing")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Section 4: Phase Recognition */}
                                <h5 className="text-base font-black text-white">{t("statePhaseReadMoreS4Title")}</h5>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS4P1")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS4P2")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS4P3")}</p>
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("statePhaseReadMoreS4P4")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Section 5: Clarity Over Reaction */}
                                <h5 className="text-base font-black text-white">{t("statePhaseReadMoreS5Title")}</h5>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS5P1")}</p>
                                <p className="text-sm text-gray-300">{t("statePhaseReadMoreS5P2")}</p>
                                <p className="text-sm text-gray-300">{t("statePhaseReadMoreS5P3")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("statePhaseReadMoreS5P4")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Tagline */}
                                <motion.p
                                  className="text-sm font-black text-center pt-2"
                                  style={{ color: state.color }}
                                  animate={{ scale: [1, 1.02, 1] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  {t("statePhaseReadMoreTagline")}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expandable Read More Content for DISPLACEMENT STATE */}
                        <AnimatePresence>
                          {i === 1 && expandedState === 1 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-5 pt-5 space-y-4" style={{ borderTop: `1px solid ${state.color}20` }}>
                                {/* Title */}
                                <h4 className="text-lg font-black" style={{ color: state.color }}>{t("stateDisplacementReadMoreTitle")}</h4>

                                {/* Intro */}
                                <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
                                  {t("stateDisplacementReadMoreP1")}
                                </p>

                                {/* Body */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateDisplacementReadMoreP2")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateDisplacementReadMoreP3")}</p>

                                {/* Risk highlight */}
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateDisplacementReadMoreP4")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Closing tagline */}
                                <motion.p
                                  className="text-sm font-black text-center pt-2"
                                  style={{ color: state.color }}
                                  animate={{ scale: [1, 1.02, 1] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  {t("stateDisplacementReadMoreP5")}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expandable Read More Content for REFERENCE STATE */}
                        <AnimatePresence>
                          {i === 2 && expandedState === 2 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-5 pt-5 space-y-4" style={{ borderTop: `1px solid ${state.color}20` }}>
                                {/* Title */}
                                <h4 className="text-lg font-black" style={{ color: state.color }}>{t("stateReferenceReadMoreTitle")}</h4>

                                {/* Intro */}
                                <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
                                  {t("stateReferenceReadMoreP1")}
                                </p>

                                {/* Body */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateReferenceReadMoreP2")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateReferenceReadMoreP3")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Closing tagline */}
                                <motion.p
                                  className="text-sm font-black text-center pt-2"
                                  style={{ color: state.color }}
                                  animate={{ scale: [1, 1.02, 1] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  {t("stateReferenceReadMoreP4")}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expandable Read More Content for OSCILLATION STATE */}
                        <AnimatePresence>
                          {i === 3 && expandedState === 3 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-5 pt-5 space-y-4" style={{ borderTop: `1px solid ${state.color}20` }}>
                                {/* Title */}
                                <h4 className="text-lg font-black" style={{ color: state.color }}>{t("stateOscillationReadMoreTitle")}</h4>

                                {/* Intro */}
                                <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
                                  {t("stateOscillationReadMoreP1")}
                                </p>

                                {/* Body */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP2")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP3")}</p>
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateOscillationReadMoreP4")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Oscillation gets */}
                                <p className="text-sm text-gray-400">{t("stateOscillationReadMoreP5")}</p>
                                <div className="space-y-2">
                                  {["stateOscillationReadMoreBullet1", "stateOscillationReadMoreBullet2", "stateOscillationReadMoreBullet3", "stateOscillationReadMoreBullet4"].map((key, bi) => (
                                    <div key={bi} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
                                      <span className="text-sm text-gray-300 font-medium">{t(key)}</span>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateOscillationReadMoreP6")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* About section */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP7")}</p>
                                <div className="space-y-2" style={{ paddingLeft: 4 }}>
                                  {["stateOscillationReadMoreBullet5", "stateOscillationReadMoreBullet6", "stateOscillationReadMoreBullet7", "stateOscillationReadMoreBullet8"].map((key, ci) => (
                                    <div key={ci} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: state.color }} />
                                      <span className="text-sm text-gray-300">{t(key)}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Closing */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP8")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateOscillationReadMoreP9")}</p>
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateOscillationReadMoreP10")}</p>
                                <p className="text-sm text-gray-300 leading-relaxed">{t("stateOscillationReadMoreP11")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Tagline */}
                                <motion.p
                                  className="text-sm font-black text-center pt-2"
                                  style={{ color: state.color }}
                                  animate={{ scale: [1, 1.02, 1] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  {t("stateOscillationReadMoreTagline")}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expandable Read More Content for DIRECTION STATE */}
                        <AnimatePresence>
                          {i === 4 && expandedState === 4 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-5 pt-5 space-y-4" style={{ borderTop: `1px solid ${state.color}20` }}>
                                {/* Title */}
                                <h4 className="text-lg font-black" style={{ color: state.color }}>{t("stateDirectionReadMoreTitle")}</h4>

                                {/* Intro */}
                                <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
                                  {t("stateDirectionReadMoreP1")}
                                </p>

                                {/* Body */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateDirectionReadMoreP2")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateDirectionReadMoreP3")}</p>

                                {/* Structural clarity */}
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateDirectionReadMoreP4")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Prediction */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateDirectionReadMoreP5")}</p>
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateDirectionReadMoreP6")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Tagline */}
                                <motion.p
                                  className="text-sm font-black text-center pt-2"
                                  style={{ color: state.color }}
                                  animate={{ scale: [1, 1.02, 1] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  {t("stateDirectionReadMoreTagline")}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expandable Read More Content for ENVELOPE STATE */}
                        <AnimatePresence>
                          {i === 5 && expandedState === 5 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-5 pt-5 space-y-4" style={{ borderTop: `1px solid ${state.color}20` }}>
                                {/* Title */}
                                <h4 className="text-lg font-black" style={{ color: state.color }}>{t("stateEnvelopeReadMoreTitle")}</h4>

                                {/* Intro */}
                                <p className="text-sm text-gray-300 leading-relaxed font-medium italic" style={{ borderLeft: `3px solid ${state.color}`, paddingLeft: 12 }}>
                                  {t("stateEnvelopeReadMoreP1")}
                                </p>

                                {/* Body */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateEnvelopeReadMoreP2")}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateEnvelopeReadMoreP3")}</p>

                                {/* Structural clarity */}
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateEnvelopeReadMoreP4")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Energy dynamics */}
                                <p className="text-sm text-gray-400 leading-relaxed">{t("stateEnvelopeReadMoreP5")}</p>
                                <p className="text-sm font-bold" style={{ color: state.color }}>{t("stateEnvelopeReadMoreP6")}</p>

                                {/* Divider */}
                                <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${state.color}40, transparent)` }} />

                                {/* Tagline */}
                                <motion.p
                                  className="text-sm font-black text-center pt-2"
                                  style={{ color: state.color }}
                                  animate={{ scale: [1, 1.02, 1] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  {t("stateEnvelopeReadMoreTagline")}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto mt-10">
            <GlassCard glow="#a855f7" className="p-8 text-center">
              <p className="text-lg font-bold" style={{ color: "#a855f7" }}>
                {t("togetherCompleteSystem")}
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ DECISION ENGINE ═══════════ */}
      <section id="decision-engine" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={t("decisionEngineSub")}>
            {t("structuralDecisionEngine")}
          </SectionTitle>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <GlassCard glow={accent} className="p-5 md:p-14">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${accentG}0.15), ${accentG}0.02))` }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-dashed rounded-2xl" style={{ borderColor: accent, opacity: 0.3 }} />
                  <Brain className="w-10 h-10 relative z-10" style={{ color: accent }} />
                </div>
              </div>

              <div className="space-y-6 text-gray-300 text-lg leading-relaxed text-justify px-2 md:px-8">
                <p>{t("engineDesc1")}</p>
                <p>{t("engineDesc2")}</p>
                <div className="font-bold py-4 px-6 mt-6 rounded-xl relative overflow-hidden" style={{ background: "rgba(0, 229, 160, 0.05)", border: `1px solid ${accentG}0.2)` }}>
                  <div className={`absolute top-0 bottom-0 ${isRTL ? "right-0" : "left-0"} w-1.5`} style={{ background: accent }} />
                  <p className="relative z-10" style={{ color: "white" }}>
                    {t("engineDesc3")}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SCREENSHOTS ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={t("professionalInterface")}>
            {t("seePlatformUpClose")}
          </SectionTitle>

          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentScreenshot} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.4 }}>
                <div className="rounded-2xl overflow-hidden relative" style={{ border: `1px solid ${accentG}0.12)`, boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${accentG}0.05)` }}>
                  <img src={screenshots[currentScreenshot].url} alt={screenshots[currentScreenshot].title} className="w-full object-contain max-h-[300px] md:max-h-[500px]" />
                  <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, rgba(6,10,16,0.95) 0%, transparent 100%)" }}>
                    <h3 className="text-xl font-black text-white mb-1">{screenshots[currentScreenshot].title}</h3>
                    <p className="text-sm text-gray-400">{screenshots[currentScreenshot].description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button onClick={() => setCurrentScreenshot(p => (p - 1 + screenshots.length) % screenshots.length)}
              className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-2 md:right-3" : "left-2 md:left-3"} w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer`}
              style={{ background: "rgba(6,10,16,0.8)", border: `1px solid ${accentG}0.15)` }}>
              {isRTL ? <ChevronRight className="w-5 h-5 text-white" /> : <ChevronLeft className="w-5 h-5 text-white" />}
            </button>
            <button onClick={() => setCurrentScreenshot(p => (p + 1) % screenshots.length)}
              className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-2 md:left-3" : "right-2 md:right-3"} w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer`}
              style={{ background: "rgba(6,10,16,0.8)", border: `1px solid ${accentG}0.15)` }}>
              {isRTL ? <ChevronLeft className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
            </button>

            <div className="flex items-center justify-center gap-2 mt-6">
              {screenshots.map((_, i) => (
                <button key={i} onClick={() => setCurrentScreenshot(i)}
                  className="rounded-full transition-all cursor-pointer"
                  style={{ width: i === currentScreenshot ? 32 : 10, height: 10, background: i === currentScreenshot ? accent : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ BROKER PARTNERS ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={t("brokerPartnersSub")}>
            {t("brokerPartnersTitle")}
          </SectionTitle>

          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: "IC Markets", discount: "25%", url: "https://t.me/PhaseX_Ai", bg: "#fff", text: "#0a1628" },
              { name: "PrimeXBT", discount: "50%", url: "https://t.me/PhaseX_Ai", bg: "#1a2332", text: "#fff" },
              { name: "OctaFX", discount: "50%", url: "https://t.me/PhaseX_Ai", bg: "#00a651", text: "#fff" },
              { name: "eToro", discount: "20%", url: "https://t.me/PhaseX_Ai", bg: "#6bbd46", text: "#fff" },
              { name: "Vantage FX", discount: "30%", url: "https://t.me/PhaseX_Ai", bg: "#e8380d", text: "#fff" },
              { name: "Windsor Brokers", discount: "25%", url: "https://t.me/PhaseX_Ai", bg: "#1a3a5c", text: "#fff" },
              { name: "Exness", discount: "40%", url: "https://t.me/PhaseX_Ai", bg: "#facc15", text: "#000" },
              { name: "LiteForex", discount: "30%", url: "https://t.me/PhaseX_Ai", bg: "#003d7a", text: "#fff" },
              { name: "IUX", discount: "35%", url: "https://t.me/PhaseX_Ai", bg: "#1c1c2e", text: "#fff" },
              { name: "Swissquote", discount: "20%", url: "https://t.me/PhaseX_Ai", bg: "#e4002b", text: "#fff" },
              { name: "FxPro", discount: "30%", url: "https://t.me/PhaseX_Ai", bg: "#ff5722", text: "#fff" },
              { name: "iFOREX", discount: "25%", url: "https://t.me/PhaseX_Ai", bg: "#0054a6", text: "#fff" },
              { name: "FP Markets", discount: "35%", url: "https://t.me/PhaseX_Ai", bg: "#00295b", text: "#fff" },
              { name: "RoboForex", discount: "30%", url: "https://t.me/PhaseX_Ai", bg: "#2196f3", text: "#fff" },
              { name: "XM", discount: "50%", url: "https://t.me/PhaseX_Ai", bg: "#c4161c", text: "#fff" },
            ].map((broker, i) => (
              <div key={i} className="relative cursor-pointer" style={{ perspective: "800px", height: "140px" }}
                onClick={() => setFlippedBroker(flippedBroker === i ? null : i)}>
                {/* Card container with 3D flip */}
                <div className="w-full h-full relative transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: flippedBroker === i ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                  
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 border border-[#1c2230] hover:border-gray-600 transition-colors"
                    style={{ backfaceVisibility: "hidden", background: "#10141d" }}>
                    <Logo size="sm" showText={false} animated={false} />
                    <span className="text-[11px] font-black text-white tracking-wide">{broker.name}</span>
                    <div className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ background: `${accent}15`, color: accent }}>
                      {broker.discount} {t("brokerDiscount")}
                    </div>
                    <p className="text-[9px] text-gray-600 font-medium">{t("brokerClickToReveal")}</p>
                  </div>
                  
                  {/* BACK FACE */}
                  <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 border p-4"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, #10141d, #161c2a)", borderColor: `${accent}40` }}>
                    <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${accent}15`, color: accent }}>
                      {t("brokerReferralOffer")}
                    </div>
                    <div className="text-2xl font-black" style={{ color: accent }}>{broker.discount}</div>
                    <a href={broker.url} target="_blank" rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-center text-black transition-transform hover:scale-105 no-underline block"
                      style={{ background: accent }}
                      onClick={(e) => e.stopPropagation()}>
                      {t("brokerSignUp")}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW PHASE X IS DIFFERENT ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={t("notIndicatorsStates")} color="#448aff">
            {t("howPhaseXIsDifferent")}
          </SectionTitle>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5 mb-10">
            {/* Does NOT */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <GlassCard glow="#ff1744" className="p-5 md:p-8 h-full">
                <div className="text-center mb-6">
                  <motion.div className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-3" style={{ background: "rgba(255,23,68,0.12)" }}
                    animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <X className="w-8 h-8" style={{ color: "#ff1744" }} />
                  </motion.div>
                  <h3 className="text-xl font-black" style={{ color: "#ff1744" }}>{t("phaseXDoesNot")}</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Ban, text: t("tellYouWhatToDo") },
                    { icon: TrendingUp, text: t("giveTradingSignals") },
                    { icon: Brain, text: t("forceInterpretations") },
                    { icon: Target, text: t("makeDecisionsForYou") }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,23,68,0.05)" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,23,68,0.12)" }}>
                          <Icon className="w-4 h-4" style={{ color: "#ff1744" }} />
                        </div>
                        <p className="text-sm font-bold" style={{ color: "#ff5252" }}>{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            {/* DOES */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <GlassCard glow={accent} className="p-5 md:p-8 h-full">
                <div className="text-center mb-6">
                  <motion.div className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-3"
                    style={{ background: `${accentG}0.12)` }}
                    animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                    transition={{ scale: { duration: 2, repeat: Infinity }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}>
                    <Eye className="w-8 h-8" style={{ color: accent }} />
                  </motion.div>
                  <h3 className="text-xl font-black" style={{ color: accent }}>{t("phaseXDoes")}</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Eye, text: t("showWhatIsHappening"), c: accent },
                    { icon: Gauge, text: t("revealTrueStates"), c: "#a855f7" },
                    { icon: Shield, text: t("keepYouDecisionMaker"), c: "#448aff" },
                    { icon: Sparkles, text: t("removeTheFog"), c: "#ffc400" }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div key={i} whileHover={{ scale: 1.03 }}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={{ background: `${item.c}06` }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.c}15`, boxShadow: `0 0 10px ${item.c}15` }}>
                          <Icon className="w-4 h-4" style={{ color: item.c }} />
                        </div>
                        <p className="text-sm font-bold" style={{ color: item.c }}>{item.text}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <GlassCard glow="#a855f7" className="p-6 md:p-10 text-center">
              <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                <p className="text-2xl font-black text-white mb-3">{t("youRemainDecisionMaker")}</p>
                <p className="text-lg font-light" style={{ color: "#a855f7" }}>{t("phaseXRemovesFog")}</p>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHO IS IT FOR ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={t("builtForSeriousParticipants")}>
            {t("whoPhaseXIsFor")}
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { icon: Users, text: t("forProTraders") },
              { icon: LineChart, text: t("forQuantAnalysts") },
              { icon: Briefcase, text: t("forPortfolioManagers") },
              { icon: Shield, text: t("forInstitutions") },
              { icon: Eye, text: t("forIndependentTraders") }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.04 }}>
                  <div className="p-5 rounded-xl flex items-center gap-4" style={{ background: `${accent}05`, border: `1px solid ${accent}12` }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, boxShadow: `0 5px 15px ${accentG}0.2)` }}>
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <p className="text-sm font-bold text-white">{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <div className="p-6 rounded-xl text-center" style={{ background: "rgba(255,196,0,0.05)", border: "1px solid rgba(255,196,0,0.15)" }}>
              <p className="text-sm font-bold" style={{ color: "#ffc400" }}>
                {t("notForGamblers")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ PLATFORM ACCESS ═══════════ */}
      <section id="access" className="py-20 scroll-mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={t("accessPlatformSub")} color="#a855f7">
            {t("platformAccess")}
          </SectionTitle>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <GlassCard glow="#a855f7" className="p-6 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", boxShadow: "0 10px 30px rgba(168,85,247,0.25)" }}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <p className="text-base text-gray-400">{t("secureWebPlatform")}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Users, text: t("personalAccountAccess"), c: "#a855f7" },
                  { icon: BarChart3, text: t("multiMarketCoverage"), c: "#448aff" },
                  { icon: Activity, text: t("multiTimeframeAnalysis"), c: accent },
                  { icon: Zap, text: t("continuousSystemUpdates"), c: "#ff6e40" }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.03 }}
                      className="p-5 rounded-xl transition-all" style={{ background: `${item.c}06`, border: `1px solid ${item.c}12` }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: `${item.c}15`, boxShadow: `0 0 15px ${item.c}15` }}>
                        <Icon className="w-5 h-5" style={{ color: item.c }} />
                      </div>
                      <p className="text-sm font-bold text-white">{item.text}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center">
                <motion.button onClick={onGetStarted} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-xl text-base font-black tracking-wider relative overflow-hidden cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "white", boxShadow: "0 10px 40px rgba(168,85,247,0.3)" }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
                    animate={{ left: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                  <span className="relative z-10 flex items-center gap-2">
                    {t("loginRequestAccess")}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FINAL STATEMENT ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <GlassCard className="p-8 md:p-14 text-center space-y-8">
              <div className="space-y-3">
                <p className="text-xl md:text-2xl text-gray-400">{t("marketsDontNeedMoreIndicators")}</p>
                <p className="text-2xl md:text-3xl font-black" style={{ color: accent }}>{t("needBetterRepresentation")}</p>
              </div>
              <div className="h-[1px] w-20 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
              <div className="space-y-3">
                <p className="text-lg text-gray-500">{t("notAnUpgrade")}</p>
                <p className="text-2xl md:text-3xl font-black" style={{ color: accent }}>{t("isARewrite")}</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-12 relative z-10" style={{ borderTop: `1px solid ${accentG}0.06)` }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
            {/* Brand */}
            <div className="text-center md:text-left flex-shrink-0">
              <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                <Logo size="sm" animated={false} />
                <span className="text-2xl font-black" style={{ color: accent }}>PHASE X</span>
              </div>
              <p className="text-sm text-gray-400 font-light">The Market, Rewritten</p>
            </div>

            {/* All icons in one row */}
            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
              {/* Social */}
              {[
                { icon: Twitter, hc: "#1da1f2" },
                { icon: Linkedin, hc: "#0077b5" },
                { icon: Mail, hc: accent }
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a key={`s-${i}`} href="#" whileHover={{ scale: 1.12, y: -2 }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}

              {/* Separator */}
              <div className="w-[1px] h-6 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* Legal buttons */}
              <TermsButton onClick={() => setTermsOpen(true)} />
              <PrivacyPolicyButton onClick={() => setPrivacyOpen(true)} />
              <CookieButton onClick={() => setCookieOpen(true)} />
              <LegalDisclaimerButton onClick={() => setDisclaimerOpen(true)} />
              <RiskDisclosureButton onClick={() => setRiskOpen(true)} />
              <ManifestoButton onClick={() => setManifestoOpen(true)} />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-5 text-center" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
            <p className="text-[11px] text-gray-600">
              © 2024 PHASE X AI. {t("allRightsReserved")} — Structural Market Intelligence Platform
            </p>
          </div>
        </div>
      </footer>

      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <CookiePolicyModal isOpen={cookieOpen} onClose={() => setCookieOpen(false)} />
      <LegalDisclaimerModal isOpen={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
      <ManifestoModal isOpen={manifestoOpen} onClose={() => setManifestoOpen(false)} />
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <RiskDisclosureModal isOpen={riskOpen} onClose={() => setRiskOpen(false)} />
    </div>
  );
}