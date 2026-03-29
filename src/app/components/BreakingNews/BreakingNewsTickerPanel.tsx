import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { NewsEvent } from "../phase-x/types";
import { translateTitle } from "./translateTitle";

interface BreakingNewsTickerPanelProps {
  activeIndex: number;
  isRTL: boolean;
  currentEvent: NewsEvent;
  impactColorStr: string;
  impactBgStr: string;
  impactLabel: string;
}

export function BreakingNewsTickerPanel({
  activeIndex,
  isRTL,
  currentEvent,
  impactColorStr,
  impactBgStr,
  impactLabel,
}: BreakingNewsTickerPanelProps) {
  return (
    <div className="flex-1 overflow-hidden relative h-full flex items-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 w-full whitespace-nowrap overflow-hidden"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${impactBgStr}`}>
            <AlertTriangle className={`w-3 h-3 ${impactColorStr}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${impactColorStr}`}>{impactLabel}</span>
          </div>

          <a
            href={
              currentEvent.url ||
              `https://www.forexfactory.com/calendar?day=${currentEvent.date.split("T")[0].split("-").slice(1).join("-")}-${currentEvent.date.split("-")[0]}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-gray-200 hover:text-white hover:underline decoration-white/30 underline-offset-4 cursor-pointer"
            dir={isRTL && translateTitle(currentEvent.title, isRTL) !== currentEvent.title ? "rtl" : "ltr"}
          >
            {currentEvent.country && (
              <span className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 rounded no-underline" dir="ltr">
                {currentEvent.country}
              </span>
            )}
            <span className="truncate max-w-[200px] md:max-w-[400px]">{translateTitle(currentEvent.title, isRTL)}</span>
          </a>

          {(currentEvent.forecast || currentEvent.previous) && (
            <div className="hidden lg:flex items-center gap-3 text-[10px] font-medium text-gray-500 ml-auto mr-4" dir="ltr">
              {currentEvent.forecast && (
                <span>
                  <span className="text-gray-600">F:</span> {currentEvent.forecast}
                </span>
              )}
              {currentEvent.previous && (
                <span>
                  <span className="text-gray-600">P:</span> {currentEvent.previous}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
