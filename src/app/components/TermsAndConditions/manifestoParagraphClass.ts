/** Bold styling for manifesto pull-quote lines (matches original TermsAndConditions behavior). */
export function manifestoParagraphClass(p: string): string {
    const bold =
        p.startsWith("But ") ||
        p.startsWith("They are systems") ||
        p.startsWith("The problem") ||
        p.startsWith("لكن") ||
        p.startsWith("إنه نظام") ||
        p.startsWith("المشكلة") ||
        p.startsWith("بل") ||
        p.startsWith("Not ") ||
        p.startsWith("PHASEX") ||
        p.startsWith("Ancak ") ||
        p.startsWith("Onlar ") ||
        p.startsWith("Sorun ") ||
        p.startsWith("Но ") ||
        p.startsWith("Это ") ||
        p.startsWith("Проблема ") ||
        p.startsWith("Не ");
    return bold ? "text-white font-bold" : "text-gray-400";
}
