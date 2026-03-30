export function isArabic(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
}

export function getErrorTitle(message: string): string {
    const m = message.toLowerCase();
    if (m.includes("trade is disabled")) return "⛔ Trading Disabled";
    if (m.includes("not enough money") || m.includes("insufficient")) return "💰 Insufficient Funds";
    if (m.includes("invalid volume") || m.includes("volume")) return "📊 Invalid Volume";
    if (m.includes("market closed") || m.includes("market is closed")) return "🕐 Market Closed";
    if (m.includes("invalid price")) return "💹 Invalid Price";
    if (m.includes("off quotes")) return "📶 Off Quotes";
    if (m.includes("timeout") || m.includes("timed out")) return "⏱️ Connection Timeout";
    if (m.includes("session expired")) return "🔑 Session Expired";
    if (m.includes("not connected")) return "🔌 Not Connected";
    if (m.includes("invalid stops") || m.includes("invalid sl") || m.includes("invalid tp"))
        return "🎯 Invalid Stop/Target";
    if (m.includes("too many")) return "⚠️ Rate Limit";
    if (m.includes("invalid symbol") || m.includes("symbol does not exist")) return "❌ Invalid Symbol";
    return "❌ Trade Rejected";
}

export function getErrorIcon(message: string): string {
    const m = message.toLowerCase();
    if (m.includes("trade is disabled")) return "🚫";
    if (m.includes("not enough money") || m.includes("insufficient")) return "💸";
    if (m.includes("invalid volume")) return "📉";
    if (m.includes("market closed")) return "🔒";
    if (m.includes("timeout")) return "⏳";
    if (m.includes("session expired")) return "🔐";
    if (m.includes("not connected")) return "📡";
    if (m.includes("invalid symbol") || m.includes("symbol does not exist")) return "🔍";
    return "⚠️";
}

export function getErrorColor(message: string): string {
    const m = message.toLowerCase();
    if (m.includes("trade is disabled") || m.includes("market closed")) return "#ff4466";
    if (m.includes("not enough money") || m.includes("insufficient")) return "#ffaa33";
    if (m.includes("timeout") || m.includes("session")) return "#ff8844";
    if (m.includes("invalid symbol") || m.includes("symbol does not exist")) return "#ff6688";
    return "#ff5555";
}

export function sanitizeTradeErrorText(text: string): string {
    return text
        .replace(/MetaApi[i]?/gi, "Broker")
        .replace(/metaapi/gi, "Broker")
        .replace(/meta-api/gi, "Broker");
}
