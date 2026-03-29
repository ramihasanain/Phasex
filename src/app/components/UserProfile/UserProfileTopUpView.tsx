import { motion } from "motion/react";
import { ArrowLeft, CircleCheck, Coins, Copy, Send, X } from "lucide-react";
import type { TokenPackageSize } from "./types";
import { priceForPackage } from "./tokenTopUpPackages";
import { UserProfileTopUpPackageGrid } from "./UserProfileTopUpPackageGrid";

interface UserProfileTopUpViewProps {
    onBack: () => void;
    onClose: () => void;
    walletAddress: string;
    selectedPackage: TokenPackageSize;
    onSelectPackage: (size: TokenPackageSize) => void;
    onConfirmPaid: () => void;
    isProcessing: boolean;
    onCopyAddress: (text: string) => void;
}

export function UserProfileTopUpView({
    onBack,
    onClose,
    walletAddress,
    selectedPackage,
    onSelectPackage,
    onConfirmPaid,
    isProcessing,
    onCopyAddress,
}: UserProfileTopUpViewProps) {
    const usd = priceForPackage(selectedPackage);

    return (
        <motion.div
            key="topup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-8 md:p-10 relative bg-[#0b0e14] h-full flex flex-col overflow-y-auto"
        >
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,195,255,0.05), transparent 70%)", filter: "blur(80px)" }}
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
                    className="w-16 h-16 bg-[#00c3ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00c3ff]/30"
                    animate={{
                        boxShadow: [
                            "0 0 15px rgba(0,195,255,0.1)",
                            "0 0 30px rgba(0,195,255,0.2)",
                            "0 0 15px rgba(0,195,255,0.1)",
                        ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Coins size={30} className="text-[#00c3ff]" />
                </motion.div>
                <h2 className="text-3xl font-black text-white">Top-up AI Tokens</h2>
                <p className="text-gray-500 mt-1.5 text-sm font-medium">Purchase compute power for live radar and chat analysis.</p>
            </div>

            <UserProfileTopUpPackageGrid selectedPackage={selectedPackage} onSelect={onSelectPackage} />

            <div className="bg-[#10141d] rounded-[24px] border border-[#1c2230] p-6 flex flex-col md:flex-row gap-6 max-w-3xl mx-auto w-full relative z-10 shadow-inner">
                <div className="flex-1">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                        <Send size={16} className="text-[#00c3ff]" /> Payment Instructions
                    </h4>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        Send <strong className="text-white">${usd}</strong> via{" "}
                        <a
                            href="https://t.me/PhaseX_Ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0088cc] font-bold no-underline hover:underline"
                        >
                            Telegram
                        </a>{" "}
                        or USDT TRC20.
                    </p>
                    <div
                        role="button"
                        tabIndex={0}
                        className="flex items-center justify-between p-3 bg-[#0b0e14] rounded-xl border border-[#1c2230] cursor-pointer hover:border-[#f7931a]/40 transition-colors group"
                        onClick={() => onCopyAddress(walletAddress)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onCopyAddress(walletAddress);
                            }
                        }}
                    >
                        <span className="font-mono text-xs text-gray-400 break-all pr-3">{walletAddress}</span>
                        <span className="text-[#f7931a] group-hover:text-white group-hover:bg-[#f7931a] transition-colors p-2 bg-[#f7931a]/15 rounded-lg shrink-0">
                            <Copy size={14} />
                        </span>
                    </div>
                </div>

                <div className="flex flex-col justify-end min-w-[240px]">
                    <button
                        type="button"
                        onClick={onConfirmPaid}
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-black transition-all flex items-center justify-center gap-2 text-sm cursor-pointer ${isProcessing ? "opacity-70" : "hover:scale-[1.02]"}`}
                        style={{ background: "#00c3ff", boxShadow: "0 8px 30px rgba(0,195,255,0.25)" }}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />{" "}
                                Processing...
                            </span>
                        ) : (
                            <>
                                <CircleCheck size={18} /> I Have Paid ${usd}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
