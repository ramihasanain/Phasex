import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { TokenPackageSize } from "./types";

interface UserProfilePendingViewProps {
    selectedPackage: TokenPackageSize;
}

export function UserProfilePendingView({ selectedPackage }: UserProfilePendingViewProps) {
    return (
        <motion.div
            key="pending"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-10 text-center h-full flex flex-col items-center justify-center bg-[#0b0e14]"
        >
            <motion.div
                className="w-28 h-28 rounded-full flex items-center justify-center mb-6 relative"
                style={{ background: "linear-gradient(135deg, rgba(0,195,255,0.15) 0%, transparent 100%)" }}
            >
                <motion.div
                    className="absolute inset-0 border-4 rounded-full border-t-[#00c3ff] border-r-transparent border-b-[#00c3ff] border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <Check size={48} color="#00c3ff" />
            </motion.div>
            <h2 className="text-3xl font-black mb-3 text-white">Tokens Verified!</h2>
            <p className="text-base text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
                <strong className="text-white text-xl mx-1">{selectedPackage.toLocaleString()}</strong> AI Tokens added. Returning to
                dashboard...
            </p>
        </motion.div>
    );
}
