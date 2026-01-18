function getPatternNames(data) {
  return [...new Set(data.map(d => d.pattern))]
}

function getCandlesForPattern(data, patternName) {
  return data.filter(d => d.pattern === patternName)
}

module.exports = {
  getPatternNames,
  getCandlesForPattern
}
