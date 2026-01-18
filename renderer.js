const path = require("path");

// =====================
// Modules
// =====================
const { loadCSV } = require("./modules/csvLoader");
const { drawCandle } = require("./modules/candleRenderer");
const { drawCandlePair } = require("./modules/pairCandleRenderer");

const {
  getPatternNames,
  getCandlesForPattern,
} = require("./modules/patternManager");

const { SINGLE, PAIR, getPatternType } = require("./modules/patternRegistry");
const { buildPairs } = require("./modules/pairBuilder");

// =====================
// Single-candle optimizers
// =====================
const {
  optimizeHammer,
  optimizeInvertedHammer,
  optimizeBullishPinBar,
  optimizeBearishPinBar,
  optimizeShavenHead,
  optimizeShavenBottom,
} = require("./modules/optimizer");

// =====================
// Pair-wise optimizers (SOUL-PRESERVING)
// =====================
const {
  optimizeBullishEngulfing,
  optimizeBearishEngulfing,
  optimizeBullishHarami,
  optimizeBearishHarami,
  optimizePiercingPattern,
  optimizeDarkCloudCover,
} = require("./modules/optimizerPair");

// =====================
// Single-candle code generators
// =====================
const {
  generateHammerCode,
  generateInvertedHammerCode,
  generateBullishPinBarCode,
  generateBearishPinBarCode,
  generateShavenHeadCode,
  generateShavenBottomCode,
} = require("./modules/codeGenerator");

// =====================
// Pair-wise code generators (SOUL-PRESERVING)
// =====================
const {
  generateBullishEngulfingCode,
  generateBearishEngulfingCode,
  generateBullishHaramiCode,
  generateBearishHaramiCode,
  generatePiercingPatternCode,
  generateDarkCloudCoverCode,
} = require("./modules/codeGeneratorPair");

// =====================
// Canvas
// =====================
const canvas = document.getElementById("candleCanvas");
const ctx = canvas.getContext("2d");

// =====================
// UI references
// =====================
const patternDiv = document.getElementById("patterns");
const statusDiv = document.getElementById("status");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const generateBtn = document.getElementById("generateBtn");
const codeView = document.getElementById("codeView");
const codeBlock = document.getElementById("codeBlock");
const copyBtn = document.getElementById("copyBtn");

// =====================
// App state
// =====================
const MIN_SAMPLES = 20;

let currentPattern = null;
let currentPatternType = SINGLE;
let currentItems = [];
let itemIndex = 0;
let labeledData = [];

// =====================
// Load CSV
// =====================
const dataPath = path.join(__dirname, "data", "data.csv");
const allData = loadCSV(dataPath);
const patterns = getPatternNames(allData);

// =====================
// Pattern selection
// =====================
patterns.forEach((p) => {
  const div = document.createElement("div");
  div.className = "pattern-item";
  div.innerText = p;

  div.onclick = () => {
    document
      .querySelectorAll(".pattern-item")
      .forEach((el) => el.classList.remove("active"));
    div.classList.add("active");

    currentPattern = p;
    currentPatternType = getPatternType(p);

    itemIndex = 0;
    labeledData = [];
    generateBtn.disabled = true;
    codeView.style.display = "none";

    const raw = getCandlesForPattern(allData, p);
    if (!raw.length) {
      statusDiv.innerText = `Pattern: ${p} | No data`;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    currentItems = currentPatternType === SINGLE ? raw : buildPairs(raw);

    statusDiv.innerText = `Pattern: ${p} | Item 1 / ${currentItems.length}`;

    renderCurrent();
  };

  patternDiv.appendChild(div);
});

// =====================
// Rendering
// =====================
function renderCurrent() {
  if (currentPatternType === SINGLE) {
    drawCandle(ctx, currentItems[itemIndex]);
  } else {
    drawCandlePair(
      ctx,
      currentItems[itemIndex].prev,
      currentItems[itemIndex].curr,
    );
  }
}

// =====================
// Label handling
// =====================
function handleLabel(label) {
  if (itemIndex >= currentItems.length) return;

  const item = currentItems[itemIndex];

  labeledData.push(
    currentPatternType === SINGLE
      ? { ...item, label }
      : { prev: item.prev, curr: item.curr, label },
  );

  itemIndex++;

  if (itemIndex < currentItems.length) {
    statusDiv.innerText = `Pattern: ${currentPattern} | Item ${itemIndex + 1} / ${currentItems.length}`;
    renderCurrent();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    statusDiv.innerText = `Pattern: ${currentPattern} | Done (${labeledData.length})`;
  }

  generateBtn.disabled = labeledData.length < MIN_SAMPLES;
}

// =====================
// Code generation
// =====================
function generateCode() {
  if (labeledData.length < MIN_SAMPLES) {
    alert(`Need at least ${MIN_SAMPLES} samples`);
    return;
  }

  const meta = {
    patternName: currentPattern,
    sampleCount: labeledData.length,
  };

  let pineCode = "";

  switch (currentPattern) {
    // ===== SINGLE =====
    case "hammer":
      pineCode = generateHammerCode(optimizeHammer(labeledData), meta);
      break;

    case "inverted_hammer":
      pineCode = generateInvertedHammerCode(
        optimizeInvertedHammer(labeledData),
        meta,
      );
      break;

    case "pin_bar_bullish":
      pineCode = generateBullishPinBarCode(
        optimizeBullishPinBar(labeledData),
        meta,
      );
      break;

    case "pin_bar_bearish":
      pineCode = generateBearishPinBarCode(
        optimizeBearishPinBar(labeledData),
        meta,
      );
      break;

    case "shaven_head":
      pineCode = generateShavenHeadCode(optimizeShavenHead(labeledData), meta);
      break;

    case "shaven_bottom":
      pineCode = generateShavenBottomCode(
        optimizeShavenBottom(labeledData),
        meta,
      );
      break;

    // ===== PAIR (SOUL-PRESERVED) =====
    case "bullish_engulfing":
      pineCode = generateBullishEngulfingCode(
        optimizeBullishEngulfing(labeledData),
        meta,
      );
      break;

    case "bearish_engulfing":
      pineCode = generateBearishEngulfingCode(
        optimizeBearishEngulfing(labeledData),
        meta,
      );
      break;

    case "bullish_harami":
      pineCode = generateBullishHaramiCode(
        optimizeBullishHarami(labeledData),
        meta,
      );
      break;

    case "bearish_harami":
      pineCode = generateBearishHaramiCode(
        optimizeBearishHarami(labeledData),
        meta,
      );
      break;

    case "piercing_pattern":
      pineCode = generatePiercingPatternCode(
        optimizePiercingPattern(labeledData),
        meta,
      );
      break;

    case "dark_cloud_cover":
      pineCode = generateDarkCloudCoverCode(
        optimizeDarkCloudCover(labeledData),
        meta,
      );
      break;

    default:
      alert("Pattern not wired yet");
      return;
  }

  codeBlock.innerText = pineCode;
  codeView.style.display = "block";
}

// =====================
// Bindings
// =====================
yesBtn.onclick = () => handleLabel(1);
noBtn.onclick = () => handleLabel(0);
generateBtn.onclick = generateCode;

copyBtn.onclick = () => {
  navigator.clipboard.writeText(codeBlock.innerText);
  alert("Code copied");
};
