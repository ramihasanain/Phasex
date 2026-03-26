import { motion } from "motion/react";
import { SectionTitle } from "../section-title/SectionTitle";
import { GlassCard } from "../glass-card/GlassCard";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Brain } from "lucide-react";

const accent = "#00e5a0";
const accentG = "rgba(0,229,160,";

const DecisionEngine = () => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <section id="decision-engine" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("decisionEngineSub")}>
          {t("structuralDecisionEngine")}
        </SectionTitle>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard glow={accent} className="p-5 md:p-14">
            <div className="mb-8 flex justify-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accentG}0.15), ${accentG}0.02))`,
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 border border-dashed rounded-2xl"
                  style={{ borderColor: accent, opacity: 0.3 }}
                />
                <Brain
                  className="w-10 h-10 relative z-10"
                  style={{ color: accent }}
                />
              </div>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed text-justify px-2 md:px-8">
              <p>{t("engineDesc1")}</p>
              <p>{t("engineDesc2")}</p>
              <div
                className="font-bold py-4 px-6 mt-6 rounded-xl relative overflow-hidden"
                style={{
                  background: "rgba(0, 229, 160, 0.05)",
                  border: `1px solid ${accentG}0.2)`,
                }}
              >
                <div
                  className={`absolute top-0 bottom-0 ${isRTL ? "right-0" : "left-0"} w-1.5`}
                  style={{ background: accent }}
                />
                <p className="relative z-10" style={{ color: "white" }}>
                  {t("engineDesc3")}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default DecisionEngine;
