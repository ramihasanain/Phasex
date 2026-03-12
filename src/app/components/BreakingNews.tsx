"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, AlertTriangle, RadioTower, RefreshCw, Maximize2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { BreakingNewsModal, translateTitle } from "./BreakingNewsModal";
import { extractTagsFromText } from "./phase-x/UIComponents";
import { NewsEvent } from "./phase-x/types";

// ... [The original FFCalendarEvent interface is kept for local parsing before merging]

export interface FFCalendarEvent {
    title: string;
    country: string;
    date: string;
    impact: string;
    forecast?: string;
    previous?: string;
    url?: string;
    source?: "forex" | "crypto" | "commodities" | "indices" | "general";
    body?: string;
    imageurl?: string;
    provider?: string;
}

interface BreakingNewsProps {
    selectedSymbol: string;
    selectedCategory?: string;
}

export function BreakingNews({ selectedSymbol, selectedCategory }: BreakingNewsProps) {
    const { language, t } = useLanguage();
    const isRTL = language === "ar";
    
    const initialProviders: Record<string, "loading" | "ok" | "error" | "empty"> = {
        "ForexFactory": "loading",
        "Crypto News": "loading",
        "Global Market News": "loading",
        "Business News": "loading",
        "CoinDesk": "loading",
        "Market Feed": "loading",
        "Yahoo Finance": "loading",
        "Financial Times": "loading",
        "Seeking Alpha": "loading",
        "MarketWatch": "loading",
        "The Block": "loading",
        "Decrypt": "loading",
        "FXStreet": "loading",
        "ForexLive": "loading",
        "CNBC": "loading",
        "Investing.com": "loading",
        "Wall Street Journal": "loading"
    };

    // Switch state from local FFCalendarEvent to the global NewsEvent
    const [events, setEvents] = useState<NewsEvent[]>([]);
    const [providerStatuses, setProviderStatuses] = useState(initialProviders);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            // Helper for fetching and parsing RSS feeds into NewsEvents (kept for reference, but APIs preferred)
            const fetchRSS = async (url: string, sourceCategory: "forex" | "crypto" | "commodities" | "indices" | "general", providerName: string): Promise<FFCalendarEvent[]> => {
                try {
                    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
                    if (!res.ok) {
                        setProviderStatuses(prev => ({ ...prev, [providerName]: "error" }));
                        return [];
                    }
                    const data = await res.json();
                    if (data.status !== 'ok' || !data.items) {
                        setProviderStatuses(prev => ({ ...prev, [providerName]: "error" }));
                        return [];
                    }
                    if (data.items.length === 0) {
                        setProviderStatuses(prev => ({ ...prev, [providerName]: "empty" }));
                        return [];
                    }
                    setProviderStatuses(prev => ({ ...prev, [providerName]: "ok" }));
                    return data.items.slice(0, 50).map((item: any) => ({
                        title: item.title,
                        date: item.pubDate,
                        impact: "Normal",
                        url: item.link,
                        source: sourceCategory,
                        body: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 200), // Strip HTML and limit length
                        provider: providerName
                    }));
                } catch (e) {
                    console.error(`${providerName} RSS error:`, e);
                    setProviderStatuses(prev => ({ ...prev, [providerName]: "error" }));
                    return [];
                }
            };

            // 1. ForexFactory (Calendar Data via JSON proxy)
            const ffPromise = fetch("https://corsproxy.io/?url=" + encodeURIComponent("https://nfs.faireconomy.media/ff_calendar_thisweek.json"))
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch calendar");
                    return res.json();
                })
                .then((data: FFCalendarEvent[]) => {
                    if (!data || data.length === 0) {
                        setProviderStatuses(prev => ({ ...prev, "ForexFactory": "empty" }));
                        return [];
                    }
                    setProviderStatuses(prev => ({ ...prev, "ForexFactory": "ok" }));
                    const now = new Date();
                    return data.filter(e => {
                        const eventDate = new Date(e.date);
                        return eventDate >= new Date(now.setHours(0,0,0,0)); 
                    }).map(e => ({ ...e, source: "forex" as const, provider: "ForexFactory" }));
                })
                .catch(err => {
                    console.error("Forex API error:", err);
                    setProviderStatuses(prev => ({ ...prev, "ForexFactory": "error" }));
                    return [] as FFCalendarEvent[];
                });

            // 2. Crypto News (General Crypto - CryptoCompare)
            const cryptoPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN")
                .then(res => res.ok ? res.json() : null)
                .then((json: any) => {
                    if (!json || !json.Data || json.Data.length === 0) {
                        setProviderStatuses(prev => ({ ...prev, "Crypto News": "empty" }));
                        return [];
                    }
                    setProviderStatuses(prev => ({ ...prev, "Crypto News": "ok" }));
                    return json.Data.slice(0, 50).map((item: any): FFCalendarEvent => ({
                        title: item.title,
                        country: item.categories.split('|').find((t: string) => t === 'BTC' || t === 'ETH' || t === 'SOL') || "CRYPTO",
                        date: new Date(item.published_on * 1000).toISOString(),
                        impact: "Medium",
                        url: item.url,
                        source: "crypto",
                        body: item.body,
                        imageurl: item.imageurl,
                        provider: item.source_info?.name || "Crypto News"
                    }));
                }).catch(() => {
                    setProviderStatuses(prev => ({ ...prev, "Crypto News": "error" }));
                    return [] as FFCalendarEvent[];
                });

            // 3. Commodities & Macro Economy (CryptoCompare API)
            const commoditiesPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?categories=Commodities,Macro&lang=EN")
                .then(res => res.ok ? res.json() : null)
                .then((json: any) => {
                    if (!json || !json.Data || json.Data.length === 0) {
                        setProviderStatuses(prev => ({ ...prev, "Global Market News": "empty" }));
                        return [];
                    }
                    setProviderStatuses(prev => ({ ...prev, "Global Market News": "ok" }));
                    return json.Data.slice(0, 50).map((item: any): FFCalendarEvent => ({
                        title: item.title,
                        country: "COMMODITY",
                        date: new Date(item.published_on * 1000).toISOString(),
                        impact: "Medium",
                        url: item.url,
                        source: "commodities",
                        body: item.body,
                        imageurl: item.imageurl,
                        provider: item.source_info?.name || "Global Market News"
                    }));
                }).catch(() => {
                    setProviderStatuses(prev => ({ ...prev, "Global Market News": "error" }));
                    return [] as FFCalendarEvent[];
                });

            // 4. Indices, Traditional Markets & Business (CryptoCompare API)
            const indicesPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?categories=Market,Business,Fiat&lang=EN")
                .then(res => res.ok ? res.json() : null)
                .then((json: any) => {
                    if (!json || !json.Data || json.Data.length === 0) {
                        setProviderStatuses(prev => ({ ...prev, "Business News": "empty" }));
                        return [];
                    }
                    setProviderStatuses(prev => ({ ...prev, "Business News": "ok" }));
                    return json.Data.slice(0, 50).map((item: any): FFCalendarEvent => ({
                        title: item.title,
                        country: "INDEX",
                        date: new Date(item.published_on * 1000).toISOString(),
                        impact: "Medium",
                        url: item.url,
                        source: "indices",
                        body: item.body,
                        imageurl: item.imageurl,
                        provider: item.source_info?.name || "Business News"
                    }));
                }).catch(() => {
                    setProviderStatuses(prev => ({ ...prev, "Business News": "error" }));
                    return [] as FFCalendarEvent[];
                });

            // 5. CoinDesk (CryptoCompare Specific Source)
            const coindeskPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN&feeds=coindesk")
                .then(res => res.ok ? res.json() : null)
                .then((json: any) => {
                    if (!json || !json.Data || json.Data.length === 0) {
                        setProviderStatuses(prev => ({ ...prev, "CoinDesk": "empty" }));
                        return [];
                    }
                    setProviderStatuses(prev => ({ ...prev, "CoinDesk": "ok" }));
                    return json.Data.slice(0, 50).map((item: any): FFCalendarEvent => ({
                        title: item.title,
                        country: "CRYPTO",
                        date: new Date(item.published_on * 1000).toISOString(),
                        impact: "Normal",
                        url: item.url,
                        source: "crypto",
                        body: item.body,
                        imageurl: item.imageurl,
                        provider: "CoinDesk"
                    }));
                }).catch(() => {
                    setProviderStatuses(prev => ({ ...prev, "CoinDesk": "error" }));
                    return [] as FFCalendarEvent[];
                });

            // 6. Bloomberg/Reuters/WSJ Equivalents (CryptoCompare Traditional Finance Sources)
            const tradFiPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN&feeds=cryptoglobe,dailyhodl") // Using reliable feeds as proxy for general market news
                .then(res => res.ok ? res.json() : null)
                .then((json: any) => {
                    if (!json || !json.Data || json.Data.length === 0) {
                        setProviderStatuses(prev => ({ ...prev, "Market Feed": "empty" }));
                        return [];
                    }
                    setProviderStatuses(prev => ({ ...prev, "Market Feed": "ok" }));
                    return json.Data.slice(0, 50).map((item: any): FFCalendarEvent => ({
                        title: item.title,
                        country: "MARKETS",
                        date: new Date(item.published_on * 1000).toISOString(),
                        impact: "Normal",
                        url: item.url,
                        source: "general",
                        body: item.body,
                        imageurl: item.imageurl,
                        provider: item.source_info?.name || "Market Feed"
                    }));
                }).catch(() => {
                    setProviderStatuses(prev => ({ ...prev, "Market Feed": "error" }));
                    return [] as FFCalendarEvent[];
                });

            // 7. Yahoo Finance (RSS - General)
            const yahooPromise = fetchRSS("https://finance.yahoo.com/news/rssindex", "general", "Yahoo Finance");

            // 8. Financial Times (RSS - Business)
            const ftPromise = fetchRSS("https://www.ft.com/?format=rss", "general", "Financial Times");

            // 9. Seeking Alpha (RSS - Markets)
            const seekingAlphaPromise = fetchRSS("https://seekingalpha.com/feed.xml", "general", "Seeking Alpha");

            // 10. MarketWatch (RSS - Markets)
            const marketWatchPromise = fetchRSS("https://feeds.content.dowjones.io/public/rss/mw_topstories", "general", "MarketWatch");

            // 11. The Block (RSS - Crypto)
            const theBlockPromise = fetchRSS("https://www.theblock.co/api/hub/rss/", "crypto", "The Block");

            // 12. Decrypt (RSS - Crypto)
            const decryptPromise = fetchRSS("https://decrypt.co/feed", "crypto", "Decrypt");

            // 13. FXStreet (RSS - Forex)
            const fxstreetPromise = fetchRSS("https://www.fxstreet.com/rss", "forex", "FXStreet");

            // 14. ForexLive (RSS - Forex)
            const forexlivePromise = fetchRSS("https://www.forexlive.com/feed/news", "forex", "ForexLive");

            // 15. CNBC Top News (RSS - General)
            const cnbcTopPromise = fetchRSS("https://search.cnbc.com/rs/search/combinedcms/view.xml?profile=100003114", "general", "CNBC");

            // 16. Investing.com Crypto (RSS - Crypto)
            const investingCryptoPromise = fetchRSS("https://www.investing.com/rss/news_301.rss", "crypto", "Investing.com");

            // 17. WSJ Markets (RSS - Markets)
            const wsjMarketsPromise = fetchRSS("https://feeds.a.dj.com/rss/RSSMarketsMain.xml", "general", "Wall Street Journal");

            // Await all sources
            const [
                ffEvents, cryptoEvents, commoditiesEvents, indicesEvents, coindeskEvents, tradFiEvents, yahooEvents,
                ftEvents, seekingAlphaEvents, marketWatchEvents, theBlockEvents, decryptEvents,
                fxstreetEvents, forexliveEvents, cnbcTopEvents, investingCryptoEvents, wsjMarketsEvents
            ] = await Promise.all([
                ffPromise, cryptoPromise, commoditiesPromise, indicesPromise, coindeskPromise, tradFiPromise, yahooPromise,
                ftPromise, seekingAlphaPromise, marketWatchPromise, theBlockPromise, decryptPromise,
                fxstreetPromise, forexlivePromise, cnbcTopPromise, investingCryptoPromise, wsjMarketsPromise
            ]);
            
            // Merge & sort news articles (newest first)
            const newsCombined = [
                ...cryptoEvents, ...commoditiesEvents, ...indicesEvents, ...coindeskEvents, ...tradFiEvents, ...yahooEvents,
                ...ftEvents, ...seekingAlphaEvents, ...marketWatchEvents, ...theBlockEvents, ...decryptEvents,
                ...fxstreetEvents, ...forexliveEvents, ...cnbcTopEvents, ...investingCryptoEvents, ...wsjMarketsEvents
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            // Limit news to top 1000 freshest items
            const slicedNews = newsCombined.slice(0, 1000);

            // Important: Re-add ForexFactory events and sort the final combined list
            // This ensures ForexFactory (Economic Calendar) events are never pushed out by high-volume news
            const combined = [...ffEvents, ...slicedNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Turn raw events into full NewsEvents with IDs and Tags
            const finalizedEvents: NewsEvent[] = combined.map((e, index) => {
                const combinedText = `${e.title} ${e.body || ''}`;
                const matchedTags = extractTagsFromText(combinedText);
                
                // Inject country as a tag if it exists (e.g. USD, EUR)
                if (e.country && !matchedTags.includes(e.country)) {
                    matchedTags.push(e.country);
                }
                
                // Add a special tag for ForexFactory calendar events
                if (e.provider === "ForexFactory") {
                    matchedTags.push("أجندة اقتصادية");
                }
                
                return {
                     id: `news-${e.source}-${index}-${Date.now()}`,
                     title: e.title,
                     body: e.body,
                     date: e.date,
                     url: e.url,
                     impact: e.impact,
                     source: e.source || "general",
                     country: e.country,
                     forecast: e.forecast,
                     previous: e.previous,
                     imageurl: e.imageurl,
                     provider: e.provider || (e.source === "forex" ? "ForexFactory" : "News Hub"),
                     matchedTags: matchedTags
                };
            });
            
            setEvents(finalizedEvents);
            
        } catch (err: any) {
            setError(err.message || "Failed to load news");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        // Refresh every 7 minutes
        const interval = setInterval(fetchNews, 7 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Filter by the main Market tab selected in PhaseXDynamicsPage
    const filteredEvents = useMemo(() => {
        if (!events.length) return [];
            
        let pertinentEvents = events;
            if (selectedCategory === "Crypto") {
                pertinentEvents = events.filter(e => e.source === "crypto");
            } else if (selectedCategory === "Commodities") {
                // Return commodities news + high impact forex news (since forex impacts gold/oil)
                pertinentEvents = events.filter(e => e.source === "commodities" || (e.source === "forex" && e.impact === "High"));
            } else if (selectedCategory === "Indices") {
                // Return stock market news + high impact forex news
                pertinentEvents = events.filter(e => e.source === "indices" || (e.source === "forex" && e.impact === "High"));
            } else if (selectedCategory !== "All") {
                // Vector Core / Forex Tabs -> strictly Macroeconomic ForexFactory events
                pertinentEvents = events.filter(e => e.source === "forex");
            }

        // Sort by Impact: High > Medium > Low
        return pertinentEvents.sort((a, b) => {
            const impactScore = { "High": 3, "Medium": 2, "Low": 1, "Non": 0 } as Record<string, number>;
            return (impactScore[b.impact] || 0) - (impactScore[a.impact] || 0);
        });
        
    }, [events, selectedCategory]);

    useEffect(() => {
        if (filteredEvents.length > 0) {
            const timer = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % filteredEvents.length);
            }, 6000); // cycle every 6 seconds
            return () => clearInterval(timer);
        }
    }, [filteredEvents]);

    if (loading && !events.length) {
        return (
             <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs text-gray-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {t("loadingNews")}
            </div>
        );
    }

    if (error || filteredEvents.length === 0) {
        return (
            <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs text-gray-400">
                <Globe className="w-3.5 h-3.5 opacity-50" />
                {t("noEventsFor")}
            </div>
        );
    }

    const currentEvent = filteredEvents[activeIndex];

    let impactColorStr = "text-gray-400";
    let impactBgStr = "bg-gray-500/10 border-gray-500/20";
    let impactLabel = t("impactNormal");
    
    if (currentEvent.impact === "High") {
        impactColorStr = "text-red-400";
        impactBgStr = "bg-red-500/10 border-red-500/20";
        impactLabel = t("impactHigh");
    } else if (currentEvent.impact === "Medium") {
        impactColorStr = "text-orange-400";
        impactBgStr = "bg-orange-500/10 border-orange-500/20";
        impactLabel = t("impactMedium");
    } else if (currentEvent.impact === "Low") {
        impactColorStr = "text-yellow-400";
        impactBgStr = "bg-yellow-500/10 border-yellow-500/20";
        impactLabel = t("impactLow");
    }

    return (
        <div className="relative overflow-hidden flex items-center bg-black/40 border border-white/10 rounded-xl px-1 h-[42px] max-w-full">
            {/* Live Indicator pulse */}
            <div className="flex items-center gap-2 px-3 border-r border-white/10 h-full flex-shrink-0" dir={isRTL ? "rtl" : "ltr"}>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                    <RadioTower className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t("liveNews")}</span>
                </span>
            </div>

            <div className="flex-1 overflow-hidden relative h-full flex items-center px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-3 w-full whitespace-nowrap overflow-hidden"
                        dir={isRTL ? "rtl" : "ltr"}
                    >
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${impactBgStr}`}>
                            <AlertTriangle className={`w-3 h-3 ${impactColorStr}`} />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${impactColorStr}`}>{impactLabel}</span>
                        </div>
                        
                        <a 
                            href={currentEvent.url || `https://www.forexfactory.com/calendar?day=${currentEvent.date.split('T')[0].split('-').slice(1).join('-')}-${currentEvent.date.split('-')[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold text-gray-200 hover:text-white hover:underline decoration-white/30 underline-offset-4 cursor-pointer"
                            dir={isRTL && translateTitle(currentEvent.title, isRTL) !== currentEvent.title ? "rtl" : "ltr"}
                        >
                            {currentEvent.country && <span className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 rounded no-underline" dir="ltr">{currentEvent.country}</span>}
                            <span className="truncate max-w-[200px] md:max-w-[400px]">
                                {translateTitle(currentEvent.title, isRTL)}
                            </span>
                        </a>

                        {(currentEvent.forecast || currentEvent.previous) && (
                            <div className="hidden lg:flex items-center gap-3 text-[10px] font-medium text-gray-500 ml-auto mr-4" dir="ltr">
                                {currentEvent.forecast && <span><span className="text-gray-600">F:</span> {currentEvent.forecast}</span>}
                                {currentEvent.previous && <span><span className="text-gray-600">P:</span> {currentEvent.previous}</span>}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* View All Button */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3 h-full border-l border-white/10 hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest text-cyan-400 flex-shrink-0"
                dir={isRTL ? "rtl" : "ltr"}
            >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("viewAll")}</span>
            </button>

            {/* Full-Page Modal Context */}
            <BreakingNewsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                events={events as any}           // Passing the raw unfiltered events down to the modal
                selectedSymbol={selectedSymbol}
                selectedCategory={selectedCategory}
                providerStatuses={providerStatuses}
            />
        </div>
    );
}
