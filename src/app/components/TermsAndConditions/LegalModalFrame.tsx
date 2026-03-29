import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

export interface LegalModalFrameProps {
    isOpen: boolean;
    onClose: () => void;
    accent: string;
    accentG: string;
    isRTL: boolean;
    headerIcon: LucideIcon;
    headerTitle: ReactNode;
    headerSubtitle?: ReactNode;
    scrollClassName?: string;
    children: React.ReactNode;
}

export function LegalModalFrame({
    isOpen,
    onClose,
    accent,
    accentG,
    isRTL,
    headerIcon: HeaderIcon,
    headerTitle,
    headerSubtitle = (
        <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
    ),
    scrollClassName = "space-y-6",
    children,
}: LegalModalFrameProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}
                                >
                                    <HeaderIcon className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">{headerTitle}</h2>
                                    {headerSubtitle}
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <div
                            className={`flex-1 overflow-y-auto px-6 py-5 ${scrollClassName}`}
                            style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}
                        >
                            {children}
                        </div>

                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
