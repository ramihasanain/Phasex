export interface TradeErrorInfo {
    title?: string;
    message: string;
    symbol?: string;
    action?: string;
    details?: string[];
}

export interface TradeErrorPopupProps {
    error: TradeErrorInfo | null;
    onClose: () => void;
}
