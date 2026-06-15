import { config } from "../config";
import { calculateBasis, calculateZScore } from "../indicators/spread";

const history: number[] = [];

let spot = 0;
let futures = 0;

export function onSpotPrice(price: number) {
  spot = price;
  compute();
}

export function onFuturesPrice(price: number) {
  futures = price;
  compute();
}

function compute() {
  if (!spot || !futures) return;

  const basis = calculateBasis(futures, spot);

  history.push(basis);
  if (history.length > config.historySize) history.shift();

  if (history.length < config.warmupSize) {
    console.log("warming up WS...");
    return;
  }

  const z = calculateZScore(history, basis);

  console.log({
    spot,
    futures,
    basis: basis.toFixed(6),
    z: z.toFixed(2),
  });

  if (z > config.zThreshold) {
    console.log("⚠️ futures rich");
  }

  if (z < -config.zThreshold) {
    console.log("⚠️ futures cheap");
  }
}
