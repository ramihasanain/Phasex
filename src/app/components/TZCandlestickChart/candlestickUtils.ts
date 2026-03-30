export function seededRandom(seed: number) {
    const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
}

export function generateOHLCFromValue(value: number, index: number) {
    const volatility = Math.max(Math.abs(value) * 0.06, 0.5);

    const r1 = seededRandom(index * 13 + 7);
    const r2 = seededRandom(index * 17 + 11);
    const r3 = seededRandom(index * 23 + 3);
    const r4 = seededRandom(index * 31 + 19);

    const openOffset = (r1 - 0.5) * volatility * 1.2;
    const closeOffset = (r2 - 0.5) * volatility * 1.2;

    const open = value + openOffset;
    const close = value + closeOffset;

    const wickUp = volatility * (0.3 + r3 * 0.7);
    const wickDown = volatility * (0.3 + r4 * 0.7);
    const high = Math.max(open, close) + wickUp;
    const low = Math.min(open, close) - wickDown;

    return { open, high, low, close };
}
