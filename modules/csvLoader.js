const fs = require("fs")
const path = require("path")

function loadCSV(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8")
  const lines = raw.trim().split("\n")

  const headers = lines[0].split(",")

  return lines.slice(1).map(line => {
    const values = line.split(",")
    const row = {}

    headers.forEach((h, i) => {
      row[h.trim()] = values[i].trim()
    })

    return {
      pattern: row.pattern_name,
      open: Number(row.open),
      close: Number(row.close),
      high: Number(row.high),
      low: Number(row.low)
    }
  })
}

module.exports = { loadCSV }
