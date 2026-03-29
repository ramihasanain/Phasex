import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { manifestoFR } from "../../locales/legal_fr";
import { manifestoES } from "../../locales/legal_es";
import { manifestoEN, manifestoAR, manifestoTR, manifestoRU } from "./data/manifestoLocal";
import { LegalModalFrame } from "./LegalModalFrame";
import { ManifestoModalBody } from "./ManifestoModalBody";
import { pickByLang } from "./pickByLang";
import type { TermsModalProps } from "./types";

export function ManifestoModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#a855f7";
    const accentG = "rgba(168,85,247,";
    const sections = pickByLang(language, {
        en: manifestoEN,
        ar: manifestoAR,
        tr: manifestoTR,
        ru: manifestoRU,
        fr: manifestoFR,
        es: manifestoES,
    });

    const headerTitle =
        language === "ar"
            ? "مانيفستو PHASEX"
            : language === "tr"
              ? "PHASEX Bildirgesi"
              : language === "ru"
                ? "Манифест PHASEX"
                : language === "fr"
                  ? "Manifeste PHASEX"
                  : language === "es"
                    ? "Manifiesto PHASEX"
                    : "PHASEX Manifesto";

    const headerSubtitle = (
        <p className="text-[11px] text-gray-500 font-medium">
            {language === "ar"
                ? "انظر إلى السوق كنظام"
                : language === "tr"
                  ? "Piyasayı bir sistem olarak görün"
                  : language === "ru"
                    ? "Рассматривайте рынок как систему"
                    : "See the market as a system"}
        </p>
    );

    const signatureLine =
        language === "ar"
            ? "انظر إلى السوق كنظام."
            : language === "tr"
              ? "Piyasayı bir sistem olarak görün."
              : language === "ru"
                ? "Рассматривайте рынок как систему."
                : "See the market as a system.";

    return (
        <LegalModalFrame
            isOpen={isOpen}
            onClose={onClose}
            accent={accent}
            accentG={accentG}
            isRTL={isRTL}
            headerIcon={BookOpen}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
        >
            <ManifestoModalBody sections={sections} accent={accent} accentG={accentG} signatureLine={signatureLine} />
        </LegalModalFrame>
    );
}

export function ManifestoButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)", color: "#a855f7" }}
        >
            <BookOpen className="w-3.5 h-3.5" />
            {t("manifesto")}
        </motion.button>
    );
}
