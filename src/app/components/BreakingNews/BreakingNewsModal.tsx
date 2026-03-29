"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import type { NewsEvent } from "../phase-x/types";
import { BreakingNewsModalEventList } from "./BreakingNewsModal/BreakingNewsModalEventList";
import { BreakingNewsModalHeader } from "./BreakingNewsModal/BreakingNewsModalHeader";
import { BreakingNewsModalToolbar } from "./BreakingNewsModal/BreakingNewsModalToolbar";

export interface BreakingNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: NewsEvent[];
    selectedSymbol: string;
    selectedCategory?: string;
    providerStatuses: Record<string, "loading" | "ok" | "error" | "empty">;
}

export function BreakingNewsModal({
    isOpen,
    onClose,
    events,
    selectedSymbol: _selectedSymbol,
    selectedCategory,
    providerStatuses,
}: BreakingNewsModalProps) {
    const { language, t } = useLanguage();
    const isRTL = language === "ar";

    const [providerFilter, setProviderFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(20);

    const allProviders = useMemo(() => Object.keys(providerStatuses).sort(), [providerStatuses]);

    const uniqueTags = useMemo(() => {
        const tags = new Set<string>();
        events.forEach((e) => {
            if (e.matchedTags) {
                e.matchedTags.forEach((tag) => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    }, [events]);

    useEffect(() => {
        if (!isOpen) return;
        if (selectedCategory && selectedCategory !== "All") {
            setSearchQuery(selectedCategory.toUpperCase());
        } else {
            setSearchQuery("");
        }
    }, [selectedCategory, isOpen]);

    const filteredEvents = useMemo(() => {
        let results = events;
        if (providerFilter !== "ALL") {
            results = results.filter((e) => e.provider === providerFilter);
        }
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            results = results.filter((e) => {
                const searchStr = `${e.title} ${e.body || ""} ${e.matchedTags.join(" ")} ${e.country || ""} ${e.provider || ""}`.toLowerCase();
                return searchStr.includes(query);
            });
        }
        return results;
    }, [events, providerFilter, searchQuery]);

    useEffect(() => {
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
                    <BreakingNewsModalHeader title={t("advancedNewsCenter")} subtitle={t("smartDetection")} onClose={onClose} />

                    <BreakingNewsModalToolbar
                        isRTL={isRTL}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchPlaceholder={t("searchNews")}
                        uniqueTags={uniqueTags}
                        allProviders={allProviders}
                        providerFilter={providerFilter}
                        setProviderFilter={setProviderFilter}
                        providerStatuses={providerStatuses}
                        sourceFilterLabel={t("sourceFilter")}
                    />

                    <BreakingNewsModalEventList
                        filteredEvents={filteredEvents}
                        visibleCount={visibleCount}
                        setVisibleCount={setVisibleCount}
                        isRTL={isRTL}
                        setSearchQuery={setSearchQuery}
                        noNewsLabel={t("noNewsMatched")}
                        loadMoreLabel={isRTL ? "عرض المزيد" : "Load More"}
                        t={t}
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
