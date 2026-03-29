import { motion } from "motion/react";
import { ArrowLeft, Check, Copy, DollarSign, Gift, Users, X } from "lucide-react";
import type { ReferralEntry } from "../../contexts/AuthContext";
import { UserProfileReferralHistoryTable } from "./UserProfileReferralHistoryTable";

interface UserProfileReferralViewProps {
    onBack: () => void;
    onClose: () => void;
    referralCode: string;
    referralBalance: number;
    referralHistory: ReferralEntry[];
    codeCopied: boolean;
    onCopyReferralCode: () => void;
    referralTitle: string;
    referralDesc: string;
    yourReferralCode: string;
    copyCode: string;
    codeCopiedLabel: string;
    referralBalanceLabel: string;
    referralTabLabel: string;
    referralHistoryLabel: string;
    referralNameLabel: string;
    referralPlanLabel: string;
    referralDateLabel: string;
    referralEarnedLabel: string;
    noReferralsLabel: string;
}

export function UserProfileReferralView({
    onBack,
    onClose,
    referralCode,
    referralBalance,
    referralHistory,
    codeCopied,
    onCopyReferralCode,
    referralTitle,
    referralDesc,
    yourReferralCode,
    copyCode,
    codeCopiedLabel,
    referralBalanceLabel,
    referralTabLabel,
    referralHistoryLabel,
    referralNameLabel,
    referralPlanLabel,
    referralDateLabel,
    referralEarnedLabel,
    noReferralsLabel,
}: UserProfileReferralViewProps) {
    return (
        <motion.div
            key="referral"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-8 md:p-10 relative bg-[#0b0e14] h-full flex flex-col overflow-y-auto"
        >
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)", filter: "blur(80px)" }}
            />

            <button
                type="button"
                onClick={onBack}
                className="absolute top-6 left-6 p-2.5 rounded-full flex items-center gap-2 hover:bg-white/5 transition-colors text-gray-400 z-10 cursor-pointer"
            >
                <ArrowLeft size={18} /> <span className="font-bold text-xs uppercase tracking-widest">Back</span>
            </button>
            <button
                type="button"
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-white/5 transition-colors text-gray-400 z-10 cursor-pointer"
            >
                <X size={22} />
            </button>

            <div className="text-center mt-8 mb-8 relative z-10">
                <motion.div
                    className="w-16 h-16 bg-[#a855f7]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#a855f7]/30"
                    animate={{
                        boxShadow: [
                            "0 0 15px rgba(168,85,247,0.1)",
                            "0 0 30px rgba(168,85,247,0.2)",
                            "0 0 15px rgba(168,85,247,0.1)",
                        ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Gift size={30} className="text-[#a855f7]" />
                </motion.div>
                <h2 className="text-3xl font-black text-white">{referralTitle}</h2>
                <p className="text-gray-500 mt-1.5 text-sm font-medium max-w-md mx-auto">{referralDesc}</p>
            </div>

            <div className="max-w-2xl mx-auto w-full space-y-4 relative z-10">
                <div className="p-5 rounded-[20px] border border-[#a855f7]/20 bg-[#10141d] text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#a855f7] mb-2">{yourReferralCode}</p>
                    <div className="flex items-center justify-center gap-3">
                        <div className="px-6 py-3 rounded-xl bg-[#0b0e14] border-2 border-[#a855f7]/30">
                            <span className="font-mono text-2xl font-black text-white tracking-[0.15em]">
                                {referralCode || "PX-XXXX0000"}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onCopyReferralCode}
                            className="px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                            style={{ background: codeCopied ? "#00e5a0" : "#a855f7", color: "#000" }}
                        >
                            {codeCopied ? (
                                <>
                                    <Check size={16} /> {codeCopiedLabel}
                                </>
                            ) : (
                                <>
                                    <Copy size={16} /> {copyCode}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-5 rounded-[20px] border border-[#1c2230] bg-[#10141d] text-center">
                        <DollarSign size={22} className="text-[#00e5a0] mx-auto mb-1.5" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-0.5">{referralBalanceLabel}</p>
                        <div className="text-2xl font-black text-[#00e5a0]">${referralBalance.toFixed(2)}</div>
                    </div>
                    <div className="p-5 rounded-[20px] border border-[#1c2230] bg-[#10141d] text-center">
                        <Users size={22} className="text-[#00c3ff] mx-auto mb-1.5" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-0.5">{referralTabLabel}</p>
                        <div className="text-2xl font-black text-[#00c3ff]">{referralHistory.length}</div>
                    </div>
                </div>

                <UserProfileReferralHistoryTable
                    referralHistory={referralHistory}
                    referralHistoryLabel={referralHistoryLabel}
                    referralNameLabel={referralNameLabel}
                    referralPlanLabel={referralPlanLabel}
                    referralDateLabel={referralDateLabel}
                    referralEarnedLabel={referralEarnedLabel}
                    noReferralsLabel={noReferralsLabel}
                />
            </div>
        </motion.div>
    );
}
