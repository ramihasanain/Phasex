import { motion } from "motion/react";
import { Lock, Mail } from "lucide-react";

interface LoginPageLoginCredentialsProps {
    accent: string;
    accentG: string;
    isRTL: boolean;
    t: (key: string) => string;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    focused: string | null;
    setFocused: (v: string | null) => void;
    onOpenForgot: () => void;
}

export function LoginPageLoginCredentials({
    accent,
    accentG,
    isRTL,
    t,
    email,
    setEmail,
    password,
    setPassword,
    focused,
    setFocused,
    onOpenForgot,
}: LoginPageLoginCredentialsProps) {
    return (
        <>
            <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase" htmlFor="email">
                    {t("emailLabel")}
                </label>
                <div className="relative group">
                    <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                            border: `1px solid ${focused === "email" ? accent : "rgba(255,255,255,0.06)"}`,
                            boxShadow: focused === "email" ? `0 0 20px ${accentG}0.15), inset 0 0 15px ${accentG}0.05)` : "none",
                        }}
                        animate={focused === "email" ? { borderColor: [accent, `${accent}80`, accent] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <input
                        id="email"
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        required
                        dir="auto"
                        className="w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 px-10 text-sm font-medium outline-none transition-all"
                    />
                    <Mail
                        className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 rtl:right-4"
                        style={{ color: focused === "email" ? accent : "#4b5563" }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase" htmlFor="password">
                    {t("passwordLabel")}
                </label>
                <div className="relative group">
                    <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                            border: `1px solid ${focused === "password" ? accent : "rgba(255,255,255,0.06)"}`,
                            boxShadow: focused === "password" ? `0 0 20px ${accentG}0.15), inset 0 0 15px ${accentG}0.05)` : "none",
                        }}
                        animate={focused === "password" ? { borderColor: [accent, `${accent}80`, accent] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <input
                        id="password"
                        type="password"
                        placeholder={t("passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)}
                        required
                        dir="auto"
                        className="w-full bg-[rgba(255,255,255,0.03)] text-white placeholder:text-gray-600 rounded-xl py-3.5 px-10 text-sm font-medium outline-none transition-all"
                    />
                    <Lock
                        className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 rtl:right-4"
                        style={{ color: focused === "password" ? accent : "#4b5563" }}
                    />
                </div>
                <div className="flex justify-end mt-1">
                    <button type="button" onClick={onOpenForgot} className="text-[11px] font-bold cursor-pointer hover:opacity-80 transition-opacity" style={{ color: accent }}>
                        {isRTL ? "نسيت كلمة السر؟" : "Forgot password?"}
                    </button>
                </div>
            </div>
        </>
    );
}
