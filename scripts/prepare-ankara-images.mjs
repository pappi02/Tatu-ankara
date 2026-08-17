import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pagePath = path.join(root, "app", "page.tsx");
const publicDir = path.join(root, "public", "ankara");

fs.mkdirSync(publicDir, { recursive: true });

const pieces = [
  {
    id: "p1",
    file: "floral-maxi-dress.svg",
    title: "Floral Ankara Maxi Dress",
    bg: "#f4eee5",
    base: "#0f6b5a",
    accent: "#f0b429",
    accent2: "#d94f4f",
    kind: "dress",
  },
  {
    id: "p2",
    file: "geometric-two-piece.svg",
    title: "Geometric Ankara Skirt Set",
    bg: "#efe8df",
    base: "#171717",
    accent: "#c92a2a",
    accent2: "#e6a51a",
    kind: "set",
  },
  {
    id: "p3",
    file: "bold-jumpsuit.svg",
    title: "Bold Print Ankara Jumpsuit",
    bg: "#e8eef0",
    base: "#123d6a",
    accent: "#f2b705",
    accent2: "#d64045",
    kind: "jumpsuit",
  },
  {
    id: "p4",
    file: "classic-midi-dress.svg",
    title: "Classic Ankara Midi Dress",
    bg: "#f2ece4",
    base: "#7c1830",
    accent: "#f2c14e",
    accent2: "#1f7a5c",
    kind: "dress",
  },
  {
    id: "p5",
    file: "ankara-kimono.svg",
    title: "Ankara Kimono Jacket",
    bg: "#eee7e1",
    base: "#5b174f",
    accent: "#d62f78",
    accent2: "#f0a51a",
    kind: "kimono",
  },
  {
    id: "p6",
    file: "peplum-blouse.svg",
    title: "Peplum Ankara Blouse",
    bg: "#e8edf1",
    base: "#126b78",
    accent: "#ed5b35",
    accent2: "#e5bd2d",
    kind: "blouse",
  },
  {
    id: "p7",
    file: "ankara-pencil-skirt.svg",
    title: "Ankara Pencil Skirt",
    bg: "#f1ebe4",
    base: "#151515",
    accent: "#e34b55",
    accent2: "#e2a52a",
    kind: "skirt",
  },
  {
    id: "p8",
    file: "wrap-ankara-dress.svg",
    title: "Wrap Ankara Dress",
    bg: "#edf1f2",
    base: "#075b4f",
    accent: "#efc33b",
    accent2: "#d7463f",
    kind: "wrap",
  },
];

function svgFor(piece) {
  const { bg, base, accent, accent2, title, kind } = piece;
  const patternId = `p-${piece.id}`;
  const garment = {
    dress: `<path d="M255 220 L345 220 L375 315 L465 680 Q300 760 135 680 L225 315 Z" fill="url(#${patternId})" stroke="#171717" stroke-width="5"/><path d="M255 220 L300 270 L345 220" fill="none" stroke="#171717" stroke-width="6"/><path d="M225 315 Q300 350 375 315" fill="none" stroke="#171717" stroke-width="5"/>`,
    set: `<path d="M235 205 L365 205 L350 360 L250 360 Z" fill="url(#${patternId})" stroke="#171717" stroke-width="5"/><path d="M215 350 L385 350 L445 700 Q300 755 155 700 Z" fill="url(#${patternId})" stroke="#171717" stroke-width="5"/><path d="M250 360 Q300 385 350 360" fill="none" stroke="#171717" stroke-width="5"/>`,
    jumpsuit: `<path d="M245 210 L355 210 L390 360 L350 700 L300 540 L250 700 L210 360 Z" fill="url(#${patternId})" stroke="#171717" stroke-width="5"/><path d="M245 210 L300 265 L355 210" fill="none" stroke="#171717" stroke-width="6"/><path d="M210 360 L390 360" stroke="#171717" stroke-width="7"/>`,
    kimono: `<path d="M210 210 L275 280 L300 240 L325 280 L390 210 L475 650 L300 700 L125 650 Z" fill="url(#${patternId})" stroke="#171717" stroke-width="5"/><path d="M275 280 L300 520 L325 280" fill="none" stroke="#171717" stroke-width="7"/><path d="M215 500 Q300 540 385 500" fill="none" stroke="#171717" stroke-width="12"/>`,
    blouse: `<path d="M235 220 Q300 255 365 220 L420 310 L370 365 L350 300 L350 520 L250 520 L250 300 L230 365 L180 310 Z" fill="url(#${patternId})" stroke="#171717" stroke-width="5"/><path d="M235 220 Q300 285 365 220" fill="none" stroke="#171717" stroke-width="6"/><path d="M250 480 Q300 500 350 480" fill="none" stroke="#171717" stroke-width="5"/>`,
    skirt: `<path d="M225 220 L375 220 L350 330 L435 700 Q300 750 165 700 L250 330 Z" fill="url(#${patternId})" stroke="#171717" stroke-width="5"/><path d="M225 220 L375 220 L350 330 L250 330 Z" fill="${base}" stroke="#171717" stroke-width="5"/>`,
    wrap: `<path d="M245 215 L355 215 L385 330 L455 690 Q300 760 145 690 L215 330 Z" fill="url(#${patternId})" stroke="#171717" stroke-width="5"/><path d="M245 215 L300 300 L355 215" fill="none" stroke="#171717" stroke-width="6"/><path d="M245 300 L355 470 L245 430" fill="none" stroke="#171717" stroke-width="5"/><path d="M205 370 Q300 410 395 370" fill="none" stroke="#171717" stroke-width="8"/>`,
  }[kind];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-label="${title} made from Ankara fabric">
  <defs>
    <pattern id="${patternId}" width="90" height="90" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
      <rect width="90" height="90" fill="${base}"/>
      <circle cx="22" cy="22" r="15" fill="${accent}"/>
      <circle cx="22" cy="22" r="7" fill="${base}"/>
      <path d="M50 5 L80 35 L50 65 L20 35 Z" fill="none" stroke="${accent2}" stroke-width="8"/>
      <path d="M5 75 Q45 45 85 75" fill="none" stroke="${accent}" stroke-width="6"/>
      <circle cx="68" cy="65" r="7" fill="${accent2}"/>
    </pattern>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-opacity=".18"/>
    </filter>
  </defs>
  <rect width="600" height="800" fill="${bg}"/>
  <ellipse cx="300" cy="735" rx="190" ry="25" fill="#000" opacity=".08"/>
  <g filter="url(#shadow)">
    ${garment}
  </g>
  <text x="300" y="770" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#333">TATU ANKARA</text>
</svg>`;
}

for (const piece of pieces) {
  fs.writeFileSync(path.join(publicDir, piece.file), svgFor(piece), "utf8");
}

const original = fs.readFileSync(pagePath, "utf8");
let page = original;

for (const piece of pieces) {
  const block = new RegExp(`(id: "${piece.id}"[\\s\\S]*?images:) \\[.*?\\]`, "m");
  const replacement = `$1 ["/ankara/${piece.file}", "/ankara/${piece.file}"]`;
  page = page.replace(block, replacement);
}

if (page === original) {
  throw new Error("No product image blocks were updated in app/page.tsx");
}

fs.writeFileSync(pagePath, page, "utf8");
console.log(`Prepared ${pieces.length} original Ankara product illustrations.`);
