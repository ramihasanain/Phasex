import { motion } from "motion/react";
import { ArrowRight, Gift, Users } from "lucide-react";

interface UserProfileDashboardReferralCardProps {
    referralBalance: number;
    referralEarningsLabel: string;
    referralTabLabel: string;
    referralCountLabel: string;
    onOpenReferral: () => void;
}

export function UserProfileDashboardReferralCard({
    referralBalance,
    referralEarningsLabel,
    referralTabLabel,
    referralCountLabel,
    onOpenReferral,
}: UserProfileDashboardReferralCardProps) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="p-6 rounded-[24px] border bg-[#10141d] transition-all flex flex-col cursor-pointer relative overflow-hidden group"
            onClick={onOpenReferral}
            style={{ borderColor: "#a855f720" }}
        >
            <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[#a855f7] opacity-[0.04] rounded-full blur-[35px] pointer-events-none group-hover:opacity-[0.1] transition-opacity" />
            <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#a855f7]/12 text-[#a855f7] shadow-inner">
                    <Gift size={24} />
                </div>
                <span className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-[#a855f7]/10 uppercase tracking-widest text-[#a855f7]">
                    {referralTabLabel}
                </span>
            </div>
            <div className="text-2xl font-black text-white relative z-10">${referralBalance.toFixed(2)}</div>
            <p className="text-[11px] font-medium text-gray-500 mb-4 mt-0.5 relative z-10">{referralEarningsLabel}</p>
            <div className="mt-auto pt-3 border-t border-[#a855f710] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-500">{referralCountLabel}</span>
                </div>
                <ArrowRight size={14} className="text-gray-500" />
            </div>
        </motion.div>
    );
}
