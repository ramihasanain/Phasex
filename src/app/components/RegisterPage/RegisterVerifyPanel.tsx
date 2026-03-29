import { motion } from "motion/react";
import { MailCheck, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";

type Props = { w: RegisterWizardValue };

export function RegisterVerifyPanel({ w }: Props) {
  const {
    isRTL,
    formData,
    verifyChecking,
    handleCheckVerification,
    handleResendVerification,
    resendCooldown,
    resendSuccess,
  } = w;

  return (
    <>
      <motion.div
        className="w-24 h-24 rounded-full flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.15) 0%, transparent 100%)` }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "3px solid rgba(168,85,247,0.2)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <MailCheck size={44} color="#a855f7" />
      </motion.div>

      <div>
        <h2 className="text-xl font-black text-white mb-2">{isRTL ? "تحقق من بريدك الإلكتروني" : "Verify Your Email"}</h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed font-medium">
          {isRTL
            ? `أرسلنا رابط تحقق إلى ${formData.email}. يرجى فتح بريدك والضغط على الرابط لتفعيل حسابك.`
            : `We sent a verification link to ${formData.email}. Please check your inbox and click the link to activate your account.`}
        </p>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        <motion.button
          type="button"
          onClick={handleCheckVerification}
          disabled={verifyChecking}
          className="w-full py-3.5 rounded-xl text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, #a855f7, #9333ea)`, color: "#fff", boxShadow: `0 8px 30px rgba(168,85,247,0.3)` }}
          whileHover={!verifyChecking ? { scale: 1.02 } : {}}
          whileTap={!verifyChecking ? { scale: 0.98 } : {}}
        >
          {verifyChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isRTL ? "جاري التحقق..." : "Checking..."}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {isRTL ? "لقد فعّلت بريدي" : "I've Verified My Email"}
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={handleResendVerification}
          disabled={resendCooldown > 0}
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 transition-all"
          style={{
            background: "rgba(255,255,255,0.03)",
            color: resendCooldown > 0 ? "#6b7280" : "#a855f7",
            border: `1px solid ${resendCooldown > 0 ? "rgba(255,255,255,0.06)" : "rgba(168,85,247,0.25)"}`,
          }}
          whileHover={resendCooldown === 0 ? { background: "rgba(168,85,247,0.08)" } : {}}
          whileTap={resendCooldown === 0 ? { scale: 0.98 } : {}}
        >
          <RefreshCw className="w-4 h-4" />
          {resendCooldown > 0
            ? isRTL
              ? `إعادة إرسال (${resendCooldown}s)`
              : `Resend (${resendCooldown}s)`
            : isRTL
              ? "إعادة إرسال رابط التحقق"
              : "Resend Verification Link"}
        </motion.button>
      </div>

      {resendSuccess && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-[#00e5a0]">
          {isRTL ? "تم إرسال رابط التحقق مجدداً!" : "Verification link resent!"}
        </motion.p>
      )}

      <div className="p-3 rounded-xl max-w-xs" style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)" }}>
        <p className="text-[11px] text-gray-400">
          {isRTL ? "💡 تحقق من مجلد الرسائل غير المرغوب فيها (Spam) إذا لم تجد الرسالة." : "💡 Check your spam/junk folder if you don't see the email."}
        </p>
      </div>
    </>
  );
}
