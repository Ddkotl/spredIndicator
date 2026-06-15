import WebSocket from "ws";
import { PriceUpdate } from "../types/market";

const SPOT_WS = "wss://stream.bybit.com/v5/public/spot";

export function connectSpot(symbol: string, onPrice: (data: PriceUpdate) => void) {
  const ws = new WebSocket(SPOT_WS);

  ws.on("open", () => {
    ws.send(JSON.stringify({
      op: "subscribe",
      args: [`tickers.${symbol}`]
    }));
  });

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    if (msg?.data?.lastPrice) {
      onPrice({
        symbol,
        price: parseFloat(msg.data.lastPrice),
        ts: Date.now()
      });
    }
  });

  ws.on("error", console.error);
  ws.on("close", () => console.log("Spot WS closed"));

  return ws;
}