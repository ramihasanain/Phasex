import { motion } from "motion/react";
import { Check, Zap, Bot, Activity, ArrowRight } from "lucide-react";
import { useSubscriptionOnboarding } from "./useSubscriptionOnboarding";

type Ctx = ReturnType<typeof useSubscriptionOnboarding>;

export function SubscriptionOnboardingPlanExtras({ ctx }: { ctx: Ctx }) {
    const {
        t,
        aiAddon,
        setAiAddon,
        mt5Addon,
        setMt5Addon,
        mt5TermsAccepted,
        setMt5TermsAccepted,
        mt5MonthlyPrice,
        referralInput,
        setReferralInput,
        referralApplied,
        referralError,
        setReferralError,
        handleApplyReferral,
        handleRemoveReferral,
        referralDiscountAmount,
        totalAmount,
        goToPayment,
    } = ctx;

    return (
        <>
            <motion.div className="mt-8 mx-auto w-full max-w-[1400px] px-4" onClick={() => setAiAddon(!aiAddon)}>
                <div
                    className="p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between cursor-pointer border transition-all relative z-10"
                    style={{
                        backgroundColor: aiAddon ? `rgba(0, 229, 160, 0.05)` : "#10141d",
                        borderColor: aiAddon ? "#00e5a0" : "#1c2230",
                        boxShadow: aiAddon
                            ? `0 10px 40px rgba(0,229,160,0.15), inset 0 0 20px rgba(0,229,160,0.05)`
                            : "none",
                    }}
                >
                    <div className="flex items-center gap-6 md:gap-8">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center relative bg-[#0b0e14] border border-[#00e5a0]/30 shrink-0">
                            {aiAddon && (
                                <motion.div
                                    className="absolute inset-0 rounded-[20px] border-2 border-dashed border-[#00e5a0]/50"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                />
                            )}
                            <Bot size={32} color={aiAddon ? "#00e5a0" : "#4b5563"} />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-white mb-2 flex items-center gap-2">
                                {t("aiInsightTitle")} <Zap size={18} className="text-[#00e5a0]" />
                            </h3>
                            <p className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed">
                                {t("aiInsightDesc")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mt-6 md:mt-0 shrink-0 self-end md:self-auto">
                        <div className="text-right">
                            <div className="text-3xl md:text-4xl font-black text-[#00e5a0]">$20</div>
                            <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 mt-1">
                                {t("aiAddonLabel")}
                            </div>
                        </div>
                        <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${aiAddon ? "border-[#00e5a0] bg-[#00e5a0]/20 text-[#00e5a0]" : "border-[#4b5563] text-transparent"}`}
                        >
                            <Check size={20} strokeWidth={4} />
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div className="mt-4 mx-auto w-full max-w-[1400px] px-4">
                <div
                    className="p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between cursor-pointer border transition-all relative z-10"
                    role="button"
                    tabIndex={0}
                    onClick={() => setMt5Addon(!mt5Addon)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setMt5Addon(!mt5Addon);
                        }
                    }}
                    style={{
                        backgroundColor: mt5Addon ? `rgba(99, 102, 241, 0.05)` : "#10141d",
                        borderColor: mt5Addon ? "#6366f1" : "#1c2230",
                        boxShadow: mt5Addon
                            ? `0 10px 40px rgba(99,102,241,0.15), inset 0 0 20px rgba(99,102,241,0.05)`
                            : "none",
                    }}
                >
                    <div className="flex items-center gap-6 md:gap-8">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center relative bg-[#0b0e14] border border-[#6366f1]/30 shrink-0">
                            {mt5Addon && (
                                <motion.div
                                    className="absolute inset-0 rounded-[20px] border-2 border-dashed border-[#6366f1]/50"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                />
                            )}
                            <Activity size={32} color={mt5Addon ? "#6366f1" : "#4b5563"} />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-white mb-2 flex items-center gap-2">
                                {t("mt5IntegrationTitle")}
                            </h3>
                            <p className="text-sm md:text-base font-medium text-gray-400 max-w-2xl leading-relaxed">
                                {t("mt5IntegrationDesc")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mt-6 md:mt-0 shrink-0 self-end md:self-auto">
                        <div className="text-right">
                            <div className="text-3xl md:text-4xl font-black text-[#6366f1]">${mt5MonthlyPrice}</div>
                            <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 mt-1">
                                {t("perMonth")}
                            </div>
                        </div>
                        <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${mt5Addon ? "border-[#6366f1] bg-[#6366f1]/20 text-[#6366f1]" : "border-[#4b5563] text-transparent"}`}
                        >
                            <Check size={20} strokeWidth={4} />
                        </div>
                    </div>
                </div>
                {mt5Addon && (
                    <div className="mt-4 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="mt5Terms"
                            checked={mt5TermsAccepted}
                            onChange={(e) => setMt5TermsAccepted(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-600 bg-[#0b0e14] checked:bg-[#6366f1] focus:ring-0 cursor-pointer accent-[#6366f1]"
                        />
                        <label htmlFor="mt5Terms" className="text-sm font-medium text-gray-400 cursor-pointer select-none">
                            {t("mt5TermsAgreement")}
                        </label>
                    </div>
                )}
            </motion.div>

            <div
                className="w-full max-w-[1400px] mx-auto mt-6 p-5 rounded-[24px] relative z-10"
                style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.15)" }}
            >
                <p className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] mb-3">{t("referralCodeInput")}</p>
                {referralApplied ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Check size={18} className="text-[#00e5a0]" />
                            <span className="text-sm font-bold text-[#00e5a0]">{t("referralApplied")}</span>
                            <span className="font-mono text-xs text-gray-400 ml-1">{referralInput.toUpperCase()}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveReferral}
                            className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer uppercase tracking-widest"
                        >
                            {t("referralRemove")}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={referralInput}
                            onChange={(e) => {
                                setReferralInput(e.target.value);
                                setReferralError(false);
                            }}
                            className="flex-1 px-4 py-3 rounded-xl text-sm font-mono font-bold bg-[#0b0e14] border border-[#1c2230] text-white placeholder-gray-600 focus:border-[#a855f7] outline-none uppercase tracking-wider"
                            placeholder={t("referralCodePlaceholder")}
                        />
                        <button
                            type="button"
                            onClick={handleApplyReferral}
                            className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[#a855f7] text-black cursor-pointer hover:bg-[#9333ea] transition-colors"
                        >
                            {t("applyCode")}
                        </button>
                    </div>
                )}
                {referralError && (
                    <p className="text-[10px] text-red-400 mt-1 font-bold">{t("referralInvalid")}</p>
                )}
            </div>

            {referralApplied && (
                <div
                    className="w-full max-w-[1400px] mx-auto mt-3 flex items-center justify-between px-5 py-3 rounded-[24px] relative z-10"
                    style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)" }}
                >
                    <span className="text-sm font-bold text-[#00e5a0]">{t("referralDiscount")}</span>
                    <span className="text-lg font-black text-[#00e5a0]">-${referralDiscountAmount.toFixed(2)}</span>
                </div>
            )}

            <div className="w-full max-w-[1400px] mx-auto mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#10141d] p-6 md:p-8 rounded-[24px] border border-[#1c2230] relative z-10">
                <div className="font-bold text-lg md:text-xl text-gray-400 mb-6 sm:mb-0 text-center sm:text-left">
                    {t("totalDue")}{" "}
                    <span className="text-3xl md:text-4xl font-black text-white ml-2 block sm:inline mt-2 sm:mt-0">
                        ${totalAmount.toFixed(2)}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={goToPayment}
                    className={`px-8 md:px-12 py-4 md:py-5 rounded-xl font-black uppercase tracking-wide md:tracking-widest flex items-center justify-center gap-3 text-black transition-transform ${mt5Addon && !mt5TermsAccepted ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] cursor-pointer"} text-base md:text-lg w-full sm:w-auto`}
                    style={{
                        background: `linear-gradient(90deg, #00e5a0, #00b37e)`,
                        boxShadow: `0 10px 30px rgba(0,229,160,0.3)`,
                    }}
                >
                    {t("checkoutPlan")} <ArrowRight size={20} />
                </button>
            </div>
        </>
    );
}
