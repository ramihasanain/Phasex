import { RefreshCw } from "lucide-react";

interface BreakingNewsLoadingProps {
  label: string;
}

export function BreakingNewsLoading({ label }: BreakingNewsLoadingProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs text-gray-400">
      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      {label}
    </div>
  );
}
