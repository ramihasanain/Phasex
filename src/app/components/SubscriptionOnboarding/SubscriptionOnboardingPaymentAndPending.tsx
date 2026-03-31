import { motion } from "motion/react";
import { CreditCard, Send, Copy, Coins, Shield, CircleCheck, Check } from "lucide-react";
import { useSubscriptionOnboarding } from "./useSubscriptionOnboarding";

type Ctx = ReturnType<typeof useSubscriptionOnboarding>;

export function SubscriptionOnboardingPaymentStep({ ctx }: { ctx: Ctx }) {
    const { t, setStep, currentPlan, aiAddon, mt5Addon, totalAmount, walletAddress, copyToClipboard, handleFinish } =
        ctx;

    return (
        <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-2xl bg-[#10141d] p-10 rounded-[32px] mx-auto my-10"
            style={{ border: `1px solid #1c2230`, boxShadow: `0 20px 60px rgba(0,0,0,0.6)` }}
        >
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#00e5a0]/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[#00e5a0]/30 shadow-[0_0_30px_rgba(0,229,160,0.2)]">
                    <CreditCard size={36} className="text-[#00e5a0]" />
                </div>
                <h2 className="text-3xl font-black text-white">{t("confirmPayment")}</h2>
                <p className="text-gray-400 mt-2 text-base">{t("confirmPaymentDesc")}</p>
                {currentPlan && (
                    <div
                        className="flex flex-col items-center gap-2 mt-4 px-4 py-3 rounded-xl"
                        style={{
                            background: `${currentPlan.iconColor}10`,
                            border: `1px solid ${currentPlan.iconColor}20`,
                        }}
                    >
                        <div className="inline-flex gap-2 items-center">
                            <span className="text-sm font-black" style={{ color: currentPlan.iconColor }}>
                                {currentPlan.title}
                            </span>
                            {aiAddon && <span className="text-xs font-bold text-[#00e5a0]">| + AI Insight</span>}
                            {mt5Addon && <span className="text-xs font-bold text-[#6366f1]">| + MT5 Integration</span>}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 rounded-2xl mb-10 flex justify-between items-center bg-[#0b0e14] border border-[#1c2230] shadow-inner">
                <span className="font-black text-gray-400 uppercase tracking-widest text-sm">{t("amountDue")}</span>
                <span className="text-5xl font-black text-[#00e5a0]">${totalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-6 mb-10">
                <div className="p-8 rounded-2xl border border-[#0088cc]/30 bg-[#0088cc]/5 relative overflow-hidden group hover:border-[#0088cc] transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Send size={80} className="text-[#0088cc]" />
                    </div>
                    <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                        <div className="bg-[#0088cc] text-black w-8 h-8 rounded-full flex items-center justify-center">
                            <Send size={16} />
                        </div>
                        {t("telegramFastTrack")}
                    </h3>
                    <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{t("telegramFastTrackDesc")}</p>
                    <div className="grid grid-cols-1 gap-3 relative z-10">
                        <a
                            href="https://t.me/PhaseX_Ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline"
                        >
                            <span className="font-mono text-base font-bold text-white">@PhaseX_Ai</span>
                            <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg">
                                <Copy size={18} />
                            </div>
                        </a>
                        <a
                            href="https://t.me/PhaseX_Ai_SupportBot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between group/btn cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline"
                        >
                            <span className="font-mono text-base font-bold text-white">@PhaseX_Ai_SupportBot</span>
                            <div className="text-[#0088cc] group-hover/btn:text-white transition-colors bg-[#0088cc]/10 p-2.5 rounded-lg">
                                <Copy size={18} />
                            </div>
                        </a>
                    </div>
                </div>

                <div className="p-8 rounded-2xl border border-[#f7931a]/30 bg-[#f7931a]/5 relative overflow-hidden group hover:border-[#f7931a] transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Coins size={80} className="text-[#f7931a]" />
                    </div>
                    <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                        <div className="bg-[#f7931a] text-black w-8 h-8 rounded-full flex items-center justify-center">
                            <Coins size={16} />
                        </div>
                        {t("cryptoPayment")}
                    </h3>
                    <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{t("cryptoPaymentDesc")}</p>
                    <div
                        className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between relative z-10 group/btn cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => copyToClipboard(walletAddress)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                copyToClipboard(walletAddress);
                            }
                        }}
                    >
                        <span className="font-mono text-sm sm:text-base font-bold break-all text-white max-w-[85%]">
                            {walletAddress}
                        </span>
                        <div className="text-[#f7931a] group-hover/btn:text-white transition-colors shrink-0 bg-[#f7931a]/10 p-2.5 rounded-lg ml-2">
                            <Copy size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-[#1c2230] pt-8">
                <div className="bg-[#00e5a0]/10 border border-[#00e5a0]/20 p-5 rounded-2xl mb-8 flex items-start gap-4">
                    <div className="text-[#00e5a0] shrink-0 mt-0.5">
                        <Shield size={24} />
                    </div>
                    <p className="text-sm font-medium text-[#00e5a0] leading-relaxed">{t("noReceiptNote")}</p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setStep("plans")}
                        className="font-bold text-gray-500 hover:text-white transition-colors px-6 py-4 w-full sm:w-auto cursor-pointer"
                    >
                        {t("cancelGoBack")}
                    </button>
                    <button
                        type="button"
                        onClick={handleFinish}
                        className="px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
                        style={{ background: "#00e5a0", boxShadow: `0 10px 40px rgba(0,229,160,0.3)` }}
                    >
                        <CircleCheck size={22} /> {t("confirmPaymentSent")}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export function SubscriptionOnboardingPendingStep({ ctx }: { ctx: Ctx }) {
    const { t } = ctx;

    return (
        <motion.div
            key="pending"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center relative z-10 p-12 rounded-[32px] bg-[#10141d] max-w-xl w-full mx-auto my-auto mt-20"
            style={{
                border: `1px solid rgba(0,229,160,0.3)`,
                boxShadow: `0 0 80px rgba(0,229,160,0.15)`,
            }}
        >
            <motion.div
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 relative"
                style={{ background: `linear-gradient(135deg, rgba(0,229,160,0.2) 0%, transparent 100%)` }}
            >
                <motion.div
                    className="absolute inset-0 border-4 rounded-full border-t-[#00e5a0] border-r-transparent border-b-[#00e5a0] border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <Check size={56} color="#00e5a0" />
            </motion.div>
            <h2 className="text-4xl font-black mb-4 text-white">{t("verificationPending")}</h2>
            <p className="text-lg mb-8 leading-relaxed font-medium text-gray-400">
                {t("verificationPendingDescOnboard")}
            </p>
        </motion.div>
    );
}
