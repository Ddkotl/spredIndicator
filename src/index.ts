import { getSpotSymbols, getFuturesSymbols } from "./api/symbols";
import { buildUniverse } from "./engine/universe";
import { connectBatch } from "./ws/batch";
import { onSpot, onFutures } from "./engine/scanner";

async function main() {
  console.log("Loading universe...");

  const spot = await getSpotSymbols();
  const fut = await getFuturesSymbols();

  const universe = buildUniverse(spot, fut).slice(0, 200);

  console.log("Pairs:", universe.length);

  const chunkSize = 20;
  const chunks: string[][] = [];

  for (let i = 0; i < universe.length; i += chunkSize) {
    chunks.push(universe.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    connectBatch("spot", chunk, onSpot);
    connectBatch("futures", chunk, onFutures);
  }
}

main();

// проанализируй весь проект и сделай 2 файла, в первом опиши и обьясни всюархитектуру пакеты и код а также логику приложения детально, во втором напиши недостатки и дальнейшие шаги по развитию
