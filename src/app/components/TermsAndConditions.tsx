import { motion, AnimatePresence } from "motion/react";
import { X, Shield, FileText, Cookie, AlertTriangle, BookOpen, Eye, ShieldAlert } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const termsEN = [
    {
        title: "1. Definitions", items: [
            "Platform / Website: The PHASEX website, applications, interfaces, and all related analytical tools and services.",
            "User: Any individual accessing or using the platform or creating an account.",
            "Content: All data, charts, indicators, classifications, market states, analytics, text, visualizations, or outputs provided by PHASEX.",
            "Subscription: Any paid or free plan granting access to features, analytics, or platform tools.",
        ]
    },
    { title: "2. Acceptance of Terms", text: "By accessing or using PHASEX, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.\nIf you do not agree with any part of these terms, you must discontinue use of the platform." },
    {
        title: "3. Nature of the Service", text: "PHASEX provides quantitative market analysis tools and structural market representations designed for informational, analytical, and educational purposes.\nPHASEX does not provide financial advice, investment recommendations, or trading signals.\nNothing on the platform should be interpreted as:", items: [
            "Financial advice",
            "Investment advice",
            "A solicitation to buy or sell any financial instrument",
        ], after: "Users remain fully responsible for their own trading and investment decisions."
    },
    {
        title: "4. Eligibility", text: "By using the platform, you confirm that:", items: [
            "You are at least the legal age in your jurisdiction.",
            "You have the legal capacity to enter into binding agreements.",
            "Your use of the platform complies with applicable laws and regulations.",
        ]
    },
    {
        title: "5. Account Security", text: "Users are responsible for maintaining the confidentiality of their login credentials.\nPHASEX is not responsible for unauthorized access resulting from:", items: [
            "Account sharing",
            "Weak passwords",
            "Failure to secure login information",
        ], after: "Users must immediately notify the platform if suspicious activity is detected."
    },
    {
        title: "6. Service Availability", text: "PHASEX strives to maintain reliable service but does not guarantee uninterrupted availability.\nThe platform may experience:", items: [
            "Maintenance periods",
            "Technical interruptions",
            "System updates",
            "Data delays",
        ], after: "PHASEX is not liable for any losses caused by service interruptions."
    },
    {
        title: "7. Data Sources", text: "Market data and analytics may rely on third-party data providers.\nDue to variations between data feeds, brokers, or exchanges:", items: [
            "Prices may differ",
            "Data timing may vary",
            "Chart structures may not exactly match other platforms",
        ], after: "PHASEX does not guarantee absolute accuracy of third-party data."
    },
    {
        title: "8. Intellectual Property", text: "All intellectual property rights related to PHASEX are owned by the platform or its licensors, including:", items: [
            "Algorithms",
            "Structural charting models",
            "Interface design",
            "Databases",
            "Brand elements",
        ], after: "Users may not copy, distribute, reverse engineer, resell, or extract data from the platform without written permission."
    },
    {
        title: "9. Prohibited Use", text: "Users may not:", items: [
            "Use PHASEX for illegal activities",
            "Attempt to disrupt or hack the system",
            "Resell platform access",
            "Misrepresent PHASEX outputs as guaranteed trading signals",
        ], after: "Violation may result in account suspension or termination."
    },
    { title: "10. Subscriptions and Payments", text: "Access to certain features may require a paid subscription.\nSubscription terms, pricing, and features are clearly described on the platform.\nPHASEX reserves the right to modify subscription plans or pricing with appropriate notice." },
    { title: "11. Refund Policy", text: "Subscription payments are generally non-refundable unless explicitly stated otherwise.\nUsers are responsible for reviewing the subscription terms before completing payment." },
    { title: "12. Disclaimer of Warranties", text: "The platform is provided \"as is\" and \"as available.\"\nPHASEX makes no warranties regarding:", items: ["Accuracy", "Reliability", "Continuous availability", "Suitability for trading decisions"] },
    { title: "13. Limitation of Liability", text: "To the fullest extent permitted by law, PHASEX shall not be liable for:", items: ["Trading losses", "Financial damages", "Loss of profits", "Indirect or consequential damages"], after: "arising from the use of the platform." },
    { title: "14. Indemnification", text: "Users agree to indemnify and hold harmless PHASEX from claims, damages, or legal expenses resulting from misuse of the platform or violation of these terms." },
    { title: "15. Termination", text: "PHASEX reserves the right to suspend or terminate accounts that violate platform rules or threaten system integrity." },
    { title: "16. Amendments", text: "These Terms may be updated periodically. Continued use of the platform constitutes acceptance of the updated terms." },
    { title: "17. Governing Law", text: "These Terms shall be governed by the UAE laws of the jurisdiction in UAE operates." },
    { title: "18. Contact", text: "For legal inquiries or support:\nSupport Email: phasexai@gmail.com" },
];

const termsAR = [
    {
        title: "1. التعريفات", items: [
            "المنصة / الموقع: موقع وتطبيق PHASEX وخدماته الرقمية وأي واجهات أو أدوات مرتبطة به.",
            "المستخدم: أي شخص يصل إلى المنصة أو ينشئ حسابًا أو يستخدم الخدمات.",
            "المحتوى: كل ما تعرضه المنصة من بيانات، تصنيفات، حالات سوق، شارتات، مؤشرات، نصوص، أو مخرجات تحليلية.",
            "الاشتراك: أي خطة مدفوعة/تجريبية تتيح الوصول إلى محتوى أو مزايا إضافية.",
        ]
    },
    { title: "2. القبول والاستخدام", text: "باستخدامك PHASEX أو إنشاء حساب، فإنك توافق على هذه الشروط والأحكام. إذا لم توافق، يجب التوقف عن استخدام المنصة." },
    {
        title: "3. طبيعة الخدمة وعدم تقديم المشورة", items: [
            "PHASEX منصة تحليل كمي وتمثيل سوقي، وتعرض \"حالات سوق\" ومخرجات تحليلية لأغراض معلوماتية/بحثية/تعليمية.",
            "لا تُعد أي مادة في PHASEX توصية استثمارية أو نصيحة مالية أو دعوة للشراء/البيع، ولا تمثل استشارة شخصية تناسب ظروفك.",
        ]
    },
    {
        title: "4. أهلية الاستخدام", text: "يقر المستخدم بأنه:", items: [
            "بلغ السن القانوني في بلد إقامته.",
            "يملك الأهلية القانونية للتعاقد.",
            "استخدامه لا يخالف الأنظمة/القوانين المحلية أو قيود الجهات الرقابية في دولته.",
        ]
    },
    {
        title: "5. الحسابات والأمان", items: [
            "المستخدم مسؤول عن سرية بيانات الدخول (اسم المستخدم/كلمة المرور) وعن جميع الأنشطة التي تتم عبر حسابه.",
            "يجب إخطار الإدارة فورًا عند الاشتباه بأي اختراق أو استخدام غير مصرح به.",
        ]
    },
    {
        title: "6. حدود الخدمة والتوفر", items: [
            "قد تتعرض المنصة لانقطاعات، صيانة، تحديثات، أو تغييرات وظيفية.",
            "لا نضمن أن الخدمة ستكون متاحة بشكل دائم أو دون أخطاء أو دون تأخير.",
        ]
    },
    {
        title: "7. مصادر البيانات والأطراف الثالثة", items: [
            "قد تعتمد المنصة على مزودين خارجيين للبيانات أو البنية التحتية أو بوابات الدفع.",
            "قد تختلف الأسعار/البيانات بين مزود وآخر بسبب فروقات التسعير أو التأخير أو اختلاف التوقيت.",
            "PHASEX غير مسؤولة عن أخطاء أو تأخير مزود خارجي خارج سيطرتها.",
        ]
    },
    {
        title: "8. الملكية الفكرية", items: [
            "جميع حقوق الملكية الفكرية (الاسم، العلامة، الواجهات، الخوارزميات، الشارتات، التصاميم، النصوص، قواعد البيانات) مملوكة لـ PHASEX أو للمرخصين لها.",
            "يُحظر نسخ أو إعادة نشر أو بيع أو إعادة توزيع أو الهندسة العكسية أو استخراج الخوارزميات أو المحتوى بأي وسيلة دون إذن كتابي.",
        ]
    },
    {
        title: "9. الاستخدامات المحظورة", text: "يُحظر على المستخدم:", items: [
            "استخدام المنصة في أي نشاط غير قانوني أو احتيالي.",
            "محاولة اختراق أو تعطيل الخدمة أو جمع بيانات غير مصرح بها.",
            "إعادة بيع الاشتراك أو مشاركة الحساب على نحو يخالف سياسة الاشتراك.",
            "تقديم ادعاءات مضللة بأن PHASEX تضمن الربح أو تقدم إشارات مضمونة.",
        ]
    },
    {
        title: "10. الاشتراكات والدفع", items: [
            "الأسعار، المزايا، مدة الاشتراك، والتجديد (إن وجد) موضحة داخل صفحة الخطط.",
            "قد يتم تعديل الأسعار أو المزايا مستقبلًا مع إشعار مناسب عبر المنصة أو البريد.",
        ]
    },
    {
        title: "11. سياسة الاسترجاع والإلغاء", items: [
            "يمكنك إلغاء التجديد في أي وقت من إعدادات الحساب، ويسري الإلغاء اعتبارًا من نهاية دورة الفوترة الحالية.",
            "الاشتراكات غير قابلة للاسترجاع بعد التفعيل ما لم يُذكر خلاف ذلك.",
        ]
    },
    {
        title: "12. إخلاء المسؤولية", items: [
            "يتم تقديم المحتوى \"كما هو\" و\"حسب التوفر\".",
            "لا نقدم أي ضمانات صريحة أو ضمنية بخصوص الدقة، الملاءمة لغرض معين، عدم الانقطاع، أو النتائج.",
        ]
    },
    {
        title: "13. حدود المسؤولية", text: "إلى الحد الذي يسمح به القانون:", items: [
            "لا تتحمل PHASEX أو فريقها أي مسؤولية عن أي خسائر مالية/تجارية/عرضية/تبعية ناتجة عن استخدام المنصة أو الاعتماد على محتواها.",
            "المستخدم يتحمل وحده مسؤولية قراراته التداولية ونتائجها.",
        ]
    },
    {
        title: "14. التعويض (Indemnity)", text: "يوافق المستخدم على تعويض PHASEX عن أي مطالبات أو أضرار أو تكاليف ناتجة عن:", items: [
            "إساءة استخدام المنصة",
            "انتهاك هذه الشروط",
            "انتهاك حقوق طرف ثالث",
        ]
    },
    {
        title: "15. الإيقاف وإنهاء الخدمة", text: "يحق لـ PHASEX:", items: [
            "تعليق/إغلاق الحساب عند الاشتباه بسلوك مخالف أو إساءة استخدام أو انتهاك أمني.",
            "إنهاء الخدمة كليًا أو جزئيًا وفق تقديرها مع إشعار مناسب عند الإمكان.",
        ]
    },
    { title: "16. التعديلات", text: "قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرارك باستخدام المنصة بعد التحديث يعني قبولك للشروط المعدلة." },
    { title: "17. القانون والاختصاص", text: "تخضع هذه الشروط لقوانين الإمارات العربية المتحدة، وتكون المحاكم المختصة في الإمارات العربية المتحدة هي المرجع عند النزاع، ما لم تُلزم القوانين بخلاف ذلك." },
    { title: "18. التواصل", text: "للاستفسارات القانونية أو الدعم:\nphasexai@gmail.com" },
];

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";
    const terms = isRTL ? termsAR : termsEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        {/* Top LED */}
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }} />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <Shield className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {isRTL ? "الشروط والأحكام" : "Terms and Conditions"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {terms.map((section, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.text && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                                    )}
                                    {section.items && (
                                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {section.items.map((item, j) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).after && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mt-2">{(section as any).after}</p>
                                    )}
                                </motion.div>
                            ))}

                            {/* Contact */}
                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-xs text-gray-500">
                                    © 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}
                                </p>
                            </div>
                        </div>

                        {/* Bottom LED */}
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Export a simple button component for the footer
export function TermsButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{
                background: `${accentG}0.06)`,
                border: `1px solid ${accentG}0.15)`,
                color: accent,
            }}
        >
            <FileText className="w-3.5 h-3.5" />
            {isRTL ? "الشروط والأحكام" : "Terms & Conditions"}
        </motion.button>
    );
}

/* ═══════════ COOKIE POLICY ═══════════ */

const cookieEN = [
    { title: "What Are Cookies", text: "Cookies are small text files stored on your device when you visit a website. They allow websites to recognize your device and improve the user experience." },
    {
        title: "How PHASEX Uses Cookies", text: "PHASEX uses cookies for purposes including:", items: [
            "Maintaining secure login sessions",
            "Improving website functionality",
            "Understanding how users interact with the platform",
            "Enhancing performance and stability",
        ]
    },
    {
        title: "Types of Cookies We Use", subsections: [
            { sub: "Essential Cookies", desc: "Required for the basic operation of the platform, including account authentication and security." },
            { sub: "Performance Cookies", desc: "Help analyze website traffic and platform usage in order to improve functionality." },
            { sub: "Functional Cookies", desc: "Allow the platform to remember certain user preferences." },
        ]
    },
    { title: "Managing Cookies", text: "Most web browsers allow users to control or disable cookies through browser settings.\nDisabling certain cookies may impact the functionality of the platform." },
    { title: "Third-Party Cookies", text: "Some cookies may be placed by trusted third-party services used for analytics, hosting, or infrastructure support." },
    { title: "Changes to This Policy", text: "PHASEX may update this Cookie Policy as needed to reflect platform improvements or legal requirements." },
];

const cookieAR = [
    { title: "ما هي ملفات الارتباط", text: "ملفات الارتباط (Cookies) هي ملفات نصية صغيرة يتم تخزينها على جهاز المستخدم عند زيارة الموقع." },
    {
        title: "كيفية استخدام ملفات الارتباط", text: "تستخدم PHASEX ملفات الارتباط من أجل:", items: [
            "الحفاظ على جلسات تسجيل الدخول",
            "تحسين أداء الموقع",
            "فهم كيفية استخدام المنصة",
            "تحسين تجربة المستخدم",
        ]
    },
    {
        title: "أنواع ملفات الارتباط", subsections: [
            { sub: "ملفات أساسية", desc: "ضرورية لعمل الموقع بشكل صحيح." },
            { sub: "ملفات الأداء", desc: "تساعد في تحليل استخدام الموقع." },
            { sub: "ملفات الوظائف", desc: "تسمح للموقع بتذكر تفضيلات المستخدم." },
        ]
    },
    { title: "التحكم في ملفات الارتباط", text: "يمكن للمستخدم التحكم في ملفات الارتباط أو تعطيلها من خلال إعدادات المتصفح.\nتعطيل بعض الملفات قد يؤثر على وظائف الموقع." },
    { title: "ملفات الارتباط من أطراف ثالثة", text: "قد يتم وضع بعض ملفات الارتباط من خدمات طرف ثالث موثوقة تُستخدم للتحليلات أو الاستضافة أو دعم البنية التحتية." },
    { title: "التغييرات على هذه السياسة", text: "قد تقوم PHASEX بتحديث سياسة ملفات الارتباط حسب الحاجة لتعكس تحسينات المنصة أو المتطلبات القانونية." },
];

export function CookiePolicyModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";
    const sections = isRTL ? cookieAR : cookieEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }} />

                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <Cookie className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {isRTL ? "سياسة ملفات الارتباط" : "Cookie Policy"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {sections.map((section, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                                        <Cookie className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.text && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                                    )}
                                    {section.items && (
                                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {section.items.map((item, j) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).subsections && (
                                        <div className="space-y-3 mt-2">
                                            {(section as any).subsections.map((sub: any, j: number) => (
                                                <div key={j} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                                                    <h4 className="text-[13px] font-bold text-white mb-1">{sub.sub}</h4>
                                                    <p className="text-[12px] text-gray-500 leading-relaxed">{sub.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-xs text-gray-500">
                                    © 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}
                                </p>
                            </div>
                        </div>

                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function CookieButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{
                background: `${accentG}0.06)`,
                border: `1px solid ${accentG}0.15)`,
                color: accent,
            }}
        >
            <Cookie className="w-3.5 h-3.5" />
            {isRTL ? "سياسة ملفات الارتباط" : "Cookie Policy"}
        </motion.button>
    );
}

/* ═══════════ LEGAL DISCLAIMER ═══════════ */

const disclaimerEN = [
    { text: "The information, tools, and analytical representations provided by PHASEX are intended for informational and educational purposes only." },
    { text: "PHASEX does not provide financial, investment, or trading advice." },
    {
        text: "Nothing displayed on the platform should be interpreted as:", items: [
            "Investment advice",
            "A recommendation to buy or sell financial instruments",
            "A guarantee of future market performance",
        ]
    },
    { text: "Financial markets involve significant risk, and users remain fully responsible for their trading decisions and financial outcomes." },
    { text: "PHASEX does not guarantee the accuracy, completeness, or reliability of any market data, analysis, or visual representations." },
    { text: "Past market behavior does not guarantee future results." },
    { text: "By using the PHASEX platform, users acknowledge and accept full responsibility for any actions taken based on platform information." },
];

const disclaimerAR = [
    { text: "المعلومات والأدوات والتحليلات المعروضة على منصة PHASEX مخصصة لأغراض تعليمية ومعلوماتية فقط." },
    { text: "لا تقدم PHASEX أي نصائح مالية أو استثمارية." },
    {
        text: "ولا ينبغي تفسير أي محتوى على المنصة على أنه:", items: [
            "توصية استثمارية",
            "دعوة لشراء أو بيع أي أداة مالية",
            "ضمان لتحقيق أرباح",
        ]
    },
    { text: "تنطوي الأسواق المالية على مخاطر كبيرة، ويتحمل المستخدم وحده المسؤولية الكاملة عن قراراته الاستثمارية." },
    { text: "لا تضمن PHASEX دقة أو اكتمال أو موثوقية البيانات أو التحليلات المعروضة." },
    { text: "الأداء السابق للأسواق لا يضمن النتائج المستقبلية." },
];

export function LegalDisclaimerModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#ff6e40";
    const accentG = "rgba(255,110,64,";
    const sections = isRTL ? disclaimerAR : disclaimerEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <AlertTriangle className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {isRTL ? "إخلاء المسؤولية القانونية" : "Legal Disclaimer"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {/* Warning banner */}
                            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${accentG}0.06)`, border: `1px solid ${accentG}0.15)` }}>
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                                <p className="text-[13px] font-bold" style={{ color: accent }}>
                                    {isRTL ? "⚠️ تحذير: الأسواق المالية تنطوي على مخاطر عالية. قد تخسر رأس مالك بالكامل."
                                        : "⚠️ Warning: Financial markets carry significant risk. You may lose your entire capital."}
                                </p>
                            </div>
                            {sections.map((section, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }} className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <p className="text-[13px] text-gray-400 leading-relaxed">{section.text}</p>
                                    {section.items && (
                                        <ul className={`space-y-1.5 mt-2 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {section.items.map((item, j) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}
                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-xs text-gray-500">© 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}</p>
                            </div>
                        </div>
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function LegalDisclaimerButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(255,110,64,0.06)", border: "1px solid rgba(255,110,64,0.15)", color: "#ff6e40" }}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {isRTL ? "إخلاء المسؤولية" : "Legal Disclaimer"}
        </motion.button>
    );
}

/* ═══════════ PHASEX MANIFESTO ═══════════ */

const manifestoEN = [
    {
        title: "The Market Is Not Noise", paragraphs: [
            "Financial markets are often described as chaotic systems driven by randomness and speculation.",
            "Charts flash endlessly with price movements, indicators compete for attention, and traders are left navigating a landscape of conflicting signals.",
            "But markets are not noise.", "They are systems.",
            "Systems shaped by structure, pressure, rhythm, and behavioral cycles.",
            "The problem has never been the market itself.", "The problem has been the way we try to observe it.",
        ]
    },
    {
        title: "The Failure of Indicator Stacking", paragraphs: [
            "For decades, market analysis has relied on an ever-growing collection of indicators.",
            "Oscillators, moving averages, bands, channels, signals layered upon signals.", "Each promising clarity.",
            "Yet the result has often been the opposite.",
            "More indicators create more interpretations.", "More interpretations create more confusion.",
            "Complexity has been mistaken for insight.", "PHASEX was created to challenge that assumption.",
        ]
    },
    {
        title: "A Structural View of Markets", paragraphs: [
            "Markets do not move randomly from tick to tick.", "They evolve through structural states.",
            "Moments of expansion.", "Moments of contraction.", "Periods of directional pressure.", "Cycles of oscillation and equilibrium.",
            "Instead of chasing signals, PHASEX observes these states.",
            "It reconstructs market behavior through a framework designed to reveal the underlying structure of price movement.",
        ]
    },
    {
        title: "From Indicators to States", paragraphs: [
            "PHASEX replaces fragmented signals with a unified structural language.",
            "The platform represents market behavior through distinct analytical states:",
        ], states: ["Phase State", "Displacement State", "Reference State", "Oscillation State", "Direction State", "Envelope State"],
        after: ["Each state captures a different dimension of market dynamics.", "Together, they form a coherent system for observing how markets evolve."]
    },
    {
        title: "Clarity Over Complexity", paragraphs: [
            "Financial markets generate vast streams of data, but insight rarely comes from adding more noise.",
            "True understanding comes from seeing structure.", "PHASEX was built with a simple philosophy:",
        ], highlights: ["Reduce noise.", "Reveal structure.", "Observe behavior."],
        after: ["By reconstructing price movement into interpretable states, PHASEX allows traders and analysts to observe markets with a level of clarity rarely achieved through traditional tools."]
    },
    {
        title: "Not Prediction. Observation.", paragraphs: [
            "PHASEX does not attempt to predict the future.", "It seeks to make the present visible.",
            "When structure becomes clear, behavior becomes understandable.",
            "And when behavior becomes understandable, decisions become more informed.",
        ]
    },
    {
        title: "A New Language for Market Structure", paragraphs: [
            "Markets have long been viewed through the lens of indicators.", "PHASEX proposes a different language.",
            "A language of states, structure, and behavior.",
            "A language designed not to overwhelm traders with signals, but to help them see the market as it truly is.",
        ]
    },
    {
        title: "The Vision", paragraphs: [
            "PHASEX was created with a simple yet ambitious goal:",
            "To redefine how financial markets are visualized and understood.",
            "Not through more indicators.", "But through deeper structure.",
        ]
    },
];

const manifestoAR = [
    {
        title: "السوق ليس ضجيجًا", paragraphs: [
            "غالبًا ما توصف الأسواق المالية بأنها أنظمة فوضوية تحكمها العشوائية والمضاربة.",
            "تتحرك الرسوم البيانية بلا توقف، تتزاحم المؤشرات، ويجد المتداول نفسه وسط كم هائل من الإشارات المتضاربة.",
            "لكن السوق ليس ضجيجًا.", "إنه نظام.",
            "نظام يتشكل من بنية، وضغوط، وإيقاعات، ودورات سلوكية.",
            "المشكلة لم تكن يومًا في السوق نفسه.", "المشكلة كانت في الطريقة التي نحاول بها رؤيته.",
        ]
    },
    {
        title: "فشل تكديس المؤشرات", paragraphs: [
            "لعقود طويلة اعتمد التحليل المالي على إضافة المزيد من المؤشرات.",
            "مؤشرات زخم، متوسطات متحركة، نطاقات سعرية، قنوات… إشارات فوق إشارات.", "كل واحدة تعد بالمزيد من الوضوح.",
            "لكن النتيجة غالبًا كانت عكس ذلك.",
            "المزيد من المؤشرات يعني المزيد من التفسيرات.", "والمزيد من التفسيرات يعني المزيد من الارتباك.",
            "لقد تم الخلط بين التعقيد والبصيرة.", "وهنا جاءت فكرة PHASEX.",
        ]
    },
    {
        title: "رؤية بنيوية للسوق", paragraphs: [
            "السوق لا يتحرك بشكل عشوائي من لحظة إلى أخرى.", "بل يتطور عبر حالات بنيوية.",
            "لحظات توسّع.", "لحظات انكماش.", "فترات ضغط اتجاهي.", "ودورات من التذبذب والتوازن.",
            "بدلاً من مطاردة الإشارات، تقوم PHASEX برصد هذه الحالات.",
            "وتعيد بناء سلوك السوق ضمن إطار تحليلي يكشف البنية الحقيقية للحركة السعرية.",
        ]
    },
    {
        title: "من المؤشرات إلى الحالات", paragraphs: [
            "تستبدل PHASEX الإشارات المتفرقة بلغة تحليلية موحدة قائمة على الحالات البنيوية.",
            "تمثل المنصة سلوك السوق من خلال مجموعة من الحالات:",
        ], states: ["Phase State", "Displacement State", "Reference State", "Oscillation State", "Direction State", "Envelope State"],
        after: ["كل حالة تكشف بعدًا مختلفًا من ديناميكيات السوق.", "ومجتمعةً تشكل نظامًا متكاملًا لفهم حركة الأسواق."]
    },
    {
        title: "الوضوح قبل التعقيد", paragraphs: [
            "تولد الأسواق المالية كمًا هائلًا من البيانات.",
            "لكن الفهم الحقيقي لا يأتي من إضافة المزيد من الضجيج.", "بل من رؤية البنية.",
            "لقد بُنيت PHASEX على فلسفة بسيطة:",
        ], highlights: ["تقليل الضجيج.", "إظهار البنية.", "فهم السلوك."],
        after: ["ومن خلال إعادة بناء حركة السعر في صورة حالات قابلة للفهم، تمنح PHASEX المتداولين رؤية أكثر وضوحًا لديناميكيات السوق."]
    },
    {
        title: "ليس تنبؤًا… بل رؤية", paragraphs: [
            "PHASEX لا تحاول التنبؤ بالمستقبل.", "بل تسعى إلى جعل الحاضر مرئيًا.",
            "وعندما تصبح البنية واضحة، يصبح السلوك مفهومًا.",
            "وعندما يصبح السلوك مفهومًا، تصبح القرارات أكثر وعيًا.",
        ]
    },
    {
        title: "لغة جديدة لفهم السوق", paragraphs: [
            "لطالما تم تفسير الأسواق عبر المؤشرات.", "لكن PHASEX تقترح لغة مختلفة.",
            "لغة قائمة على الحالات والبنية والسلوك.",
            "لغة لا تهدف إلى إغراق المتداول بالإشارات، بل إلى مساعدته على رؤية السوق كما هو.",
        ]
    },
    {
        title: "الرؤية", paragraphs: [
            "نشأت PHASEX من هدف بسيط لكنه طموح:",
            "إعادة تعريف الطريقة التي يتم بها تصور وفهم الأسواق المالية.",
            "ليس عبر المزيد من المؤشرات.", "بل عبر بنية أعمق.",
        ]
    },
];

export function ManifestoModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#a855f7";
    const accentG = "rgba(168,85,247,";
    const sections = isRTL ? manifestoAR : manifestoEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <BookOpen className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {isRTL ? "مانيفستو PHASEX" : "PHASEX Manifesto"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">{isRTL ? "انظر إلى السوق كنظام" : "See the market as a system"}</p>
                                </div>
                            </div>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {sections.map((section, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }} className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <h3 className="text-base font-black mb-4 flex items-center gap-2" style={{ color: accent }}>
                                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.paragraphs.map((p, j) => (
                                        <p key={j} className={`text-[13px] leading-relaxed mb-1.5 ${p.startsWith("But ") || p.startsWith("They are systems") || p.startsWith("The problem") ||
                                            p.startsWith("لكن") || p.startsWith("إنه نظام") || p.startsWith("المشكلة") ||
                                            p.startsWith("بل") || p.startsWith("Not ") || p.startsWith("PHASEX")
                                            ? "text-white font-bold" : "text-gray-400"
                                            }`}>{p}</p>
                                    ))}
                                    {(section as any).states && (
                                        <div className="flex flex-wrap gap-2 my-3">
                                            {(section as any).states.map((s: string, j: number) => (
                                                <span key={j} className="px-3 py-1.5 rounded-lg text-[12px] font-bold"
                                                    style={{ background: `${accentG}0.1)`, color: accent, border: `1px solid ${accentG}0.2)` }}>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {(section as any).highlights && (
                                        <div className="my-3 space-y-1">
                                            {(section as any).highlights.map((h: string, j: number) => (
                                                <p key={j} className="text-[14px] font-black" style={{ color: accent }}>{h}</p>
                                            ))}
                                        </div>
                                    )}
                                    {(section as any).after && (section as any).after.map((a: string, j: number) => (
                                        <p key={j} className="text-[13px] text-gray-400 leading-relaxed mt-1.5">{a}</p>
                                    ))}
                                </motion.div>
                            ))}

                            {/* Final signature */}
                            <div className="text-center py-6">
                                <motion.p className="text-2xl font-black mb-2" style={{ color: accent }}
                                    animate={{ textShadow: [`0 0 20px ${accentG}0.3)`, `0 0 40px ${accentG}0.5)`, `0 0 20px ${accentG}0.3)`] }}
                                    transition={{ duration: 3, repeat: Infinity }}>
                                    PHASEX
                                </motion.p>
                                <p className="text-sm text-gray-500 font-medium italic">
                                    {isRTL ? "انظر إلى السوق كنظام." : "See the market as a system."}
                                </p>
                            </div>
                        </div>
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function ManifestoButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)", color: "#a855f7" }}>
            <BookOpen className="w-3.5 h-3.5" />
            {isRTL ? "مانيفستو PHASEX" : "Manifesto"}
        </motion.button>
    );
}

/* ═══════════ PRIVACY POLICY ═══════════ */

const privacyEN = [
    { title: "Introduction", text: "PHASEX respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, process, and safeguard information when you use our website and services.\nBy accessing or using the PHASEX platform, you agree to the practices described in this policy." },
    {
        title: "Information We Collect", subsections: [
            { sub: "Personal Information", desc: "Information that can identify you directly, such as:", items: ["Name", "Email address", "Account credentials", "Payment information (processed by third-party payment providers)"] },
            { sub: "Technical Information", desc: "When you access PHASEX, certain technical data may be collected automatically, including:", items: ["IP address", "Device type", "Browser type", "Operating system", "Access timestamps", "Usage activity within the platform"] },
            { sub: "Analytical Data", desc: "We may collect usage analytics to improve the performance, security, and functionality of the platform." },
        ]
    },
    {
        title: "How We Use Your Information", text: "We use collected information for purposes including:", items: [
            "Creating and managing user accounts",
            "Providing access to platform features",
            "Improving system performance and user experience",
            "Detecting fraud or unauthorized activity",
            "Communicating service updates or support responses",
        ], after: "PHASEX does not sell personal data to third parties."
    },
    {
        title: "Data Sharing", text: "Your information may be shared only under limited circumstances:", items: [
            "With service providers supporting infrastructure, hosting, or payments",
            "When required by applicable law or legal obligations",
            "To protect the security or integrity of the platform",
        ]
    },
    { title: "Data Security", text: "PHASEX implements reasonable technical and organizational measures to protect user data from unauthorized access, misuse, or disclosure.\nHowever, no internet transmission or storage system can be guaranteed to be completely secure." },
    { title: "Data Retention", text: "Personal information is retained only as long as necessary to provide services, comply with legal obligations, or resolve disputes." },
    {
        title: "User Rights", text: "Depending on your jurisdiction, you may have the right to:", items: [
            "Access your personal data",
            "Request correction of inaccurate data",
            "Request deletion of personal information",
            "Withdraw consent where applicable",
        ], after: "Requests can be submitted through the platform's support contact."
    },
    { title: "Third-Party Services", text: "PHASEX may integrate third-party tools or services. These providers operate under their own privacy policies, and PHASEX is not responsible for their practices." },
    { title: "Policy Updates", text: "This Privacy Policy may be updated periodically. Continued use of the platform after updates constitutes acceptance of the revised policy." },
    { title: "Contact", text: "For privacy-related inquiries:\nSupport Email: phasexai@gmail.com" },
];

const privacyAR = [
    { title: "المقدمة", text: "تحترم PHASEX خصوصية مستخدميها وتلتزم بحماية بياناتهم الشخصية. توضح هذه السياسة كيفية جمع البيانات واستخدامها ومعالجتها وحمايتها عند استخدام الموقع أو خدمات المنصة.\nباستخدام منصة PHASEX فإنك توافق على الممارسات الموضحة في هذه السياسة." },
    {
        title: "المعلومات التي نقوم بجمعها", subsections: [
            { sub: "المعلومات الشخصية", desc: "مثل:", items: ["الاسم", "البريد الإلكتروني", "بيانات تسجيل الدخول", "معلومات الدفع (تتم معالجتها عبر مزودي دفع خارجيين)"] },
            { sub: "المعلومات التقنية", desc: "عند استخدام الموقع قد يتم جمع بعض البيانات التقنية تلقائيًا مثل:", items: ["عنوان IP", "نوع الجهاز", "نوع المتصفح", "نظام التشغيل", "وقت الوصول إلى الموقع", "نشاط الاستخدام داخل المنصة"] },
            { sub: "بيانات التحليل", desc: "قد يتم جمع بيانات إحصائية لتحسين أداء المنصة وتطوير خدماتها." },
        ]
    },
    {
        title: "كيفية استخدام المعلومات", text: "نستخدم المعلومات التي يتم جمعها لأغراض تشمل:", items: [
            "إنشاء وإدارة حسابات المستخدمين",
            "تقديم خدمات المنصة",
            "تحسين الأداء وتجربة المستخدم",
            "اكتشاف الأنشطة غير المصرح بها",
            "التواصل مع المستخدمين بشأن التحديثات أو الدعم الفني",
        ], after: "لا تقوم PHASEX ببيع البيانات الشخصية لأي طرف ثالث."
    },
    {
        title: "مشاركة البيانات", text: "قد تتم مشاركة البيانات في حالات محدودة مثل:", items: [
            "مع مزودي الخدمات التقنية أو الدفع",
            "عند وجود التزام قانوني",
            "لحماية أمن المنصة أو مستخدميها",
        ]
    },
    { title: "حماية البيانات", text: "تتخذ PHASEX إجراءات تقنية وتنظيمية معقولة لحماية البيانات من الوصول غير المصرح به أو الاستخدام غير المشروع.\nومع ذلك لا يمكن ضمان الأمان الكامل لأي نظام يعمل عبر الإنترنت." },
    { title: "الاحتفاظ بالبيانات", text: "يتم الاحتفاظ بالبيانات فقط للمدة اللازمة لتقديم الخدمات أو الامتثال للمتطلبات القانونية." },
    {
        title: "حقوق المستخدم", text: "قد يحق للمستخدمين حسب القوانين المحلية:", items: [
            "الوصول إلى بياناتهم الشخصية",
            "تصحيح البيانات غير الدقيقة",
            "طلب حذف البيانات",
            "سحب الموافقة عند الحاجة",
        ]
    },
    { title: "خدمات الأطراف الثالثة", text: "قد تستخدم PHASEX خدمات أو أدوات تابعة لطرف ثالث. وتخضع هذه الخدمات لسياسات الخصوصية الخاصة بها." },
    { title: "تحديثات السياسة", text: "قد يتم تعديل هذه السياسة من وقت لآخر. استمرار استخدام المنصة يعني الموافقة على التعديلات." },
];

export function PrivacyPolicyModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#06b6d4";
    const accentG = "rgba(6,182,212,";
    const sections = isRTL ? privacyAR : privacyEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <Eye className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {sections.map((section, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }} className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                                        <Eye className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.text && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                                    )}
                                    {(section as any).items && (
                                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {(section as any).items.map((item: string, j: number) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).after && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mt-2 font-medium">{(section as any).after}</p>
                                    )}
                                    {(section as any).subsections && (
                                        <div className="space-y-3 mt-2">
                                            {(section as any).subsections.map((sub: any, j: number) => (
                                                <div key={j} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                                                    <h4 className="text-[13px] font-bold text-white mb-1">{sub.sub}</h4>
                                                    <p className="text-[12px] text-gray-500 leading-relaxed">{sub.desc}</p>
                                                    {sub.items && (
                                                        <ul className={`space-y-1 mt-1.5 ${isRTL ? "pr-3" : "pl-3"}`}>
                                                            {sub.items.map((item: string, k: number) => (
                                                                <li key={k} className="text-[12px] text-gray-500 flex items-start gap-2">
                                                                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.4 }} />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-xs text-gray-500">© 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}</p>
                            </div>
                        </div>
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function PrivacyPolicyButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)", color: "#06b6d4" }}>
            <Eye className="w-3.5 h-3.5" />
            {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
        </motion.button>
    );
}

/* ═══════════ RISK DISCLOSURE ═══════════ */

const riskEN = [
    {
        title: "1. Trading Risk", text: "Trading financial markets involves significant risk and may result in the loss of part or all of invested capital.\nFinancial instruments such as:", items: [
            "Forex", "Indices", "Commodities", "Stocks", "Cryptocurrencies", "Futures", "CFDs",
        ], after: "carry a high degree of risk."
    },
    { title: "2. Leverage Risk", text: "Leverage can magnify both profits and losses.\nUnder certain conditions, losses may exceed the initial deposit depending on the financial instrument and broker policies." },
    {
        title: "3. Market Volatility", text: "Financial markets may experience rapid price movements caused by:", items: [
            "Economic news", "Political events", "Market liquidity changes", "Institutional flows",
        ], after: "Such movements may cause unexpected trading outcomes."
    },
    {
        title: "4. Analytical Tools Limitation", text: "PHASEX provides quantitative market representations and analytical tools, including structural market states and chart models.\nThese tools:", items: [
            "Do not guarantee profitable outcomes",
            "Do not predict market behavior with certainty",
            "Should not be relied upon as the sole basis for trading decisions.",
        ]
    },
    {
        title: "5. Technical Risks", text: "Technical issues such as:", items: [
            "Internet disruptions", "Server failures", "Platform outages", "Data delays",
        ], after: "may impact the availability or accuracy of information."
    },
    { title: "6. Data Variations", text: "Market prices may differ across brokers or exchanges.\nTherefore, chart patterns and structural representations displayed on PHASEX may vary from other trading platforms." },
    {
        title: "7. User Responsibility", text: "Users are fully responsible for:", items: [
            "Risk management", "Position sizing", "Stop-loss placement", "Financial decisions",
        ], after: "PHASEX does not manage or control user trading accounts."
    },
    { title: "8. No Guarantee of Profit", text: "Past market behavior or analytical representations do not guarantee future performance.\nNo system, model, or analytical tool can eliminate trading risk." },
    { title: "9. Acknowledgment", text: "By using PHASEX, you acknowledge that you understand and accept the risks associated with financial market trading." },
];

const riskAR = [
    { title: "1. طبيعة المخاطر", text: "التداول في الأسواق المالية (العملات، المؤشرات، السلع، الأسهم، العملات الرقمية، المشتقات، العقود مقابل الفروقات، والعقود الآجلة) ينطوي على مخاطر مرتفعة وقد يؤدي إلى خسارة جزئية أو كاملة لرأس المال." },
    { title: "2. الرافعة المالية", text: "استخدام الرافعة المالية قد يضاعف الأرباح كما قد يضاعف الخسائر بسرعة. قد تخسر أكثر من الإيداع الأولي حسب نوع المنتج والوسيط وشروطه." },
    {
        title: "3. تقلبات السوق والانزلاق السعري", text: "الأسعار قد تتحرك بسرعة عالية، وقد يحدث:", items: [
            "فجوات سعرية", "انزلاق سعري", "اتساع سبريد", "تأخيرات تنفيذ",
        ], after: "ما قد يؤدي إلى نتائج مختلفة عن المتوقع."
    },
    {
        title: "4. الاعتماد على التحليل والمخرجات", text: "PHASEX يقدم تمثيلات وتحليلات كمية (Market States) تساعد على الفهم، لكنها:", items: [
            "لا تضمن نتائج", "لا تمنع الخسارة",
            "وقد تخطئ، أو تتأثر بظروف استثنائية (أخبار، أزمات، تدخلات، سيولة ضعيفة).",
        ]
    },
    { title: "5. المخاطر التقنية", text: "قد تتعرض المنصة أو مزودو البيانات/الإنترنت/الجهاز المستخدم لانقطاعات أو تأخير أو أعطال. قد يؤثر ذلك على تحديث البيانات أو عرضها." },
    { title: "6. اختلاف بيانات الوسطاء", text: "قد تختلف الأسعار والشموع والبيانات بين مزود وآخر (Broker/Data Feed)، لذلك قد تختلف النتائج أو الإشارات البصرية من منصة لأخرى." },
    {
        title: "7. مسؤولية المستخدم", text: "أنت المسؤول الوحيد عن:", items: [
            "قرارات التداول", "إدارة المخاطر", "تحديد حجم الصفقة", "استخدام وقف الخسارة",
            "مراجعة ملاءمة المنتج لخبرتك ووضعك المالي",
        ]
    },
    {
        title: "8. لا ضمانات", text: "لا تقدم PHASEX أي ضمانات بخصوص:", items: [
            "الدقة الكاملة", "استمرارية التوفر", "تحقيق أرباح", "عدم الخسارة",
        ]
    },
    { title: "9. توصية عامة", text: "لا تتداول بأموال لا تستطيع تحمل خسارتها. إن لم تكن متأكدًا من مخاطر المنتجات المالية، استشر مختصًا مرخصًا.\nباستخدامك PHASEX، فإنك تقر بأنك قرأت هذا الإفصاح وفهمته وتقبلت المخاطر كاملة." },
];

export function RiskDisclosureModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#ef4444";
    const accentG = "rgba(239,68,68,";
    const sections = isRTL ? riskAR : riskEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <ShieldAlert className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {isRTL ? "إفصاح المخاطر" : "Risk Disclosure"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {/* Risk warning banner */}
                            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${accentG}0.08)`, border: `1px solid ${accentG}0.2)` }}>
                                <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                                <div>
                                    <p className="text-[13px] font-black mb-1" style={{ color: accent }}>
                                        {isRTL ? "⚠️ تحذير مخاطر عالية" : "⚠️ HIGH RISK WARNING"}
                                    </p>
                                    <p className="text-[12px] text-gray-400">
                                        {isRTL ? "التداول في الأسواق المالية ينطوي على مخاطر كبيرة. قد تخسر رأس مالك بالكامل."
                                            : "Trading financial markets involves significant risk. You may lose your entire invested capital."}
                                    </p>
                                </div>
                            </div>
                            {sections.map((section, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }} className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                                        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.text && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                                    )}
                                    {section.items && (
                                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {section.items.map((item, j) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).after && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mt-2">{(section as any).after}</p>
                                    )}
                                </motion.div>
                            ))}
                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-[11px] text-gray-600">PHASEX — Structural Market Intelligence Platform</p>
                                <p className="text-xs text-gray-500 mt-1">© 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}</p>
                            </div>
                        </div>
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function RiskDisclosureButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }}>
            <ShieldAlert className="w-3.5 h-3.5" />
            {isRTL ? "إفصاح المخاطر" : "Risk Disclosure"}
        </motion.button>
    );
}
