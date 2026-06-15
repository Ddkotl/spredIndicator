import WebSocket from "ws";

const SPOT_WS = "wss://stream.bybit.com/v5/public/spot";
const FUT_WS = "wss://stream.bybit.com/v5/public/linear";

export function connectBatch(
  type: "spot" | "futures",
  symbols: string[],
  onPrice: (symbol: string, price: number) => void,
) {
  const ws = new WebSocket(type === "spot" ? SPOT_WS : FUT_WS);

  ws.on("open", () => {
    ws.send(
      JSON.stringify({
        op: "subscribe",
        args: symbols.map((s) => `tickers.${s}`),
      }),
    );
  });

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    const topic = msg?.topic;
    const price = msg?.data?.lastPrice;

    if (!topic || !price) return;

    const symbol = topic.split(".")[1];

    onPrice(symbol, parseFloat(price));
  });

  ws.on("error", console.error);
  ws.on("close", (code, reason) => {
  console.log(`${type} WS closed`, {
    code,
    reason: reason?.toString()
  });
});

  return ws;
}
