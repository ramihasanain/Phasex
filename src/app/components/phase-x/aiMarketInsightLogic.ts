export type Language = "en" | "ar" | "ru" | "tr" | "fr" | "es";

const insightsData = {
    "Decision": {
      "STRONG_BUY": {
        "ar": "تشير القراءة الفنية الحالية إلى بيئة سوقية صاعدة قوية جداً، بوضوح لصالح الاتجاه الإيجابي.",
        "en": "The current quantitative reading indicates a strong bullish market environment clearly favoring the upside direction.",
        "ru": "Текущие количественные данные указывают на сильную бычью рыночную среду, явно благоприятствующую восходящему тренду.",
        "tr": "Mevcut nicel okuma, açıkça yükseliş yönünü destekleyen güçlü bir boğa piyasası ortamına işaret ediyor.",
        "fr": "La lecture quantitative actuelle indique un environnement de marché haussier fort favorisant clairement la direction à la hausse.",
        "es": "La lectura cuantitativa actual indica un fuerte entorno de mercado alcista que favorece claramente la dirección alcista."
      },
      "BUY": {
        "ar": "تشير المؤشرات الكمية الحالية إلى ترجيح الاتجاه الصاعد في حركة السوق.",
        "en": "The current quantitative reading suggests a prevailing bullish bias in the market.",
        "ru": "Текущие количественные данные свидетельствуют о преобладающем бычьем смещении на рынке.",
        "tr": "Mevcut nicel veriler, piyasada geçerli bir yükseliş eğilimi olduğunu gösteriyor.",
        "fr": "La lecture quantitative actuelle suggère un biais haussier prédominant sur le marché.",
        "es": "La lectura cuantitativa actual sugiere un sesgo alcista predominante en el mercado."
      },
      "WEAK_BUY": {
        "ar": "تعكس المؤشرات الكمية ميلاً صعودياً محدوداً في حركة السوق.",
        "en": "Quantitative indicators reflect a limited bullish inclination in current market conditions.",
        "ru": "Количественные индикаторы отражают ограниченную склонность к росту в текущих рыночных условиях.",
        "tr": "Nicel göstergeler mevcut piyasa koşullarında sınırlı bir yükseliş eğilimini yansıtıyor.",
        "fr": "Les indicateurs quantitatifs reflètent une inclination haussière limitée dans les conditions actuelles du marché.",
        "es": "Los indicadores cuantitativos reflejan una inclinación alcista limitada en las condiciones actuales del mercado."
      },
      "NO_TRADE": {
        "ar": "تشير القراءة الفنية الحالية للبيانات الكمية إلى حالة حيادية نسبياً في السوق دون أفضلية واضحة لأي اتجاه.",
        "en": "The current quantitative assessment suggests a relatively neutral market environment without a clear directional advantage.",
        "ru": "Текущая количественная оценка указывает на относительно нейтральную рыночную среду без явного преимущества направления.",
        "tr": "Mevcut nicel değerlendirme net bir yön avantajı olmadan nispeten nötr bir piyasa ortamına işaret ediyor.",
        "fr": "L'évaluation quantitative actuelle suggère un environnement de marché relativement neutre sans avantage directionnel clair.",
        "es": "La evaluación cuantitativa actual sugiere un entorno de mercado relativamente neutral sin una ventaja direccional clara."
      },
      "WEAK_SELL": {
        "ar": "تعكس المؤشرات الكمية ميلاً هبوطياً محدوداً في حركة السوق.",
        "en": "Quantitative indicators reflect a limited bearish inclination in current market conditions.",
        "ru": "Количественные индикаторы отражают ограниченную склонность к падению в текущих рыночных условиях.",
        "tr": "Nicel göstergeler mevcut piyasa koşullarında sınırlı bir düşüş eğilimini yansıtıyor.",
        "fr": "Les indicateurs quantitatifs reflètent une inclination baissière limitée dans les conditions actuelles du marché.",
        "es": "Los indicadores cuantitativos reflejan una inclinación bajista limitada en las condiciones actuales del mercado."
      },
      "SELL": {
        "ar": "تشير القراءة الفنية الحالية للبيانات الكمية إلى ترجيح الاتجاه الهابط في السوق.",
        "en": "The current quantitative data suggests a prevailing bearish bias in the market.",
        "ru": "Текущие количественные данные свидетельствуют о преобладающем медвежьем смещении на рынке.",
        "tr": "Mevcut nicel veriler piyasada geçerli bir düşüş eğilimi olduğunu gösteriyor.",
        "fr": "Les données quantitatives actuelles suggèrent un biais baissier prédominant sur le marché.",
        "es": "Los datos cuantitativos actuales sugieren un sesgo bajista predominante en el mercado."
      },
      "STRONG_SELL": {
        "ar": "تشير القراءة الفنية الحالية للبيانات الكمية إلى ضغط بيعي قوي جداً، وبسيادة واضحة للاتجاه الهابط.",
        "en": "The quantitative reading indicates strong selling pressure and a clearly dominant bearish market structure.",
        "ru": "Количественные показания указывают на сильное давление продаж и явно доминирующую медвежью структуру рынка.",
        "tr": "Nicel okuma güçlü bir satış baskısına ve piyasa yapısında açıkça baskın olan bir düşüş yönüne işaret ediyor.",
        "fr": "La lecture quantitative indique une forte pression à la vente et une structure de marché baissière clairement dominante.",
        "es": "La lectura cuantitativa indica una fuerte presión de venta y una estructura de mercado bajista claramente dominante."
      }
    },
    "Primary_Trend": {
      "STRONG_UPTREND": {
        "ar": "بالإضافة إلى أن الاتجاه العام للسوق في اتجاه صاعد قوي يعكس سيطرة واضحة للقوى الشرائية.",
        "en": "Additionally, the overall market trend indicates a strong upward direction, reflecting clear dominance of buying pressure.",
        "ru": "Кроме того, общая рыночная тенденция указывает на сильное восходящее направление, что отражает явное преобладание покупательского давления.",
        "tr": "Ayrıca, genel piyasa trendi satın alma baskısının net hakimiyetini yansıtan güçlü bir yukarı yönlü harekete işaret ediyor.",
        "fr": "De plus, la tendance globale du marché indique une forte direction à la hausse, reflétant une claire domination de la pression d'achat.",
        "es": "Además, la tendencia general del mercado indica una fuerte dirección alcista, lo que refleja un claro predominio de la presión de compra."
      },
      "BULLISH": {
        "ar": "بالإضافة إلى أن الاتجاه العام يميل صعوداً معتدلاً في حركة السوق.",
        "en": "Additionally, the overall trend reflects a moderate upward bias in market movement.",
        "ru": "Кроме того, общий тренд отражает умеренное восходящее смещение в движении рынка.",
        "tr": "Ayrıca, genel piyasa hareketi ılımlı bir yükseliş eğilimi yansıtıyor.",
        "fr": "De plus, la tendance globale reflète un biais modérément à la hausse dans le mouvement du marché.",
        "es": "Además, la tendencia general refleja un sesgo alcista moderado en el movimiento del mercado."
      },
      "NEUTRAL": {
        "ar": "بالإضافة إلى أن الاتجاه العام يميل إلى حالة حيادية دون تفوق واضح لأي من القوى الشرائية أو البيعية.",
        "en": "Additionally, the overall market trend indicates a neutral condition, with no clear dominance from either buyers or sellers.",
        "ru": "Кроме того, общая рыночная тенденция указывает на нейтральное состояние, без четкого доминирования со стороны покупателей или продавцов.",
        "tr": "Ayrıca, genel piyasa trendi alıcı veya satıcıların net bir hakimiyetinin olmadığı nötr bir duruma işaret ediyor.",
        "fr": "De plus, la tendance globale du marché indique une condition neutre, sans domination claire ni des acheteurs ni des vendeurs.",
        "es": "Además, la tendencia general del mercado indica una condición neutral, sin un claro predominio ni de los compradores ni de los vendedores."
      },
      "BEARISH": {
        "ar": "بالإضافة إلى أن الاتجاه العام يميل هبوطاً معتدلاً في حركة السوق.",
        "en": "Additionally, the overall trend reflects a moderate downward bias in market movement.",
        "ru": "Кроме того, общий тренд отражает умеренное медвежье смещение в движении рынка.",
        "tr": "Ayrıca, genel trend piyasa hareketinde ılımlı bir düşüş eğilimini yansıtıyor.",
        "fr": "De plus, la tendance globale reflète un biais modérément à la baisse dans le mouvement du marché.",
        "es": "Además, la tendencia general refleja un sesgo bajista moderado en el movimiento del mercado."
      },
      "STRONG_DOWNTREND": {
        "ar": "بالإضافة إلى أن الاتجاه العام للسوق في اتجاه هابط قوي وبسيادة واضحة للاتجاه الهابط.",
        "en": "Additionally, the overall market trend indicates strong selling pressure and clear dominance of the bearish direction.",
        "ru": "Кроме того, общий рыночный тренд указывает на сильное давление продаж и явное доминирование медвежьего направления.",
        "tr": "Ayrıca, genel piyasa trendi güçlü satış baskısına ve ayı yönünün açık bir hakimiyetine işaret ediyor.",
        "fr": "De plus, la tendance globale du marché indique une forte pression à la vente et une claire domination de la direction baissière.",
        "es": "Además, la tendencia general del mercado indica una fuerte presión de venta y un claro predominio de la dirección bajista."
      }
    },
    "Structural_Bias": {
      "UPWARD": {
        "ar": "ومع ذلك، تشير البنية الهيكلية للسوق إلى انحياز صاعد.",
        "en": "Moreover, the market structure shows an upward structural bias.",
        "ru": "Более того, структура рынка демонстрирует восходящее структурное смещение.",
        "tr": "Dahası, piyasa yapısı yukarı yönlü yapısal bir eğilim göstermektedir.",
        "fr": "De plus, la structure du marché montre un biais structurel à la hausse.",
        "es": "Además, la estructura del mercado muestra un sesgo estructural alcista."
      },
      "DOWNWARD": {
        "ar": "ومع ذلك، تشير البنية الهيكلية للسوق إلى انحياز هابط.",
        "en": "Moreover, the market structure shows a downward structural bias.",
        "ru": "Более того, структура рынка демонстрирует нисходящее структурное смещение.",
        "tr": "Dahası, piyasa yapısı aşağı yönlü yapısal bir eğilim gösteriyor.",
        "fr": "De plus, la structure du marché montre un biais structurel à la baisse.",
        "es": "Además, la estructura del mercado muestra un sesgo estructural bajista."
      },
      "NEUTRAL": {
        "ar": "ومع ذلك، تعكس البنية الهيكلية حالة توازن نسبي بين قوى العرض والطلب.",
        "en": "Moreover, the market structure reflects a balanced condition.",
        "ru": "Более того, рыночная структура отражает сбалансированное состояние.",
        "tr": "Dahası, piyasa yapısı dengeli bir durumu yansıtır.",
        "fr": "De plus, la structure du marché reflète une condition équilibrée.",
        "es": "Además, la estructura del mercado refleja una condición equilibrada."
      }
    },
    "Momentum_State": {
      "STRONG": { "ar": "كما يوضح الزخم قوة واضحة في الحركة السعرية.", "en": "Furthermore, momentum shows strong price movement strength.", "ru": "Кроме того, импульс показывает сильную динамику движения цены.", "tr": "Ayrıca, ivme güçlü fiyat hareketi gücü gösterir.", "fr": "En outre, la dynamique montre une forte intensité de mouvement des prix.", "es": "Además, el impulso muestra una fuerte intensidad en el movimiento de los precios." },
      "MODERATE": { "ar": "كما يشير الزخم إلى حركة متوسطة القوة في السوق.", "en": "Furthermore, momentum reflects moderate strength in price movement.", "ru": "Кроме того, импульс отражает умеренную силу в движении цены.", "tr": "Ayrıca, ivme fiyat hareketinin ılımlı gücünü yansıtır.", "fr": "En outre, la dynamique reflète une force modérée dans le mouvement des prix.", "es": "Además, el impulso refleja una fuerza moderada en el movimiento de los precios." },
      "WEAK": { "ar": "كما يعكس الزخم ضعفاً نسبياً في الحركة السعرية.", "en": "Furthermore, momentum indicates relatively weak price movement.", "ru": "Кроме того, импульс указывает на относительно слабое движение цены.", "tr": "Ayrıca, ivme nispeten zayıf fiyat hareketi gücünü yansıtır.", "fr": "En outre, la dynamique indique un mouvement des prix relativement faible.", "es": "Además, el impulso indica un movimiento de precios relativamente débil." }
    },
    "Volatility": {
      "ELEVATED": { "ar": "ويظهر السوق مستوى مرتفعاً من التذبذب.", "en": "However, market volatility is currently elevated.", "ru": "Тем не менее, волатильность рынка в настоящее время повышена.", "tr": "Ancak, piyasa volatilitesi şu anda yükselmiş durumda.", "fr": "Cependant, la volatilité du marché est actuellement élevée.", "es": "Sin embargo, la volatilidad del mercado es actualmente elevada." },
      "MODERATE": { "ar": "ويتحرك السوق ضمن مستوى تذبذب معتدل.", "en": "However, market volatility remains moderate.", "ru": "Тем не менее, рыночная волатильность остается умеренной.", "tr": "Ancak, piyasa volatilitesi ılımlı kalmaya devam ediyor.", "fr": "Cependant, la volatilité du marché reste modérée.", "es": "Sin embargo, la volatilidad del mercado sigue siendo moderada." },
      "LOW": { "ar": "وتتحرك السوق في مستويات منخفضة من التذبذب.", "en": "However, market volatility is currently low.", "ru": "Тем не менее, волатильность рынка в настоящее время низкая.", "tr": "Ancak, piyasa volatilitesi şu anda düşük.", "fr": "Cependant, la volatilité du marché est actuellement faible.", "es": "Sin embargo, la volatilidad del mercado es actualmente baja." }
    },
    "Reversal_Risk": {
      "LOW": {
        "ar": "ومع ذلك، تشير مخاطر الانعكاس إلى احتمال منخفض لحدوث تغير مفاجئ في الاتجاه، ما يعكس درجة أعلى من استقرار الحركة الحالية.",
        "en": "Nevertheless, reversal risk currently appears low, suggesting a relatively stable directional environment.",
        "ru": "Тем не менее, риск разворота в настоящее время кажется низким, что свидетельствует об относительно стабильной направленной среде.",
        "tr": "Yine de, tersine dönüş riski şu anda düşük görünüyor, bu da nispeten istikrarlı bir yönelimsel ortam öneriyor.",
        "fr": "Néanmoins, le risque de renversement semble actuellement faible, suggérant un environnement directionnel relativement stable.",
        "es": "Sin embargo, el riesgo de reversión parece ser bajo en la actualidad, sugiriendo un entorno direccional relativamente estable."
      },
      "MODERATE": {
        "ar": "ومع ذلك، تعكس مخاطر الانعكاس احتمالاً متوسطاً لحدوث تقلبات أو تصحيحات في الحركة السعرية.",
        "en": "Nevertheless, reversal risk is assessed as moderate, indicating the potential for short-term volatility or corrective movements.",
        "ru": "Тем не менее, риск разворота оценивается как умеренный, что указывает на потенциал краткосрочной волатильности или коррекционных движений.",
        "tr": "Yine de, tersine dönüş riski ılımlı olarak değerlendiriliyor, bu da kısa vadeli volatilite veya düzeltici hareket potansiyeline işaret ediyor.",
        "fr": "Néanmoins, le risque de renversement est évalué comme modéré, indiquant le potentiel d'une volatilité à court terme ou de mouvements correctifs.",
        "es": "Sin embargo, el riesgo de reversión se evalúa como moderado, indicando el potencial de volatilidad a corto plazo o movimientos correctivos."
      },
      "HIGH": {
        "ar": "ومع ذلك، تشير مخاطر الانعكاس إلى احتمال أكبر لحدوث انعكاسات أو تقلبات مفاجئة في السوق.",
        "en": "Nevertheless, elevated reversal risk indicates a higher probability of sudden market reversals or sharp price fluctuations.",
        "ru": "Тем не менее, повышенный риск разворота указывает на более высокую вероятность внезапных разворотов рынка или резких колебаний цен.",
        "tr": "Yine de, yükselmiş tersine dönüş riski ani piyasa tersine dönüşlerinin veya keskin fiyat dalgalanmalarının yüksek bir olasılığını gösteriyor.",
        "fr": "Néanmoins, le risque élevé de renversement indique une probabilité plus forte de renversements soudains du marché ou de fluctuations aiguës des prix.",
        "es": "Sin embargo, el alto riesgo de reversión indica una mayor probabilidad de cambios repentinos en el mercado o de fluctuaciones severas en los precios."
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
    // Determine language, fallback to english gracefully
    const langKey = ["en", "ar", "ru", "tr", "fr", "es"].includes(language) ? language : "en";

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
