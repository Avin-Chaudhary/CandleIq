function buildPairs(candles) {
  const pairs = []

  for (let i = 0; i < candles.length - 1; i += 2) {
    pairs.push({
      prev: candles[i],
      curr: candles[i + 1],
    })
  }

  return pairs
}

module.exports = { buildPairs }
