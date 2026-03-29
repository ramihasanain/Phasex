import { Activity, Check, Copy } from "lucide-react";
import type { SubscriptionPlan, SubscriptionStatus } from "../../contexts/AuthContext";
import { PlanIcon } from "./PlanIcon";
import { UserProfileSidebarAvatar } from "./UserProfileSidebarAvatar";
import { UserProfileSidebarGlow } from "./UserProfileSidebarGlow";
import type { PlanTheme } from "./types";

interface UserProfileSidebarProps {
    theme: PlanTheme;
    subscriptionPlan: SubscriptionPlan;
    planDisplayName: string;
    subscriptionStatus: SubscriptionStatus;
    hasMT5Access: boolean;
    userName: string;
    userEmail: string;
    referralCode: string;
    codeCopied: boolean;
    onCopyReferralCode: () => void;
    yourReferralCode: string;
    copyCode: string;
    codeCopiedLabel: string;
}

export function UserProfileSidebar({
    theme,
    subscriptionPlan,
    planDisplayName,
    subscriptionStatus,
    hasMT5Access,
    userName,
    userEmail,
    referralCode,
    codeCopied,
    onCopyReferralCode,
    yourReferralCode,
    copyCode,
    codeCopiedLabel,
}: UserProfileSidebarProps) {
    const statusColor =
        subscriptionStatus === "active" ? "#00e5a0" : subscriptionStatus === "pending" ? "#facc15" : "#ef4444";

    return (
        <div
            className="md:w-[38%] relative p-10 flex flex-col items-center justify-center text-center overflow-hidden"
            style={{
                background: `linear-gradient(160deg, #10141d 0%, #0b0e14 60%, ${theme.color}08 100%)`,
                borderRight: `1px solid ${theme.color}15`,
            }}
        >
            <UserProfileSidebarGlow theme={theme} />
            <UserProfileSidebarAvatar theme={theme} />

            <h2 className="text-2xl font-black mb-0.5 z-10 text-white">{userName}</h2>
            <p className="text-xs font-medium z-10 mb-2 text-gray-500">{userEmail}</p>

            <div
                className="px-4 py-1.5 rounded-full mb-6 z-10 flex items-center gap-2"
                style={{ background: `${theme.color}15`, border: `1px solid ${theme.color}30` }}
            >
                <PlanIcon plan={subscriptionPlan} size={14} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: theme.color }}>
                    {planDisplayName}
                </span>
            </div>

            <div
                className="w-full p-5 rounded-2xl z-10 bg-[#0b0e14]/80 border shadow-inner mt-auto"
                style={{ borderColor: `${theme.color}15` }}
            >
                <div className="text-[10px] font-black uppercase tracking-widest mb-3 text-gray-600">Account Status</div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-3 w-3">
                            <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ backgroundColor: statusColor }}
                            />
                            <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: statusColor }} />
                        </div>
                        <span className="font-bold capitalize text-white text-sm">{subscriptionStatus}</span>
                    </div>
                    {subscriptionStatus === "active" && (
                        <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-[#00e5a0]/10 text-[#00e5a0]">
                            Live
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t" style={{ borderColor: `${theme.color}10` }}>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">MT5 Integration</div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity size={14} className={hasMT5Access ? "text-[#6366f1]" : "text-gray-500"} />
                            <span className="text-xs font-bold text-white">{hasMT5Access ? "Active" : "Inactive"}</span>
                        </div>
                        {hasMT5Access ? (
                            <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-[#6366f1]/10 text-[#6366f1]">
                                Live
                            </div>
                        ) : (
                            <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-gray-500/10 text-gray-500">
                                Disabled
                            </div>
                        )}
                    </div>
                </div>

                {referralCode ? (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: `${theme.color}10` }}>
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">{yourReferralCode}</div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-sm font-black tracking-wider" style={{ color: theme.color }}>
                                {referralCode}
                            </span>
                            <button
                                type="button"
                                onClick={onCopyReferralCode}
                                className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1"
                                style={{
                                    background: codeCopied ? "#00e5a015" : `${theme.color}15`,
                                    color: codeCopied ? "#00e5a0" : theme.color,
                                }}
                            >
                                {codeCopied ? (
                                    <>
                                        <Check size={10} /> {codeCopiedLabel}
                                    </>
                                ) : (
                                    <>
                                        <Copy size={10} /> {copyCode}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
