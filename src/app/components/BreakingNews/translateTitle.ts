const arabicEventTitles: Record<string, string> = {
  "Monetary Policy Statement": "بيان السياسة النقدية",
  "Official Bank Rate": "معدل الفائدة الرسمي",
  "Cash Rate": "سعر الفائدة",
  "Interest Rate Decision": "قرار الفائدة",
  "FOMC Statement": "بيان اللجنة الفيدرالية (FOMC)",
  "FOMC Press Conference": "المؤتمر الصحفي للاحتياطي الفيدرالي",
  "Fed Chair Powell Speaks": "حديث رئيس الفيدرالي باول",
  "ECB Press Conference": "المؤتمر الصحفي للبنك المركزي الأوروبي",
  "Main Refinancing Rate": "نسبة إعادة التمويل الرئيسية",
  "Non-Farm Employment Change": "تقرير التوظيف بغير القطاع الزراعي (NFP)",
  "Unemployment Rate": "معدل البطالة",
  "Employment Change": "التغير في التوظيف",
  "Unemployment Claims": "شكاوى البطالة",
  "JOLTS Job Openings": "فرص العمل (JOLTS)",
  "ADP Non-Farm Employment Change": "وظائف القطاع الخاص (ADP)",
  "CPI m/m": "مؤشر أسعار المستهلكين (شهري)",
  "CPI y/y": "مؤشر أسعار المستهلكين (سنوي)",
  "Core CPI m/m": "مؤشر أسعار المستهلكين الأساسي (شهري)",
  "Core PCE Price Index m/m": "مؤشر نفقات الاستهلاك الشخصي الأساسي (شهري)",
  "PPI m/m": "مؤشر أسعار المنتجين (شهري)",
  "Core PPI m/m": "مؤشر أسعار المنتجين الأساسي (شهري)",
  "Advance GDP q/q": "الناتج المحلي الإجمالي المسبق (ربع سنوي)",
  "Prelim GDP q/q": "الناتج المحلي الإجمالي التمهيدي (ربع سنوي)",
  "Final GDP q/q": "الناتج المحلي الإجمالي النهائي (ربع سنوي)",
  "ISM Manufacturing PMI": "مؤشر مديري المشتريات الصناعي (ISM)",
  "ISM Services PMI": "مؤشر مديري المشتريات الخدمي (ISM)",
  "Flash Manufacturing PMI": "مؤشر مديري المشتريات الصناعي (الأولي)",
  "Flash Services PMI": "مؤشر مديري المشتريات الخدمي (الأولي)",
  "Retail Sales m/m": "مبيعات التجزئة (شهري)",
  "Core Retail Sales m/m": "مبيعات التجزئة الأساسية (شهري)",
  "CB Consumer Confidence": "ثقة المستهلك (CB)",
  "Prelim UoM Consumer Sentiment": "ثقة المستهلك (جامعة ميشيغان)",
  "Building Permits": "تصاريح البناء",
  "Existing Home Sales": "مبيعات المنازل القائمة",
  "New Home Sales": "مبيعات المنازل الجديدة",
  "Crude Oil Inventories": "مخزونات النفط الخام",
  "Trade Balance": "الميزان التجاري",
};

export function translateTitle(title: string, isRTL: boolean) {
  if (!isRTL) return title;
  if (arabicEventTitles[title]) return arabicEventTitles[title];
  if (title.includes("Speaks")) return title.replace("Speaks", "يتحدث");
  return title;
}
