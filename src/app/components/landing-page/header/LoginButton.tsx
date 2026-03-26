import { motion } from "motion/react";
import { useLanguage } from "@/app/contexts/LanguageContext";
const accent = "#00e5a0";

export default function LoginButton({
  onClick,
  variant,
}: {
  onClick: () => void;
  variant: "desktop" | "mobile";
}) {
  const { t } = useLanguage();

  if (variant === "desktop") {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex px-5 py-2 rounded-lg text-sm font-bold tracking-wider cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${accent}, #00c890)`,
          color: "#060a10",
        }}
      >
        {t("loginBtn")}
      </motion.button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-lg text-sm font-bold cursor-pointer"
      style={{ background: accent, color: "#060a10" }}
    >
      {t("loginBtn")}
    </button>
  );
}
