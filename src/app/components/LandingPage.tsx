import { useState, useMemo } from "react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "motion/react";
import {
  Gauge, Move, Target, Activity, Navigation, Zap, Shield, ArrowRight,
  Users, BarChart3, Sparkles, ChevronLeft, ChevronRight,
  Languages, Menu, X, Linkedin, Twitter, Mail,
  Briefcase, TrendingUp, Brain, Eye, LineChart, Ban, BellOff, HeartOff
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { TermsModal, TermsButton, CookiePolicyModal, CookieButton, LegalDisclaimerModal, LegalDisclaimerButton, ManifestoModal, ManifestoButton, PrivacyPolicyModal, PrivacyPolicyButton, RiskDisclosureModal, RiskDisclosureButton } from "./TermsAndConditions";

interface LandingPageProps {
  onGetStarted: () => void;
  onRegister: () => void;
  onOpenDynamics: () => void;
}

export function LandingPage({ onGetStarted, onRegister, onOpenDynamics }: LandingPageProps) {
  const { language, toggleLanguage } = useLanguage();
  const isRTL = language === "ar";
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);

  const accent = "#00e5a0";
  const accentG = "rgba(0,229,160,";

  const navLinks = [
    { label: isRTL ? "الرئيسية" : "Home", href: "#home" },
    { label: isRTL ? "ما هو PHASE X" : "What is PHASE X", href: "#what-is" },
    { label: isRTL ? "المؤشرات" : "States", href: "#states" },
    { label: isRTL ? "الوصول" : "Access", href: "#access" },
    { label: isRTL ? "التحليل الهيكلي" : "Structural Dynamics", href: "#dynamics", action: onOpenDynamics },
  ];

  const screenshots = [
    { url: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80", title: isRTL ? "لوحة التحكم الرئيسية" : "Main Dashboard", description: isRTL ? "واجهة احترافية لعرض جميع الأسواق والمؤشرات" : "Professional interface displaying all markets and indicators" },
    { url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80", title: isRTL ? "المؤشرات الفنية" : "Technical Indicators", description: isRTL ? "5 مؤشرات فنية حصرية ومتطورة" : "5 exclusive and advanced technical indicators" },
    { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80", title: isRTL ? "تحليل متعدد الأطر الزمنية" : "Multi-Timeframe Analysis", description: isRTL ? "رؤية شاملة للسوق عبر فريمات مختلفة" : "Comprehensive market view across different timeframes" },
    { url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=80", title: isRTL ? "أسواق متعددة" : "Multiple Markets", description: isRTL ? "FOREX, CRYPTO, INDEX, COMMODITY" : "FOREX, CRYPTO, INDEX, COMMODITY" }
  ];

  const stateColors = ["#a855f7", "#448aff", "#00e676", "#ff9100", "#ff1744"];
  const states = [
    { icon: Gauge, name: "PHASE STATE", nameAr: "حالة المرحلة", question: isRTL ? "أين يتجه السوق؟" : "Where is the market headed?", description: isRTL ? "يحدد ما إذا كان السوق في مرحلة شراء، مرحلة بيع، أو مرحلة محايدة" : "Identifies whether the market is in a Buy Phase, Sell Phase, or Neutral Phase.", color: stateColors[0] },
    { icon: Move, name: "DISPLACEMENT STATE", nameAr: "حالة الإزاحة", question: isRTL ? "ما مدى بعد السوق عن التوازن؟" : "How far is the market from equilibrium?", description: isRTL ? "يكشف عن الاختلال المتراكم والحمل الداخلي للسوق" : "Reveals accumulated imbalance and internal market load.", color: stateColors[1] },
    { icon: Target, name: "REFERENCE STATE", nameAr: "الحالة المرجعية", question: isRTL ? "أين يقف السوق بالنسبة لمرساته الداخلية؟" : "Where does the market stand relative to its internal anchor?", description: isRTL ? "يكشف نقاط التحول الهيكلية عن طريق إزالة السعر تماماً" : "Exposes structural turning points by removing price entirely.", color: stateColors[2] },
    { icon: Activity, name: "OSCILLATION STATE", nameAr: "حالة التذبذب", question: isRTL ? "ما هو إيقاع الزخم؟" : "What is the rhythm of momentum?", description: isRTL ? "يعرض التذبذب كحالة سلوكية — وليس خطاً مسطحاً" : "Displays oscillation as a behavioral state — not a flat line.", color: stateColors[3] },
    { icon: Navigation, name: "DIRECTION STATE", nameAr: "حالة الاتجاه", question: isRTL ? "هل الاتجاه يستمر أم ينكسر؟" : "Is direction holding or breaking?", description: isRTL ? "يجمع استمرارية الاتجاه في هياكل واضحة وقابلة للقراءة" : "Aggregates directional continuity into clear, readable structures.", color: stateColors[4] },
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
    <div className="min-h-screen relative" dir={isRTL ? "rtl" : "ltr"} style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}>

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
              <span className="text-xl font-black hidden md:block" style={{ color: accent }}>PHASE X</span>
            </motion.div>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.a key={i} href={link.href}
                  onClick={(e) => { e.preventDefault(); (link as any).action ? (link as any).action() : scrollToSection(link.href); }}
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group cursor-pointer">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] group-hover:w-full transition-all" style={{ background: accent }} />
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <motion.button onClick={toggleLanguage} whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer hidden md:flex"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <Languages className="w-4 h-4" />
              </motion.button>
              <motion.button onClick={onGetStarted} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="hidden md:flex px-5 py-2 rounded-lg text-sm font-bold tracking-wider cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, color: "#060a10" }}>
                {isRTL ? "دخول" : "Login"}
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
                  {navLinks.map((link, i) => (
                    <a key={i} href={link.href}
                      onClick={(e) => { e.preventDefault(); (link as any).action ? (link as any).action() : scrollToSection(link.href); }}
                      className="block py-2 px-4 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm cursor-pointer">{link.label}</a>
                  ))}
                  <div className="pt-2 border-t border-white/5">
                    <button onClick={onGetStarted} className="w-full py-2.5 rounded-lg text-sm font-bold cursor-pointer" style={{ background: accent, color: "#060a10" }}>
                      {isRTL ? "دخول" : "Login"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section id="home" className="relative overflow-hidden scroll-mt-16">
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

        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center max-w-4xl mx-auto">

            <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
              style={{ background: `${accentG}0.06)`, border: `1px solid ${accentG}0.15)` }}
              animate={{ boxShadow: [`0 0 15px ${accentG}0.1)`, `0 0 30px ${accentG}0.2)`, `0 0 15px ${accentG}0.1)`] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-4 h-4" style={{ color: accent }} />
              </motion.div>
              <span className="text-sm font-bold" style={{ color: accent }}>
                {isRTL ? "منصة إدراك السوق" : "Market Perception Platform"}
              </span>
            </motion.div>

            <motion.h1 className="text-6xl md:text-8xl font-black mb-5"
              animate={{ textShadow: [`0 0 30px ${accentG}0.2)`, `0 0 60px ${accentG}0.35)`, `0 0 30px ${accentG}0.2)`] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <span style={{ color: accent }}>PHASE X AI</span>
            </motion.h1>

            <h2 className="text-2xl md:text-4xl mb-8 text-gray-500 font-light">{isRTL ? "السوق، أُعيدت كتابته" : "The Market, Rewritten"}</h2>

            <motion.div className="h-[2px] w-24 mx-auto mb-8" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              animate={{ width: ["96px", "200px", "96px"] }} transition={{ duration: 2.5, repeat: Infinity }} />

            <div className="space-y-3 mb-10">
              <p className="text-lg md:text-xl text-gray-400">{isRTL ? "طريقة جديدة لرؤية الأسواق المالية" : "A new way to see financial markets"}</p>
              <p className="text-base md:text-lg text-gray-500">{isRTL ? "ليس كرسوم بيانية للأسعار، بل كحالات سوقية" : "not as price charts, but as market states."}</p>
              <div className="pt-3">
                <p className="text-base text-gray-500">{isRTL ? "لا تحلل السوق." : "You don't analyze the market."}</p>
                <motion.p className="text-xl md:text-2xl font-bold mt-2" style={{ color: accent }}
                  animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  {isRTL ? "بل تدرك هيكله." : "You perceive its structure."}
                </motion.p>
              </div>
            </div>

            <motion.button onClick={onGetStarted} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -8, 0] }} transition={{ y: { duration: 2.5, repeat: Infinity } }}
              className="text-lg px-10 py-5 rounded-2xl font-black tracking-wider relative overflow-hidden cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, color: "#060a10", boxShadow: `0 15px 50px ${accentG}0.3), 0 0 80px ${accentG}0.1)` }}>
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                animate={{ left: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
              <span className="relative z-10 flex items-center gap-2">
                {isRTL ? "ادخل لمنصة PHASE X" : "Enter PHASE X Platform"}
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}><ArrowRight className="w-5 h-5" /></motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHAT IS PHASE X ═══════════ */}
      <section id="what-is" className="py-20 scroll-mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={isRTL ? "منصة إدراك السوق" : "PHASE X is a market perception platform."}>
            {isRTL ? "ما هو PHASE X؟" : "What is PHASE X?"}
          </SectionTitle>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto mb-10">
            <GlassCard className="p-10 text-center">
              <p className="text-lg text-gray-300 leading-relaxed mb-4">{isRTL ? "بدلاً من الرسوم البيانية والمؤشرات والإشارات التقليدية، يعيد PHASE X بناء السوق إلى حالات سلوكية واضحة." : "Instead of traditional charts, indicators, and signals, PHASE X reconstructs the market into clear behavioral states."}</p>
              <p className="text-base text-gray-500">{isRTL ? "كل حالة تجيب على سؤال أساسي حول السوق، بشكل موضوعي، مرئي، وبدون تفسير." : "Each state answers a fundamental question about the market, objectively, visually, and without interpretation."}</p>
            </GlassCard>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Ban, text: isRTL ? "لا تنبؤات" : "No predictions", color: "#ff1744" },
              { icon: BellOff, text: isRTL ? "لا إشارات" : "No signals", color: "#ff9100" },
              { icon: HeartOff, text: isRTL ? "لا ضوضاء عاطفية" : "No emotional noise", color: "#ff1744" }
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
          <SectionTitle>{isRTL ? "لماذا يوجد PHASE X؟" : "Why PHASE X Exists?"}</SectionTitle>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-5xl mx-auto mb-10">
            <GlassCard glow="#ff1744" className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex w-14 h-14 rounded-xl items-center justify-center mb-3" style={{ background: "rgba(255,23,68,0.12)" }}>
                  <BarChart3 className="w-7 h-7" style={{ color: "#ff1744" }} />
                </div>
                <h3 className="text-2xl font-black text-white">{isRTL ? "لماذا تفشل الرسوم التقليدية؟" : "Why Traditional Charts Fail?"}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, text: isRTL ? "الشموع اليابانية تجزئ السلوك المستمر" : "Candlesticks fragment continuous behavior" },
                  { icon: Zap, text: isRTL ? "المؤشرات تتداخل وتتناقض" : "Indicators overlap and contradict" },
                  { icon: Brain, text: isRTL ? "المتداولون مجبرون على التفسير بدلاً من الإدراك" : "Traders are forced to interpret instead of perceive" },
                  { icon: Eye, text: isRTL ? "القرارات تصبح عاطفية، غير متسقة، ومتأخرة" : "Decisions become emotional, inconsistent, and late" }
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
            <GlassCard glow={accent} className="p-10 text-center">
              <p className="text-2xl font-black text-white mb-3">{isRTL ? "الأسواق معقدة." : "Markets are complex."}</p>
              <p className="text-xl font-light" style={{ color: accent }}>{isRTL ? "لكن تمثيلها لا يجب أن يكون كذلك." : "Their representation shouldn't be."}</p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FIVE STATES ═══════════ */}
      <section id="states" className="py-20 scroll-mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={isRTL ? "سوق واحد. خمس حالات" : "One Market. Five States"}>
            {isRTL ? "لغة سوق PHASE X" : "The PHASE X Market Language"}
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
                      <div className="md:w-1/3 p-6 flex items-center justify-center relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${state.color}15, ${state.color}05)` }}>
                        <motion.div className="absolute inset-0 pointer-events-none"
                          style={{ background: `radial-gradient(circle at 50% 50%, ${state.color}10 0%, transparent 70%)` }}
                          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                        <div className="text-center relative z-10">
                          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 mx-auto"
                            style={{ background: `${state.color}15`, border: `1px solid ${state.color}30`, boxShadow: `0 0 25px ${state.color}15` }}>
                            <Icon className="w-10 h-10" style={{ color: state.color }} />
                          </div>
                          <h3 className="text-lg font-black text-white mb-1">{state.name}</h3>
                          <p className="text-xs text-gray-500">{state.nameAr}</p>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <p className="text-base font-bold mb-3" style={{ color: state.color }}>{state.question}</p>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">{state.description}</p>
                        <button className="text-xs font-bold flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors group cursor-pointer">
                          {isRTL ? "اقرأ المزيد..." : "Read more..."}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
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
                {isRTL ? "معاً، تشكل هذه الحالات نظام إدراك سوقي كامل" : "Together, these states form a complete market perception system."}
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SCREENSHOTS ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={isRTL ? "واجهة احترافية مصممة لتجربة تداول مميزة" : "Professional interface designed for premium trading"}>
            {isRTL ? "شاهد المنصة عن قرب" : "See the Platform Up Close"}
          </SectionTitle>

          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentScreenshot} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.4 }}>
                <div className="rounded-2xl overflow-hidden relative" style={{ border: `1px solid ${accentG}0.12)`, boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${accentG}0.05)` }}>
                  <img src={screenshots[currentScreenshot].url} alt={screenshots[currentScreenshot].title} className="w-full h-[450px] object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, rgba(6,10,16,0.95) 0%, transparent 100%)" }}>
                    <h3 className="text-xl font-black text-white mb-1">{screenshots[currentScreenshot].title}</h3>
                    <p className="text-sm text-gray-400">{screenshots[currentScreenshot].description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button onClick={() => setCurrentScreenshot(p => (p - 1 + screenshots.length) % screenshots.length)}
              className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer`}
              style={{ background: "rgba(6,10,16,0.8)", border: `1px solid ${accentG}0.15)` }}>
              {isRTL ? <ChevronRight className="w-5 h-5 text-white" /> : <ChevronLeft className="w-5 h-5 text-white" />}
            </button>
            <button onClick={() => setCurrentScreenshot(p => (p + 1) % screenshots.length)}
              className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"} w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer`}
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

      {/* ═══════════ HOW PHASE X IS DIFFERENT ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={isRTL ? "ليست مؤشرات. ليست إشارات. حالات." : "Not Indicators. Not Signals. States."} color="#448aff">
            {isRTL ? "كيف يختلف PHASE X" : "How PHASE X Is Different"}
          </SectionTitle>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5 mb-10">
            {/* Does NOT */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <GlassCard glow="#ff1744" className="p-8 h-full">
                <div className="text-center mb-6">
                  <motion.div className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-3" style={{ background: "rgba(255,23,68,0.12)" }}
                    animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <X className="w-8 h-8" style={{ color: "#ff1744" }} />
                  </motion.div>
                  <h3 className="text-xl font-black" style={{ color: "#ff1744" }}>{isRTL ? "PHASE X لا يفعل" : "PHASE X Does Not"}</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Ban, text: isRTL ? "لا يخبرك بما يجب عليك فعله" : "Tell you what to do" },
                    { icon: TrendingUp, text: isRTL ? "لا يعطي إشارات تداول" : "Give trading signals" },
                    { icon: Brain, text: isRTL ? "لا يفرض تفسيرات" : "Force interpretations" },
                    { icon: Target, text: isRTL ? "لا يتخذ قرارات نيابة عنك" : "Make decisions for you" }
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
              <GlassCard glow={accent} className="p-8 h-full">
                <div className="text-center mb-6">
                  <motion.div className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-3"
                    style={{ background: `${accentG}0.12)` }}
                    animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                    transition={{ scale: { duration: 2, repeat: Infinity }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}>
                    <Eye className="w-8 h-8" style={{ color: accent }} />
                  </motion.div>
                  <h3 className="text-xl font-black" style={{ color: accent }}>{isRTL ? "PHASE X يفعل" : "PHASE X Does"}</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Eye, text: isRTL ? "يُظهر لك ما يحدث" : "Show you what is happening", c: accent },
                    { icon: Gauge, text: isRTL ? "يكشف حالات السوق الحقيقية" : "Reveal true market states", c: "#a855f7" },
                    { icon: Shield, text: isRTL ? "يبقيك صانع القرار" : "Keep you the decision-maker", c: "#448aff" },
                    { icon: Sparkles, text: isRTL ? "يزيل الضباب" : "Remove the fog", c: "#ffc400" }
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
            <GlassCard glow="#a855f7" className="p-10 text-center">
              <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                <p className="text-2xl font-black text-white mb-3">{isRTL ? "أنت تبقى صانع القرار" : "You remain the decision-maker"}</p>
                <p className="text-lg font-light" style={{ color: "#a855f7" }}>{isRTL ? "PHASE X يزيل الضباب" : "PHASE X removes the fog"}</p>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHO IS IT FOR ═══════════ */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={isRTL ? "مبني للمشاركين الجادين في السوق" : "Built for Serious Market Participants"}>
            {isRTL ? "لمن PHASE X؟" : "Who PHASE X Is For"}
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { icon: Users, text: isRTL ? "المتداولون المحترفون" : "Professional traders" },
              { icon: LineChart, text: isRTL ? "المحللون الكميون" : "Quantitative analysts" },
              { icon: Briefcase, text: isRTL ? "مديرو المحافظ" : "Portfolio managers" },
              { icon: Shield, text: isRTL ? "المؤسسات والمكاتب الخاصة" : "Institutions and proprietary desks" },
              { icon: Eye, text: isRTL ? "المتداولون المستقلون الذين يسعون للوضوح" : "Independent traders seeking clarity" }
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
                {isRTL ? "PHASE X ليس مصمماً للمقامرين أو الباحثين عن الإشارات" : "PHASE X is not designed for gamblers or signal seekers"}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ PLATFORM ACCESS ═══════════ */}
      <section id="access" className="py-20 scroll-mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <SectionTitle sub={isRTL ? "الوصول لمنصة PHASE X" : "Access the PHASE X Platform"} color="#a855f7">
            {isRTL ? "الوصول للمنصة" : "Platform Access"}
          </SectionTitle>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <GlassCard glow="#a855f7" className="p-10">
              <div className="text-center mb-8">
                <div className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", boxShadow: "0 10px 30px rgba(168,85,247,0.25)" }}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <p className="text-base text-gray-400">{isRTL ? "PHASE X متاح من خلال منصة ويب آمنة" : "PHASE X is available through a secure web platform."}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Users, text: isRTL ? "وصول حساب شخصي" : "Personal account access", c: "#a855f7" },
                  { icon: BarChart3, text: isRTL ? "تغطية متعددة الأسواق" : "Multi-market coverage", c: "#448aff" },
                  { icon: Activity, text: isRTL ? "تحليل متعدد الأطر الزمنية" : "Multi-timeframe analysis", c: accent },
                  { icon: Zap, text: isRTL ? "تحديثات نظام مستمرة" : "Continuous system updates", c: "#ff6e40" }
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
                    {isRTL ? "دخول / طلب الوصول" : "Login / Request Access"}
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
            <GlassCard className="p-14 text-center space-y-8">
              <div className="space-y-3">
                <p className="text-xl md:text-2xl text-gray-400">{isRTL ? "الأسواق لا تحتاج لمزيد من المؤشرات." : "Markets don't need more indicators."}</p>
                <p className="text-2xl md:text-3xl font-black" style={{ color: accent }}>{isRTL ? "بل تحتاج لتمثيل أفضل." : "They need better representation."}</p>
              </div>
              <div className="h-[1px] w-20 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
              <div className="space-y-3">
                <p className="text-lg text-gray-500">{isRTL ? "PHASE X ليس ترقية." : "PHASE X is not an upgrade."}</p>
                <p className="text-2xl md:text-3xl font-black" style={{ color: accent }}>{isRTL ? "بل هو إعادة كتابة" : "It is a rewrite"}</p>
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
              © 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."} — Structural Market Intelligence Platform
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