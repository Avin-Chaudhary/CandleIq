// ==============================
// Price → Y mapper (SINGLE SOURCE OF TRUTH)
// ==============================
function priceToY(price, baseY, minPrice, scale) {
  return baseY - (price - minPrice) * scale;
}

// ==============================
// GRID (graph-paper style)
// ==============================
function drawGrid(ctx, minPrice, maxPrice, baseY, scale, paddingTop) {
  const levels = 6;
  const step = (maxPrice - minPrice) / levels;

  ctx.strokeStyle = "#eee";
  ctx.fillStyle = "#888";
  ctx.font = "11px Arial";
  ctx.textAlign = "left";

  for (let i = 0; i <= levels; i++) {
    const price = minPrice + i * step;
    const y = priceToY(price, baseY, minPrice, scale);

    if (y < paddingTop || y > baseY) continue;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.stroke();

    ctx.fillText(price.toFixed(2), 6, y - 2);
  }
}

/*
// ==============================
// Candle with side labels
// ==============================
function drawLabeledCandle(
  ctx,
  c,
  x,
  baseY,
  scale,
  minPrice,
  title,
  side
) {
  const yOpen = priceToY(c.open, baseY, minPrice, scale);
  const yClose = priceToY(c.close, baseY, minPrice, scale);
  const yHigh = priceToY(c.high, baseY, minPrice, scale);
  const yLow = priceToY(c.low, baseY, minPrice, scale);

  const bodyTop = Math.min(yOpen, yClose);
  const bodyBottom = Math.max(yOpen, yClose);

  // Wick
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(x, yHigh);
  ctx.lineTo(x, yLow);
  ctx.stroke();

  // Body
  ctx.fillStyle = c.close >= c.open ? "#2ecc71" : "#e74c3c";
  ctx.fillRect(x - 14, bodyTop, 28, bodyBottom - bodyTop);

  // Title
  ctx.fillStyle = "#333";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(title, x, 30);

  // Labels
  const offset = 18;
  const labelX = side === "left" ? x - offset : x + offset;

  ctx.font = "12px Arial";
  ctx.textAlign = side === "left" ? "right" : "left";
  ctx.fillStyle = "#444";

  ctx.fillText(`High: ${c.high.toFixed(2)}`, labelX, yHigh + 4);
  ctx.fillText(`Close: ${c.close.toFixed(2)}`, labelX, bodyTop + 12);
  ctx.fillText(`Open: ${c.open.toFixed(2)}`, labelX, bodyBottom - 2);
  ctx.fillText(`Low: ${c.low.toFixed(2)}`, labelX, yLow);
}

// ==============================
// MAIN FUNCTION (FIXED)
// ==============================
function drawCandlePair(ctx, prev, curr) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const paddingTop = 60;
  const paddingBottom = 60;
  const baseY = ctx.canvas.height - paddingBottom;

  const prices = [
    prev.open, prev.close, prev.high, prev.low,
    curr.open, curr.close, curr.high, curr.low,
  ];

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  if (maxPrice === minPrice) return; // safety

  const scale =
    (ctx.canvas.height - paddingTop - paddingBottom) /
    (maxPrice - minPrice);

  // ✅ GRID (NOW CORRECT)
  drawGrid(ctx, minPrice, maxPrice, baseY, scale, paddingTop);

  // Center divider
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ctx.canvas.width / 2, paddingTop);
  ctx.lineTo(ctx.canvas.width / 2, baseY);
  ctx.stroke();

  // Prev
  drawLabeledCandle(
    ctx,
    prev,
    ctx.canvas.width * 0.25,
    baseY,
    scale,
    minPrice,
    "Prev",
    "left"
  );

  // Curr
  drawLabeledCandle(
    ctx,
    curr,
    ctx.canvas.width * 0.75,
    baseY,
    scale,
    minPrice,
    "Curr",
    "right"
  );
}
*/
function drawLabeledCandle(ctx, c, x, baseY, scale, minPrice, title, side) {
  const yOpen = priceToY(c.open, baseY, minPrice, scale);
  const yClose = priceToY(c.close, baseY, minPrice, scale);
  const yHigh = priceToY(c.high, baseY, minPrice, scale);
  const yLow = priceToY(c.low, baseY, minPrice, scale);

  const isBullish = c.close >= c.open;
  const bodyTop = Math.min(yOpen, yClose);
  const bodyBottom = Math.max(yOpen, yClose);

  // 1. Wick
  ctx.strokeStyle = "#444";
  ctx.beginPath();
  ctx.moveTo(x, yHigh);
  ctx.lineTo(x, yLow);
  ctx.stroke();

  // 2. Body
  ctx.fillStyle = isBullish ? "#2ecc71" : "#e74c3c";
  ctx.fillRect(x - 14, bodyTop, 28, bodyBottom - bodyTop);

  // 3. Title
  ctx.fillStyle = "#333";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(title, x, 30);

  // 4. Labels (FIXED LOGIC)
  const offset = 22;
  const labelX = side === "left" ? x - offset : x + offset;
  ctx.font = "11px Arial";
  ctx.textAlign = side === "left" ? "right" : "left";
  ctx.fillStyle = "#555";

  // High and Low are always top and bottom
  ctx.fillText(`High: ${c.high.toFixed(2)}`, labelX, yHigh + 4);
  ctx.fillText(`Low: ${c.low.toFixed(2)}`, labelX, yLow + 4);

  // Dynamic Open/Close positioning
  if (isBullish) {
    // Green Candle: Close is at the top, Open is at the bottom
    ctx.fillText(`Close: ${c.close.toFixed(2)}`, labelX, bodyTop + 4);
    ctx.fillText(`Open: ${c.open.toFixed(2)}`, labelX, bodyBottom + 4);
  } else {
    // Red Candle: Open is at the top, Close is at the bottom
    ctx.fillText(`Open: ${c.open.toFixed(2)}`, labelX, bodyTop + 4);
    ctx.fillText(`Close: ${c.close.toFixed(2)}`, labelX, bodyBottom + 4);
  }
}
// ==============================
// MAIN FUNCTION (UPDATED)
// ==============================
function drawCandlePair(ctx, prev, curr) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const paddingTop = 60;
  const paddingBottom = 60;
  const baseY = ctx.canvas.height - paddingBottom;

  const prices = [
    prev.open,
    prev.close,
    prev.high,
    prev.low,
    curr.open,
    curr.close,
    curr.high,
    curr.low,
  ];

  let maxPrice = Math.max(...prices);
  let minPrice = Math.min(...prices);

  // ✅ ADD PRICE PADDING
  // This ensures candles aren't "squashed" against the top/bottom
  const priceRange = maxPrice - minPrice;
  const buffer = priceRange * 0.2; // Add 20% extra space
  maxPrice += buffer;
  minPrice -= buffer;

  if (maxPrice === minPrice) return;

  const scale =
    (ctx.canvas.height - paddingTop - paddingBottom) / (maxPrice - minPrice);

  // 1. Draw Grid First (Shared for both)
  drawGrid(ctx, minPrice, maxPrice, baseY, scale, paddingTop);

  // 2. Center divider
  ctx.strokeStyle = "#ddd";
  ctx.setLineDash([5, 5]); // Make it dashed for a cleaner look
  ctx.beginPath();
  ctx.moveTo(ctx.canvas.width / 2, 20);
  ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - 20);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // 3. Draw Prev Candle
  drawLabeledCandle(
    ctx,
    prev,
    ctx.canvas.width * 0.3, // Moved slightly inward
    baseY,
    scale,
    minPrice,
    "Previous Candle",
    "left",
  );

  // 4. Draw Curr Candle
  drawLabeledCandle(
    ctx,
    curr,
    ctx.canvas.width * 0.7, // Moved slightly inward
    baseY,
    scale,
    minPrice,
    "Current Candle",
    "right",
  );
}

module.exports = { drawCandlePair };
