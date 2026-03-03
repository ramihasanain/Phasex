import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Card, CardContent } from "./ui/card";
import { ExternalLink, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export function AdSpace() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";
  const isRTL = language === "ar";

  const ads = [
    {
      title: isRTL ? "افتح حساب تداول حقيقي" : "Open Real Trading Account",
      description: isRTL 
        ? "ابدأ التداول الحقيقي مع أفضل الوسطاء" 
        : "Start real trading with top brokers",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
      link: "#",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      title: isRTL ? "دورة تداول احترافية" : "Professional Trading Course",
      description: isRTL 
        ? "تعلم التداول من الصفر حتى الاحتراف" 
        : "Learn trading from zero to pro",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
      link: "#",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      title: isRTL ? "استراتيجيات تداول مجانية" : "Free Trading Strategies",
      description: isRTL 
        ? "احصل على استراتيجيات مجربة ومضمونة" 
        : "Get tested and proven strategies",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80",
      link: "#",
      gradient: "from-orange-600 to-red-600"
    }
  ];

  return (
    <div className="space-y-4">
      {ads.map((ad, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className={`overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white"} shadow-lg hover:shadow-xl transition-all`}>
            <CardContent className="p-0">
              <div className="relative h-32 overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className={`absolute inset-0 bg-gradient-to-br ${ad.gradient} opacity-70`} />
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-2 right-2"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
              </div>
              <div className="p-4">
                <h3 className={`font-bold text-sm mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {ad.title}
                </h3>
                <p className={`text-xs mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {ad.description}
                </p>
                <Button 
                  size="sm" 
                  className={`w-full text-xs bg-gradient-to-r ${ad.gradient} hover:opacity-90`}
                  onClick={() => window.open(ad.link, '_blank')}
                >
                  {isRTL ? "اكتشف المزيد" : "Learn More"}
                  <ExternalLink className={`w-3 h-3 ${isRTL ? "mr-1" : "ml-1"}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
