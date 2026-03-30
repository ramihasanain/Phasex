export type AiTradeSignalTxt = {
    analyzing: string;
    systemReady: string;
    standby: string;
    extracting: string;
    initScan: string;
    focus: string;
    entryProtocol: string;
    targetPrimary: string;
    abortLevel: string;
    volatility: string;
    trendStrength: string;
    support: string;
    resistance: string;
    aiLogic: string;
    riskVectors: string;
    scanningBtn: string;
    rescanBtn: string;
    executeBtn: string;
};

const txtDict: Record<string, AiTradeSignalTxt> = {
    ar: {
        analyzing: "جاري التحليل...",
        systemReady: "جاهز",
        standby: "وضع الاستعداد",
        extracting: "استخراج البيانات...",
        initScan: "ابدأ الفحص لمعالجة ديناميكيات المرحلة مباشرة.",
        focus: "التركيز",
        entryProtocol: "نقطة الدخول",
        targetPrimary: "الهدف الرئيسي",
        abortLevel: "مستوى الإلغاء (SL)",
        volatility: "التقلب",
        trendStrength: "قوة الاتجاه",
        support: "الدعم",
        resistance: "المقاومة",
        aiLogic: "منطق الذكاء الاصطناعي",
        riskVectors: "مؤشرات الخطر",
        scanningBtn: "جاري المسح...",
        rescanBtn: "إعادة المسح",
        executeBtn: "تنفيذ المسح",
    },
    en: {
        analyzing: "ANALYZING...",
        systemReady: "SYSTEM READY",
        standby: "STANDBY",
        extracting: "EXTRACTING METRICS...",
        initScan: "Initiate scan to process live Phase X dynamics.",
        focus: "FOCUS",
        entryProtocol: "ENTRY PROTOCOL",
        targetPrimary: "TARGET PRIMARY",
        abortLevel: "ABORT LEVEL (SL)",
        volatility: "VOLATILITY",
        trendStrength: "TREND STRENGTH",
        support: "SUPPORT",
        resistance: "RESISTANCE",
        aiLogic: "AI LOGIC",
        riskVectors: "RISK VECTORS & FACTORS",
        scanningBtn: "SCANNING...",
        rescanBtn: "RE-SCAN",
        executeBtn: "EXECUTE SCAN",
    },
    ru: {
        analyzing: "АНАЛИЗ...",
        systemReady: "СИСТЕМА ГОТОВА",
        standby: "ОЖИДАНИЕ",
        extracting: "ИЗВЛЕЧЕНИЕ МЕТРИК...",
        initScan: "Начать сканирование для обработки динамики Phase X.",
        focus: "ФОКУС",
        entryProtocol: "ПРОТОКОЛ ВХОДА",
        targetPrimary: "ОСНОВНАЯ ЦЕЛЬ",
        abortLevel: "УРОВЕНЬ ОТМЕНЫ (SL)",
        volatility: "ВОЛАТИЛЬНОСТЬ",
        trendStrength: "СИЛА ТРЕНДА",
        support: "ПОДДЕРЖКА",
        resistance: "СОПРОТИВЛЕНИЕ",
        aiLogic: "ЛОГИКА ИИ",
        riskVectors: "ФАКТОРЫ РИСКА",
        scanningBtn: "СКАНИРОВАНИЕ...",
        rescanBtn: "ПОВТОРНОЕ СКАНИРОВАНИЕ",
        executeBtn: "НАЧАТЬ СКАНИРОВАНИЕ",
    },
    tr: {
        analyzing: "ANALİZ EDİLİYOR...",
        systemReady: "SİSTEM HAZIR",
        standby: "BEKLEMEDE",
        extracting: "METRİKLER ÇIKARILIYOR...",
        initScan: "Canlı Phase X dinamiklerini işlemek için taramayı başlatın.",
        focus: "ODAK",
        entryProtocol: "GİRİŞ PROTOKOLÜ",
        targetPrimary: "BİRİNCİL HEDEF",
        abortLevel: "İPTAL SEVİYESİ (SL)",
        volatility: "VOLATİLİTE",
        trendStrength: "TREND GÜCÜ",
        support: "DESTEK",
        resistance: "DİRENÇ",
        aiLogic: "YZ MANTIĞI",
        riskVectors: "RİSK FAKTÖRLERİ",
        scanningBtn: "TARANIYOR...",
        rescanBtn: "YENİDEN TARA",
        executeBtn: "TARAMAYI BAŞLAT",
    },
    fr: {
        analyzing: "ANALYSE...",
        systemReady: "PRÊT",
        standby: "VEILLE",
        extracting: "EXTRACTION DE DONNÉES...",
        initScan: "Lancer l'analyse pour traiter la dynamique Phase X en direct.",
        focus: "FOCUS",
        entryProtocol: "PROTOCOLE D'ENTRÉE",
        targetPrimary: "CIBLE PRINCIPALE",
        abortLevel: "NIVEAU D'ABANDON (SL)",
        volatility: "VOLATILITÉ",
        trendStrength: "FORCE DE TENDANCE",
        support: "SUPPORT",
        resistance: "RÉSISTANCE",
        aiLogic: "LOGIQUE IA",
        riskVectors: "VECTEURS DE RISQUE",
        scanningBtn: "ANALYSE EN COURS...",
        rescanBtn: "NOUVELLE ANALYSE",
        executeBtn: "EXÉCUTER L'ANALYSE",
    },
    es: {
        analyzing: "ANALIZANDO...",
        systemReady: "LISTO",
        standby: "ESPERA",
        extracting: "EXTRAYENDO MÉTRICAS...",
        initScan: "Iniciar escaneo para procesar las dinámicas en vivo de Phase X.",
        focus: "FOCO",
        entryProtocol: "PROTOCOLO DE ENTRADA",
        targetPrimary: "OBJETIVO PRINCIPAL",
        abortLevel: "NIVEL DE ABORTO (SL)",
        volatility: "VOLATILIDAD",
        trendStrength: "FUERZA DE TENDENCIA",
        support: "SOPORTE",
        resistance: "RESISTENCIA",
        aiLogic: "LÓGICA DE IA",
        riskVectors: "VECTORES DE RIESGO",
        scanningBtn: "ESCANEANDO...",
        rescanBtn: "VOLVER A ESCANEAR",
        executeBtn: "EJECUTAR ESCANEO",
    },
};

export function getAiTradeSignalTxt(language: string): AiTradeSignalTxt {
    return txtDict[language] || txtDict.en;
}
