import { motion } from "framer-motion";
import { X, Activity } from "lucide-react";
import type { ThemeTokens } from "../../hooks/useThemeTokens";

type Props = {
    tk: ThemeTokens;
    onClose: () => void;
};

export function MarketWatchModalHeader({ tk, onClose }: Props) {
    return (
        <div
            className="px-6 py-5 flex items-center justify-between relative overflow-hidden"
            style={{
                background: tk.isDark ? "#060a10" : "#f8fafc",
                borderBottom: `1px solid ${tk.isDark ? "rgba(99,102,241,0.15)" : "rgba(0,0,0,0.1)"}`,
            }}
        >
            {tk.isDark && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                />
            )}
            <div className="absolute top-1/2 left-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center relative border border-indigo-500/30"
                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(0,0,0,0))" }}
                >
                    <Activity className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <div
                        className="absolute inset-0 border border-indigo-400 rounded-xl"
                        style={{ clipPath: "polygon(0 0, 30% 0, 0 30%)" }}
                    />
                    <div
                        className="absolute inset-0 border border-indigo-400 rounded-xl"
                        style={{ clipPath: "polygon(100% 100%, 70% 100%, 100% 70%)" }}
                    />
                </motion.div>
                <div>
                    <h2 className="text-lg font-black tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-500 drop-shadow-sm flex items-center gap-2">
                        Market Watch <span className="opacity-40 font-mono text-[10px]">v2.0</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <p className="text-[10px] uppercase font-bold tracking-[0.25em]" style={{ color: tk.textDim }}>
                            Telemetry Active // MetaApi Link
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end mr-4">
                    <div className="text-[8px] font-mono tracking-widest text-indigo-400/50 mb-0.5">LATENCY: 12ms</div>
                    <div className="w-24 h-1 bg-indigo-900/40 rounded-full overflow-hidden relative">
                        <motion.div
                            className="w-1/2 h-full bg-indigo-500 rounded-full"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2.5 rounded-xl transition-all duration-300 hover:scale-105 group border border-transparent hover:border-red-500/30 hover:bg-red-500/10"
                    style={{ color: tk.textDim }}
                >
                    <X className="w-5 h-5 group-hover:text-red-400 transition-colors drop-shadow-[0_0_8px_rgba(239,68,68,0)] group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </button>
            </div>
        </div>
    );
}
