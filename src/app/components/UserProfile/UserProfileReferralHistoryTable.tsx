import { Clock, Users } from "lucide-react";
import type { ReferralEntry } from "../../contexts/AuthContext";

interface UserProfileReferralHistoryTableProps {
    referralHistory: ReferralEntry[];
    referralHistoryLabel: string;
    referralNameLabel: string;
    referralPlanLabel: string;
    referralDateLabel: string;
    referralEarnedLabel: string;
    noReferralsLabel: string;
}

export function UserProfileReferralHistoryTable({
    referralHistory,
    referralHistoryLabel,
    referralNameLabel,
    referralPlanLabel,
    referralDateLabel,
    referralEarnedLabel,
    noReferralsLabel,
}: UserProfileReferralHistoryTableProps) {
    return (
        <div className="p-5 rounded-[20px] border border-[#1c2230] bg-[#10141d]">
            <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                <Clock size={16} className="text-gray-500" /> {referralHistoryLabel}
            </h4>
            {referralHistory.length === 0 ? (
                <div className="text-center py-8">
                    <Users size={32} className="text-gray-700 mx-auto mb-2" />
                    <p className="text-gray-600 text-xs font-medium">{noReferralsLabel}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#1c2230]">
                                <th className="text-[9px] font-black uppercase tracking-widest text-gray-600 py-2.5 text-left">
                                    {referralNameLabel}
                                </th>
                                <th className="text-[9px] font-black uppercase tracking-widest text-gray-600 py-2.5 text-left">
                                    {referralPlanLabel}
                                </th>
                                <th className="text-[9px] font-black uppercase tracking-widest text-gray-600 py-2.5 text-left">
                                    {referralDateLabel}
                                </th>
                                <th className="text-[9px] font-black uppercase tracking-widest text-gray-600 py-2.5 text-right">
                                    {referralEarnedLabel}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {referralHistory.map((entry, i) => (
                                <tr key={i} className="border-b border-[#1c2230]/50 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7] text-[10px] font-black">
                                                {entry.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-white">{entry.name}</span>
                                                <p className="text-[9px] text-gray-600">{entry.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5">
                                        <span className="text-[10px] font-bold text-gray-400 px-2 py-0.5 rounded-md bg-white/5">
                                            {entry.plan}
                                        </span>
                                    </td>
                                    <td className="py-2.5 text-[10px] text-gray-500">{entry.date}</td>
                                    <td className="py-2.5 text-right">
                                        <span className="text-xs font-black text-[#00e5a0]">+${entry.earned.toFixed(2)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
