import { Activity, Check, Clock, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { SubscriptionPanelViewModel } from "./useSubscriptionPanel";

export function SubscriptionPanelAddonToggles({ p }: { p: SubscriptionPanelViewModel }) {
    const { t, aiAddon, setAiAddon, mt5Addon, setMt5Addon, mt5TermsAccepted, setMt5TermsAccepted } = p;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between cursor-pointer border transition-all relative z-10"
                onClick={() => setAiAddon(!aiAddon)}
                style={{
                    backgroundColor: aiAddon ? `rgba(0, 229, 160, 0.05)` : "#10141d",
                    borderColor: aiAddon ? "#00e5a0" : "#1c2230",
                    boxShadow: aiAddon ? `0 10px 40px rgba(0,229,160,0.15), inset 0 0 20px rgba(0,229,160,0.05)` : "none",
                }}
            >
                <div className="flex items-center gap-6 md:gap-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center relative bg-[#0b0e14] border border-[#00e5a0]/30 shrink-0">
                        {aiAddon ? (
                            <motion.div
                                className="absolute inset-0 rounded-[20px] border-2 border-dashed border-[#00e5a0]/50"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            />
                        ) : null}
                        {aiAddon ? <Zap size={32} className="text-[#00e5a0]" /> : <Clock size={32} className="text-gray-500" />}
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-2 flex items-center gap-2">
                            {t("aiInsightTitle")} <Zap size={18} className="text-[#00e5a0]" />
                        </h3>
                        <p className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed">{t("aiInsightDesc")}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 mt-6 md:mt-0 shrink-0 self-end md:self-auto">
                    <div className="text-right">
                        <div className="text-3xl md:text-4xl font-black text-[#00e5a0]">$20</div>
                        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 mt-1">{t("aiAddonLabel")}</div>
                    </div>
                    <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                            aiAddon ? "border-[#00e5a0] bg-[#00e5a0]/20 text-[#00e5a0]" : "border-[#4b5563] text-transparent"
                        }`}
                    >
                        <Check size={20} strokeWidth={4} />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between cursor-pointer border transition-all relative z-10"
                onClick={() => setMt5Addon(!mt5Addon)}
                style={{
                    backgroundColor: mt5Addon ? `rgba(99, 102, 241, 0.05)` : "#10141d",
                    borderColor: mt5Addon ? "#6366f1" : "#1c2230",
                    boxShadow: mt5Addon ? `0 10px 40px rgba(99,102,241,0.15), inset 0 0 20px rgba(99,102,241,0.05)` : "none",
                }}
            >
                <div className="flex items-center gap-6 md:gap-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center relative bg-[#0b0e14] border border-[#6366f1]/30 shrink-0">
                        {mt5Addon ? (
                            <motion.div
                                className="absolute inset-0 rounded-[20px] border-2 border-dashed border-[#6366f1]/50"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            />
                        ) : null}
                        <Activity size={32} color={mt5Addon ? "#6366f1" : "#4b5563"} />
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-2 flex items-center gap-2">{t("mt5IntegrationTitle")}</h3>
                        <p className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed">{t("mt5IntegrationDesc")}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 mt-6 md:mt-0 shrink-0 self-end md:self-auto">
                    <div className="text-right">
                        <div className="text-3xl md:text-4xl font-black text-[#6366f1]">$30</div>
                        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 mt-1">{t("perMonth")}</div>
                    </div>
                    <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                            mt5Addon ? "border-[#6366f1] bg-[#6366f1]/20 text-[#6366f1]" : "border-[#4b5563] text-transparent"
                        }`}
                    >
                        <Check size={20} strokeWidth={4} />
                    </div>
                </div>
            </motion.div>
            {mt5Addon ? (
                <div className="mt-4 flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="mt5TermsPanel"
                        checked={mt5TermsAccepted}
                        onChange={(e) => setMt5TermsAccepted(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-[#0b0e14] checked:bg-[#6366f1] focus:ring-0 cursor-pointer accent-[#6366f1]"
                    />
                    <label htmlFor="mt5TermsPanel" className="text-sm font-medium text-gray-400 cursor-pointer select-none">
                        {t("mt5TermsAgreement")}
                    </label>
                </div>
            ) : null}
        </>
    );
}
