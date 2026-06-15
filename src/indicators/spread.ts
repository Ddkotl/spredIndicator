import { mean, std } from "./stats";

export function calculateBasis(futures: number, spot: number): number {
  return (futures - spot) / spot;
}

export function calculateZScore(history: number[], current: number) {
  const m = mean(history);
  const s = std(history);

  if (s === 0) return 0;

  return (current - m) / s;
}