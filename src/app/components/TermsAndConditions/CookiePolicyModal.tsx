import { motion } from "motion/react";
import { Cookie } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { cookieFR } from "../../locales/legal_fr";
import { cookieES } from "../../locales/legal_es";
import { cookieEN, cookieAR, cookieTR, cookieRU } from "./data/cookieLocal";
import { LegalModalFrame } from "./LegalModalFrame";
import { pickByLang } from "./pickByLang";
import type { TermsModalProps } from "./types";

export function CookiePolicyModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";
    const sections = pickByLang(language, { en: cookieEN, ar: cookieAR, tr: cookieTR, ru: cookieRU, fr: cookieFR, es: cookieES });

    const headerTitle =
        language === "ar"
            ? "سياسة ملفات الارتباط"
            : language === "tr"
              ? "Çerez Politikası"
              : language === "ru"
                ? "Политика использования файлов cookie"
                : language === "fr"
                  ? "Politique des Cookies"
                  : language === "es"
                    ? "Política de Cookies"
                    : "Cookie Policy";

    return (
        <LegalModalFrame
            isOpen={isOpen}
            onClose={onClose}
            accent={accent}
            accentG={accentG}
            isRTL={isRTL}
            headerIcon={Cookie}
            headerTitle={headerTitle}
        >
            {sections.map((section, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl p-5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                        <Cookie className="w-4 h-4 flex-shrink-0" />
                        {section.title}
                    </h3>
                    {section.text ? (
                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                    ) : null}
                    {"items" in section && section.items ? (
                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                            {section.items.map((item, j) => (
                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                    <span
                                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: accent, opacity: 0.5 }}
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                    {"subsections" in section && (section as { subsections?: { sub: string; desc: string }[] }).subsections ? (
                        <div className="space-y-3 mt-2">
                            {(section as { subsections: { sub: string; desc: string }[] }).subsections.map((sub, j) => (
                                <div
                                    key={j}
                                    className="rounded-lg p-3"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}
                                >
                                    <h4 className="text-[13px] font-bold text-white mb-1">{sub.sub}</h4>
                                    <p className="text-[12px] text-gray-500 leading-relaxed">{sub.desc}</p>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </motion.div>
            ))}

            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                <p className="text-xs text-gray-500">
                    © 2024 PHASE X AI.{" "}
                    {language === "ar"
                        ? "جميع الحقوق محفوظة"
                        : language === "tr"
                          ? "Tüm hakları saklıdır."
                          : language === "ru"
                            ? "Все права защищены."
                            : "All rights reserved."}
                </p>
            </div>
        </LegalModalFrame>
    );
}

export function CookieButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{
                background: `${accentG}0.06)`,
                border: `1px solid ${accentG}0.15)`,
                color: accent,
            }}
        >
            <Cookie className="w-3.5 h-3.5" />
            {t("cookiePolicy")}
        </motion.button>
    );
}
