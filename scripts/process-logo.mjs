// =========================================================================
// Convert public/logo/logo_iit.png into a transparent, trimmed version
// suitable for both light AND dark headers/footers.
//
// Steps:
//   1. Read source PNG
//   2. Trim uniform borders (any solid colour on the edges — incl. black
//      box border that surrounds many printed logos)
//   3. Trim again to catch the inner white background ring
//   4. Convert near-white pixels to transparent (chroma-key)
//   5. Trim transparent borders to crop tight
//   6. Save as logo_iit_clean.png
//
// Run with:  npm run logo
// =========================================================================
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SRC = path.join(ROOT, 'public/logo/logo_iit.png');
const OUT = path.join(ROOT, 'public/logo/logo_iit_clean.png');

const WHITE_THRESHOLD = 235;   // RGB above this counts as "white"
const ALPHA_RAMP_BAND = 25;    // soft edge band so it doesn't look pixelated

console.log(`Reading: ${SRC}`);

// 1. Trim outer borders (handles black box frame). We use a large threshold
//    so dark borders are detected as "different from inside" and removed.
const trimmed = await sharp(SRC).trim({ threshold: 60 }).toBuffer();

// 2. Trim again with white-targeted threshold to remove white margin
const trimmed2 = await sharp(trimmed)
  .trim({ background: '#ffffff', threshold: 8 })
  .toBuffer();

// 3. Pull raw pixels and chroma-key the white background.
const { data, info } = await sharp(trimmed2)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data);

for (let i = 0; i < out.length; i += channels) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const minRGB = Math.min(r, g, b);

  if (minRGB >= WHITE_THRESHOLD) {
    // Pure-ish white → fully transparent
    out[i + 3] = 0;
  } else if (minRGB >= WHITE_THRESHOLD - ALPHA_RAMP_BAND) {
    // Soft edge — gradient alpha for clean anti-alias
    const ramp = (minRGB - (WHITE_THRESHOLD - ALPHA_RAMP_BAND)) / ALPHA_RAMP_BAND;
    out[i + 3] = Math.max(0, Math.min(255, Math.round(out[i + 3] * (1 - ramp))));
  }
}

// 4. Re-encode, trim transparent edges, save.
await sharp(out, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .trim() // trims transparent borders now
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`\n✓ ${path.relative(ROOT, OUT)}`);
console.log(`  size: ${meta.width}×${meta.height}, ${Math.round((await sharp(OUT).toBuffer()).length / 1024)} KB, alpha: ${meta.hasAlpha}`);
console.log(`\nPreview with:`);
console.log(`  • open public/logo/logo_iit_clean.png  (Windows: just double-click)`);
console.log(`\nIf the result looks bad (e.g. eats into the orange artwork),`);
console.log(`adjust WHITE_THRESHOLD in scripts/process-logo.mjs (235 default,`);
console.log(`try 245 to keep more colour; 220 to remove more white).`);
