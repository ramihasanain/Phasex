import screenshot1 from "../../../assets/screenshot1.png";
import screenshot2 from "../../../assets/screenshot2.png";
import screenshot3 from "../../../assets/screenshot3.png";
import screenshot4 from "../../../assets/screenshot4.png";
import screenshot5 from "../../../assets/screenshot5.png";
import screenshot6 from "../../../assets/screenshot6.png";
import screenshot7 from "../../../assets/screenshot7.png";

export interface ScreenshotSlide {
  url: string;
  title: string;
  description: string;
}

export function buildScreenshots(isRTL: boolean): ScreenshotSlide[] {
  return [
    {
      url: screenshot1,
      title: isRTL ? "لوحة التحكم الرئيسية" : "Main Dashboard",
      description: isRTL ? "واجهة احترافية لعرض جميع الأسواق والمؤشرات" : "Professional interface displaying all markets and indicators",
    },
    {
      url: screenshot2,
      title: isRTL ? "المؤشرات الفنية" : "Technical Indicators",
      description: isRTL ? "5 مؤشرات فنية حصرية ومتطورة" : "5 exclusive and advanced technical indicators",
    },
    {
      url: screenshot3,
      title: isRTL ? "تحليل متعدد الأطر الزمنية" : "Multi-Timeframe Analysis",
      description: isRTL ? "رؤية شاملة للسوق عبر فريمات مختلفة" : "Comprehensive market view across different timeframes",
    },
    {
      url: screenshot4,
      title: isRTL ? "أسواق متعددة" : "Multiple Markets",
      description: isRTL ? "FOREX, CRYPTO, INDEX, COMMODITY" : "FOREX, CRYPTO, INDEX, COMMODITY",
    },
    {
      url: screenshot5,
      title: isRTL ? "تحليل الذكاء الاصطناعي" : "AI Analysis",
      description: isRTL ? "تحليل ذكي للسوق باستخدام الذكاء الاصطناعي" : "Smart market analysis powered by AI",
    },
    {
      url: screenshot6,
      title: isRTL ? "أدوات التداول" : "Trading Tools",
      description: isRTL ? "أدوات تداول متقدمة لتحليل دقيق" : "Advanced trading tools for precise analysis",
    },
    {
      url: screenshot7,
      title: isRTL ? "إدارة المحفظة" : "Portfolio Management",
      description: isRTL ? "إدارة وتتبع محفظتك بسهولة" : "Easily manage and track your portfolio",
    },
  ];
}
