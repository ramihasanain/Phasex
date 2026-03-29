export const TOPUP_WALLET_ADDRESS = "TQwFCKK5JjZACHdE888zG5iUx8wQ2RtnAV";

export interface TokenTopUpPackage {
    tokens: number;
    price: number;
    name: string;
    color: string;
    popular?: boolean;
}

export const TOKEN_TOP_UP_PACKAGES: TokenTopUpPackage[] = [
    { tokens: 250, price: 10, name: "Starter", color: "#64748b" },
    { tokens: 700, price: 20, name: "Pro", color: "#00c3ff", popular: true },
    { tokens: 2000, price: 50, name: "Max", color: "#a855f7" },
];

export function priceForPackage(selected: 250 | 700 | 2000): number {
    if (selected === 250) return 10;
    if (selected === 700) return 20;
    return 50;
}
