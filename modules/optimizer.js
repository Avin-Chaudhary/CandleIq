// ==================================================
// Utility
// ==================================================
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// ==================================================
// ========= SINGLE CANDLE OPTIMIZERS ================
// ==================================================

/*
Optimized parameters:
- a : wick/body multiplier
- b : opposite wick ratio
*/

function optimizeSingleCandle(labeledData, config) {
  if (config.wickType == "lower") {
    return optimizetype1(labeledData, config);
  } else if (config.wickType == "upper") {
    return optimizetype2(labeledData, config);
  }
}

function optimizetype1(labeledData, config) {
  const {
    lr = 0.01,
    epochs = 800,
    k = 5,
    aInit,
    bInit,
    aMin,
    aMax,
    bMin,
    bMax,
    wickType, // "lower" or "upper"
  } = config;

  let a = aInit;
  let b = bInit;

  function score(c) {
    const bodySize = Math.abs(c.close - c.open);
    if (bodySize == 0) return;
    const lowerWick = Math.min(c.open, c.close) - c.low;
    const upperWick = c.high - Math.max(c.open, c.close);

    const b1 = upperWick / bodySize;
    const a1 = lowerWick / bodySize;

    if (b1 < b && c.label == 0) {
      b = b - 0.1 * ((b - b1) / b);
    } else if (b1 > b && c.label == 1) {
      b = b + 0.1 * ((b1 - b) / b1);
    }

    if (a1 < a && c.label == 1) {
      a = a - 0.1 * ((a - a1) / a);
    } else if (a1 > a && c.label == 0) {
      a = a + 0.1 * ((a1 - a) / a1);
    }
  }

  for (let i = 1; i <= epochs; i++) {
    for (const c of labeledData) {
      score(c);
    }
    a = Math.min(Math.max(a, aMin), aMax);
    b = Math.min(Math.max(b, bMin), bMax);
  }

  return {
    mainWickMultiplier: Number(a.toFixed(3)),
    oppositeWickRatio: Number(b.toFixed(3)),
  };
}

function optimizetype2(labeledData, config) {
  const {
    lr = 0.01,
    epochs = 800,
    k = 5,
    aInit,
    bInit,
    aMin,
    aMax,
    bMin,
    bMax,
    wickType, // "lower" or "upper"
  } = config;

  let a = aInit;
  let b = bInit;

  function score(c) {
    const bodySize = Math.abs(c.close - c.open);
    if (bodySize == 0) return;
    const lowerWick = Math.min(c.open, c.close) - c.low;
    const upperWick = c.high - Math.max(c.open, c.close);

    const b1 = upperWick / bodySize;
    const a1 = lowerWick / bodySize;

    if (b1 < b && c.label == 1) {
      b = b - 0.1 * ((b - b1) / b);
    } else if (b1 > b && c.label == 0) {
      b = b + 0.1 * ((b1 - b) / b1);
    }

    if (a1 < a && c.label == 0) {
      a = a - 0.1 * ((a - a1) / a);
    } else if (a1 > a && c.label == 1) {
      a = a + 0.1 * ((a1 - a) / a1);
    }
  }

  for (let i = 1; i <= epochs; i++) {
    for (const c of labeledData) {
      score(c);
    }
    a = Math.min(Math.max(a, aMin), aMax);
    b = Math.min(Math.max(b, bMin), bMax);
  }

  return {
    mainWickMultiplier: Number(a.toFixed(3)),
    oppositeWickRatio: Number(b.toFixed(3)),
  };
}

// ----------------- SINGLE PATTERN WRAPPERS -----------------

function optimizeHammer(data) {
  return optimizeSingleCandle(data, {
    aInit: 1.5,
    bInit: 0.3,
    aMin: 1.0,
    aMax: 5.0,
    bMin: 0.001,
    bMax: 0.5,
    wickType: "lower",
  });
}

function optimizeInvertedHammer(data) {
  return optimizeSingleCandle(data, {
    aInit: 1.5,
    bInit: 0.3,
    aMin: 0.001,
    aMax: 0.5,
    bMin: 1.0,
    bMax: 5.0,
    wickType: "upper",
  });
}

function optimizeBullishPinBar(data) {
  return optimizeSingleCandle(data, {
    aInit: 2.0,
    bInit: 0.3,
    aMin: 1.0,
    aMax: 8.0,
    bMin: 0.001,
    bMax: 0.5,
    wickType: "lower",
  });
}

function optimizeBearishPinBar(data) {
  return optimizeSingleCandle(data, {
    aInit: 2.0,
    bInit: 0.3,
    aMin: 0.001,
    aMax: 0.5,
    bMin: 1.0,
    bMax: 8.0,
    wickType: "upper",
  });
}

function optimizeShavenHead(data) {
  return optimizeSingleCandle(data, {
    aInit: 0.2,
    bInit: 0.05,
    aMin: 1.0,
    aMax: 6.0,
    bMin: 0.001,
    bMax: 0.2,
    wickType: "lower",
  });
}

function optimizeShavenBottom(data) {
  return optimizeSingleCandle(data, {
    aInit: 0.2,
    bInit: 0.05,
    aMin: 0.0001,
    aMax: 0.2,
    bMin: 1.0,
    bMax: 6.0,
    wickType: "upper",
  });
}

// ==================================================
// ========= PAIR-WISE OPTIMIZERS =====================
// ==================================================

/*
Optimized parameters:
- r : body dominance ratio
*/

function optimizeEngulfing(data, bullish = true) {
  const lr = 0.01;
  const epochs = 800;
  let r = 1.0;

  function score(pair) {
    const p = pair.prev;
    const c = pair.curr;

    const body1 = Math.abs(p.close - p.open);
    const body2 = Math.abs(c.close - c.open);
    if (body1 === 0 || body2 === 0) return 0;

    const engulf = bullish
      ? p.open > p.close && c.close > c.open && c.close >= p.open
      : p.close > p.open && c.open > c.close && c.open >= p.close;

    const dominance = body2 / body1;

    return sigmoid(5 * (dominance - r)) * (engulf ? 1 : 0);
  }

  for (let i = 0; i < epochs; i++) {
    let grad = 0;

    for (const pair of data) {
      const y = pair.label;
      const s = score(pair);
      grad += s - y;
    }

    r -= lr * grad;
    r = Math.min(Math.max(r, 0.5), 3.0);
  }

  return { bodyDominanceRatio: Number(r.toFixed(3)) };
}

// ==================================================
// ========= EXPORTS =================================
// ==================================================

module.exports = {
  // Single candle
  optimizeHammer,
  optimizeInvertedHammer,
  optimizeBullishPinBar,
  optimizeBearishPinBar,
  optimizeShavenHead,
  optimizeShavenBottom,

  // Pair-wise
  optimizeBullishEngulfing: (d) => optimizeEngulfing(d, true),
  optimizeBearishEngulfing: (d) => optimizeEngulfing(d, false),
};
