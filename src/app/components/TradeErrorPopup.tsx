"use client";
import { TradeErrorPopupInner } from "./TradeErrorPopup/TradeErrorPopupInner";
import type { TradeErrorPopupProps } from "./TradeErrorPopup/types";

export type { TradeErrorInfo } from "./TradeErrorPopup/types";

export function TradeErrorPopup(props: TradeErrorPopupProps) {
    return <TradeErrorPopupInner {...props} />;
}

export default TradeErrorPopup;
