import axios from "axios";

const BASE = "https://api.bybit.com/v5/market/instruments-info";

export async function getSpotSymbols(): Promise<Set<string>> {
  const res = await axios.get(BASE, {
    params: { category: "spot" }
  });

  return new Set(res.data.result.list.map((x: any) => x.symbol));
}

export async function getFuturesSymbols(): Promise<Set<string>> {
  const res = await axios.get(BASE, {
    params: { category: "linear" }
  });

  return new Set(res.data.result.list.map((x: any) => x.symbol));
}