import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { TokenPackageSize } from "./types";
import { TOKEN_TOP_UP_PACKAGES } from "./tokenTopUpPackages";

interface UserProfileTopUpPackageGridProps {
    selectedPackage: TokenPackageSize;
    onSelect: (size: TokenPackageSize) => void;
}

export function UserProfileTopUpPackageGrid({ selectedPackage, onSelect }: UserProfileTopUpPackageGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10 max-w-3xl mx-auto w-full">
            {TOKEN_TOP_UP_PACKAGES.map((pkg) => (
                <motion.div
                    key={pkg.tokens}
                    whileHover={{ y: -4 }}
                    onClick={() => onSelect(pkg.tokens as TokenPackageSize)}
                    className="cursor-pointer rounded-[20px] p-6 border-2 transition-all relative overflow-hidden flex flex-col"
                    style={{
                        borderColor: selectedPackage === pkg.tokens ? pkg.color : "#1c2230",
                        backgroundColor: selectedPackage === pkg.tokens ? `${pkg.color}08` : "#10141d",
                    }}
                >
                    {pkg.popular ? (
                        <div className="absolute top-0 right-0 px-3 py-1 bg-[#00c3ff] text-black text-[9px] font-black uppercase tracking-widest rounded-bl-xl">
                            Best
                        </div>
                    ) : null}
                    {selectedPackage === pkg.tokens ? (
                        <div
                            className="absolute top-4 right-4 rounded-full p-0.5 border-2"
                            style={{ color: pkg.color, borderColor: pkg.color }}
                        >
                            <Check size={12} strokeWidth={4} />
                        </div>
                    ) : null}
                    <div className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-gray-600">{pkg.name}</div>
                    <div className="text-3xl font-black text-white mb-4">
                        {pkg.tokens.toLocaleString()} <span className="text-xs font-bold text-gray-600">TK</span>
                    </div>
                    <div className="text-2xl font-black mt-auto" style={{ color: selectedPackage === pkg.tokens ? pkg.color : "#fff" }}>
                        ${pkg.price}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
