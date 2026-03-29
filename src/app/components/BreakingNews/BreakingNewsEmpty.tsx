import { Globe } from "lucide-react";

interface BreakingNewsEmptyProps {
  label: string;
}

export function BreakingNewsEmpty({ label }: BreakingNewsEmptyProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs text-gray-400">
      <Globe className="w-3.5 h-3.5 opacity-50" />
      {label}
    </div>
  );
}
