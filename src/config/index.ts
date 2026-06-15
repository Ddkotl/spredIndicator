export const config = {
  symbols: [], // заполняется динамически

  historySize: 100, // FIX: увеличено (шум снижаем)
  warmupSize: 50,

  zThreshold: 2.5, // FIX: более строгий threshold
  minBasis: 0.001, // FIX: фильтр шума (0.1%)

  cooldownMs: 15000, // FIX: защита от спама

  emaAlpha: 0.2, // FIX: smoothing
};
