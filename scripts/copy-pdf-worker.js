/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/copy-pdf-worker.js
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const dstDir = path.join(projectRoot, 'public');

const candidates = [
  // 1) Verschachtelt unter react-pdf (häufigster Fall)
  path.join(projectRoot, 'node_modules', 'react-pdf', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs'),
  path.join(projectRoot, 'node_modules', 'react-pdf', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js'),
  // 2) Top-Level installiert (falls vorhanden)
  path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs'),
  path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js'),
];

fs.mkdirSync(dstDir, { recursive: true });

let copied = 0;
for (const src of candidates) {
  if (fs.existsSync(src)) {
    const basename = path.basename(src); // pdf.worker.min.mjs | pdf.worker.min.js
    const dst = path.join(dstDir, basename);
    fs.copyFileSync(src, dst);
    console.log(`[copy-pdf-worker] Copied: ${src} -> ${dst}`);
    copied++;
  }
}

if (copied === 0) {
  console.error(
    '[copy-pdf-worker] Konnte keinen Worker finden. Ist "react-pdf" installiert? ' +
    'Oder "pdfjs-dist" als Top-Level? Erwartete Pfade:\n' +
    candidates.map((c) => ` - ${c}`).join('\n')
  );
  process.exit(1);
} else {
  console.log(`[copy-pdf-worker] Done. ${copied} Datei(en) kopiert.`);
}
