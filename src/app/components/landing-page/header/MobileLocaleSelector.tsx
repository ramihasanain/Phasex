import { useLanguage } from "@/app/contexts/LanguageContext";
import { languageOptions } from "@/app/utils/languageOptions";

const accent = "#00e5a0";

export default function MobileLocaleSelector({
  onSelect,
}: {
  onSelect: () => void;
}) {
  const { language, setLanguageKey } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {languageOptions.map((lang) => (
        <button
          key={lang.code}
          onClick={() => {
            setLanguageKey(lang.code as any);
            onSelect();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
            language === lang.code
              ? "bg-white/10 text-white font-bold"
              : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
          }`}
          style={{
            border:
              language === lang.code
                ? `1px solid ${accent}40`
                : "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <img
            src={`https://flagcdn.com/${lang.flagUrl}.svg`}
            alt={lang.code}
            className="w-4 h-auto rounded-sm"
          />
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
