function header(patternName, sampleCount) {
  return `
// Auto-generated using ${sampleCount} labeled samples
// Pattern: ${patternName}
`;
}

// ================= HAMMER =================
function generateHammerCode(params, meta) {
  const { mainWickMultiplier, oppositeWickRatio } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isHammer(open, close, low, high) =>
    bodySize  = math.abs(close - open)
    lowerWick = math.min(open, close) - low
    upperWick = high - math.max(open, close)

    (lowerWick >= ${mainWickMultiplier / 1} * bodySize) and (upperWick <= ${oppositeWickRatio / 1} * bodySize)
`.trim();
}

// ================= INVERTED HAMMER =================
function generateInvertedHammerCode(params, meta) {
  const { mainWickMultiplier, oppositeWickRatio } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isInvertedHammer(open, close, low, high) =>
    bodySize  = math.abs(close - open)
    lowerWick = math.min(open, close) - low
    upperWick = high - math.max(open, close)

    (upperWick >= ${oppositeWickRatio / 1} * bodySize) and (lowerWick <= ${mainWickMultiplier / 1} * bodySize)
`.trim();
}

// ================= BULLISH PIN BAR =================
function generateBullishPinBarCode(params, meta) {
  const { mainWickMultiplier, oppositeWickRatio } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isBullishPinBar(open, close, low, high) =>
    bodySize  = math.abs(close - open)
    lowerWick = math.min(open, close) - low
    upperWick = high - math.max(open, close)

    (lowerWick >= ${mainWickMultiplier / 1} * bodySize) and (upperWick <= ${oppositeWickRatio / 1} * bodySize)
`.trim();
}

// ================= BEARISH PIN BAR =================
function generateBearishPinBarCode(params, meta) {
  const { mainWickMultiplier, oppositeWickRatio } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isBearishPinBar(open, close, low, high) =>
    bodySize  = math.abs(close - open)
    lowerWick = math.min(open, close) - low
    upperWick = high - math.max(open, close)

    (upperWick >= ${oppositeWickRatio / 1} * bodySize) and (lowerWick <= ${mainWickMultiplier / 1} * bodySize)
`.trim();
}

// ================= SHAVEN HEAD =================
function generateShavenHeadCode(params, meta) {
  const { mainWickMultiplier, oppositeWickRatio } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isShavenHead(open, close, low, high) =>
    bodySize  = math.abs(close - open)
    lowerWick = math.min(open, close) - low
    upperWick = high - math.max(open, close)

    (upperWick <= ${oppositeWickRatio / 1} * bodySize) and (lowerWick >= ${mainWickMultiplier / 1} * bodySize)
`.trim();
}

// ================= SHAVEN BOTTOM =================
function generateShavenBottomCode(params, meta) {
  const { mainWickMultiplier, oppositeWickRatio } = params;

  return `
${header(meta.patternName, meta.sampleCount)}
isShavenBottom(open, close, low, high) =>
    bodySize  = math.abs(close - open)
    lowerWick = math.min(open, close) - low
    upperWick = high - math.max(open, close)

    (lowerWick <= ${mainWickMultiplier / 1} * bodySize) and (upperWick >= ${oppositeWickRatio / 1} * bodySize)
`.trim();
}

module.exports = {
  generateHammerCode,
  generateInvertedHammerCode,
  generateBullishPinBarCode,
  generateBearishPinBarCode,
  generateShavenHeadCode,
  generateShavenBottomCode,
};
