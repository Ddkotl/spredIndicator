import axios from "axios";
import { config } from "../config";

const BASE_URL = "https://api.bybit.com/v5/market/tickers";

export async function getSpotPrice(symbol: string = config.symbol): Promise<number> {
  const res = await axios.get(BASE_URL, {
    params: { category: "spot", symbol }
  });

  return parseFloat(res.data.result.list[0].lastPrice);
}

export async function getFuturesPrice(symbol: string = config.symbol): Promise<number> {
  const res = await axios.get(BASE_URL, {
    params: { category: "linear", symbol }
  });

  return parseFloat(res.data.result.list[0].lastPrice);
}