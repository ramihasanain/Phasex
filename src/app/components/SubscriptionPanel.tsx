import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Crown, Calendar, Clock, Send, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "motion/react";

interface SubscriptionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  features: string[];
  popular?: boolean;
  color: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "الباقة الشهرية",
    duration: "شهر واحد",
    price: "50$",
    features: [
      "الوصول لجميع الأسواق",
      "جميع المؤشرات الفنية",
      "الرسوم البيانية المباشرة",
      "دعم فني 24/7",
    ],
    color: "blue",
  },
  {
    id: "quarterly",
    name: "الباقة الربع سنوية",
    duration: "3 أشهر",
    price: "120$",
    features: [
      "الوصول لجميع الأسواق",
      "جميع المؤشرات الفنية",
      "الرسوم البيانية المباشرة",
      "دعم فني 24/7",
      "تنبيهات الأسعار",
      "توصيات يومية",
    ],
    popular: true,
    color: "purple",
  },
  {
    id: "yearly",
    name: "الباقة السنوية",
    duration: "12 شهر",
    price: "400$",
    features: [
      "الوصول لجميع الأسواق",
      "جميع المؤشرات الفنية",
      "الرسوم البيانية المباشرة",
      "دعم فني VIP 24/7",
      "تنبيهات الأسعار",
      "توصيات يومية",
      "تحليلات متقدمة",
      "جلسات استشارية",
    ],
    color: "amber",
  },
];

// بيانات الاشتراك الحالي (يمكن استبدالها ببيانات من API)
const currentSubscription = {
  isActive: true,
  plan: "quarterly",
  startDate: "2024-10-01",
  endDate: "2025-01-01",
  daysRemaining: 3,
};

export function SubscriptionPanel({ isOpen, onClose }: SubscriptionPanelProps) {
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const isDark = theme === "dark";

  // حساب نسبة الوقت المتبقي
  const getTotalDays = () => {
    const start = new Date(currentSubscription.startDate);
    const end = new Date(currentSubscription.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getProgressPercentage = () => {
    const total = getTotalDays();
    return ((total - currentSubscription.daysRemaining) / total) * 100;
  };

  const handleTelegramContact = (plan: SubscriptionPlan) => {
    // استبدل بمعرف التليجرام الخاص بك
    const telegramUsername = "YourTelegramUsername";
    const message = encodeURIComponent(
      `مرحباً، أريد الاشتراك في ${plan.name} بسعر ${plan.price}`
    );
    window.open(`https://t.me/${telegramUsername}?text=${message}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          <Card className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white"} shadow-2xl`}>
            <CardHeader className="border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className={`flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  إدارة الاشتراك
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className={isDark ? "text-gray-400 hover:text-white" : ""}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* حالة الاشتراك الحالي */}
              <div
                className={`p-6 rounded-xl border-2 ${
                  currentSubscription.isActive
                    ? isDark
                      ? "bg-green-950/30 border-green-800"
                      : "bg-green-50 border-green-200"
                    : isDark
                    ? "bg-red-950/30 border-red-800"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={currentSubscription.isActive ? "default" : "destructive"}
                        className="text-xs font-semibold"
                      >
                        {currentSubscription.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 ml-1" />
                            نشط
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 ml-1" />
                            منتهي
                          </>
                        )}
                      </Badge>
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {subscriptionPlans.find((p) => p.id === currentSubscription.plan)?.name}
                      </span>
                    </div>
                    <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      اشتراكك الحالي
                    </h3>
                  </div>
                  <Crown className="w-12 h-12 text-amber-500" />
                </div>

                {/* شريط التقدم */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                      متبقي {currentSubscription.daysRemaining} يوم
                    </span>
                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                      {getProgressPercentage().toFixed(0)}% مستخدم
                    </span>
                  </div>
                  <div
                    className={`h-3 rounded-full overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage()}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        currentSubscription.daysRemaining <= 7
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                {/* تفاصيل التواريخ */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-gray-800/50" : "bg-white/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        تاريخ البدء
                      </span>
                    </div>
                    <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {new Date(currentSubscription.startDate).toLocaleDateString("ar-SA")}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-gray-800/50" : "bg-white/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        تاريخ الانتهاء
                      </span>
                    </div>
                    <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {new Date(currentSubscription.endDate).toLocaleDateString("ar-SA")}
                    </div>
                  </div>
                </div>
              </div>

              {/* باقات الاشتراك */}
              <div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  باقات الاشتراك المتاحة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedPlan === plan.id
                          ? isDark
                            ? "border-purple-600 bg-purple-950/30"
                            : "border-purple-600 bg-purple-50"
                          : isDark
                          ? "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      } ${plan.popular ? "shadow-lg" : "shadow-sm"}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {/* شارة الأكثر شعبية */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 shadow-lg">
                            <Zap className="w-3 h-3 ml-1" />
                            الأكثر شعبية
                          </Badge>
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <h4 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                          {plan.name}
                        </h4>
                        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {plan.duration}
                        </div>
                      </div>

                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {plan.price}
                        </div>
                      </div>

                      {/* المميزات */}
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className={`flex items-start gap-2 text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* زر التواصل عبر تليجرام */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTelegramContact(plan);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                      >
                        <Send className="w-4 h-4 ml-2" />
                        اشترك عبر تليجرام
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* معلومات إضافية */}
              <div
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-blue-950/30 border-blue-800"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                      طريقة الاشتراك
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      بعد النقر على "اشترك عبر تليجرام"، سيتم فتح محادثة معنا حيث يمكنك إتمام عملية
                      الدفع والحصول على تفعيل فوري لاشتراكك.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
