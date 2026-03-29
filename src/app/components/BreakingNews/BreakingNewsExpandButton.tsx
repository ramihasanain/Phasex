import { Maximize2 } from "lucide-react";

interface BreakingNewsExpandButtonProps {
  isRTL: boolean;
  label: string;
  onClick: () => void;
}

export function BreakingNewsExpandButton({ isRTL, label, onClick }: BreakingNewsExpandButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 px-3 h-full border-l border-white/10 hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest text-cyan-400 flex-shrink-0"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Maximize2 className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
