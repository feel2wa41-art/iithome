// =========================================================================
// Generate IIT brand favicons (raster PNGs, no vector output).
// Run with:  node scripts/generate-favicons.mjs
// =========================================================================
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Hand-built "IIT" lettermark using pure rectangles so we don't depend on
// any system font being installed. Result rasterises cleanly at all sizes.
function buildSvg(canvas = 64) {
  // Letterforms positioned on a 64×64 grid, then scaled by sharp.
  return `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"  stop-color="#1962f5"/>
      <stop offset="55%" stop-color="#1962f5"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"  stop-color="white" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Rounded brand tile -->
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <rect width="64" height="64" rx="14" fill="url(#shine)"/>

  <!-- I I T -->
  <g fill="white">
    <rect x="11"   y="20" width="5" height="24" rx="1.2"/>
    <rect x="20.5" y="20" width="5" height="24" rx="1.2"/>
    <rect x="30"   y="20" width="22" height="5" rx="1.2"/>
    <rect x="38.5" y="20" width="5" height="24" rx="1.2"/>
  </g>

  <!-- Fiber accent dot -->
  <circle cx="32" cy="54" r="1.6" fill="#22d3ee"/>
</svg>
  `.trim();
}

const SVG = Buffer.from(buildSvg());

const OUTPUTS = [
  // Next.js App Router auto-detected favicons
  { name: 'src/app/icon.png',        size: 512 },
  { name: 'src/app/apple-icon.png',  size: 180 },
  // Public folder copies (for explicit links and legacy browsers)
  { name: 'public/favicon-16.png',   size: 16  },
  { name: 'public/favicon-32.png',   size: 32  },
  { name: 'public/favicon-48.png',   size: 48  },
  { name: 'public/favicon-192.png',  size: 192 },
  { name: 'public/favicon-512.png',  size: 512 },
  { name: 'public/apple-touch-icon.png', size: 180 },
];

for (const { name, size } of OUTPUTS) {
  const out = path.join(ROOT, name);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(SVG)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  const stat = fs.statSync(out);
  console.log(`✓ ${name.padEnd(40)} ${size}×${size}   ${(stat.size / 1024).toFixed(1)} KB`);
}

// Also write a static favicon.ico (browsers still request /favicon.ico).
// We embed a 32×32 PNG inside a minimal ICO container.
const ico32 = await sharp(SVG).resize(32, 32).png().toBuffer();
const icoBuffer = pngToIco(ico32, 32);
fs.writeFileSync(path.join(ROOT, 'public/favicon.ico'), icoBuffer);
console.log(`✓ public/favicon.ico                       (32×32 PNG-in-ICO)`);

console.log('\nAll favicons regenerated. Next.js will pick them up on next build.');

// -------------------------------------------------------------------------
// Tiny PNG-to-ICO encoder. Wraps a 32x32 PNG in a 1-entry ICO container.
// -------------------------------------------------------------------------
function pngToIco(pngBuffer, size) {
  const ICONDIR_SIZE = 6;
  const ICONDIRENTRY_SIZE = 16;
  const totalSize = ICONDIR_SIZE + ICONDIRENTRY_SIZE + pngBuffer.length;
  const out = Buffer.alloc(totalSize);

  // ICONDIR
  out.writeUInt16LE(0, 0);        // reserved
  out.writeUInt16LE(1, 2);        // type: 1 = icon
  out.writeUInt16LE(1, 4);        // count: 1 image

  // ICONDIRENTRY
  out.writeUInt8(size >= 256 ? 0 : size, 6);  // width  (0 = 256)
  out.writeUInt8(size >= 256 ? 0 : size, 7);  // height
  out.writeUInt8(0, 8);                       // color count
  out.writeUInt8(0, 9);                       // reserved
  out.writeUInt16LE(1, 10);                   // color planes
  out.writeUInt16LE(32, 12);                  // bits per pixel
  out.writeUInt32LE(pngBuffer.length, 14);    // image size
  out.writeUInt32LE(ICONDIR_SIZE + ICONDIRENTRY_SIZE, 18); // offset

  pngBuffer.copy(out, ICONDIR_SIZE + ICONDIRENTRY_SIZE);
  return out;
}
