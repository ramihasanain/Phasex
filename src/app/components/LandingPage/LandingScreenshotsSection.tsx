import type { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ACCENT, ACCENT_G } from "./constants";
import type { LandingT } from "./landingTypes";
import type { ScreenshotSlide } from "./screenshotsData";
import { SectionTitle } from "./SectionTitle";

interface LandingScreenshotsSectionProps {
  t: LandingT;
  isRTL: boolean;
  screenshots: ScreenshotSlide[];
  currentScreenshot: number;
  setCurrentScreenshot: Dispatch<SetStateAction<number>>;
}

export function LandingScreenshotsSection({
  t,
  isRTL,
  screenshots,
  currentScreenshot,
  setCurrentScreenshot,
}: LandingScreenshotsSectionProps) {
  const accent = ACCENT;
  const accentG = ACCENT_G;

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("professionalInterface")}>{t("seePlatformUpClose")}</SectionTitle>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreenshot}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl overflow-hidden relative" style={{ border: `1px solid ${accentG}0.12)`, boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${accentG}0.05)` }}>
                <img src={screenshots[currentScreenshot].url} alt={screenshots[currentScreenshot].title} className="w-full object-contain max-h-[300px] md:max-h-[500px]" />
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, rgba(6,10,16,0.95) 0%, transparent 100%)" }}>
                  <h3 className="text-xl font-black text-white mb-1">{screenshots[currentScreenshot].title}</h3>
                  <p className="text-sm text-gray-400">{screenshots[currentScreenshot].description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setCurrentScreenshot((p) => (p - 1 + screenshots.length) % screenshots.length)}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-2 md:right-3" : "left-2 md:left-3"} w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer`}
            style={{ background: "rgba(6,10,16,0.8)", border: `1px solid ${accentG}0.15)` }}
          >
            {isRTL ? <ChevronRight className="w-5 h-5 text-white" /> : <ChevronLeft className="w-5 h-5 text-white" />}
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreenshot((p) => (p + 1) % screenshots.length)}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-2 md:left-3" : "right-2 md:right-3"} w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer`}
            style={{ background: "rgba(6,10,16,0.8)", border: `1px solid ${accentG}0.15)` }}
          >
            {isRTL ? <ChevronLeft className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
          </button>

          <div className="flex items-center justify-center gap-2 mt-6">
            {screenshots.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentScreenshot(i)}
                className="rounded-full transition-all cursor-pointer"
                style={{ width: i === currentScreenshot ? 32 : 10, height: 10, background: i === currentScreenshot ? accent : "rgba(255,255,255,0.1)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
