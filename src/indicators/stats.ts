export function mean(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function std(arr: number[]) {
  const m = mean(arr);
  return Math.sqrt(mean(arr.map(x => (x - m) ** 2)));
}