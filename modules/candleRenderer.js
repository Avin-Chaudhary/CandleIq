function drawCandle(ctx, candle) {
  const { open, close, high, low } = candle

  const canvasHeight = ctx.canvas.height
  const canvasWidth = ctx.canvas.width

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // Padding
  const topPadding = 40
  const bottomPadding = 40

  // Scale price → y coordinate
  const priceRange = high - low
  const usableHeight = canvasHeight - topPadding - bottomPadding

  const priceToY = price =>
    topPadding + (high - price) / priceRange * usableHeight

  const xCenter = canvasWidth / 2
  const bodyWidth = 60

  const openY = priceToY(open)
  const closeY = priceToY(close)
  const highY = priceToY(high)
  const lowY = priceToY(low)

  const isBullish = close > open
  const bodyTop = Math.min(openY, closeY)
  const bodyBottom = Math.max(openY, closeY)
  const bodyHeight = bodyBottom - bodyTop

  // Wick
  ctx.strokeStyle = "#000"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xCenter, highY)
  ctx.lineTo(xCenter, lowY)
  ctx.stroke()

  // Body
  ctx.fillStyle = isBullish ? "#2ecc71" : "#e74c3c"
  ctx.fillRect(
    xCenter - bodyWidth / 2,
    bodyTop,
    bodyWidth,
    Math.max(bodyHeight, 2)
  )

  // Labels
  ctx.fillStyle = "#000"
  ctx.font = "14px Arial"

  ctx.fillText(`High: ${high}`, xCenter + 80, highY + 5)
  ctx.fillText(`Low: ${low}`, xCenter + 80, lowY + 5)
  ctx.fillText(`Open: ${open}`, xCenter - 140, openY + 5)
  ctx.fillText(`Close: ${close}`, xCenter - 140, closeY + 5)
}

module.exports = { drawCandle }
