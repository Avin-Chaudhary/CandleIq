const SINGLE = "single"
const PAIR = "pair"

const patternRegistry = {
  // Single-candle
  hammer: SINGLE,
  inverted_hammer: SINGLE,
  bullish_pinbar: SINGLE,
  bearish_pinbar: SINGLE,
  shaven_head: SINGLE,
  shaven_bottom: SINGLE,

  // Pair-wise
  bullish_engulfing: PAIR,
  bearish_engulfing: PAIR,
  bullish_harami: PAIR,
  bearish_harami: PAIR,
  piercing_pattern: PAIR,
  dark_cloud_cover: PAIR,
}

function getPatternType(patternName) {
  return patternRegistry[patternName.toLowerCase()] || SINGLE
}

module.exports = {
  SINGLE,
  PAIR,
  getPatternType,
}
