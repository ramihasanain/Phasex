import { motion } from "motion/react";
import { Send, Zap } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterStepPayment({ w }: Props) {
  const { t, previewTotal, totalAmount, walletAddress, copyToClipboard } = w;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
      <div className="text-center mb-3">
        <div className="w-16 h-16 bg-[#00e5a0]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#00e5a0]/30 shadow-[0_0_20px_rgba(0,229,160,0.2)]">
          <Send size={28} className="text-[#00e5a0]" />
        </div>
        <h2 className="text-xl font-black text-white">{t("confirmPayment")}</h2>
        <p className="text-gray-400 mt-1 text-xs">{t("confirmPaymentDesc")}</p>
      </div>

      <div className="p-4 rounded-xl flex justify-between items-center bg-[#0b0e14] border border-[#1c2230]">
        <span className="font-black text-gray-400 uppercase tracking-widest text-xs">{t("amountDue")}</span>
        <span className="text-3xl font-black text-[#00e5a0]">${(previewTotal ?? totalAmount).toFixed(2)}</span>
      </div>

      <div className="p-5 rounded-xl border border-[#0088cc]/30 bg-[#0088cc]/5 hover:border-[#0088cc] transition-colors">
        <h3 className="font-black mb-1.5 flex items-center gap-2 text-white text-sm">
          <div className="bg-[#0088cc] text-black w-6 h-6 rounded-full flex items-center justify-center">
            <Send size={12} />
          </div>
          {t("telegramFastTrack")}
        </h3>
        <p className="text-[11px] text-gray-400 mb-3">{t("telegramFastTrackDesc")}</p>
        <div className="space-y-2">
          <a
            href="https://t.me/PhaseX_Ai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline"
          >
            <span className="font-mono text-sm font-bold text-white">@PhaseX_Ai</span>
            <div className="text-[#0088cc] bg-[#0088cc]/10 p-1.5 rounded-lg">
              <Send size={14} />
            </div>
          </a>
          <a
            href="https://t.me/PhaseX_Ai_SupportBot"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer hover:border-[#0088cc]/50 transition-colors no-underline"
          >
            <span className="font-mono text-sm font-bold text-white">@PhaseX_Ai_SupportBot</span>
            <div className="text-[#0088cc] bg-[#0088cc]/10 p-1.5 rounded-lg">
              <Send size={14} />
            </div>
          </a>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-[#f7931a]/30 bg-[#f7931a]/5 hover:border-[#f7931a] transition-colors">
        <h3 className="font-black mb-1.5 flex items-center gap-2 text-white text-sm">
          <div className="bg-[#f7931a] text-black w-6 h-6 rounded-full flex items-center justify-center">
            <Zap size={12} />
          </div>
          USDT TRC20
        </h3>
        <p className="text-[11px] text-gray-400 mb-3">{t("cryptoPaymentDesc")}</p>
        <div className="p-3 rounded-lg border border-[#1c2230] bg-[#0b0e14] flex items-center justify-between cursor-pointer" onClick={() => copyToClipboard(walletAddress)}>
          <span className="font-mono text-xs font-bold break-all text-white max-w-[85%]">{walletAddress}</span>
          <div className="text-[#f7931a] shrink-0 bg-[#f7931a]/10 p-1.5 rounded-lg ml-2">
            <Send size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
