import { motion } from "motion/react";
import { Eye } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { privacyFR } from "../../locales/legal_fr";
import { privacyES } from "../../locales/legal_es";
import { privacyEN, privacyAR, privacyTR, privacyRU } from "./data/privacyLocal";
import { LegalModalFrame } from "./LegalModalFrame";
import { pickByLang } from "./pickByLang";
import type { TermsModalProps } from "./types";

export function PrivacyPolicyModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#06b6d4";
    const accentG = "rgba(6,182,212,";
    const sections = pickByLang(language, { en: privacyEN, ar: privacyAR, tr: privacyTR, ru: privacyRU, fr: privacyFR, es: privacyES });

    const headerTitle =
        language === "ar"
            ? "سياسة الخصوصية"
            : language === "tr"
              ? "Gizlilik Politikası"
              : language === "ru"
                ? "Политика конфиденциальности"
                : language === "fr"
                  ? "Politique de Confidentialité"
                  : language === "es"
                    ? "Política de Privacidad"
                    : "Privacy Policy";

    return (
        <LegalModalFrame
            isOpen={isOpen}
            onClose={onClose}
            accent={accent}
            accentG={accentG}
            isRTL={isRTL}
            headerIcon={Eye}
            headerTitle={headerTitle}
        >
            {sections.map((section, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl p-5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                        <Eye className="w-4 h-4 flex-shrink-0" />
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
                        <p className="text-[13px] text-gray-400 leading-relaxed mt-2 font-medium">{(section as { after: string }).after}</p>
                    ) : null}
                    {"subsections" in section && (section as { subsections?: unknown[] }).subsections ? (
                        <div className="space-y-3 mt-2">
                            {(section as { subsections: { sub: string; desc: string; items?: string[] }[] }).subsections.map((sub, j) => (
                                <div
                                    key={j}
                                    className="rounded-lg p-3"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}
                                >
                                    <h4 className="text-[13px] font-bold text-white mb-1">{sub.sub}</h4>
                                    <p className="text-[12px] text-gray-500 leading-relaxed">{sub.desc}</p>
                                    {sub.items ? (
                                        <ul className={`space-y-1 mt-1.5 ${isRTL ? "pr-3" : "pl-3"}`}>
                                            {sub.items.map((item, k) => (
                                                <li key={k} className="text-[12px] text-gray-500 flex items-start gap-2">
                                                    <span
                                                        className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: accent, opacity: 0.4 }}
                                                    />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : null}
                </motion.div>
            ))}
            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                <p className="text-xs text-gray-500">© 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}</p>
            </div>
        </LegalModalFrame>
    );
}

export function PrivacyPolicyButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)", color: "#06b6d4" }}
        >
            <Eye className="w-3.5 h-3.5" />
            {t("privacyPolicy")}
        </motion.button>
    );
}
