import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { disclaimerFR } from "../../locales/legal_fr";
import { disclaimerES } from "../../locales/legal_es";
import { disclaimerEN, disclaimerAR, disclaimerTR, disclaimerRU } from "./data/disclaimerLocal";
import { LegalModalFrame } from "./LegalModalFrame";
import { pickByLang } from "./pickByLang";
import type { TermsModalProps } from "./types";

export function LegalDisclaimerModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#ff6e40";
    const accentG = "rgba(255,110,64,";
    const sections = pickByLang(language, {
        en: disclaimerEN,
        ar: disclaimerAR,
        tr: disclaimerTR,
        ru: disclaimerRU,
        fr: disclaimerFR,
        es: disclaimerES,
    });

    const headerTitle =
        language === "ar"
            ? "إخلاء المسؤولية القانونية"
            : language === "tr"
              ? "Yasal Uyarı"
              : language === "ru"
                ? "Отказ от ответственности"
                : language === "fr"
                  ? "Avertissement Légal"
                  : language === "es"
                    ? "Aviso Legal"
                    : "Legal Disclaimer";

    const warningText =
        language === "ar"
            ? "⚠️ تحذير: الأسواق المالية تنطوي على مخاطر عالية. قد تخسر رأس مالك بالكامل."
            : language === "tr"
              ? "⚠️ Uyarı: Finansal piyasalar önemli riskler içerir. Tüm sermayenizi kaybedebilirsiniz."
              : language === "ru"
                ? "⚠️ Внимание: Финансовые рынки несут значительный риск. Вы можете потерять весь свой капитал."
                : language === "fr"
                  ? "⚠️ Avertissement : Les marchés financiers comportent des risques importants. Vous pouvez perdre tout votre capital."
                  : language === "es"
                    ? "⚠️ Advertencia: Los mercados financieros conllevan un riesgo significativo. Puede perder todo su capital."
                    : "⚠️ Warning: Financial markets carry significant risk. You may lose your entire capital.";

    return (
        <LegalModalFrame
            isOpen={isOpen}
            onClose={onClose}
            accent={accent}
            accentG={accentG}
            isRTL={isRTL}
            headerIcon={AlertTriangle}
            headerTitle={headerTitle}
            scrollClassName="space-y-4"
        >
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${accentG}0.06)`, border: `1px solid ${accentG}0.15)` }}>
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <p className="text-[13px] font-bold" style={{ color: accent }}>
                    {warningText}
                </p>
            </div>
            {sections.map((section, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl p-5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <p className="text-[13px] text-gray-400 leading-relaxed">{section.text}</p>
                    {"items" in section && section.items ? (
                        <ul className={`space-y-1.5 mt-2 ${isRTL ? "pr-4" : "pl-4"}`}>
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
                </motion.div>
            ))}
            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                <p className="text-xs text-gray-500">© 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}</p>
            </div>
        </LegalModalFrame>
    );
}

export function LegalDisclaimerButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(255,110,64,0.06)", border: "1px solid rgba(255,110,64,0.15)", color: "#ff6e40" }}
        >
            <AlertTriangle className="w-3.5 h-3.5" />
            {t("legalDisclaimer")}
        </motion.button>
    );
}
