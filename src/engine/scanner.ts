import { config } from "../config";
import { mean, std } from "../indicators/stats";

type State = {
  spot: number;
  futures: number;
  history: number[];
  ema: number;
};

const state: Record<string, State> = {};
const lastSignal: Record<string, number> = {};

function init(symbol: string) {
  if (!state[symbol]) {
    state[symbol] = {
      spot: 0,
      futures: 0,
      history: [],
      ema: 0,
    };
  }
}

export function onSpot(symbol: string, price: number) {
  init(symbol);
  state[symbol].spot = price;
  compute(symbol);
}
export function onFutures(symbol: string, price: number) {
  init(symbol);
  state[symbol].futures = price;
  compute(symbol);
}

function compute(symbol: string) {
  const s = state[symbol];

  if (!s.spot || !s.futures) return;

  // -----------------------------
  // BASE SPREAD
  // -----------------------------
  const basis = (s.futures - s.spot) / s.spot;

  // -----------------------------
  // FIX 2 — MIN BASIS FILTER
  // -----------------------------
  if (Math.abs(basis) < config.minBasis) return;

  // -----------------------------
  // FIX 3 — EMA SMOOTHING
  // -----------------------------
  if (!s.ema) {
    s.ema = basis;
  } else {
    s.ema = config.emaAlpha * basis + (1 - config.emaAlpha) * s.ema;
  }

  // -----------------------------
  // history update
  // -----------------------------
  s.history.push(s.ema);
  if (s.history.length > config.historySize) {
    s.history.shift();
  }

  if (s.history.length < config.warmupSize) return;

  // -----------------------------
  // z-score
  // -----------------------------
  const z = (s.ema - mean(s.history)) / std(s.history);

  // -----------------------------
  // FIX 4 — COOLDOWN (ANTI SPAM)
  // -----------------------------
  const now = Date.now();

  if (lastSignal[symbol] && now - lastSignal[symbol] < config.cooldownMs) {
    return;
  }

  // -----------------------------
  // SIGNAL LOGIC
  // -----------------------------
  if (Math.abs(z) > config.zThreshold) {
    lastSignal[symbol] = now;

    console.log("🚨 SIGNAL", {
      symbol,
      spot: s.spot,
      futures: s.futures,
      basis: basis.toFixed(6),
      ema: s.ema.toFixed(6),
      z: z.toFixed(2),
    });
  }
}
