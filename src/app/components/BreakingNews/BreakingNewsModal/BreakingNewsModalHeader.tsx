import { Globe, X } from "lucide-react";

interface BreakingNewsModalHeaderProps {
  title: string;
  subtitle: string;
  onClose: () => void;
}

export function BreakingNewsModalHeader({ title, subtitle, onClose }: BreakingNewsModalHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-white/5 bg-black/40 gap-4">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Globe className="text-cyan-400 w-6 h-6" />
          {title}
        </h2>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
