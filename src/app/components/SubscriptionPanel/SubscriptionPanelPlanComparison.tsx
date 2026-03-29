import { ArrowDownCircle, ArrowUpCircle, ChevronRight, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { SubscriptionPlanRow } from "./types";

export function SubscriptionPanelPlanComparison({
    isRTL,
    subscriptionPlan,
    selectedPlan,
    currentPlanObj,
    newPlanObj,
    billingCycle,
    getPrice,
    aiAddon,
    mt5Addon,
    changeColor,
    changeBg,
    isUpgrade,
    isDowngrade,
}: {
    isRTL: boolean;
    subscriptionPlan: string;
    selectedPlan: string | null;
    currentPlanObj: SubscriptionPlanRow | undefined;
    newPlanObj: SubscriptionPlanRow | undefined;
    billingCycle: "monthly" | "yearly";
    getPrice: (n: number) => number;
    aiAddon: boolean;
    mt5Addon: boolean;
    changeColor: string;
    changeBg: string;
    isUpgrade: boolean;
    isDowngrade: boolean;
}) {
    return (
        <>
            <div className="text-center mb-10">
                <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
                    style={{
                        background: `${changeBg}0.1)`,
                        border: `2px solid ${changeBg}0.3)`,
                        boxShadow: `0 0 30px ${changeBg}0.15)`,
                    }}
                >
                    {isUpgrade ? (
                        <ArrowUpCircle size={40} color={changeColor} />
                    ) : isDowngrade ? (
                        <ArrowDownCircle size={40} color={changeColor} />
                    ) : (
                        <Zap size={40} color={changeColor} />
                    )}
                </div>
                <h2 className="text-3xl font-black text-white mb-2">
                    {isUpgrade
                        ? isRTL
                            ? "تأكيد الترقية"
                            : "Confirm Upgrade"
                        : isDowngrade
                          ? isRTL
                              ? "تأكيد التخفيض"
                              : "Confirm Downgrade"
                          : isRTL
                            ? "تأكيد التحديث"
                            : "Confirm Update"}
                </h2>
                <p className="text-gray-400 text-sm">{isRTL ? "راجع التغييرات قبل التأكيد" : "Review the changes before confirming"}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="flex-1 w-full p-5 rounded-2xl border border-[#1c2230] bg-[#10141d]">
                    <div className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-3">
                        {isRTL ? "الخطة الحالية" : "Current Plan"}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        {currentPlanObj ? (
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                    background: `${currentPlanObj.iconColor}20`,
                                    border: `1px solid ${currentPlanObj.iconColor}40`,
                                }}
                            >
                                {currentPlanObj.icon}
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-800" />
                        )}
                        <span className="text-lg font-black text-white capitalize">{currentPlanObj?.name || subscriptionPlan}</span>
                    </div>
                    <div className="text-2xl font-black text-gray-400">
                        ${currentPlanObj ? getPrice(currentPlanObj.price) : 0}
                        <span className="text-xs text-gray-600 font-bold">
                            /{billingCycle === "yearly" ? (isRTL ? "سنة" : "yr") : isRTL ? "شهر" : "mo"}
                        </span>
                    </div>
                </div>

                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ChevronRight size={32} color={changeColor} className="rotate-0 sm:rotate-0" />
                </motion.div>

                <div
                    className="flex-1 w-full p-5 rounded-2xl relative overflow-hidden"
                    style={{
                        background: `${changeBg}0.05)`,
                        border: `2px solid ${changeColor}`,
                        boxShadow: `0 0 20px ${changeBg}0.1)`,
                    }}
                >
                    <div className="text-[10px] uppercase tracking-widest font-black mb-3" style={{ color: changeColor }}>
                        {isRTL ? "الخطة الجديدة" : "New Plan"}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        {newPlanObj ? (
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                    background: `${newPlanObj.iconColor}20`,
                                    border: `1px solid ${newPlanObj.iconColor}40`,
                                }}
                            >
                                {newPlanObj.icon}
                            </div>
                        ) : null}
                        <span className="text-lg font-black text-white capitalize">{newPlanObj?.name || selectedPlan}</span>
                    </div>
                    <div className="text-2xl font-black" style={{ color: changeColor }}>
                        ${newPlanObj ? getPrice(newPlanObj.price) : 0}
                        <span className="text-xs text-gray-500 font-bold">
                            /{billingCycle === "yearly" ? (isRTL ? "سنة" : "yr") : isRTL ? "شهر" : "mo"}
                        </span>
                    </div>
                    {aiAddon || mt5Addon ? (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${changeBg}0.2)` }}>
                            <div className="text-[9px] uppercase tracking-widest font-black text-gray-500 mb-1">
                                {isRTL ? "الإضافات" : "Add-ons"}
                            </div>
                            {aiAddon ? <div className="text-xs font-bold text-[#00e5a0]">+ AI Insight ($20/mo)</div> : null}
                            {mt5Addon ? <div className="text-xs font-bold text-[#6366f1]">+ MT5 Integration ($30/mo)</div> : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}
