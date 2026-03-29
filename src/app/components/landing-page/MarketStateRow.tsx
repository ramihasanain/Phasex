import type { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { MarketStateItem } from "./buildMarketStates";
import type { LandingT } from "./landingTypes";
import { StateReadMoreDirection } from "./state-read-more/StateReadMoreDirection";
import { StateReadMoreDisplacement } from "./state-read-more/StateReadMoreDisplacement";
import { StateReadMoreEnvelope } from "./state-read-more/StateReadMoreEnvelope";
import { StateReadMoreOscillation } from "./state-read-more/StateReadMoreOscillation";
import { StateReadMorePhase } from "./state-read-more/StateReadMorePhase";
import { StateReadMoreReference } from "./state-read-more/StateReadMoreReference";

interface MarketStateRowProps {
  state: MarketStateItem;
  index: number;
  expandedState: number | null;
  setExpandedState: Dispatch<SetStateAction<number | null>>;
  t: LandingT;
}

export function MarketStateRow({ state, index: i, expandedState, setExpandedState, t }: MarketStateRowProps) {
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(14,20,33,0.9) 0%, rgba(8,12,22,0.95) 100%)",
          border: `1px solid ${state.color}18`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex flex-col md:flex-row">
          <div
            className="md:w-1/3 p-4 md:p-6 flex items-center justify-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${state.color}15, ${state.color}05)` }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 50%, ${state.color}10 0%, transparent 70%)` }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="text-center relative z-10">
              <div
                className="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-3 mx-auto"
                style={{
                  background: `${state.color}15`,
                  border: `1px solid ${state.color}30`,
                  boxShadow: `0 0 25px ${state.color}15`,
                }}
              >
                <Icon className="w-7 h-7 md:w-10 md:h-10" style={{ color: state.color }} />
              </div>
              <h3 className="text-lg font-black text-white mb-1">{state.name}</h3>
              <p className="text-xs text-gray-500">{state.nameAr}</p>
            </div>
          </div>
          <div className="md:w-2/3 p-4 md:p-6">
            <p className="text-base font-bold mb-3" style={{ color: state.color }}>{state.question}</p>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{state.description}</p>
            <button
              type="button"
              onClick={() => setExpandedState(expandedState === i ? null : i)}
              className="text-xs font-bold flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors group cursor-pointer"
            >
              {t("readMore")}
              <motion.span animate={{ rotate: expandedState === i ? 90 : 0 }} transition={{ duration: 0.3 }}>
                <ArrowRight className="w-3 h-3" />
              </motion.span>
            </button>

            <AnimatePresence>{i === 0 && expandedState === 0 && <StateReadMorePhase state={state} t={t} />}</AnimatePresence>
            <AnimatePresence>{i === 1 && expandedState === 1 && <StateReadMoreDisplacement state={state} t={t} />}</AnimatePresence>
            <AnimatePresence>{i === 2 && expandedState === 2 && <StateReadMoreReference state={state} t={t} />}</AnimatePresence>
            <AnimatePresence>{i === 3 && expandedState === 3 && <StateReadMoreOscillation state={state} t={t} />}</AnimatePresence>
            <AnimatePresence>{i === 4 && expandedState === 4 && <StateReadMoreDirection state={state} t={t} />}</AnimatePresence>
            <AnimatePresence>{i === 5 && expandedState === 5 && <StateReadMoreEnvelope state={state} t={t} />}</AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
