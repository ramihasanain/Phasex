/**
 * Trade Sound Effects — MetaTrader-style audio feedback
 * Uses Web Audio API to generate sounds programmatically (no audio files needed).
 */

let _audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return _audioCtx;
}

/** Play a tone sequence */
function playTones(
  tones: { freq: number; duration: number; delay: number; type?: OscillatorType; gain?: number }[]
) {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    for (const t of tones) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = t.type || 'sine';
      osc.frequency.value = t.freq;
      gainNode.gain.setValueAtTime(t.gain ?? 0.15, now + t.delay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + t.delay + t.duration);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + t.delay);
      osc.stop(now + t.delay + t.duration);
    }
  } catch {
    // Audio not available — silently ignore
  }
}

/** ✅ Trade executed successfully — ascending "ding-dong" chime */
export function playTradeExecuted() {
  playTones([
    { freq: 880, duration: 0.15, delay: 0, type: 'sine', gain: 0.18 },
    { freq: 1175, duration: 0.15, delay: 0.12, type: 'sine', gain: 0.15 },
    { freq: 1397, duration: 0.25, delay: 0.24, type: 'sine', gain: 0.12 },
  ]);
}

/** ❌ Trade failed — descending "buzz" */
export function playTradeFailed() {
  playTones([
    { freq: 330, duration: 0.12, delay: 0, type: 'square', gain: 0.08 },
    { freq: 260, duration: 0.12, delay: 0.1, type: 'square', gain: 0.06 },
    { freq: 200, duration: 0.2, delay: 0.2, type: 'square', gain: 0.05 },
  ]);
}

/** 🔔 Position closed — short "cash register" ding */
export function playPositionClosed() {
  playTones([
    { freq: 1047, duration: 0.08, delay: 0, type: 'sine', gain: 0.2 },
    { freq: 1319, duration: 0.08, delay: 0.07, type: 'sine', gain: 0.18 },
    { freq: 1568, duration: 0.08, delay: 0.14, type: 'sine', gain: 0.15 },
    { freq: 2093, duration: 0.3, delay: 0.21, type: 'sine', gain: 0.12 },
  ]);
}

/** 🔗 Connected to MT5 — subtle confirmation */
export function playConnected() {
  playTones([
    { freq: 523, duration: 0.1, delay: 0, type: 'sine', gain: 0.1 },
    { freq: 659, duration: 0.1, delay: 0.08, type: 'sine', gain: 0.1 },
    { freq: 784, duration: 0.2, delay: 0.16, type: 'sine', gain: 0.08 },
  ]);
}
