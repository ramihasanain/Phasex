import { useLanguage } from "@/app/contexts/LanguageContext";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const accent = "#00e5a0";
const accentG = "rgba(0,229,160,";

const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden scroll-mt-32">
      {/* Warp tunnel concentric rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${i * 250}px`,
              height: `${i * 250}px`,
              border: `1px solid ${accentG}${0.06 / i})`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.25 / i, 0.1],
            }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Central energy glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          className="w-[400px] h-[400px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentG}0.08) 0%, ${accentG}0.02) 40%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            top: "-30%",
            left: "-15%",
            background: `radial-gradient(circle, ${accentG}0.07) 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            bottom: "-20%",
            right: "-10%",
            background: `radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: `${accentG}0.06)`,
              border: `1px solid ${accentG}0.15)`,
            }}
            animate={{
              boxShadow: [
                `0 0 15px ${accentG}0.1)`,
                `0 0 30px ${accentG}0.2)`,
                `0 0 15px ${accentG}0.1)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: accent }} />
            </motion.div>
            <span className="text-sm font-bold" style={{ color: accent }}>
              {t("marketPerceptionPlatform")}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-8xl font-black mb-5"
            animate={{
              textShadow: [
                `0 0 30px ${accentG}0.2)`,
                `0 0 60px ${accentG}0.35)`,
                `0 0 30px ${accentG}0.2)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span style={{ color: accent }}>PHASE X AI</span>
          </motion.h1>

          <h2 className="text-xl md:text-4xl mb-8 text-gray-500 font-light">
            {t("theMarketRewritten")}
          </h2>

          <motion.div
            className="h-[2px] w-24 mx-auto mb-8"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
            animate={{ width: ["96px", "200px", "96px"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          <div className="space-y-3 mb-10">
            <p className="text-lg md:text-xl text-gray-400">
              {t("newWayToSee")}
            </p>
            <p className="text-base md:text-lg text-gray-500">
              {t("notAsCharts")}
            </p>
            <div className="pt-3">
              <p className="text-base text-gray-500">{t("dontAnalyze")}</p>
              <motion.p
                className="text-xl md:text-2xl font-bold mt-2"
                style={{ color: accent }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {t("perceiveStructure")}
              </motion.p>
            </div>
          </div>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ y: { duration: 2.5, repeat: Infinity } }}
            className="text-base px-7 py-4 md:text-lg md:px-10 md:py-5 rounded-2xl font-black tracking-wider relative overflow-hidden cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${accent}, #00c890)`,
              color: "#060a10",
              boxShadow: `0 15px 50px ${accentG}0.3), 0 0 80px ${accentG}0.1)`,
            }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
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
              {t("enterPlatform")}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
