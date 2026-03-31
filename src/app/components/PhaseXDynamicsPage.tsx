import { AnimatePresence, motion } from "motion/react";
import { BreakingNews } from "./BreakingNews";
import { ScanLine } from "./PhaseX/UIComponents";
import { usePhaseXDynamicsPage } from "./PhaseXDynamicsPage/usePhaseXDynamicsPage";
import { PhaseXDynamicsHeader } from "./PhaseXDynamicsPage/PhaseXDynamicsHeader";
import { PhaseXDynamicsBanner } from "./PhaseXDynamicsPage/PhaseXDynamicsBanner";
import { PhaseXDynamicsMarket } from "./PhaseXDynamicsPage/PhaseXDynamicsMarket";
import { PhaseXDynamicsContent } from "./PhaseXDynamicsPage/PhaseXDynamicsContent";
import { PhaseXDynamicsModals } from "./PhaseXDynamicsPage/PhaseXDynamicsModals";
import type { PhaseXDynamicsPageProps } from "./PhaseXDynamicsPage/types";

export type { PhaseXDynamicsPageProps } from "./PhaseXDynamicsPage/types";

export function PhaseXDynamicsPage({ onBack, initialSymbol, initialTab }: PhaseXDynamicsPageProps) {
    const ctx = usePhaseXDynamicsPage(onBack, initialSymbol, initialTab);
    const { isRTL, accent, accentG, isNewsOpen, selectedSymbol, selectedCategory } = ctx;

    return (
        <div
            className="min-h-screen text-gray-300 overflow-hidden"
            dir={isRTL ? "rtl" : "ltr"}
            style={{ background: "#060a10", fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Ambient */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 50% 40% at 70% 20%, ${accentG}0.06) 0%, transparent 70%),
radial-gradient(ellipse 30% 50% at 20% 80%, ${accentG}0.03) 0%, transparent 60%)`,
                }}
            />
            <ScanLine color={accent} />
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Header */}
            <PhaseXDynamicsHeader ctx={ctx} />

            {/* Breaking News */}
            <AnimatePresence>
                {isNewsOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        style={{ overflow: "hidden" }}
                        className="px-5 w-full relative z-20 max-w-[1700px] mx-auto"
                    >
                        <BreakingNews
                            selectedSymbol={selectedSymbol}
                            selectedCategory={selectedCategory}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Body */}
            <div className="relative z-10 max-w-[1700px] mx-auto px-5 -mt-2">
                <PhaseXDynamicsBanner ctx={ctx} />
                <PhaseXDynamicsMarket ctx={ctx} />
            </div>

            {/* Content */}
            <PhaseXDynamicsContent ctx={ctx} />

            {/* Modals */}
            <PhaseXDynamicsModals ctx={ctx} />
        </div>
    );
}
