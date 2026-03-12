import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Calendar, Filter, TextQuote, Search, Tag, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { NewsEvent } from "./phase-x/types"; // Import the generic NewsEvent

// Dictionary of common ForexFactory titles
const arabicEventTitles: Record<string, string> = {
    // Interest Rates & Central Banks
    "Monetary Policy Statement": "بيان السياسة النقدية",
    "Official Bank Rate": "معدل الفائدة الرسمي",
    "Cash Rate": "سعر الفائدة",
    "Interest Rate Decision": "قرار الفائدة",
    "FOMC Statement": "بيان اللجنة الفيدرالية (FOMC)",
    "FOMC Press Conference": "المؤتمر الصحفي للاحتياطي الفيدرالي",
    "Fed Chair Powell Speaks": "حديث رئيس الفيدرالي باول",
    "ECB Press Conference": "المؤتمر الصحفي للبنك المركزي الأوروبي",
    "Main Refinancing Rate": "نسبة إعادة التمويل الرئيسية",

    // Employment & Labor
    "Non-Farm Employment Change": "تقرير التوظيف بغير القطاع الزراعي (NFP)",
    "Unemployment Rate": "معدل البطالة",
    "Employment Change": "التغير في التوظيف",
    "Unemployment Claims": "شكاوى البطالة",
    "JOLTS Job Openings": "فرص العمل (JOLTS)",
    "ADP Non-Farm Employment Change": "وظائف القطاع الخاص (ADP)",

    // Inflation (CPI, PPI, PCE)
    "CPI m/m": "مؤشر أسعار المستهلكين (شهري)",
    "CPI y/y": "مؤشر أسعار المستهلكين (سنوي)",
    "Core CPI m/m": "مؤشر أسعار المستهلكين الأساسي (شهري)",
    "Core PCE Price Index m/m": "مؤشر نفقات الاستهلاك الشخصي الأساسي (شهري)",
    "PPI m/m": "مؤشر أسعار المنتجين (شهري)",
    "Core PPI m/m": "مؤشر أسعار المنتجين الأساسي (شهري)",

    // Growth (GDP, PMI)
    "Advance GDP q/q": "الناتج المحلي الإجمالي المسبق (ربع سنوي)",
    "Prelim GDP q/q": "الناتج المحلي الإجمالي التمهيدي (ربع سنوي)",
    "Final GDP q/q": "الناتج المحلي الإجمالي النهائي (ربع سنوي)",
    "ISM Manufacturing PMI": "مؤشر مديري المشتريات الصناعي (ISM)",
    "ISM Services PMI": "مؤشر مديري المشتريات الخدمي (ISM)",
    "Flash Manufacturing PMI": "مؤشر مديري المشتريات الصناعي (الأولي)",
    "Flash Services PMI": "مؤشر مديري المشتريات الخدمي (الأولي)",

    // Consumers & Retail
    "Retail Sales m/m": "مبيعات التجزئة (شهري)",
    "Core Retail Sales m/m": "مبيعات التجزئة الأساسية (شهري)",
    "CB Consumer Confidence": "ثقة المستهلك (CB)",
    "Prelim UoM Consumer Sentiment": "ثقة المستهلك (جامعة ميشيغان)",

    // Housing
    "Building Permits": "تصاريح البناء",
    "Existing Home Sales": "مبيعات المنازل القائمة",
    "New Home Sales": "مبيعات المنازل الجديدة",

    // Trade Balance
    "Crude Oil Inventories": "مخزونات النفط الخام",
    "Trade Balance": "الميزان التجاري",
};

export const translateTitle = (title: string, isRTL: boolean) => {
    if (!isRTL) return title;

    // Exact match
    if (arabicEventTitles[title]) return arabicEventTitles[title];

    // Partial Match for speeches
    if (title.includes("Speaks")) return title.replace("Speaks", "يتحدث");

    return title; // fallback to English if no translation found
};

interface BreakingNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: NewsEvent[]; // Update to global NewsEvent
    selectedSymbol: string;
    selectedCategory?: string;
    providerStatuses: Record<string, "loading" | "ok" | "error" | "empty">;
}

export function BreakingNewsModal({ isOpen, onClose, events, selectedSymbol, selectedCategory, providerStatuses }: BreakingNewsModalProps) {
    const { language, t } = useLanguage();
    const isRTL = language === "ar";

    const [providerFilter, setProviderFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(20);

    // All providers sorted alphabetically
    const allProviders = useMemo(() => {
        return Object.keys(providerStatuses).sort();
    }, [providerStatuses]);

    // Extract unique tags for the filter
    const uniqueTags = useMemo(() => {
        const tags = new Set<string>();
        events.forEach(e => {
            if (e.matchedTags) {
                e.matchedTags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    }, [events]);

    // Map the external selectedCategory directly to search query
    React.useEffect(() => {
        if (!isOpen) return;

        if (selectedCategory && selectedCategory !== "All") {
            setSearchQuery(selectedCategory.toUpperCase());
        } else {
            setSearchQuery("");
        }
    }, [selectedCategory, isOpen]);

    const filteredEvents = useMemo(() => {
        let results = events;

        // 1. tag / provider filter
        if (providerFilter !== "ALL") {
            results = results.filter(e => e.provider === providerFilter);
        }

        // 3. Search Text Filter (checks title, body, and tags)
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            results = results.filter(e => {
                const searchStr = `${e.title} ${e.body || ''} ${e.matchedTags.join(' ')} ${e.country || ''} ${e.provider || ''}`.toLowerCase();
                return searchStr.includes(query);
            });
        }

        return results;
    }, [events, providerFilter, searchQuery]);

    // Reset visible count when filters change
    React.useEffect(() => {
        setVisibleCount(20);
    }, [providerFilter, searchQuery]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl max-h-[85vh] flex flex-col bg-[#0b101a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    dir={isRTL ? "rtl" : "ltr"}
                >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-white/5 bg-black/40 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Globe className="text-cyan-400 w-6 h-6" />
                                {t("advancedNewsCenter")}
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                {t("smartDetection")}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Toolbar / Filters */}
                    <div className="p-4 border-b border-white/5 bg-gray-900/50 flex flex-col gap-4">

                        {/* Search Bar */}
                        <div className="relative w-full">
                            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
                            <input
                                type="text"
                                placeholder={t("searchNews")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full bg-black/50 border border-white/10 rounded-full py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
                            />
                        </div>

                        {/* Dynamic Tags Filter */}
                        {uniqueTags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm font-semibold text-gray-300">
                                        {isRTL ? "العملات والأصول:" : "Assets & Tags:"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${searchQuery === ""
                                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                                            : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {isRTL ? "الكل" : "All"}
                                    </button>
                                    {uniqueTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchQuery(tag)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${searchQuery.toLowerCase() === tag.toLowerCase()
                                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                                                : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {allProviders.length > 0 && (
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-semibold text-gray-300">
                                        {t("sourceFilter")}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setProviderFilter("ALL")}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${providerFilter === "ALL"
                                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                                            : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {isRTL ? "الكل" : "All"}
                                    </button>
                                    {allProviders.map(provider => (
                                        <button
                                            key={provider}
                                            onClick={() => setProviderFilter(provider)}
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${providerFilter === provider
                                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                                : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                                                } ${providerStatuses[provider] === "error" ? "opacity-60" : ""}`}
                                        >
                                            {provider}
                                            {providerStatuses[provider] === "loading" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]" title="Loading..." />}
                                            {providerStatuses[provider] === "error" && <span className="text-[10px] text-red-500 font-normal whitespace-nowrap">({isRTL ? "خلل من المصدر" : "Error"})</span>}
                                            {providerStatuses[provider] === "empty" && <span className="text-[10px] text-gray-500 font-normal whitespace-nowrap">({isRTL ? "لا أخبار" : "No News"})</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* List Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {filteredEvents.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-3">
                                <TextQuote className="w-10 h-10 opacity-20" />
                                <p>{t("noNewsMatched")}</p>
                            </div>
                        ) : (
                            filteredEvents.slice(0, visibleCount).map((event, idx) => {
                                let impactColorStr = "text-gray-400";
                                let impactBgStr = "bg-gray-500/10 border-gray-500/20";
                                let impactLabel = t("impactNormal");

                                if (event.impact === "High") {
                                    impactColorStr = "text-red-400";
                                    impactBgStr = "bg-red-500/10 border-red-500/20";
                                    impactLabel = t("impactHigh");
                                } else if (event.impact === "Medium") {
                                    impactColorStr = "text-orange-400";
                                    impactBgStr = "bg-orange-500/10 border-orange-500/20";
                                    impactLabel = t("impactMedium");
                                } else if (event.impact === "Low") {
                                    impactColorStr = "text-yellow-400";
                                    impactBgStr = "bg-yellow-500/10 border-yellow-500/20";
                                    impactLabel = t("impactLow");
                                }

                                const eventDate = new Date(event.date);
                                const dateFormatted = eventDate.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                                const timeFormatted = eventDate.toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={event.id || idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-black/40 hover:border-white/10 transition-colors">

                                        {/* Timing Col */}
                                        <div className="flex flex-col sm:w-28 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-white/5 pb-3 sm:pb-0 sm:pr-4 rtl:sm:border-l rtl:sm:border-r-0 rtl:sm:pl-4">
                                            <span className="text-sm font-bold text-white mb-0.5">{dateFormatted}</span>
                                            <span className="text-xs text-gray-400">{timeFormatted}</span>
                                        </div>

                                        {/* Main Details */}
                                        <div className="flex-1 flex flex-col justify-center">

                                            {/* Top Metadata Row */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {/* Smart Matched Tags Render */}
                                                {event.matchedTags && event.matchedTags.length > 0 ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Tag className="w-3 h-3 text-emerald-400" />
                                                        {event.matchedTags.map(tag => (
                                                            <button
                                                                key={tag}
                                                                onClick={() => setSearchQuery(tag)}
                                                                className="text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] tracking-wide transition-colors"
                                                                dir="ltr"
                                                                title={isRTL ? `عرض أخبار ${tag}` : `Filter by ${tag}`}
                                                            >
                                                                {tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : event.country ? (
                                                    <button
                                                        onClick={() => setSearchQuery(event.country!)}
                                                        className="text-cyan-400 font-bold bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded text-xs transition-colors"
                                                        dir="ltr"
                                                        title={isRTL ? `عرض أخبار ${event.country}` : `Filter by ${event.country}`}
                                                    >
                                                        {event.country}
                                                    </button>
                                                ) : null}

                                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${impactBgStr}`}>
                                                    <AlertTriangle className={`w-3 h-3 ${impactColorStr}`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${impactColorStr}`}>{impactLabel}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-base font-semibold text-gray-100" dir={isRTL && translateTitle(event.title, isRTL) !== event.title ? "rtl" : "ltr"}>
                                                {translateTitle(event.title, isRTL)}
                                            </h3>

                                            {event.body ? (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-400 leading-relaxed font-sans line-clamp-3" dir="ltr" dangerouslySetInnerHTML={{ __html: event.body }} />
                                                    {event.url && (
                                                        <a
                                                            href={event.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest border border-cyan-500/30 px-3 py-1.5 rounded bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
                                                        >
                                                            {event.provider ? (isRTL ? `اقرأ على ${event.provider} ↗` : `Read on ${event.provider} ↗`) : t("readReport")}
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mt-1.5 flex flex-col items-start gap-2">
                                                    <p className="text-[10px] text-gray-500" dir="ltr">({event.title})</p>
                                                    {event.url && (
                                                        <a
                                                            href={event.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex mt-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest"
                                                        >
                                                            {event.provider ? (isRTL ? `المصدر: ${event.provider} ↗` : `Source: ${event.provider} ↗`) : t("sourceLink")}
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Economic Values Col (Only for Calendar events) */}
                                        {(event.forecast || event.previous) && (
                                            <div className="flex sm:flex-col justify-end gap-4 sm:gap-2 sm:w-32 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-none border-white/5">
                                                {event.forecast && (
                                                    <div className="flex items-center justify-between sm:justify-start gap-2">
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t("forecastVal")}</span>
                                                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/40 px-1.5 rounded">{event.forecast}</span>
                                                    </div>
                                                )}
                                                {event.previous && (
                                                    <div className="flex items-center justify-between sm:justify-start gap-2">
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t("previousVal")}</span>
                                                        <span className="text-xs font-mono text-gray-400">{event.previous}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                );
                            })
                        )}

                        {visibleCount < filteredEvents.length && (
                            <div className="flex justify-center py-4">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 20)}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold text-gray-300 transition-colors"
                                >
                                    {isRTL ? "عرض المزيد" : "Load More"}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
