import { ArrowDownCircle, ArrowRight, ArrowUpCircle, Check, ChevronRight, Zap } from "lucide-react";
import { SubscriptionPanelAddonToggles } from "./SubscriptionPanelAddonToggles";
import type { SubscriptionPanelViewModel } from "./useSubscriptionPanel";

export function SubscriptionPanelAddonsAndTotal({ p }: { p: SubscriptionPanelViewModel }) {
    const {
        t,
        language,
        isRTL,
        mt5Addon,
        mt5TermsAccepted,
        referralInput,
        setReferralInput,
        referralApplied,
        referralError,
        setReferralError,
        totalAmount,
        hasActiveSub,
        isUpgrade,
        isDowngrade,
        setStep,
        setChangeSuccess,
        setChangeError,
        handleApplyReferral,
        handleRemoveReferral,
        referralDiscountAmount,
    } = p;

    const mt5Block = () => {
        if (mt5Addon && !mt5TermsAccepted) {
            alert(
                language === "ar"
                    ? "يرجى الموافقة على الشروط والأحكام الخاصة بـ MT5 قبل المتابعة."
                    : "Please agree to the MT5 Terms & Conditions before proceeding."
            );
            return true;
        }
        return false;
    };

    return (
        <>
            <SubscriptionPanelAddonToggles p={p} />

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
                            onClick={handleApplyReferral}
                            className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[#a855f7] text-black cursor-pointer hover:bg-[#9333ea] transition-colors"
                        >
                            {t("applyCode")}
                        </button>
                    </div>
                )}
                {referralError ? <p className="text-[10px] text-red-400 mt-1 font-bold">{t("referralInvalid")}</p> : null}
            </div>

            {referralApplied ? (
                <div
                    className="w-full max-w-[1400px] mx-auto mt-3 flex items-center justify-between px-5 py-3 rounded-[24px] relative z-10"
                    style={{ background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)" }}
                >
                    <span className="text-sm font-bold text-[#00e5a0]">{t("referralDiscount")}</span>
                    <span className="text-lg font-black text-[#00e5a0]">-${referralDiscountAmount.toFixed(2)}</span>
                </div>
            ) : null}

            <div className="w-full mt-8 flex flex-col sm:flex-row justify-between items-center bg-[#10141d] p-6 md:p-8 rounded-[24px] border border-[#1c2230] relative z-10">
                <div className="font-bold text-lg md:text-xl text-gray-400 mb-6 sm:mb-0 text-center sm:text-left">
                    {t("totalDue")}{" "}
                    <span className="text-3xl md:text-4xl font-black text-white ml-2 block sm:inline mt-2 sm:mt-0">${totalAmount.toFixed(2)}</span>
                </div>
                {hasActiveSub ? (
                    <button
                        onClick={() => {
                            if (mt5Block()) return;
                            setStep("confirm-change");
                            setChangeSuccess(false);
                            setChangeError(null);
                        }}
                        className={`px-8 md:px-12 py-4 md:py-5 rounded-xl font-black uppercase tracking-wide md:tracking-widest flex items-center justify-center gap-3 text-black transition-transform ${
                            mt5Addon && !mt5TermsAccepted ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] cursor-pointer"
                        } text-base md:text-lg w-full sm:w-auto`}
                        style={{
                            background: isDowngrade ? "linear-gradient(90deg, #f59e0b, #d97706)" : "linear-gradient(90deg, #6366f1, #4f46e5)",
                            boxShadow: isDowngrade ? "0 10px 30px rgba(245,158,11,0.3)" : "0 10px 30px rgba(99,102,241,0.3)",
                        }}
                    >
                        {isUpgrade ? (
                            <>
                                <ArrowUpCircle size={20} />
                                {isRTL ? "ترقية الخطة" : "Upgrade Plan"}
                            </>
                        ) : isDowngrade ? (
                            <>
                                <ArrowDownCircle size={20} />
                                {isRTL ? "تخفيض الخطة" : "Downgrade Plan"}
                            </>
                        ) : (
                            <>
                                <Zap size={20} />
                                {isRTL ? "تحديث الإضافات" : "Update Add-ons"}
                            </>
                        )}
                        <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            if (mt5Block()) return;
                            setStep("payment");
                        }}
                        className={`px-8 md:px-12 py-4 md:py-5 rounded-xl font-black uppercase tracking-wide md:tracking-widest flex items-center justify-center gap-3 text-black transition-transform ${
                            mt5Addon && !mt5TermsAccepted ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] cursor-pointer"
                        } text-base md:text-lg w-full sm:w-auto`}
                        style={{
                            background: `linear-gradient(90deg, #00e5a0, #00b37e)`,
                            boxShadow: `0 10px 30px rgba(0,229,160,0.3)`,
                        }}
                    >
                        {t("checkoutPlan")} <ArrowRight size={20} />
                    </button>
                )}
            </div>
        </>
    );
}
