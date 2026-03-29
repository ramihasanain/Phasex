import type { Dispatch, SetStateAction } from "react";
import { TextQuote } from "lucide-react";
import type { NewsEvent } from "../../phase-x/types";
import { BreakingNewsModalEventRow } from "./BreakingNewsModalEventRow";

interface BreakingNewsModalEventListProps {
  filteredEvents: NewsEvent[];
  visibleCount: number;
  setVisibleCount: Dispatch<SetStateAction<number>>;
  isRTL: boolean;
  setSearchQuery: (q: string) => void;
  noNewsLabel: string;
  loadMoreLabel: string;
  t: (key: string) => string;
}

export function BreakingNewsModalEventList({
  filteredEvents,
  visibleCount,
  setVisibleCount,
  isRTL,
  setSearchQuery,
  noNewsLabel,
  loadMoreLabel,
  t,
}: BreakingNewsModalEventListProps) {
  if (filteredEvents.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-3">
          <TextQuote className="w-10 h-10 opacity-20" />
          <p>{noNewsLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
      {filteredEvents.slice(0, visibleCount).map((event, idx) => {
        let impactColorStr = "text-gray-400";
        let impactBgStr = "bg-gray-500/10 border-gray-500/20";
        let impactLabel = t("impactNormal");

        if (event.impact === "High") {
          impactColorStr = "text-red-400";
          impactBgStr = "bg-red-500/10 border-red-500/20";
          impactLabel = t("impactHigh");
        } else if (event.impact === "Medium") {
          impactColorStr = "text-orange-400";
          impactBgStr = "bg-orange-500/10 border-orange-500/20";
          impactLabel = t("impactMedium");
        } else if (event.impact === "Low") {
          impactColorStr = "text-yellow-400";
          impactBgStr = "bg-yellow-500/10 border-yellow-500/20";
          impactLabel = t("impactLow");
        }

        const eventDate = new Date(event.date);
        const dateFormatted = eventDate.toLocaleDateString(isRTL ? "ar-EG" : "en-US", { weekday: "short", month: "short", day: "numeric" });
        const timeFormatted = eventDate.toLocaleTimeString(isRTL ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" });

        return (
          <BreakingNewsModalEventRow
            key={event.id || idx}
            event={event}
            isRTL={isRTL}
            impactColorStr={impactColorStr}
            impactBgStr={impactBgStr}
            impactLabel={impactLabel}
            dateFormatted={dateFormatted}
            timeFormatted={timeFormatted}
            setSearchQuery={setSearchQuery}
            readReportLabel={t("readReport")}
            sourceLinkLabel={t("sourceLink")}
            forecastValLabel={t("forecastVal")}
            previousValLabel={t("previousVal")}
          />
        );
      })}

      {visibleCount < filteredEvents.length && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 20)}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold text-gray-300 transition-colors"
          >
            {loadMoreLabel}
          </button>
        </div>
      )}
    </div>
  );
}
