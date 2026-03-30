import { motion } from "motion/react";
import { Activity, ArrowRight, BarChart3, Shield, Users, Zap } from "lucide-react";
import { ACCENT } from "./constants";
import { GlassCard } from "./GlassCard";
import type { LandingT } from "./landingTypes";
import { SectionTitle } from "./SectionTitle";

interface LandingPlatformAccessSectionProps {
  t: LandingT;
  onGetStarted: () => void;
}

export function LandingPlatformAccessSection({ t, onGetStarted }: LandingPlatformAccessSectionProps) {
  const accent = ACCENT;

  return (
    <section id="access" className="py-20 scroll-mt-16 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("accessPlatformSub")} color="#a855f7">
          {t("platformAccess")}
        </SectionTitle>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
          <GlassCard glow="#a855f7" className="p-6 md:p-10">
            <div className="text-center mb-8">
              <div
                className="inline-flex w-16 h-16 rounded-xl items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", boxShadow: "0 10px 30px rgba(168,85,247,0.25)" }}
              >
                <Shield className="w-8 h-8 text-white" />
              </div>
              <p className="text-base text-gray-400">{t("secureWebPlatform")}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Users, text: t("personalAccountAccess"), c: "#a855f7" },
                { icon: BarChart3, text: t("multiMarketCoverage"), c: "#448aff" },
                { icon: Activity, text: t("multiTimeframeAnalysis"), c: accent },
                { icon: Zap, text: t("continuousSystemUpdates"), c: "#ff6e40" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="p-5 rounded-xl transition-all"
                    style={{ background: `${item.c}06`, border: `1px solid ${item.c}12` }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.c}15`, boxShadow: `0 0 15px ${item.c}15` }}>
                      <Icon className="w-5 h-5" style={{ color: item.c }} />
                    </div>
                    <p className="text-sm font-bold text-white">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl text-base font-black tracking-wider relative overflow-hidden cursor-pointer"
                style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "white", boxShadow: "0 10px 40px rgba(168,85,247,0.3)" }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
                  animate={{ left: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
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
}
