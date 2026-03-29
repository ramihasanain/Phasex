import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";

export function SubscriptionPanelShell({
    isRTL,
    onClose,
    children,
}: {
    isRTL: boolean;
    onClose: () => void;
    children: ReactNode;
}) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[32px] relative flex flex-col"
                    style={{ background: "#0b0e14", border: `1px solid #1c2230`, boxShadow: `0 30px 60px rgba(0,0,0,0.8)` }}
                    dir={isRTL ? "rtl" : "ltr"}
                >
                    <button
                        onClick={onClose}
                        className={`absolute top-8 ${isRTL ? "left-8" : "right-8"} p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-20 cursor-pointer`}
                    >
                        <X size={26} />
                    </button>
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
