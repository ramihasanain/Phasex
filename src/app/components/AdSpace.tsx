import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { ExternalLink, Sparkles } from "lucide-react";
import { useThemeTokens } from "../hooks/useThemeTokens";

export function AdSpace() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const tk = useThemeTokens();

  const ads = [
    {
      title: isRTL ? "افتح حساب تداول حقيقي" : "Open Real Trading Account",
      desc: isRTL ? "ابدأ التداول الحقيقي مع أفضل الوسطاء" : "Start real trading with top brokers",
      img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
      accent: "#06b6d4",
      gradFrom: "#0e7490",
      gradTo: "#0891b2",
    },
    {
      title: isRTL ? "دورة تداول احترافية" : "Professional Trading Course",
      desc: isRTL ? "تعلم التداول من الصفر حتى الاحتراف" : "Learn trading from zero to pro",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
      accent: "#c026d3",
      gradFrom: "#7e22ce",
      gradTo: "#c026d3",
    },
    {
      title: isRTL ? "استراتيجيات تداول مجانية" : "Free Trading Strategies",
      desc: isRTL ? "استراتيجيات مجربة ومضمونة" : "Tested and proven strategies",
      img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80",
      accent: "#f97316",
      gradFrom: "#ea580c",
      gradTo: "#f97316",
    },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {ads.map((ad, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
          whileHover={{ y: -3, scale: 1.01 }}
          className="relative rounded-xl overflow-hidden cursor-pointer group"
          style={{ background: tk.surface, border: `1px solid ${tk.border}`, flex: 1 }}>

          {/* Image */}
          <div className="absolute inset-0">
            <img src={ad.img} alt="" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${ad.gradFrom}cc 0%, ${ad.gradTo}66 50%, transparent 100%)` }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
          </div>

          {/* Sparkle */}
          <motion.div className="absolute top-3 right-3 z-10"
            animate={{ rotate: [0, 180, 360], scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity }}>
            <Sparkles className="w-5 h-5" style={{ color: ad.accent, filter: `drop-shadow(0 0 6px ${ad.accent}60)` }} />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end p-4">
            <h3 className="text-[13px] font-bold mb-0.5" style={{ color: "#f1f5f9" }}>{ad.title}</h3>
            <p className="text-[10px] mb-3" style={{ color: "rgba(241,245,249,0.6)" }}>{ad.desc}</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${ad.gradFrom}, ${ad.gradTo})`, color: "#fff", boxShadow: `0 4px 15px ${ad.accent}30` }}>
              {isRTL ? "اكتشف المزيد" : "Learn More"}
              <ExternalLink className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
