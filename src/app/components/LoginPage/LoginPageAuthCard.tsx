import { motion } from "motion/react";
import { Logo } from "../Logo";

interface LoginPageAuthCardProps {
    accent: string;
    accentG: string;
    t: (key: string) => string;
    children: React.ReactNode;
}

export function LoginPageAuthCard({ accent, accentG, t, children }: LoginPageAuthCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="w-full max-w-md mx-4 relative z-10"
        >
            <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                    background: "linear-gradient(160deg, rgba(14,20,33,0.92) 0%, rgba(8,12,22,0.96) 100%)",
                    border: `1px solid ${accentG}0.12)`,
                    boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px ${accentG}0.08), inset 0 1px 0 rgba(255,255,255,0.04)`,
                }}
            >
                <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] z-30"
                    style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="px-8 pt-8 pb-4 text-center relative">
                    <motion.div className="flex justify-center mb-4" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                        <div className="relative">
                            <Logo className="w-16 h-16 relative z-10" />
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{ background: `radial-gradient(circle, ${accentG}0.2) 0%, transparent 70%)`, filter: "blur(12px)" }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-3xl font-black mb-2"
                        style={{ color: accent }}
                        animate={{ textShadow: [`0 0 15px ${accentG}0.3)`, `0 0 30px ${accentG}0.5)`, `0 0 15px ${accentG}0.3)`] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        {t("authLoginTitle")}
                    </motion.h1>

                    <p className="text-gray-500 text-sm font-medium tracking-wide">{t("loginSub")}</p>

                    <div className="flex justify-center gap-1 mt-3">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: accent }}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                            />
                        ))}
                    </div>
                </div>

                <div className="px-8 pb-8">{children}</div>

                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
            </div>
        </motion.div>
    );
}
