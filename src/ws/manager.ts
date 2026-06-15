import { PriceUpdate } from "../types/market";
import { calculateBasis, calculateZScore } from "../indicators/spread";
import { config } from "../config";

const history: number[] = [];

let spot = 0;
let futures = 0;

export function startSpreadEngine() {
  return function onPrice(update: PriceUpdate) {

    if (update.symbol !== config.symbol) return;

    // обновляем state
    if (update.price > 1000) {
      // heuristic: futures usually slightly more noisy, but ok
    }

    if (!spot) spot = update.price;
    else futures = update.price; // упрощение (разнесём ниже)

    // ВАЖНО: мы будем передавать отдельно spot/futures из разных WS
  };
}