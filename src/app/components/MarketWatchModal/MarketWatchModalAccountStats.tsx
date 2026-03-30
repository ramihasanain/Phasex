import { Wallet, CircleDollarSign, Unlock, Lock, Zap } from "lucide-react";
import type { MT5Account } from "../../hooks/useMT5";
import type { ThemeTokens } from "../../hooks/useThemeTokens";

type Props = {
    tk: ThemeTokens;
    mt5Account: MT5Account;
};

const STATS = [
    { label: "Balance", icon: Wallet, key: "balance" as const, color: "#10b981", rgb: "16, 185, 129" },
    { label: "Equity", icon: CircleDollarSign, key: "equity" as const, color: "#6366f1", rgb: "99, 102, 241" },
    { label: "Free Margin", icon: Unlock, key: "free_margin" as const, color: "#a855f7", rgb: "168, 85, 247" },
    { label: "Margin", icon: Lock, key: "margin" as const, color: "#f59e0b", rgb: "245, 158, 11" },
    { label: "Leverage", icon: Zap, key: "leverage" as const, color: "#3b82f6", rgb: "59, 130, 246", isLeverage: true },
];

export function MarketWatchModalAccountStats({ tk, mt5Account }: Props) {
    return (
        <div className="px-6 pb-6">
            <div
                className="p-4 rounded-2xl border"
                style={{
                    background: tk.isDark
                        ? "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)"
                        : "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.005) 100%)",
                    borderColor: tk.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
            >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {STATS.map((stat, idx) => {
                        const Icon = stat.icon;
                        const value = stat.isLeverage
                            ? `1:${mt5Account.leverage || 0}`
                            : `$${((mt5Account[stat.key] as number) || 0).toLocaleString()}`;
                        return (
                            <div
                                key={stat.label}
                                className="relative group p-3 rounded-xl transition-all duration-300 hover:scale-105 cursor-default"
                                style={{
                                    background: `rgba(${stat.rgb}, 0.05)`,
                                    border: `1px solid rgba(${stat.rgb}, 0.15)`,
                                    boxShadow: `inset 0 0 20px rgba(${stat.rgb}, 0.02)`,
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"
                                    style={{ background: `linear-gradient(135deg, transparent, rgba(${stat.rgb}, 1))` }}
                                />
                                <div
                                    className="absolute -top-2 -right-2 w-12 h-12 rounded-full opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40 pointer-events-none"
                                    style={{ background: stat.color }}
                                />

                                <div className="flex items-center gap-2 mb-2 relative z-10">
                                    <div
                                        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: `rgba(${stat.rgb}, 0.1)`,
                                            border: `1px solid rgba(${stat.rgb}, 0.2)`,
                                        }}
                                    >
                                        <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                                    </div>
                                    <div
                                        className="text-[9px] xl:text-[10px] font-black tracking-[0.2em] uppercase truncate"
                                        style={{ color: tk.textDim }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                                <div
                                    className="text-sm xl:text-lg font-black font-mono tracking-wide relative z-10 drop-shadow-md truncate"
                                    style={{
                                        color: stat.color,
                                        textShadow: tk.isDark ? `0 0 12px rgba(${stat.rgb}, 0.4)` : "none",
                                    }}
                                >
                                    {value}
                                </div>
                                {idx < 4 && (
                                    <div
                                        className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-px h-10"
                                        style={{
                                            background: tk.isDark
                                                ? "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)"
                                                : "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1), transparent)",
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
