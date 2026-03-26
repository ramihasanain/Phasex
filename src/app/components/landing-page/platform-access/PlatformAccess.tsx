import { motion } from "motion/react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { SectionTitle } from "../section-title/SectionTitle";
import { GlassCard } from "../glass-card/GlassCard";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { PlatformAccessFeatureCard } from "./PlatformAccessFeatureCard";

const accent = "#00e5a0";

const PLATFORM_ACCESS_FEATURES = [
  { icon: Users, textKey: "personalAccountAccess", color: "#a855f7" },
  { icon: BarChart3, textKey: "multiMarketCoverage", color: "#448aff" },
  { icon: Activity, textKey: "multiTimeframeAnalysis", color: accent },
  { icon: Zap, textKey: "continuousSystemUpdates", color: "#ff6e40" },
] as const;

const PlatformAccess = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const { t } = useLanguage();

  return (
    <section id="access" className="py-20 scroll-mt-16 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("accessPlatformSub")} color="#a855f7">
          {t("platformAccess")}
        </SectionTitle>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard glow="#a855f7" className="p-6 md:p-10">
            <div className="text-center mb-8">
              <div
                className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-4"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #6366f1)",
                  boxShadow: "0 10px 30px rgba(168,85,247,0.25)",
                }}
              >
                <Shield className="w-8 h-8 text-white" />
              </div>
              <p className="text-base text-gray-400">
                {t("secureWebPlatform")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {PLATFORM_ACCESS_FEATURES.map((item, i) => (
                <PlatformAccessFeatureCard
                  key={item.textKey}
                  icon={item.icon}
                  text={t(item.textKey)}
                  color={item.color}
                  index={i}
                />
              ))}
            </div>

            <div className="text-center">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl text-base font-black tracking-wider relative overflow-hidden cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #6366f1)",
                  color: "white",
                  boxShadow: "0 10px 40px rgba(168,85,247,0.3)",
                }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                  }}
                  animate={{ left: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1,
                  }}
                />
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
  );
};

export default PlatformAccess;
