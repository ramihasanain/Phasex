import { Globe, Search, Tag } from "lucide-react";

interface BreakingNewsModalToolbarProps {
  isRTL: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchPlaceholder: string;
  uniqueTags: string[];
  allProviders: string[];
  providerFilter: string;
  setProviderFilter: (p: string) => void;
  providerStatuses: Record<string, "loading" | "ok" | "error" | "empty">;
  sourceFilterLabel: string;
}

export function BreakingNewsModalToolbar({
  isRTL,
  searchQuery,
  setSearchQuery,
  searchPlaceholder,
  uniqueTags,
  allProviders,
  providerFilter,
  setProviderFilter,
  providerStatuses,
  sourceFilterLabel,
}: BreakingNewsModalToolbarProps) {
  return (
    <div className="p-4 border-b border-white/5 bg-gray-900/50 flex flex-col gap-4">
      <div className="relative w-full">
        <Search className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full bg-black/50 border border-white/10 rounded-full py-3 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
        />
      </div>

      {uniqueTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-gray-300">{isRTL ? "العملات والأصول:" : "Assets & Tags:"}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                searchQuery === ""
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isRTL ? "الكل" : "All"}
            </button>
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  searchQuery.toLowerCase() === tag.toLowerCase()
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {allProviders.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-gray-300">{sourceFilterLabel}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setProviderFilter("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                providerFilter === "ALL"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isRTL ? "الكل" : "All"}
            </button>
            {allProviders.map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setProviderFilter(provider)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  providerFilter === provider
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                } ${providerStatuses[provider] === "error" ? "opacity-60" : ""}`}
              >
                {provider}
                {providerStatuses[provider] === "loading" && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                    title="Loading..."
                  />
                )}
                {providerStatuses[provider] === "error" && (
                  <span className="text-[10px] text-red-500 font-normal whitespace-nowrap">({isRTL ? "خلل من المصدر" : "Error"})</span>
                )}
                {providerStatuses[provider] === "empty" && (
                  <span className="text-[10px] text-gray-500 font-normal whitespace-nowrap">({isRTL ? "لا أخبار" : "No News"})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
