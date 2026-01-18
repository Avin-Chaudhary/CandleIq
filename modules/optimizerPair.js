function clamp(x, lo, hi) {
  return Math.min(Math.max(x, lo), hi)
}

// ==================================================
// ========= BULLISH / BEARISH ENGULFING ==============
// ==================================================

function optimizeEngulfing(data, bullish = true) {
  let k = 1.0           // body dominance multiplier
  const lr = 0.01
  const epochs = 600

  for (let e = 0; e < epochs; e++) {
    let grad = 0

    for (const { prev, curr, label } of data) {
      const bodyPrev = Math.abs(prev.open - prev.close)
      const bodyCurr = Math.abs(curr.open - curr.close)
      if (bodyPrev === 0) continue

      const score = bodyCurr > k * bodyPrev ? 1 : 0
      grad += (score - label)
    }

    k -= lr * grad
    k = clamp(k, 0.5, 3.0)
  }

  return { bodyMultiplier: Number(k.toFixed(3)) }
}

// ==================================================
// ========= BULLISH / BEARISH HARAMI =================
// ==================================================

function optimizeHarami(data) {
  let tol = 5.0         // price tolerance
  const lr = 0.01
  const epochs = 600

  for (let e = 0; e < epochs; e++) {
    let grad = 0

    for (const { prev, curr, label } of data) {
      const inside =
        curr.open >= prev.close - tol &&
        curr.open <= prev.close + tol

      const score = inside ? 1 : 0
      grad += (score - label)
    }

    tol -= lr * grad
    tol = clamp(tol, 0.5, 20)
  }

  return { tolerance: Number(tol.toFixed(3)) }
}

// ==================================================
// ========= PIERCING / DARK CLOUD ===================
// ==================================================

function optimizeMidpointPattern(data) {
  let m = 0.5     // midpoint multiplier
  let gap = 0.5  // open gap constant

  const lr = 0.01
  const epochs = 600

  for (let e = 0; e < epochs; e++) {
    let gradM = 0
    let gradG = 0

    for (const { prev, curr, label } of data) {
      const mid = prev.close + m * (prev.open - prev.close)
      const score =
        curr.close > mid &&
        curr.open < prev.close - gap

      gradM += (score - label)
      gradG += (score - label)
    }

    m -= lr * gradM
    gap -= lr * gradG

    m = clamp(m, 0.2, 0.8)
    gap = clamp(gap, 0.1, 3.0)
  }

  return {
    midpointMultiplier: Number(m.toFixed(3)),
    gap: Number(gap.toFixed(3)),
  }
}

module.exports = {
  optimizeBullishEngulfing: (d) => optimizeEngulfing(d, true),
  optimizeBearishEngulfing: (d) => optimizeEngulfing(d, false),

  optimizeBullishHarami: optimizeHarami,
  optimizeBearishHarami: optimizeHarami,

  optimizePiercingPattern: optimizeMidpointPattern,
  optimizeDarkCloudCover: optimizeMidpointPattern,
}
