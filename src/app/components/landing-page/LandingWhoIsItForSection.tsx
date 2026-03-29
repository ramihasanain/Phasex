import { motion } from "motion/react";
import { Briefcase, Eye, LineChart, Shield, Users } from "lucide-react";
import { ACCENT, ACCENT_G } from "./constants";
import type { LandingT } from "./landingTypes";
import { SectionTitle } from "./SectionTitle";

interface LandingWhoIsItForSectionProps {
  t: LandingT;
}

export function LandingWhoIsItForSection({ t }: LandingWhoIsItForSectionProps) {
  const accent = ACCENT;
  const accentG = ACCENT_G;

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("builtForSeriousParticipants")}>{t("whoPhaseXIsFor")}</SectionTitle>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {[
            { icon: Users, text: t("forProTraders") },
            { icon: LineChart, text: t("forQuantAnalysts") },
            { icon: Briefcase, text: t("forPortfolioManagers") },
            { icon: Shield, text: t("forInstitutions") },
            { icon: Eye, text: t("forIndependentTraders") },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.04 }}>
                <div className="p-5 rounded-xl flex items-center gap-4" style={{ background: `${accent}05`, border: `1px solid ${accent}12` }}>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accent}, #00c890)`, boxShadow: `0 5px 15px ${accentG}0.2)` }}
                  >
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
  );
}
