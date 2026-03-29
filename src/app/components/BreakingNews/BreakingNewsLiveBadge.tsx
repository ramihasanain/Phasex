import { RadioTower } from "lucide-react";

interface BreakingNewsLiveBadgeProps {
  isRTL: boolean;
  label: string;
}

export function BreakingNewsLiveBadge({ isRTL, label }: BreakingNewsLiveBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-3 border-r border-white/10 h-full flex-shrink-0" dir={isRTL ? "rtl" : "ltr"}>
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1.5">
        <RadioTower className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </span>
    </div>
  );
}
