import { motion } from "motion/react";
import { User, Mail, Lock, MapPin, Sparkles } from "lucide-react";
import type { RegisterWizardValue } from "./useRegisterWizard";
import { RegisterVerifyPanel } from "./RegisterVerifyPanel";

type Props = { w: RegisterWizardValue };

export function RegisterStepsEarly({ w }: Props) {
  const { step, isRTL, formData, setFormData, renderInput, countries, accent, accentG, focused, setFocused, stepColors } = w;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className={step === 3 ? "flex flex-col items-center justify-center py-8 text-center space-y-5" : "space-y-4"}
    >
      {step === 1 && (
        <>
          <div className="text-center mb-4">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `${stepColors[0]}12`, border: `1px solid ${stepColors[0]}25` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <User className="w-4 h-4" style={{ color: stepColors[0] }} />
              <span className="text-sm font-bold" style={{ color: stepColors[0] }}>
                {isRTL ? "من أنت؟" : "Who are you?"}
              </span>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {renderInput("firstName", "text", isRTL ? "الاسم الأول" : "First Name", formData.firstName, (v) => setFormData({ ...formData, firstName: v }), <User className="w-4 h-4" />)}
            {renderInput("lastName", "text", isRTL ? "اسم العائلة" : "Last Name", formData.lastName, (v) => setFormData({ ...formData, lastName: v }), <User className="w-4 h-4" />)}
          </div>

          <motion.div
            className="p-4 rounded-xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: `${stepColors[0]}08`, border: `1px solid ${stepColors[0]}18` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${stepColors[0]}, ${stepColors[0]}88)` }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: stepColors[0] }}>
                  {isRTL ? "مرحباً بك في Phase X" : "Welcome to Phase X"}
                </p>
                <p className="text-xs text-gray-500">{isRTL ? "انضم لأكثر من 10,000 متداول محترف" : "Join 10,000+ professional traders"}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="text-center mb-4">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-4 h-4" style={{ color: accent }} />
              <span className="text-sm font-bold" style={{ color: accent }}>
                {isRTL ? "تأمين الحساب" : "Secure Account"}
              </span>
            </motion.div>
          </div>

          {renderInput("email", "email", isRTL ? "البريد الإلكتروني" : "Email", formData.email, (v) => setFormData({ ...formData, email: v }), <Mail className="w-4 h-4" />)}

          <div className="grid grid-cols-2 gap-3">
            {renderInput("password", "password", isRTL ? "كلمة المرور" : "Password", formData.password, (v) => setFormData({ ...formData, password: v }), <Lock className="w-4 h-4" />)}
            {renderInput(
              "confirmPassword",
              "password",
              isRTL ? "تأكيد كلمة المرور" : "Confirm Password",
              formData.confirmPassword,
              (v) => setFormData({ ...formData, confirmPassword: v }),
              <Lock className="w-4 h-4" />
            )}
          </div>

          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                border: `1px solid ${focused === "country" ? accent : "rgba(255,255,255,0.06)"}`,
                boxShadow: focused === "country" ? `0 0 20px ${accentG}0.15)` : "none",
              }}
            />
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              onFocus={() => setFocused("country")}
              onBlur={() => setFocused(null)}
              className="w-full bg-[rgba(255,255,255,0.03)] text-white rounded-xl py-3.5 px-4 text-sm font-medium outline-none appearance-none cursor-pointer"
              style={{ paddingLeft: isRTL ? "16px" : "44px", paddingRight: isRTL ? "44px" : "16px" }}
            >
              <option value="" className="bg-[#0a0e18]">
                {isRTL ? "اختر الدولة" : "Select Country"}
              </option>
              {countries.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#0a0e18]">
                  {c.label}
                </option>
              ))}
            </select>
            <MapPin className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4`} style={{ color: focused === "country" ? accent : "#4b5563" }} />
          </div>
        </>
      )}

      {step === 3 && <RegisterVerifyPanel w={w} />}
    </motion.div>
  );
}
