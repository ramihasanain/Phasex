import { motion } from "motion/react";
import { ArrowRight, Bot, Plus, Sparkles } from "lucide-react";

interface UserProfileDashboardAITokensCardProps {
    aiTokens: number;
    onOpenTopup: () => void;
}

export function UserProfileDashboardAITokensCard({ aiTokens, onOpenTopup }: UserProfileDashboardAITokensCardProps) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-[24px] border relative overflow-hidden group transition-all flex flex-col cursor-pointer"
            onClick={onOpenTopup}
            style={{ borderColor: aiTokens > 0 ? "#00c3ff30" : "#1c2230", background: "#10141d" }}
        >
            {aiTokens > 0 ? (
                <div className="absolute top-[-40px] right-[-40px] w-[160px] h-[160px] bg-[#00c3ff] opacity-[0.06] rounded-full blur-[40px] pointer-events-none group-hover:opacity-[0.12] transition-opacity" />
            ) : null}
            <div className="flex items-start justify-between mb-5 relative z-10">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner"
                    style={{
                        backgroundColor: aiTokens > 0 ? "rgba(0,195,255,0.12)" : "#1c2230",
                        color: aiTokens > 0 ? "#00c3ff" : "#64748b",
                    }}
                >
                    <Bot size={24} />
                </div>
                <span
                    className="text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest"
                    style={{
                        backgroundColor: aiTokens > 0 ? "rgba(0,195,255,0.12)" : "#1c2230",
                        color: aiTokens > 0 ? "#00c3ff" : "#64748b",
                    }}
                >
                    AI Compute
                </span>
            </div>
            <div className="text-3xl font-black mb-0.5 flex items-baseline gap-2 relative z-10 text-white">
                {aiTokens.toLocaleString()} <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tokens</span>
            </div>
            {aiTokens > 0 ? (
                <p className="text-[11px] font-medium relative z-10 flex items-center gap-1.5 text-[#00e5a0] mb-4 mt-1">
                    <Sparkles size={12} /> Systems Online
                </p>
            ) : (
                <p className="text-[11px] font-medium relative z-10 text-red-400 mb-4 mt-1 flex items-center gap-1.5">
                    <ArrowRight size={12} /> Insufficient Tokens
                </p>
            )}
            <div
                className="mt-auto pt-3 border-t flex items-center justify-between"
                style={{ borderColor: aiTokens > 0 ? "#00c3ff10" : "#1c223080" }}
            >
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Top-up Balance</span>
                <Plus size={14} className="text-gray-500" />
            </div>
        </motion.div>
    );
}
