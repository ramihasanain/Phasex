"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { BreakingNewsModal } from "./BreakingNews/BreakingNewsModal";
import { BreakingNewsEmpty } from "./BreakingNews/BreakingNewsEmpty";
import { BreakingNewsExpandButton } from "./BreakingNews/BreakingNewsExpandButton";
import { BreakingNewsLiveBadge } from "./BreakingNews/BreakingNewsLiveBadge";
import { BreakingNewsLoading } from "./BreakingNews/BreakingNewsLoading";
import { BreakingNewsTickerPanel } from "./BreakingNews/BreakingNewsTickerPanel";
import { useBreakingNewsFeed } from "./BreakingNews/useBreakingNewsFeed";

export type { FFCalendarEvent } from "./BreakingNews/types";
export { BreakingNewsModal } from "./BreakingNews/BreakingNewsModal";
export type { BreakingNewsModalProps } from "./BreakingNews/BreakingNewsModal";
export { translateTitle } from "./BreakingNews/translateTitle";

interface BreakingNewsProps {
    selectedSymbol: string;
    selectedCategory?: string;
}

export function BreakingNews({ selectedSymbol, selectedCategory }: BreakingNewsProps) {
    const { language, t } = useLanguage();
    const isRTL = language === "ar";
    const { events, providerStatuses, loading, error } = useBreakingNewsFeed();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredEvents = useMemo(() => {
        if (!events.length) return [];

        let pertinentEvents = events;
        if (selectedCategory === "Crypto") {
            pertinentEvents = events.filter((e) => e.source === "crypto");
        } else if (selectedCategory === "Commodities") {
            pertinentEvents = events.filter((e) => e.source === "commodities" || (e.source === "forex" && e.impact === "High"));
        } else if (selectedCategory === "Indices") {
            pertinentEvents = events.filter((e) => e.source === "indices" || (e.source === "forex" && e.impact === "High"));
        } else if (selectedCategory !== "All") {
            pertinentEvents = events.filter((e) => e.source === "forex");
        }

        return pertinentEvents.sort((a, b) => {
            const impactScore = { High: 3, Medium: 2, Low: 1, Non: 0 } as Record<string, number>;
            return (impactScore[b.impact] || 0) - (impactScore[a.impact] || 0);
        });
    }, [events, selectedCategory]);

    useEffect(() => {
        if (filteredEvents.length > 0) {
            const timer = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % filteredEvents.length);
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [filteredEvents]);

    if (loading && !events.length) {
        return <BreakingNewsLoading label={t("loadingNews")} />;
    }

    if (error || filteredEvents.length === 0) {
        return <BreakingNewsEmpty label={t("noEventsFor")} />;
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
            <BreakingNewsLiveBadge isRTL={isRTL} label={t("liveNews")} />

            <BreakingNewsTickerPanel
                activeIndex={activeIndex}
                isRTL={isRTL}
                currentEvent={currentEvent}
                impactColorStr={impactColorStr}
                impactBgStr={impactBgStr}
                impactLabel={impactLabel}
            />

            <BreakingNewsExpandButton isRTL={isRTL} label={t("viewAll")} onClick={() => setIsModalOpen(true)} />

            <BreakingNewsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                events={events}
                selectedSymbol={selectedSymbol}
                selectedCategory={selectedCategory}
                providerStatuses={providerStatuses}
            />
        </div>
    );
}
