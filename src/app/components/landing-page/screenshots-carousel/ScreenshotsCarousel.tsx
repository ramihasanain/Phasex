import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionTitle } from "../section-title/SectionTitle";
import { SCREENSHOTS } from "./utils/screenshots";

const accent = "#00e5a0";
const accentG = "rgba(0,229,160,";

function NavButton({
  side,
  isRTL,
  onClick,
}: {
  side: "prev" | "next";
  isRTL: boolean;
  onClick: () => void;
}) {
  const isPrev = side === "prev";
  const positionClass = isPrev
    ? isRTL
      ? "right-2 md:right-3"
      : "left-2 md:left-3"
    : isRTL
      ? "left-2 md:left-3"
      : "right-2 md:right-3";

  const Icon = isPrev
    ? isRTL
      ? ChevronRight
      : ChevronLeft
    : isRTL
      ? ChevronLeft
      : ChevronRight;

  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${positionClass} w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer`}
      style={{
        background: "rgba(6,10,16,0.8)",
        border: `1px solid ${accentG}0.15)`,
      }}
    >
      <Icon className="w-5 h-5 text-white" />
    </button>
  );
}

const ScreenshotsCarousel = () => {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const screenshots = useMemo(() => {
    return SCREENSHOTS.map((s) => ({
      url: s.url,
      title: t(s.titleKey),
      description: t(s.descriptionKey),
    }));
  }, [t]);

  const total = screenshots.length;
  const goTo = (nextIndex: number) =>
    setCurrentScreenshot(((nextIndex % total) + total) % total);
  const goPrev = () => goTo(currentScreenshot - 1);
  const goNext = () => goTo(currentScreenshot + 1);

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <SectionTitle sub={t("professionalInterface")}>
          {t("seePlatformUpClose")}
        </SectionTitle>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreenshot}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                  border: `1px solid ${accentG}0.12)`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${accentG}0.05)`,
                }}
              >
                <img
                  src={screenshots[currentScreenshot].url}
                  alt={screenshots[currentScreenshot].title}
                  className="w-full object-contain max-h-[300px] md:max-h-[500px]"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,10,16,0.95) 0%, transparent 100%)",
                  }}
                >
                  <h3 className="text-xl font-black text-white mb-1">
                    {screenshots[currentScreenshot].title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {screenshots[currentScreenshot].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <NavButton side="prev" isRTL={isRTL} onClick={goPrev} />
          <NavButton side="next" isRTL={isRTL} onClick={goNext} />

          <div className="flex items-center justify-center gap-2 mt-6">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all cursor-pointer"
                style={{
                  width: i === currentScreenshot ? 32 : 10,
                  height: 10,
                  background:
                    i === currentScreenshot ? accent : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsCarousel;
