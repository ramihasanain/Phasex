import { motion } from "motion/react";
import { FileText, Shield } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { termsFR } from "../../locales/legal_fr";
import { termsES } from "../../locales/legal_es";
import { termsEN, termsAR, termsTR, termsRU } from "./data/termsLocal";
import { LegalModalFrame } from "./LegalModalFrame";
import { pickByLang } from "./pickByLang";
import type { TermsModalProps } from "./types";

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";
    const terms = pickByLang(language, { en: termsEN, ar: termsAR, tr: termsTR, ru: termsRU, fr: termsFR, es: termsES });

    const headerTitle =
        language === "ar"
            ? "الشروط والأحكام"
            : language === "tr"
              ? "Şartlar ve Koşullar"
              : language === "ru"
                ? "Условия и положения"
                : language === "fr"
                  ? "Termes et Conditions"
                  : language === "es"
                    ? "Términos y Condiciones"
                    : "Terms and Conditions";

    return (
        <LegalModalFrame
            isOpen={isOpen}
            onClose={onClose}
            accent={accent}
            accentG={accentG}
            isRTL={isRTL}
            headerIcon={Shield}
            headerTitle={headerTitle}
        >
            {terms.map((section, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl p-5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        {section.title}
                    </h3>
                    {"text" in section && section.text ? (
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
                    {"after" in section && (section as { after?: string }).after ? (
                        <p className="text-[13px] text-gray-400 leading-relaxed mt-2">{(section as { after: string }).after}</p>
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

export function TermsButton({ onClick }: { onClick: () => void }) {
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
            <FileText className="w-3.5 h-3.5" />
            {t("termsAndConditions")}
        </motion.button>
    );
}
