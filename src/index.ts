import { connectSpot } from "./ws/spot";
import { connectFutures } from "./ws/futures";
import { onSpotPrice, onFuturesPrice } from "./engine/streamEngine";
import { config } from "./config";

console.log("Starting WS spread engine...");

connectSpot(config.symbol, (data) => {
  onSpotPrice(data.price);
});

connectFutures(config.symbol, (data) => {
  onFuturesPrice(data.price);
});
