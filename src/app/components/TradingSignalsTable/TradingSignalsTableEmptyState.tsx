import React from "react";
import { Rocket } from "lucide-react";
import type { ThemeTokens } from "../../hooks/useThemeTokens";

export function TradingSignalsTableEmptyState({
    tk,
    t,
    language,
    isFetching,
    fetchError,
}: {
    tk: ThemeTokens;
    t: (k: string) => string;
    language: string;
    isFetching: boolean;
    fetchError: string;
}) {
    return (
        <div
            className="flex-shrink-0 mt-3 rounded-2xl overflow-hidden relative"
            style={{
                background: tk.isDark
                    ? "linear-gradient(135deg, #080c15 0%, #0d1225 50%, #0a0f1a 100%)"
                    : `linear-gradient(135deg, ${tk.surface} 0%, ${tk.surfaceElevated} 50%, ${tk.surface} 100%)`,
                border: `1px solid ${tk.accentGlow08}`,
                boxShadow: `0 0 40px ${tk.accentGlow08}`,
            }}
        >
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, #6366f1 20%, #ef4444 50%, #6366f1 80%, transparent 100%)",
                    opacity: 0.6,
                }}
            />
            <div className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(99,102,241,0.15))",
                            border: "1px solid rgba(239,68,68,0.2)",
                            boxShadow: "0 0 20px rgba(239,68,68,0.1)",
                        }}
                    >
                        <Rocket className="w-5 h-5" style={{ color: "#ef4444" }} />
                    </div>
                    <div>
                        <h3 className="text-base font-black tracking-wide" style={{ color: tk.textPrimary }}>
                            PHASE{" "}
                            <span style={{ color: "#ef4444", textShadow: "0 0 12px rgba(239,68,68,0.4)" }}>X</span>{" "}
                            Trading Dashboard
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: tk.textDim }}>
                            {t("fetchSignals")}
                        </p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-10 flex flex-col items-center justify-center gap-4">
                {isFetching ? (
                    <>
                        <div className="w-8 h-8 rounded-full border-2 border-t-indigo-500 border-indigo-500/20 animate-spin" />
                        <p className="text-sm font-medium" style={{ color: tk.textDim }}>
                            {language === "ar"
                                ? "جاري تحميل بيانات المنصة..."
                                : language === "ru"
                                  ? "Загрузка данных платформы..."
                                  : language === "tr"
                                    ? "Platform verileri yükleniyor..."
                                    : language === "fr"
                                      ? "Chargement des données de la plateforme..."
                                      : language === "es"
                                        ? "Cargando datos de la plataforma..."
                                        : "Loading platform data..."}
                        </p>
                    </>
                ) : (
                    <p className="text-sm" style={{ color: fetchError ? "#ef4444" : "#334155" }}>
                        {fetchError ? `⚠️ ${fetchError}` : `⚡ ${t("noData")}`}
                    </p>
                )}
            </div>
        </div>
    );
}
