import React from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, Check, Edit2, Play, X, Zap } from "lucide-react";
import { getIcon, sortTF } from "./constants";
import { TradingSignalsSignalTfRow } from "./TradingSignalsSignalTfRow";
import type { TradingSignalsTableModel } from "./useTradingSignalsTableModel";

type Props = {
    m: TradingSignalsTableModel;
    asset: string;
    actionFilter: string;
    tfFilter: string;
};

export function TradingSignalsAssetSignalGroup({ m, asset, actionFilter, tfFilter }: Props) {
    const {
        tk,
        signalData,
        mt5Connected,
        collapsedAssets,
        toggleAsset,
        symbolOverrides,
        setSymbolOverride,
        editingSymbol,
        setEditingSymbol,
        editingBrokerName,
        setEditingBrokerName,
        handleExecuteAsset,
        handleAutoAsset,
        executingAssetBulk,
        globalAutoCooldown,
    } = m;

    const tfs = signalData[asset];
    let tfKeys = Object.keys(tfs).sort(sortTF);
    if (actionFilter !== "ALL") tfKeys = tfKeys.filter((tf) => tfs[tf].net_signal === actionFilter);
    if (tfFilter !== "ALL") tfKeys = tfKeys.filter((tf) => tf === tfFilter);
    const isCollapsed = collapsedAssets.has(asset);
    const icon = getIcon(asset);

    const allTfKeys = Object.keys(tfs);
    const buyCount = allTfKeys.filter((tf) => tfs[tf].net_signal === "Buy").length;
    const sellCount = allTfKeys.filter((tf) => tfs[tf].net_signal === "Sell").length;

    return (
        <React.Fragment key={asset}>
            <tr
                className="cursor-pointer"
                onClick={() => toggleAsset(asset)}
                style={{
                    background: "linear-gradient(90deg, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.01) 100%)",
                    borderTop: "1px solid rgba(99,102,241,0.1)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.03) 100%)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(90deg, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.01) 100%)";
                }}
            >
                <td colSpan={mt5Connected ? 11 : 8} className="p-3 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xl leading-none">{icon}</span>
                            <span className="text-sm font-black tracking-wide" style={{ color: tk.textPrimary, letterSpacing: "0.05em" }}>{asset}</span>
                            {mt5Connected &&
                                (editingSymbol === asset ? (
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()} role="presentation">
                                        <span className="text-[9px]" style={{ color: tk.textDim }}>→</span>
                                        <input
                                            autoFocus
                                            value={editingBrokerName}
                                            onChange={(e) => setEditingBrokerName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && editingBrokerName.trim() && setSymbolOverride) {
                                                    setSymbolOverride(asset, editingBrokerName.trim());
                                                    setEditingSymbol(null);
                                                } else if (e.key === "Escape") {
                                                    setEditingSymbol(null);
                                                }
                                            }}
                                            placeholder="Broker symbol..."
                                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold outline-none"
                                            style={{
                                                background: "rgba(99,102,241,0.1)",
                                                border: "1px solid rgba(99,102,241,0.3)",
                                                color: "#a5b4fc",
                                                width: 110,
                                            }}
                                        />
                                        <motion.button
                                            type="button"
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => {
                                                if (editingBrokerName.trim() && setSymbolOverride) {
                                                    setSymbolOverride(asset, editingBrokerName.trim());
                                                }
                                                setEditingSymbol(null);
                                            }}
                                            className="w-5 h-5 flex items-center justify-center rounded cursor-pointer"
                                            style={{ color: "#10b981", background: "rgba(16,185,129,0.1)" }}
                                        >
                                            <Check className="w-3 h-3" />
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setEditingSymbol(null)}
                                            className="w-5 h-5 flex items-center justify-center rounded cursor-pointer"
                                            style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)" }}
                                        >
                                            <X className="w-3 h-3" />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()} role="presentation">
                                        {symbolOverrides[asset.toUpperCase()] && (
                                            <span
                                                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                                                style={{
                                                    color: "#34d399",
                                                    background: "rgba(16,185,129,0.08)",
                                                    border: "1px solid rgba(16,185,129,0.12)",
                                                }}
                                            >
                                                → {symbolOverrides[asset.toUpperCase()]}
                                            </span>
                                        )}
                                        <motion.button
                                            type="button"
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => {
                                                setEditingSymbol(asset);
                                                setEditingBrokerName(symbolOverrides[asset.toUpperCase()] || "");
                                            }}
                                            className="w-4 h-4 flex items-center justify-center rounded cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                                            style={{ color: "#818cf8" }}
                                            title="Set broker symbol name"
                                        >
                                            <Edit2 className="w-2.5 h-2.5" />
                                        </motion.button>
                                    </div>
                                ))}
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                    background: "rgba(99,102,241,0.1)",
                                    color: "#818cf8",
                                    border: "1px solid rgba(99,102,241,0.15)",
                                }}
                            >
                                {tfKeys.length} TF
                            </span>
                            {buyCount > 0 && (
                                <span
                                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                                    style={{
                                        background: "rgba(74,222,128,0.08)",
                                        color: "#4ade80",
                                        border: "1px solid rgba(74,222,128,0.12)",
                                    }}
                                >
                                    ▲ {buyCount}
                                </span>
                            )}
                            {sellCount > 0 && (
                                <span
                                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                                    style={{
                                        background: "rgba(248,113,113,0.08)",
                                        color: "#f87171",
                                        border: "1px solid rgba(248,113,113,0.12)",
                                    }}
                                >
                                    ▼ {sellCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {mt5Connected && (
                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()} role="presentation">
                                    <motion.button
                                        type="button"
                                        onClick={() => handleExecuteAsset(asset)}
                                        disabled={executingAssetBulk !== null}
                                        whileHover={executingAssetBulk === null ? { scale: 1.05 } : {}}
                                        whileTap={executingAssetBulk === null ? { scale: 0.95 } : {}}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-colors"
                                        style={{
                                            color: executingAssetBulk === asset ? "#fff" : executingAssetBulk ? "#475569" : "#10b981",
                                            background: executingAssetBulk === asset ? "#10b981" : executingAssetBulk ? "rgba(255,255,255,0.05)" : "rgba(16,185,129,0.1)",
                                            border: executingAssetBulk ? "1px solid transparent" : "1px solid rgba(16,185,129,0.2)",
                                            opacity: executingAssetBulk && executingAssetBulk !== asset ? 0.5 : 1,
                                        }}
                                        title={
                                            executingAssetBulk === asset
                                                ? "Executing..."
                                                : executingAssetBulk
                                                  ? "Wait for current batch to finish"
                                                  : "Execute all signals for this asset"
                                        }
                                    >
                                        {executingAssetBulk === asset ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                <Play className="w-2.5 h-2.5" />
                                            </motion.div>
                                        ) : (
                                            <Play className="w-2.5 h-2.5" />
                                        )}
                                        {executingAssetBulk === asset ? "EXEC..." : `Execute ${asset}`}
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={() => handleAutoAsset(asset)}
                                        disabled={executingAssetBulk !== null || globalAutoCooldown}
                                        whileHover={executingAssetBulk === null && !globalAutoCooldown ? { scale: 1.05 } : {}}
                                        whileTap={executingAssetBulk === null && !globalAutoCooldown ? { scale: 0.95 } : {}}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-colors"
                                        style={{
                                            color: executingAssetBulk === asset ? "#fff" : executingAssetBulk || globalAutoCooldown ? "#475569" : "#a855f7",
                                            background: executingAssetBulk === asset ? "#a855f7" : executingAssetBulk || globalAutoCooldown ? "rgba(255,255,255,0.05)" : "rgba(168,85,247,0.1)",
                                            border: executingAssetBulk || globalAutoCooldown ? "1px solid transparent" : "1px solid rgba(168,85,247,0.2)",
                                            opacity: (executingAssetBulk && executingAssetBulk !== asset) || globalAutoCooldown ? 0.5 : 1,
                                        }}
                                        title={
                                            executingAssetBulk === asset
                                                ? "Applying Auto..."
                                                : globalAutoCooldown
                                                  ? "Cooldown active (Wait 7s)"
                                                  : executingAssetBulk
                                                    ? "Wait for current batch to finish"
                                                    : "Auto-trade all signals for this asset"
                                        }
                                    >
                                        {executingAssetBulk === asset ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                <Zap className="w-2.5 h-2.5" />
                                            </motion.div>
                                        ) : (
                                            <Zap className="w-2.5 h-2.5" />
                                        )}
                                        {executingAssetBulk === asset ? "AUTO..." : globalAutoCooldown ? "WAIT..." : `Auto ${asset}`}
                                    </motion.button>
                                </div>
                            )}
                            {isCollapsed ? <ChevronDown className="w-4 h-4" style={{ color: "#6366f1" }} /> : <ChevronUp className="w-4 h-4" style={{ color: "#6366f1" }} />}
                        </div>
                    </div>
                </td>
            </tr>

            {!isCollapsed &&
                tfKeys.map((tf) => (
                    <TradingSignalsSignalTfRow key={`${asset}-${tf}`} m={m} asset={asset} tf={tf} entry={tfs[tf]} />
                ))}
        </React.Fragment>
    );
}
