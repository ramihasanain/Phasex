import { useCallback, useEffect, useState } from "react";
import { extractTagsFromText } from "../phase-x/UIComponents";
import type { NewsEvent } from "../phase-x/types";
import { INITIAL_PROVIDERS } from "./initialProviders";
import type { FFCalendarEvent } from "./types";

export function useBreakingNewsFeed() {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [providerStatuses, setProviderStatuses] = useState<Record<string, "loading" | "ok" | "error" | "empty">>(() => ({ ...INITIAL_PROVIDERS }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchRSS = async (
        url: string,
        sourceCategory: "forex" | "crypto" | "commodities" | "indices" | "general",
        providerName: string
      ): Promise<FFCalendarEvent[]> => {
        try {
          const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
          if (!res.ok) {
            setProviderStatuses((prev) => ({ ...prev, [providerName]: "error" }));
            return [];
          }
          const data = await res.json();
          if (data.status !== "ok" || !data.items) {
            setProviderStatuses((prev) => ({ ...prev, [providerName]: "error" }));
            return [];
          }
          if (data.items.length === 0) {
            setProviderStatuses((prev) => ({ ...prev, [providerName]: "empty" }));
            return [];
          }
          setProviderStatuses((prev) => ({ ...prev, [providerName]: "ok" }));
          return data.items.slice(0, 50).map((item: { title: string; pubDate: string; link: string; description?: string }) => ({
            title: item.title,
            country: "",
            date: item.pubDate,
            impact: "Normal",
            url: item.link,
            source: sourceCategory,
            body: item.description?.replace(/<[^>]*>?/gm, "").substring(0, 200),
            provider: providerName,
          }));
        } catch (e) {
          console.error(`${providerName} RSS error:`, e);
          setProviderStatuses((prev) => ({ ...prev, [providerName]: "error" }));
          return [];
        }
      };

      const ffPromise = fetch("https://corsproxy.io/?url=" + encodeURIComponent("https://nfs.faireconomy.media/ff_calendar_thisweek.json"))
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch calendar");
          return res.json();
        })
        .then((data: FFCalendarEvent[]) => {
          if (!data || data.length === 0) {
            setProviderStatuses((prev) => ({ ...prev, ForexFactory: "empty" }));
            return [];
          }
          setProviderStatuses((prev) => ({ ...prev, ForexFactory: "ok" }));
          const now = new Date();
          return data
            .filter((e) => {
              const eventDate = new Date(e.date);
              return eventDate >= new Date(now.setHours(0, 0, 0, 0));
            })
            .map((e) => ({ ...e, source: "forex" as const, provider: "ForexFactory" }));
        })
        .catch((err) => {
          console.error("Forex API error:", err);
          setProviderStatuses((prev) => ({ ...prev, ForexFactory: "error" }));
          return [] as FFCalendarEvent[];
        });

      const cryptoPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN")
        .then((res) => (res.ok ? res.json() : null))
        .then((json: { Data?: Array<Record<string, unknown>> } | null) => {
          if (!json || !json.Data || json.Data.length === 0) {
            setProviderStatuses((prev) => ({ ...prev, "Crypto News": "empty" }));
            return [];
          }
          setProviderStatuses((prev) => ({ ...prev, "Crypto News": "ok" }));
          return json.Data!.slice(0, 50).map((item: Record<string, unknown>): FFCalendarEvent => ({
            title: item.title as string,
            country: String(item.categories || "")
              .split("|")
              .find((t: string) => t === "BTC" || t === "ETH" || t === "SOL") || "CRYPTO",
            date: new Date((item.published_on as number) * 1000).toISOString(),
            impact: "Medium",
            url: item.url as string,
            source: "crypto",
            body: item.body as string,
            imageurl: item.imageurl as string,
            provider: (item.source_info as { name?: string })?.name || "Crypto News",
          }));
        })
        .catch(() => {
          setProviderStatuses((prev) => ({ ...prev, "Crypto News": "error" }));
          return [] as FFCalendarEvent[];
        });

      const commoditiesPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?categories=Commodities,Macro&lang=EN")
        .then((res) => (res.ok ? res.json() : null))
        .then((json: { Data?: Array<Record<string, unknown>> } | null) => {
          if (!json || !json.Data || json.Data.length === 0) {
            setProviderStatuses((prev) => ({ ...prev, "Global Market News": "empty" }));
            return [];
          }
          setProviderStatuses((prev) => ({ ...prev, "Global Market News": "ok" }));
          return json.Data!.slice(0, 50).map((item: Record<string, unknown>): FFCalendarEvent => ({
            title: item.title as string,
            country: "COMMODITY",
            date: new Date((item.published_on as number) * 1000).toISOString(),
            impact: "Medium",
            url: item.url as string,
            source: "commodities",
            body: item.body as string,
            imageurl: item.imageurl as string,
            provider: (item.source_info as { name?: string })?.name || "Global Market News",
          }));
        })
        .catch(() => {
          setProviderStatuses((prev) => ({ ...prev, "Global Market News": "error" }));
          return [] as FFCalendarEvent[];
        });

      const indicesPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?categories=Market,Business,Fiat&lang=EN")
        .then((res) => (res.ok ? res.json() : null))
        .then((json: { Data?: Array<Record<string, unknown>> } | null) => {
          if (!json || !json.Data || json.Data.length === 0) {
            setProviderStatuses((prev) => ({ ...prev, "Business News": "empty" }));
            return [];
          }
          setProviderStatuses((prev) => ({ ...prev, "Business News": "ok" }));
          return json.Data!.slice(0, 50).map((item: Record<string, unknown>): FFCalendarEvent => ({
            title: item.title as string,
            country: "INDEX",
            date: new Date((item.published_on as number) * 1000).toISOString(),
            impact: "Medium",
            url: item.url as string,
            source: "indices",
            body: item.body as string,
            imageurl: item.imageurl as string,
            provider: (item.source_info as { name?: string })?.name || "Business News",
          }));
        })
        .catch(() => {
          setProviderStatuses((prev) => ({ ...prev, "Business News": "error" }));
          return [] as FFCalendarEvent[];
        });

      const coindeskPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN&feeds=coindesk")
        .then((res) => (res.ok ? res.json() : null))
        .then((json: { Data?: Array<Record<string, unknown>> } | null) => {
          if (!json || !json.Data || json.Data.length === 0) {
            setProviderStatuses((prev) => ({ ...prev, CoinDesk: "empty" }));
            return [];
          }
          setProviderStatuses((prev) => ({ ...prev, CoinDesk: "ok" }));
          return json.Data!.slice(0, 50).map((item: Record<string, unknown>): FFCalendarEvent => ({
            title: item.title as string,
            country: "CRYPTO",
            date: new Date((item.published_on as number) * 1000).toISOString(),
            impact: "Normal",
            url: item.url as string,
            source: "crypto",
            body: item.body as string,
            imageurl: item.imageurl as string,
            provider: "CoinDesk",
          }));
        })
        .catch(() => {
          setProviderStatuses((prev) => ({ ...prev, CoinDesk: "error" }));
          return [] as FFCalendarEvent[];
        });

      const tradFiPromise = fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN&feeds=cryptoglobe,dailyhodl")
        .then((res) => (res.ok ? res.json() : null))
        .then((json: { Data?: Array<Record<string, unknown>> } | null) => {
          if (!json || !json.Data || json.Data.length === 0) {
            setProviderStatuses((prev) => ({ ...prev, "Market Feed": "empty" }));
            return [];
          }
          setProviderStatuses((prev) => ({ ...prev, "Market Feed": "ok" }));
          return json.Data!.slice(0, 50).map((item: Record<string, unknown>): FFCalendarEvent => ({
            title: item.title as string,
            country: "MARKETS",
            date: new Date((item.published_on as number) * 1000).toISOString(),
            impact: "Normal",
            url: item.url as string,
            source: "general",
            body: item.body as string,
            imageurl: item.imageurl as string,
            provider: (item.source_info as { name?: string })?.name || "Market Feed",
          }));
        })
        .catch(() => {
          setProviderStatuses((prev) => ({ ...prev, "Market Feed": "error" }));
          return [] as FFCalendarEvent[];
        });

      const yahooPromise = fetchRSS("https://finance.yahoo.com/news/rssindex", "general", "Yahoo Finance");
      const ftPromise = fetchRSS("https://www.ft.com/?format=rss", "general", "Financial Times");
      const seekingAlphaPromise = fetchRSS("https://seekingalpha.com/feed.xml", "general", "Seeking Alpha");
      const marketWatchPromise = fetchRSS("https://feeds.content.dowjones.io/public/rss/mw_topstories", "general", "MarketWatch");
      const theBlockPromise = fetchRSS("https://www.theblock.co/api/hub/rss/", "crypto", "The Block");
      const decryptPromise = fetchRSS("https://decrypt.co/feed", "crypto", "Decrypt");
      const fxstreetPromise = fetchRSS("https://www.fxstreet.com/rss", "forex", "FXStreet");
      const forexlivePromise = fetchRSS("https://www.forexlive.com/feed/news", "forex", "ForexLive");
      const cnbcTopPromise = fetchRSS("https://search.cnbc.com/rs/search/combinedcms/view.xml?profile=100003114", "general", "CNBC");
      const investingCryptoPromise = fetchRSS("https://www.investing.com/rss/news_301.rss", "crypto", "Investing.com");
      const wsjMarketsPromise = fetchRSS("https://feeds.a.dj.com/rss/RSSMarketsMain.xml", "general", "Wall Street Journal");
      const forbesPromise = fetchRSS("https://www.forbes.com/crypto-blockchain/feed/", "crypto", "Forbes");
      const dailyfxPromise = fetchRSS("https://www.dailyfx.com/feeds/forex-market-news", "forex", "DailyFX");
      const investingForexPromise = fetchRSS("https://www.investing.com/rss/news_1.rss", "forex", "Investing.com Forex");
      const financeMagnatesPromise = fetchRSS("https://www.financemagnates.com/feed/", "general", "Finance Magnates");
      const coinTelegraphPromise = fetchRSS("https://cointelegraph.com/rss", "crypto", "Cointelegraph");

      const [
        ffEvents,
        cryptoEvents,
        commoditiesEvents,
        indicesEvents,
        coindeskEvents,
        tradFiEvents,
        yahooEvents,
        ftEvents,
        seekingAlphaEvents,
        marketWatchEvents,
        theBlockEvents,
        decryptEvents,
        fxstreetEvents,
        forexliveEvents,
        cnbcTopEvents,
        investingCryptoEvents,
        wsjMarketsEvents,
        forbesEvents,
        dailyfxEvents,
        investingForexEvents,
        financeMagnatesEvents,
        coinTelegraphEvents,
      ] = await Promise.all([
        ffPromise,
        cryptoPromise,
        commoditiesPromise,
        indicesPromise,
        coindeskPromise,
        tradFiPromise,
        yahooPromise,
        ftPromise,
        seekingAlphaPromise,
        marketWatchPromise,
        theBlockPromise,
        decryptPromise,
        fxstreetPromise,
        forexlivePromise,
        cnbcTopPromise,
        investingCryptoPromise,
        wsjMarketsPromise,
        forbesPromise,
        dailyfxPromise,
        investingForexPromise,
        financeMagnatesPromise,
        coinTelegraphPromise,
      ]);

      const newsCombined = [
        ...cryptoEvents,
        ...commoditiesEvents,
        ...indicesEvents,
        ...coindeskEvents,
        ...tradFiEvents,
        ...yahooEvents,
        ...ftEvents,
        ...seekingAlphaEvents,
        ...marketWatchEvents,
        ...theBlockEvents,
        ...decryptEvents,
        ...fxstreetEvents,
        ...forexliveEvents,
        ...cnbcTopEvents,
        ...investingCryptoEvents,
        ...wsjMarketsEvents,
        ...forbesEvents,
        ...dailyfxEvents,
        ...investingForexEvents,
        ...financeMagnatesEvents,
        ...coinTelegraphEvents,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const slicedNews = newsCombined.slice(0, 1000);
      const combined = [...ffEvents, ...slicedNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const finalizedEvents: NewsEvent[] = combined.map((e, index) => {
        const combinedText = `${e.title} ${e.body || ""}`;
        const matchedTags = extractTagsFromText(combinedText);
        if (e.country && !matchedTags.includes(e.country)) {
          matchedTags.push(e.country);
        }
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
          matchedTags,
        };
      });

      setEvents(finalizedEvents);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNews();
    const interval = setInterval(() => void fetchNews(), 7 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  return { events, providerStatuses, loading, error };
}
