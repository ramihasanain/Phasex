import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, ChevronDown, Check } from "lucide-react";
import type { Asset } from "../MarketList";
import { useThemeTokens } from "../../hooks/useThemeTokens";
import type { PhaseCandle, PhaseStateDataMap } from "../TradingDashboard/types";

export interface Indicator {
  id: string;
  name: string;
  nameEn: string;
  type: "line" | "area" | "bar" | "tz";
  color: string;
  icon: string;
  locked?: boolean;
  lockType?: "coming_soon" | "upgrade";
}

export interface IndicatorChartProps {
  currency: Asset | null;
  indicator: Indicator | null;
  data: any[];
  timeframe: number;
  onTimeframeChange: (timeframe: number) => void;
  mtfEnabled?: boolean;
  mtfSmallTimeframe?: number;
  mtfLargeTimeframe?: number;
  onMtfEnabledChange?: (enabled: boolean) => void;
  onMtfSmallTimeframeChange?: (timeframe: number) => void;
  onMtfLargeTimeframeChange?: (timeframe: number) => void;
  phaseStateData?: PhaseStateDataMap;
  generateCandlesFromReal?: (real: PhaseCandle, count?: number) => any[];
  onLiveChartData?: (data: any[]) => void;
  renderTradeButtons?: () => React.ReactNode;
  accessToken?: string | null;
  mt5Connected?: boolean;
  executeTrade?: (symbol: string, action: string, volume: number, sl?: number, tp?: number, comment?: string) => Promise<any>;
  bulkExecuteTrades?: (trades: Array<{ symbol: string; action: string; volume: number; sl?: number; tp?: number; comment?: string }>) => Promise<{ orders: any[]; errors: any[] }>;
  mt5Positions?: any[];
  addTradeToHistory?: (entry: any) => void;
  serverTradeHistory?: any[];
  autoTrades?: any[];
  autoTradeWorker?: any;
  autoTradeSubscribe?: (trades: Array<{ symbol: string; main_tf: string; sub_tf: string; window_size: number; direction: string; lot_size: number; sl?: number; comment: string }>) => Promise<{ subscribed: any[]; errors: any[] }>;
  autoTradeUnsubscribe?: (comments: string[]) => Promise<void>;
  onOpenDynamics?: (symbol: string, tab: string) => void;
}

export const phaseMainTFs: Record<string, string[]> = {
  H1: ["M5", "M10", "M15"],
  H2: ["M5", "M10", "M15", "M20", "M30"],
  H4: ["M5", "M10", "M15", "M20", "M30", "H1"],
  H6: ["M5", "M10", "M15", "M20", "M30", "H1"],
  H8: ["M10", "M15", "M20", "M30", "H1", "H2"],
  H12: ["M15", "M20", "M30", "H1", "H2", "H3"],
  D1: ["M30", "H1", "H2", "H3", "H4", "H6"],
};

const mainTFKeys = Object.keys(phaseMainTFs);

export function PhaseTimeframeSelector({
  mainTF,
  subTF,
  onMainTFChange,
  onSubTFChange,
  color,
  isRTL,
  compact,
}: {
  mainTF: string;
  subTF: string;
  onMainTFChange: (tf: string) => void;
  onSubTFChange: (tf: string) => void;
  color: string;
  isRTL: boolean;
  compact?: boolean;
}) {
  const subs = phaseMainTFs[mainTF] || [];

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#475569" }} />

      <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
        {mainTFKeys.map((tf) => {
          const active = mainTF === tf;
          return (
            <motion.button
              key={tf}
              onClick={() => onMainTFChange(tf)}
              whileTap={{ scale: 0.95 }}
              className={`${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"} rounded - md font - bold cursor - pointer transition - all`}
              style={{
                background: active ? `${color} 18` : "transparent",
                border: active ? `1px solid ${color} 35` : "1px solid transparent",
                color: active ? color : "#64748b",
              }}
            >
              {tf}
            </motion.button>
          );
        })}
      </div>

      <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.08)" }} />

      <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
        <AnimatePresence mode="popLayout">
          {subs.map((tf) => {
            const active = subTF === tf;
            return (
              <motion.button
                key={tf}
                onClick={() => onSubTFChange(tf)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.95 }}
                className={`${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"} rounded - md font - bold cursor - pointer transition - all`}
                style={{
                  background: active ? "#6366f115" : "transparent",
                  border: active ? "1px solid #6366f135" : "1px solid transparent",
                  color: active ? "#818cf8" : "#475569",
                }}
              >
                {tf}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <span
        className={`${compact ? "text-[9px]" : "text-[10px]"} font - mono px - 2 py - 0.5 rounded`}
        style={{ color: "#64748b", background: "rgba(255,255,255,0.02)" }}
      >
        {mainTF} → {subTF}
      </span>
    </div>
  );
}

interface AnimatedStatProps {
  label: string;
  value: string | number;
  color: string;
  isDirection?: boolean;
}

export const AnimatedStat = ({ label, value, color, isDirection }: AnimatedStatProps) => {
  const tk = useThemeTokens();
  const [flash, setFlash] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 500);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <motion.div
      className="flex-col justify-center items-center text-center px-1.5 py-1.5 md:px-3 rounded-lg flex relative"
      animate={{
        background: flash ? `${color} 30` : `${color}08`,
        borderColor: flash ? `${color} 60` : `${color} 12`,
        boxShadow: flash
          ? `0 0 15px ${color} 50, inset 0 0 10px ${color} 20`
          : isDirection
            ? `0 0 8px ${color} 20, inset 0 0 5px ${color} 10`
            : "none",
        scale: flash && isDirection ? 1.05 : 1,
      }}
      transition={{ duration: 0.3 }}
      style={{ border: `1px solid ${color} 12`, minWidth: 0 }}
    >
      <div className="text-[9px] font-medium truncate w-full" style={{ color: tk.isDark ? "#64748b" : "#475569" }}>
        {label}
      </div>
      <motion.div
        className={`font - bold tabular - nums truncate w - full ${isDirection ? "text-[14px] tracking-widest" : "text-[12px]"} `}
        style={{
          color,
          textShadow: isDirection ? `0 0 10px ${color} 80` : "none",
        }}
        animate={isDirection && !flash ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={isDirection && !flash ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        {value}
      </motion.div>
    </motion.div>
  );
};

export function CandleLimitSelector({
  value,
  onChange,
  isRTL,
  tk,
  color,
  compact = false,
}: {
  value: number | "Auto";
  onChange: (val: string) => void;
  isRTL: boolean;
  tk: any;
  color: string;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (v: string) => {
    onChange(v);
    setIsOpen(false);
  };
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customVal, 10);
    if (!isNaN(num) && num > 0) {
      handleSelect(num.toString());
    }
  };

  const presets: (number | "Auto")[] = ["Auto", 50, 100, 200, 500];

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded cursor-pointer transition-colors ${compact ? "px-2 py-0.5 mr-1 md:mr-2" : "px-3 py-1 rounded-lg mr-2 md:mr-4 shadow-inner"}`}
        style={{
          background: compact ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.2)",
          border: compact ? "1px solid rgba(255,255,255,0.05)" : `1px solid ${tk.border}`,
        }}
      >
        <span className={`text-slate-400 font-bold uppercase ${compact ? "text-[10px]" : "text-[11px]"}`}>{isRTL ? "الشموع" : "Candles"}:</span>
        <span className={`font-bold font-mono ${compact ? "text-[11px]" : "text-xs md:text-sm"}`} style={{ color: value === "Auto" ? "#e2e8f0" : color }}>
          {value}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 p-2 rounded-xl backdrop-blur-xl shadow-2xl overflow-hidden"
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              border: `1px solid ${tk.border}`,
              ...(isRTL ? { left: 0 } : { right: 0 }),
            }}
          >
            <div className="flex flex-col gap-1 w-32">
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 mb-1">{isRTL ? "إعدادات مسبقة" : "Presets"}</div>
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelect(p.toString())}
                  className="text-left px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-between"
                  style={{
                    background: value === p ? `${color}15` : "transparent",
                    color: value === p ? color : "#e2e8f0",
                  }}
                >
                  {p}
                  {value === p && <Check className="w-3 h-3" />}
                </button>
              ))}

              <div className="w-full h-px my-1" style={{ background: tk.border }} />

              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">{isRTL ? "مخصص" : "Custom"}</div>
              <form onSubmit={handleCustomSubmit} className="flex gap-1 px-1 mt-1">
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={customVal}
                  onChange={(e) => setCustomVal(e.target.value)}
                  placeholder={typeof value === "number" && !presets.includes(value) ? value.toString() : "..."}
                  className="w-full bg-slate-800/50 rounded flex-1 px-2 py-1.5 text-xs text-white font-mono outline-none focus:ring-1 focus:ring-opacity-50"
                  style={{ border: `1px solid ${tk.border}` } as React.CSSProperties}
                />
                <button type="submit" className="px-2 rounded bg-slate-700/50 hover:bg-slate-700 text-white transition-colors">
                  <Check className="w-3 h-3" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
