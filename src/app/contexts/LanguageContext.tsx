import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Header
    welcome: "مرحباً بك في",
    platformName: "منصة التداول المتقدمة",
    logout: "تسجيل الخروج",
    subscription: "الاشتراك",
    daysRemaining: "يوم متبقي",
    remaining: "متبقي",
    expired: "منتهي",
    
    // Markets
    markets: "الأسواق",
    forex: "العملات",
    commodity: "السلع",
    index: "المؤشرات",
    crypto: "العملات الرقمية",
    searchAsset: "ابحث عن أصل...",
    noResults: "لا توجد نتائج",
    positive: "إيجابي",
    rising: "صاعد",
    falling: "هابط",
    total: "إجمالي",
    live: "مباشر",
    hot: "ساخن",
    trending: "رائج",
    stable: "مستقر",
    
    // Indicators
    technicalIndicators: "المؤشرات الفنية",
    rsi: "مؤشر القوة النسبية (RSI)",
    macd: "الماكد (MACD)",
    ma: "المتوسط المتحرك (MA)",
    bb: "بولينجر باند (BB)",
    stoch: "مؤشر ستوكاستيك",
    ema: "المتوسط المتحرك الأسي (EMA)",
    
    // Chart
    selectAssetAndIndicator: "اختر أصل مالي ومؤشر لعرض الرسم البياني",
    currentPrice: "السعر الحالي",
    highPrice: "أعلى سعر",
    lowPrice: "أدنى سعر",
    
    // Login
    loginTitle: "منصة التداول",
    loginDescription: "سجل دخولك للوصول إلى منصة التداول المتقدمة",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    enterUsername: "أدخل اسم المستخدم",
    enterPassword: "أدخل كلمة المرور",
    login: "تسجيل الدخول",
    
    // Subscription
    subscriptionTitle: "إدارة الاشتراك",
    currentPlan: "الخطة الحالية",
    planPremium: "بريميوم",
    planStandard: "عادي",
    planActive: "نشط",
    planExpired: "منتهي",
    renewSubscription: "تجديد الاشتراك",
    viewPaymentOptions: "خيارات الدفع",
    telegramPayment: "الدفع عبر تليجرام",
    telegramPaymentDesc: "تواصل معنا عبر تليجرام لتجديد اشتراكك",
    contactOnTelegram: "تواصل عبر تليجرام",
    close: "إغلاق",
    
    // Features
    feature1: "الوصول لجميع الأسواق",
    feature2: "جميع المؤشرات الفنية",
    feature3: "الرسوم البيانية المباشرة",
    feature4: "دعم فني 24/7",
    feature5: "تنبيهات الأسعار",
    feature6: "توصيات يومية",
    feature7: "تحليلات متقدمة",
    feature8: "جلسات استشارية",
    feature9: "دعم فني VIP 24/7",
  },
  en: {
    // Header
    welcome: "Welcome to",
    platformName: "Advanced Trading Platform",
    logout: "Logout",
    subscription: "Subscription",
    daysRemaining: "days left",
    remaining: "Remaining",
    expired: "Expired",
    
    // Markets
    markets: "Markets",
    forex: "Forex",
    commodity: "Commodities",
    index: "Indices",
    crypto: "Crypto",
    searchAsset: "Search asset...",
    noResults: "No results found",
    positive: "Positive",
    rising: "Rising",
    falling: "Falling",
    total: "Total",
    live: "Live",
    hot: "Hot",
    trending: "Trending",
    stable: "Stable",
    
    // Indicators
    technicalIndicators: "Technical Indicators",
    rsi: "Relative Strength Index (RSI)",
    macd: "MACD",
    ma: "Moving Average (MA)",
    bb: "Bollinger Bands (BB)",
    stoch: "Stochastic Oscillator",
    ema: "Exponential Moving Average (EMA)",
    
    // Chart
    selectAssetAndIndicator: "Select an asset and indicator to view the chart",
    currentPrice: "Current Price",
    highPrice: "High Price",
    lowPrice: "Low Price",
    
    // Login
    loginTitle: "Trading Platform",
    loginDescription: "Login to access the advanced trading platform",
    username: "Username",
    password: "Password",
    enterUsername: "Enter username",
    enterPassword: "Enter password",
    login: "Login",
    
    // Subscription
    subscriptionTitle: "Subscription Management",
    currentPlan: "Current Plan",
    planPremium: "Premium",
    planStandard: "Standard",
    planActive: "Active",
    planExpired: "Expired",
    renewSubscription: "Renew Subscription",
    viewPaymentOptions: "Payment Options",
    telegramPayment: "Telegram Payment",
    telegramPaymentDesc: "Contact us via Telegram to renew your subscription",
    contactOnTelegram: "Contact on Telegram",
    close: "Close",
    
    // Features
    feature1: "Access to all markets",
    feature2: "All technical indicators",
    feature3: "Live charts",
    feature4: "24/7 Support",
    feature5: "Price alerts",
    feature6: "Daily recommendations",
    feature7: "Advanced analytics",
    feature8: "Consulting sessions",
    feature9: "VIP 24/7 Support",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.setAttribute("lang", savedLanguage);
      document.documentElement.setAttribute("dir", savedLanguage === "ar" ? "rtl" : "ltr");
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === "ar" ? "en" : "ar";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.setAttribute("lang", newLanguage);
    document.documentElement.setAttribute("dir", newLanguage === "ar" ? "rtl" : "ltr");
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}