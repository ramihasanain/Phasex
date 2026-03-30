import { BreakingNews } from "../BreakingNews";

export function LandingBreakingNewsStrip() {
  return (
    <div className="relative z-40 bg-black/40 border-b border-white/5 py-2 overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1700px]">
        <BreakingNews selectedSymbol="EURUSD" selectedCategory="All" />
      </div>
    </div>
  );
}
