/**
 * Gera faq-question.png (grama+terra Minecraft) e
 * faq-anwser.png (pedra lisa Minecraft) como tiles 32x32 px.
 * Execute: node generate-textures.mjs
 */
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));

// ─── PNG writer (sem dependências externas) ───────────────────────────────────

const _crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = _crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4); lenBuf.writeUInt32BE(data.length);
  const crcBuf = Buffer.allocUnsafe(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([lenBuf, t, data, crcBuf]);
}

function writePNG(filepath, w, h, getPixel) {
  const rows = [];
  for (let y = 0; y < h; y++) {
    const row = Buffer.allocUnsafe(1 + w * 3);
    row[0] = 0; // filter: None
    for (let x = 0; x < w; x++) {
      const [r, g, b] = getPixel(x, y);
      row[1 + x * 3] = r;
      row[2 + x * 3] = g;
      row[3 + x * 3] = b;
    }
    rows.push(row);
  }

  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(w, 0); ihdrData.writeUInt32BE(h, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdrData),
    chunk('IDAT', zlib.deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(filepath, png);
  console.log(`✓  ${path.relative(__dir, filepath)}`);
}

// ─── Ruído determinístico por pixel (sem estado global) ───────────────────────

function noise(x, y, seed) {
  let n = (Math.imul(x, 1619) + Math.imul(y, 31337) + Math.imul(seed, 6791)) | 0;
  n = Math.imul(n ^ (n >>> 16), 0x45D9F3B) | 0;
  n = Math.imul(n ^ (n >>> 16), 0x45D9F3B) | 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

// ─── GRAMA + TERRA  (32×32, seed=42) ─────────────────────────────────────────
//  Linhas  0-5  → tira de grama verde
//  Linhas  6-31 → terra marrom com variação de pixel

function grassPixel(x, y) {
  const n = noise(x, y, 42);

  if (y < 6) {
    // ── tira de grama ──
    if (y === 0) {
      if (n < 0.25) return [122, 198, 56];  // brilho
      if (n < 0.55) return [108, 180, 44];  // médio
      if (n < 0.80) return [ 90, 156, 30];  // base
      return [140, 212, 68];                 // highlight
    }
    if (y < 3) {
      if (n < 0.30) return [ 90, 156, 30];
      if (n < 0.62) return [ 74, 130, 22];
      if (n < 0.85) return [108, 180, 44];
      return [ 58, 106, 16];
    }
    // linhas 3-5: transição grama→terra
    if (n < 0.40) return [ 58, 106, 16];
    if (n < 0.70) return [ 74, 130, 22];
    return [112,  74,  40]; // toque de terra
  }

  // ── terra ──
  if (n < 0.38) return [125,  84,  50];  // base
  if (n < 0.60) return [107,  68,  34];  // escuro
  if (n < 0.76) return [143, 101,  64];  // claro
  if (n < 0.90) return [ 92,  56,  26];  // mais escuro
  return            [161, 124,  82];     // destaque claro
}

// ─── PEDRA LISA  (32×32, seed=137) ───────────────────────────────────────────
//  Ruído homogêneo pixel a pixel, sem bordas visíveis (igual à grama)

function stonePixel(x, y) {
  const n  = noise(x, y, 137);
  const n2 = noise(x, y, 211);  // segundo ruído para mais variação natural

  // paleta de cinzas do Minecraft smooth stone
  if (n < 0.30) return [130, 130, 130];  // base médio
  if (n < 0.52) return [118, 118, 118];  // ligeiramente escuro
  if (n < 0.68) return [144, 144, 144];  // ligeiramente claro
  if (n < 0.80) return [105, 105, 105];  // escuro
  if (n < 0.90) return [156, 156, 156];  // claro
  if (n2 < 0.5) return [ 95,  95,  95]; // acento escuro raro
  return             [164, 164, 164];    // highlight raro
}

// ─── Gerar arquivos ───────────────────────────────────────────────────────────

const pub = path.join(__dir, 'public');
writePNG(path.join(pub, 'faq-question.png'), 32, 32, grassPixel);
writePNG(path.join(pub, 'faq-anwser.png'),   32, 32, stonePixel);
console.log('\nPronto! Tiles Minecraft gerados em /public/');
