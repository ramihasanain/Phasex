import { motion } from "motion/react";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { riskFR } from "../../locales/legal_fr";
import { riskES } from "../../locales/legal_es";
import { riskEN, riskAR, riskTR, riskRU } from "./data/riskLocal";
import { LegalModalFrame } from "./LegalModalFrame";
import { pickByLang } from "./pickByLang";
import type { TermsModalProps } from "./types";

export function RiskDisclosureModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#ef4444";
    const accentG = "rgba(239,68,68,";
    const sections = pickByLang(language, { en: riskEN, ar: riskAR, tr: riskTR, ru: riskRU, fr: riskFR, es: riskES });

    const headerTitle =
        language === "ar"
            ? "إفصاح المخاطر"
            : language === "tr"
              ? "Risk Açıklaması"
              : language === "ru"
                ? "Уведомление о рисках"
                : language === "fr"
                  ? "Divulgation des Risques"
                  : language === "es"
                    ? "Divulgación de Riesgos"
                    : "Risk Disclosure";

    const bannerTitle =
        language === "ar"
            ? "⚠️ تحذير مخاطر عالية"
            : language === "tr"
              ? "⚠️ YÜKSEK RİSK UYARISI"
              : language === "ru"
                ? "⚠️ ПРЕДУПРЕЖДЕНИЕ О ВЫСОКОМ РИСКЕ"
                : language === "fr"
                  ? "⚠️ AVERTISSEMENT DE MÀ DANGER"
                  : language === "es"
                    ? "⚠️ ADVERTENCIA DE ALTO RIESGO"
                    : "⚠️ HIGH RISK WARNING";

    const bannerBody =
        language === "ar"
            ? "التداول في الأسواق المالية ينطوي على مخاطر كبيرة. قد تخسر رأس مالك بالكامل."
            : language === "tr"
              ? "Finansal piyasalarda işlem yapmak önemli riskler içerir. Yatırım yaptığınız tüm sermayeyi kaybedebilirsiniz."
              : language === "ru"
                ? "Торговля на финансовых рынках сопряжена со значительным риском. Вы можете потерять весь инвестированный капитал."
                : language === "fr"
                  ? "Le trading sur les marchés financiers implique un risque très élevé. Vous pouvez perdre tout votre capital investi."
                  : language === "es"
                    ? "Operar en los mercados financieros implica un riesgo significativo. Puede perder todo su capital."
                    : "Trading financial markets involves significant risk. You may lose your entire invested capital.";

    const footerLine2 =
        language === "ar"
            ? "جميع الحقوق محفوظة"
            : language === "tr"
              ? "Tüm hakları saklıdır."
              : language === "ru"
                ? "Все права защищены."
                : language === "fr"
                  ? "Tous droits réservés."
                  : language === "es"
                    ? "Todos los derechos reservados."
                    : "All rights reserved.";

    return (
        <LegalModalFrame
            isOpen={isOpen}
            onClose={onClose}
            accent={accent}
            accentG={accentG}
            isRTL={isRTL}
            headerIcon={ShieldAlert}
            headerTitle={headerTitle}
            scrollClassName="space-y-4"
        >
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${accentG}0.08)`, border: `1px solid ${accentG}0.2)` }}>
                <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <div>
                    <p className="text-[13px] font-black mb-1" style={{ color: accent }}>
                        {bannerTitle}
                    </p>
                    <p className="text-[12px] text-gray-400">{bannerBody}</p>
                </div>
            </div>
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
                        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                        {(section as { title: string }).title}
                    </h3>
                    {"text" in section && (section as { text?: string }).text ? (
                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{(section as { text: string }).text}</p>
                    ) : null}
                    {"items" in section && (section as { items?: string[] }).items ? (
                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                            {(section as { items: string[] }).items.map((item, j) => (
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
                <p className="text-[11px] text-gray-600">PHASEX — Structural Market Intelligence Platform</p>
                <p className="text-xs text-gray-500 mt-1">© 2024 PHASE X AI. {footerLine2}</p>
            </div>
        </LegalModalFrame>
    );
}

export function RiskDisclosureButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }}
        >
            <ShieldAlert className="w-3.5 h-3.5" />
            {t("riskDisclosure")}
        </motion.button>
    );
}
