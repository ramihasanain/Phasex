import { Clock, Settings } from "lucide-react";

interface UserProfileDashboardBillingCardProps {
    billingText: string;
}

export function UserProfileDashboardBillingCard({ billingText }: UserProfileDashboardBillingCardProps) {
    return (
        <div className="p-6 rounded-[24px] border border-[#1c2230] bg-[#10141d] flex items-center gap-5 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#facc15]/10 text-[#facc15] shrink-0">
                <Clock size={22} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm">Billing Cycle</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{billingText}</p>
            </div>
            <button type="button" className="p-2.5 rounded-xl hover:bg-white/5 text-gray-500 transition-colors shrink-0 cursor-pointer">
                <Settings size={18} />
            </button>
        </div>
    );
}
