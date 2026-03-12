export type Language = "en" | "ar" | "ru" | "tr";

const insightsData = {
    "Decision": {
      "STRONG_BUY": {
        "ar": "تشير القراءة الفنية الحالية إلى بيئة سوقية صاعدة قوية جداً، بوضوح لصالح الاتجاه الإيجابي.",
        "en": "The current quantitative reading indicates a strong bullish market environment clearly favoring the upside direction."
      },
      "BUY": {
        "ar": "تشير المؤشرات الكمية الحالية إلى ترجيح الاتجاه الصاعد في حركة السوق.",
        "en": "The current quantitative reading suggests a prevailing bullish bias in the market."
      },
      "WEAK_BUY": {
        "ar": "تعكس المؤشرات الكمية ميلاً صعودياً محدوداً في حركة السوق.",
        "en": "Quantitative indicators reflect a limited bullish inclination in current market conditions."
      },
      "NO_TRADE": {
        "ar": "تشير القراءة الفنية الحالية للبيانات الكمية إلى حالة حيادية نسبياً في السوق دون أفضلية واضحة لأي اتجاه.",
        "en": "The current quantitative assessment suggests a relatively neutral market environment without a clear directional advantage."
      },
      "WEAK_SELL": {
        "ar": "تعكس المؤشرات الكمية ميلاً هبوطياً محدوداً في حركة السوق.",
        "en": "Quantitative indicators reflect a limited bearish inclination in current market conditions."
      },
      "SELL": {
        "ar": "تشير القراءة الفنية الحالية للبيانات الكمية إلى ترجيح الاتجاه الهابط في السوق.",
        "en": "The current quantitative data suggests a prevailing bearish bias in the market."
      },
      "STRONG_SELL": {
        "ar": "تشير القراءة الفنية الحالية للبيانات الكمية إلى ضغط بيعي قوي جداً، وبسيادة واضحة للاتجاه الهابط.",
        "en": "The quantitative reading indicates strong selling pressure and a clearly dominant bearish market structure."
      }
    },
    "Primary_Trend": {
      "STRONG_UPTREND": {
        "ar": "بالإضافة إلى أن الاتجاه العام للسوق في اتجاه صاعد قوي يعكس سيطرة واضحة للقوى الشرائية.",
        "en": "Additionally, the overall market trend indicates a strong upward direction, reflecting clear dominance of buying pressure."
      },
      "BULLISH": {
        "ar": "بالإضافة إلى أن الاتجاه العام يميل صعوداً معتدلاً في حركة السوق.",
        "en": "Additionally, the overall trend reflects a moderate upward bias in market movement."
      },
      "NEUTRAL": {
        "ar": "بالإضافة إلى أن الاتجاه العام يميل إلى حالة حيادية دون تفوق واضح لأي من القوى الشرائية أو البيعية.",
        "en": "Additionally, the overall market trend indicates a neutral condition, with no clear dominance from either buyers or sellers."
      },
      "BEARISH": {
        "ar": "بالإضافة إلى أن الاتجاه العام يميل هبوطاً معتدلاً في حركة السوق.",
        "en": "Additionally, the overall trend reflects a moderate downward bias in market movement."
      },
      "STRONG_DOWNTREND": {
        "ar": "بالإضافة إلى أن الاتجاه العام للسوق في اتجاه هابط قوي وبسيادة واضحة للاتجاه الهابط.",
        "en": "Additionally, the overall market trend indicates strong selling pressure and clear dominance of the bearish direction."
      }
    },
    "Structural_Bias": {
      "UPWARD": {
        "ar": "ومع ذلك، تشير البنية الهيكلية للسوق إلى انحياز صاعد.",
        "en": "Moreover, the market structure shows an upward structural bias."
      },
      "DOWNWARD": {
        "ar": "ومع ذلك، تشير البنية الهيكلية للسوق إلى انحياز هابط.",
        "en": "Moreover, the market structure shows a downward structural bias."
      },
      "NEUTRAL": {
        "ar": "ومع ذلك، تعكس البنية الهيكلية حالة توازن نسبي بين قوى العرض والطلب.",
        "en": "Moreover, the market structure reflects a balanced condition."
      }
    },
    "Momentum_State": {
      "STRONG": { "ar": "كما يوضح الزخم قوة واضحة في الحركة السعرية.", "en": "Furthermore, momentum shows strong price movement strength." },
      "MODERATE": { "ar": "كما يشير الزخم إلى حركة متوسطة القوة في السوق.", "en": "Furthermore, momentum reflects moderate strength in price movement." },
      "WEAK": { "ar": "كما يعكس الزخم ضعفاً نسبياً في الحركة السعرية.", "en": "Furthermore, momentum indicates relatively weak price movement." }
    },
    "Volatility": {
      "ELEVATED": { "ar": "ويظهر السوق مستوى مرتفعاً من التذبذب.", "en": "However, market volatility is currently elevated." },
      "MODERATE": { "ar": "ويتحرك السوق ضمن مستوى تذبذب معتدل.", "en": "However, market volatility remains moderate." },
      "LOW": { "ar": "وتتحرك السوق في مستويات منخفضة من التذبذب.", "en": "However, market volatility is currently low." }
    },
    "Reversal_Risk": {
      "LOW": {
        "ar": "ومع ذلك، تشير مخاطر الانعكاس إلى احتمال منخفض لحدوث تغير مفاجئ في الاتجاه، ما يعكس درجة أعلى من استقرار الحركة الحالية.",
        "en": "Nevertheless, reversal risk currently appears low, suggesting a relatively stable directional environment."
      },
      "MODERATE": {
        "ar": "ومع ذلك، تعكس مخاطر الانعكاس احتمالاً متوسطاً لحدوث تقلبات أو تصحيحات في الحركة السعرية.",
        "en": "Nevertheless, reversal risk is assessed as moderate, indicating the potential for short-term volatility or corrective movements."
      },
      "HIGH": {
        "ar": "ومع ذلك، تشير مخاطر الانعكاس إلى احتمال أكبر لحدوث انعكاسات أو تقلبات مفاجئة في السوق.",
        "en": "Nevertheless, elevated reversal risk indicates a higher probability of sudden market reversals or sharp price fluctuations."
      }
    }
};

export interface MarketInsightParams {
    decision: string;
    primaryTrend: string;
    structuralBias: string;
    momentumState: string;
    volatility: string;
    reversalRisk: string;
}

const normalizeKey = (key: string) => {
    return key.replace(/\s+/g, '_').toUpperCase();
};

export const getAIMarketInsightText = (params: MarketInsightParams, language: Language = "en"): string => {
    // Fallback to English if the language isn't explicitly supported in our text map yet
    const langKey = language === "ar" ? "ar" : "en";

    const decisionKey = normalizeKey(params.decision);
    const primaryTrendKey = normalizeKey(params.primaryTrend);
    const structuralBiasKey = normalizeKey(params.structuralBias);
    const momentumStateKey = normalizeKey(params.momentumState);
    const volatilityKey = normalizeKey(params.volatility);
    const reversalRiskKey = normalizeKey(params.reversalRisk);

    const textParts = [];

    // Decision
    const decisionText = (insightsData.Decision as any)[decisionKey]?.[langKey];
    if (decisionText) textParts.push(decisionText);

    // Primary Trend
    const primaryTrendText = (insightsData.Primary_Trend as any)[primaryTrendKey]?.[langKey];
    if (primaryTrendText) textParts.push(primaryTrendText);

    // Structural Bias
    const structuralBiasText = (insightsData.Structural_Bias as any)[structuralBiasKey]?.[langKey];
    if (structuralBiasText) textParts.push(structuralBiasText);

    // Momentum State
    const momentumStateText = (insightsData.Momentum_State as any)[momentumStateKey]?.[langKey];
    if (momentumStateText) textParts.push(momentumStateText);

    // Volatility
    const volatilityText = (insightsData.Volatility as any)[volatilityKey]?.[langKey];
    if (volatilityText) textParts.push(volatilityText);

    // Reversal Risk
    const reversalRiskText = (insightsData.Reversal_Risk as any)[reversalRiskKey]?.[langKey];
    if (reversalRiskText) textParts.push(reversalRiskText);

    return textParts.join(" ");
};
