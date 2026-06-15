export function buildUniverse(spot: Set<string>, fut: Set<string>) {
  const out: string[] = [];

  for (const s of spot) {
    if (fut.has(s)) out.push(s);
  }

  return out;
}
