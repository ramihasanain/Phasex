import { AlertTriangle, Tag } from "lucide-react";
import type { NewsEvent } from "../../phase-x/types";
import { translateTitle } from "../translateTitle";

interface BreakingNewsModalEventRowProps {
  event: NewsEvent;
  isRTL: boolean;
  impactColorStr: string;
  impactBgStr: string;
  impactLabel: string;
  dateFormatted: string;
  timeFormatted: string;
  setSearchQuery: (q: string) => void;
  readReportLabel: string;
  sourceLinkLabel: string;
  forecastValLabel: string;
  previousValLabel: string;
}

export function BreakingNewsModalEventRow({
  event,
  idx,
  isRTL,
  impactColorStr,
  impactBgStr,
  impactLabel,
  dateFormatted,
  timeFormatted,
  setSearchQuery,
  readReportLabel,
  sourceLinkLabel,
  forecastValLabel,
  previousValLabel,
}: BreakingNewsModalEventRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-black/40 hover:border-white/10 transition-colors">
      <div className="flex flex-col sm:w-28 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-white/5 pb-3 sm:pb-0 sm:pr-4 rtl:sm:border-l rtl:sm:border-r-0 rtl:sm:pl-4">
        <span className="text-sm font-bold text-white mb-0.5">{dateFormatted}</span>
        <span className="text-xs text-gray-400">{timeFormatted}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {event.matchedTags && event.matchedTags.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-emerald-400" />
              {event.matchedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] tracking-wide transition-colors"
                  dir="ltr"
                  title={isRTL ? `عرض أخبار ${tag}` : `Filter by ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : event.country ? (
            <button
              type="button"
              onClick={() => setSearchQuery(event.country!)}
              className="text-cyan-400 font-bold bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded text-xs transition-colors"
              dir="ltr"
              title={isRTL ? `عرض أخبار ${event.country}` : `Filter by ${event.country}`}
            >
              {event.country}
            </button>
          ) : null}

          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${impactBgStr}`}>
            <AlertTriangle className={`w-3 h-3 ${impactColorStr}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${impactColorStr}`}>{impactLabel}</span>
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-100" dir={isRTL && translateTitle(event.title, isRTL) !== event.title ? "rtl" : "ltr"}>
          {translateTitle(event.title, isRTL)}
        </h3>

        {event.body ? (
          <div className="mt-2">
            <p className="text-sm text-gray-400 leading-relaxed font-sans line-clamp-3" dir="ltr" dangerouslySetInnerHTML={{ __html: event.body }} />
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest border border-cyan-500/30 px-3 py-1.5 rounded bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
              >
                {event.provider ? (isRTL ? `اقرأ على ${event.provider} ↗` : `Read on ${event.provider} ↗`) : readReportLabel}
              </a>
            )}
          </div>
        ) : (
          <div className="mt-1.5 flex flex-col items-start gap-2">
            <p className="text-[10px] text-gray-500" dir="ltr">
              ({event.title})
            </p>
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest"
              >
                {event.provider ? (isRTL ? `المصدر: ${event.provider} ↗` : `Source: ${event.provider} ↗`) : sourceLinkLabel}
              </a>
            )}
          </div>
        )}
      </div>

      {(event.forecast || event.previous) && (
        <div className="flex sm:flex-col justify-end gap-4 sm:gap-2 sm:w-32 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-none border-white/5">
          {event.forecast && (
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">{forecastValLabel}</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/40 px-1.5 rounded">{event.forecast}</span>
            </div>
          )}
          {event.previous && (
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">{previousValLabel}</span>
              <span className="text-xs font-mono text-gray-400">{event.previous}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
