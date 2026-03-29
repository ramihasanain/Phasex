import { CircleCheck, Clock, Send, Zap } from "lucide-react";
import type { SubscriptionPanelViewModel } from "./useSubscriptionPanel";

export function SubscriptionPanelPaymentStep({ p }: { p: SubscriptionPanelViewModel }) {
    const { t, setStep, currentPlan, aiAddon, mt5Addon, totalAmount, copyToClipboard, handleFinish, walletAddress } = p;

    return (
        <div className="p-10 relative">
            <button
                onClick={() => setStep("plans")}
                className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest cursor-pointer"
            >
                {t("backToPlans")}
            </button>
            <div className="text-center mb-8 relative z-10 max-w-2xl mx-auto mt-6">
                <div className="w-20 h-20 bg-[#00e5a0]/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[#00e5a0]/30 shadow-[0_0_30px_rgba(0,229,160,0.2)]">
                    <Clock size={36} className="text-[#00e5a0]" />
                </div>
                <h2 className="text-3xl font-black text-white">{t("confirmPayment")}</h2>
                <p className="text-gray-400 mt-2 text-base">{t("confirmPaymentDesc")}</p>
                {currentPlan ? (
                    <div
                        className="flex flex-col items-center gap-2 mt-4 px-4 py-3 rounded-xl"
                        style={{ background: `${currentPlan.iconColor}10`, border: `1px solid ${currentPlan.iconColor}20` }}
                    >
                        <div className="inline-flex gap-2 items-center">
                            <span className="text-sm font-black" style={{ color: currentPlan.iconColor }}>
                                {currentPlan.name}
                            </span>
                            {aiAddon ? <span className="text-xs font-bold text-[#00e5a0]">| + AI Insight</span> : null}
                            {mt5Addon ? <span className="text-xs font-bold text-[#6366f1]">| + MT5 Integration</span> : null}
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="max-w-2xl mx-auto p-6 rounded-2xl mb-10 flex justify-between items-center bg-[#0b0e14] border border-[#1c2230] shadow-inner">
                <span className="font-black text-gray-400 uppercase tracking-widest text-sm">{t("amountDue")}</span>
                <span className="text-5xl font-black text-[#00e5a0]">${totalAmount.toFixed(2)}</span>
            </div>

            <div className="max-w-2xl mx-auto space-y-6 mb-10">
                <div className="p-8 rounded-2xl border border-[#0088cc]/30 bg-[#0088cc]/5 relative overflow-hidden group hover:border-[#0088cc] transition-colors">
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
                                <Send size={18} />
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
                                <Send size={18} />
                            </div>
                        </a>
                    </div>
                </div>

                <div className="p-8 rounded-2xl border border-[#f7931a]/30 bg-[#f7931a]/5 relative overflow-hidden group hover:border-[#f7931a] transition-colors">
                    <h3 className="font-black mb-2 flex items-center gap-3 text-white relative z-10 text-xl">
                        <div className="bg-[#f7931a] text-black w-8 h-8 rounded-full flex items-center justify-center">
                            <Zap size={16} />
                        </div>
                        {t("cryptoPayment")}
                    </h3>
                    <p className="text-sm font-medium text-gray-400 mb-6 relative z-10">{t("cryptoPaymentDesc")}</p>
                    <div
                        className="p-4 rounded-xl border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between relative z-10 group/btn cursor-pointer"
                        onClick={() => copyToClipboard(walletAddress)}
                    >
                        <span className="font-mono text-sm sm:text-base font-bold break-all text-white max-w-[85%]">{walletAddress}</span>
                        <div className="text-[#f7931a] group-hover/btn:text-white transition-colors shrink-0 bg-[#f7931a]/10 p-2.5 rounded-lg ml-2">
                            <Send size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto border-t border-[#1c2230] pt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <button
                    onClick={() => setStep("plans")}
                    className="font-bold text-gray-500 hover:text-white transition-colors px-6 py-4 w-full sm:w-auto cursor-pointer"
                >
                    {t("cancelGoBack")}
                </button>
                <button
                    onClick={handleFinish}
                    className="px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
                    style={{ background: "#00e5a0", boxShadow: `0 10px 40px rgba(0,229,160,0.3)` }}
                >
                    <CircleCheck size={22} /> {t("confirmPaymentSent")}
                </button>
            </div>
        </div>
    );
}
