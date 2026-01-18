function header(name, n) {
  return `
// Auto-generated using ${n} labeled pairs
// Pattern: ${name}
`;
}

// ================= BULLISH ENGULFING =================

function generateBullishEngulfingCode(params, meta) {
  const { bodyMultiplier = 1.0 } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isBullishEngulfing(open, close, low, high) =>
    (open[1] > close[1] and
     close > open and
     close >= open[1] and
     (open <= close[1]) and
     close - open > ${bodyMultiplier} * (open[1] - close[1]))
`.trim();
}

// ================= BEARISH ENGULFING =================

function generateBearishEngulfingCode(params, meta) {
  const { bodyMultiplier = 1.0 } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isBearishEngulfing(open, close, low, high) =>
    (close[1] > open[1] and
     open > close and
     (open >= close[1]) and
     open[1] >= close and
     open - close > ${bodyMultiplier} * (close[1] - open[1]))
`.trim();
}

// ================= BULLISH HARAMI =================

function generateBullishHaramiCode(params, meta) {
  const { tolerance = 5.0 } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isBullishHarami(open, close, low, high) =>
    (open[1] > close[1] and
     close > open and
     close <= open[1] and
     (open <= close[1] + ${tolerance} and open >= close[1]) and
     close - open < open[1] - close[1])
`.trim();
}

// ================= BEARISH HARAMI =================

function generateBearishHaramiCode(params, meta) {
  const { tolerance = 5.0 } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isBearishHarami(open, close, low, high) =>
    (close[1] > open[1] and
     open > close and
     (open <= close[1] and open >= close[1] - ${tolerance}) and
     open[1] <= close and
     open - close < close[1] - open[1])
`.trim();
}

// ================= PIERCING PATTERN =================

function generatePiercingPatternCode(params, meta) {
  const { midpointMultiplier = 0.5, gap = 0.5 } = params;

  const midpointMultiplier1 = 0.5;
  const gap1 = 0.5;

  return `
${header(meta.patternName, meta.sampleCount)}
isPiercingPattern(open, close, low, high) =>
    (open[1] > close[1] and
     close > open and
     close > (close[1] + (${midpointMultiplier1} * (open[1] - close[1]))) and
     open < close[1] - ${gap1} and
     close < open[1])
`.trim();
}

// ================= DARK CLOUD COVER =================

function generateDarkCloudCoverCode(params, meta) {
  const { midpointMultiplier = 0.5, gap = 0.5 } = params;

  const midpointMultiplier1 = 0.5;
  const gap1 = 0.5;

  return `
${header(meta.patternName, meta.sampleCount)}
isDarkCloudCover(open, close, low, high) =>
    (close[1] > open[1] and
     open > close and
     close < (open[1] + (${midpointMultiplier1} * (close[1] - open[1]))) and
     close > open[1] and
     open > close[1] + ${gap1})
`.trim();
}

module.exports = {
  generateBullishEngulfingCode,
  generateBearishEngulfingCode,
  generateBullishHaramiCode,
  generateBearishHaramiCode,
  generatePiercingPatternCode,
  generateDarkCloudCoverCode,
};
