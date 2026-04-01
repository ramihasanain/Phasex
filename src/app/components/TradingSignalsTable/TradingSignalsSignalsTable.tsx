import React from "react";
import { TradingSignalsAssetSignalGroup } from "./TradingSignalsAssetSignalGroup";
import type { TradingSignalsTableModel } from "./useTradingSignalsTableModel";

type Props = { m: TradingSignalsTableModel };

export function TradingSignalsSignalsTable({ m }: Props) {
    const { tk, t, mt5Connected, filteredAssets, actionFilter, tfFilter } = m;

    return (
        <div
            className="overflow-auto max-[800px]:[&_th]:p-2 max-[800px]:[&_th]:text-[9px] max-[800px]:[&_th]:tracking-wide max-[800px]:[&_td]:p-1.5 max-[800px]:[&_.text-xs]:text-[9px] max-[800px]:[&_.text-sm]:text-[10px] max-[800px]:[&_input]:w-12 max-[800px]:[&_input]:text-[9px] max-[800px]:[&_input]:py-0.5"
        >
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead className="sticky top-0 z-10">
                    <tr
                        style={{
                            borderBottom: "2px solid rgba(99,102,241,0.3)",
                            background: tk.isDark ? "linear-gradient(180deg, rgba(10,16,30,1) 0%, rgba(6,10,20,0.98) 100%)" : tk.surface,
                        }}
                    >
                        <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-left tracking-wider uppercase" style={{ color: "#818cf8", textShadow: "0 0 12px rgba(99,102,241,0.3)" }}>{t("assetCol")}</th>
                        <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-center tracking-wider uppercase" style={{ color: "#818cf8", textShadow: "0 0 12px rgba(99,102,241,0.3)" }}>{t("actionStr")}</th>
                        <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-left tracking-wider uppercase" style={{ color: "#818cf8", textShadow: "0 0 12px rgba(99,102,241,0.3)" }}>{t("timeStr")}</th>
                        <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-right tracking-wider uppercase" style={{ color: "#818cf8", textShadow: "0 0 12px rgba(99,102,241,0.3)" }}>{t("priceStr")}</th>
                        <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-right tracking-wider uppercase" style={{ color: "#ef4444", textShadow: "0 0 10px rgba(239,68,68,0.25)" }}>SL</th>
                        <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-right tracking-wider uppercase" style={{ color: "#10b981", textShadow: "0 0 10px rgba(16,185,129,0.25)" }}>TP</th>
                        <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-right tracking-wider uppercase" style={{ color: "#38bdf8", textShadow: "0 0 10px rgba(56,189,248,0.2)" }}>m.PRICE</th>
                        <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-right tracking-wider uppercase" style={{ color: "#f59e0b", textShadow: "0 0 10px rgba(245,158,11,0.25)" }}>{t("profitStr")}</th>
                        {mt5Connected && (
                            <>
                                <th
                                    className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-center tracking-wider uppercase"
                                    style={{
                                        color: "#fbbf24",
                                        textShadow: "0 0 10px rgba(251,191,36,0.3)",
                                        borderLeft: "2px solid rgba(245,158,11,0.25)",
                                    }}
                                >
                                    Lot
                                </th>
                                <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-center tracking-wider uppercase" style={{ color: "#818cf8", textShadow: "0 0 10px rgba(99,102,241,0.3)" }}>Execute</th>
                                <th className="p-3 max-[800px]:p-2 text-[13px] max-[800px]:text-[9px] font-black text-center tracking-wider uppercase" style={{ color: "#a855f7", textShadow: "0 0 10px rgba(168,85,247,0.3)" }}>Auto</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {filteredAssets.length === 0 ? (
                        <tr>
                            <td colSpan={mt5Connected ? 11 : 8} className="p-8 max-[800px]:p-4 text-center text-sm max-[800px]:text-xs" style={{ color: "#334155" }}>{t("noResults")}</td>
                        </tr>
                    ) : (
                        filteredAssets.map((asset) => (
                            <TradingSignalsAssetSignalGroup
                                key={asset}
                                m={m}
                                asset={asset}
                                actionFilter={actionFilter}
                                tfFilter={tfFilter}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
