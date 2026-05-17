import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const assetRoot = join(root, "docs", "assets");

const C = {
  bg: "#F7F5F2",
  card: "#FFFFFF",
  navy: "#1A1C2E",
  navy2: "#242842",
  gold: "#F5A623",
  blue: "#6C9BCF",
  sand: "#E8D5B7",
  teal: "#0EA5E9",
  purple: "#7C3AED",
  coral: "#FF6B6B",
  green: "#16A34A",
  ink2: "#4A4D5E",
  line: "#E5E0D8",
};

const font = "'Inter','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif";

const comfyRasterOverrides = new Map([
  ["illustrations/chapter-01-one-person-era", "comfyui/chapter-01-one-person-era.png"],
  ["illustrations/chapter-02-mindset", "comfyui/chapter-02-mindset.png"],
  ["illustrations/chapter-03-niche", "comfyui/chapter-03-niche.png"],
  ["illustrations/chapter-04-ai-toolbox", "comfyui/chapter-04-ai-toolbox.png"],
  ["illustrations/chapter-05-content-factory", "comfyui/chapter-05-content-factory.png"],
  ["illustrations/chapter-06-distribution", "comfyui/chapter-06-distribution.png"],
  ["illustrations/chapter-07-monetization", "comfyui/chapter-07-monetization.png"],
  ["illustrations/chapter-08-risk", "comfyui/chapter-08-risk.png"],
  ["illustrations/chapter-09-health", "comfyui/chapter-09-health.png"],
  ["illustrations/chapter-10-opc-plus", "comfyui/chapter-10-opc-plus.png"],
]);

const assets = [
  coverFront(),
  coverWrap(),
  chapterAsset("chapter-01-one-person-era", "01", "一个人的时代来了", "一人站在AI杠杆上，面对更大的城市与市场", "city"),
  chapterAsset("chapter-02-mindset", "02", "心态是第一道生死线", "自由、孤独、反馈与止损线", "climb"),
  chapterAsset("chapter-03-niche", "03", "找到你的一人帝国", "技能、热爱、需求、付费意愿的交集", "ikigai"),
  chapterAsset("chapter-04-ai-toolbox", "04", "AI工具箱", "把写作、设计、代码、自动化变成虚拟团队", "dashboard"),
  chapterAsset("chapter-05-content-factory", "05", "内容工厂", "从选题到分发的规模化生产线", "factory"),
  chapterAsset("chapter-06-distribution", "06", "流量和分发", "让世界在不同平台找到你", "signal"),
  chapterAsset("chapter-07-monetization", "07", "变现", "技能、内容、信任长成收入之树", "tree"),
  chapterAsset("chapter-08-risk", "08", "生存底线", "财务、法务、数据和心理的防护盾", "shield"),
  chapterAsset("chapter-09-health", "09", "肉身生存", "生产力来自一个稳定运转的身体", "scale"),
  chapterAsset("chapter-10-opc-plus", "10", "从OPC到OPC+", "一个人调度一组AI代理和资产", "mirror"),
  roadmapAsset(),
  matrixAsset(),
  checklistAsset(),
  comparisonAsset(),
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function svgWrap(width, height, body, defs = "") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <linearGradient id="warmGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.gold}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${C.coral}" stop-opacity="0.75"/>
    </linearGradient>
    <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.blue}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${C.teal}" stop-opacity="0.85"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#1A1C2E" flood-opacity="0.16"/>
    </filter>
    <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
      <path d="M46 0H0V46" fill="none" stroke="${C.line}" stroke-width="1" opacity="0.45"/>
    </pattern>
    ${defs}
  </defs>
  <rect width="${width}" height="${height}" fill="${C.bg}"/>
  ${body}
</svg>`;
}

function text(x, y, value, size = 32, fill = C.navy, weight = 600, extra = "") {
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${esc(value)}</text>`;
}

function centered(x, y, value, size = 32, fill = C.navy, weight = 600) {
  return text(x, y, value, size, fill, weight, 'text-anchor="middle"');
}

function label(x, y, value, fill = C.gold) {
  return `<g><rect x="${x}" y="${y - 28}" rx="18" width="${Math.max(80, value.length * 16)}" height="40" fill="${fill}" opacity="0.16"/>
  ${text(x + 18, y, value, 18, fill, 800)}</g>`;
}

function chip(x, y, value, fill, w = 150) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="42" rx="21" fill="${fill}" opacity="0.15" stroke="${fill}" stroke-width="2"/>
  ${centered(x + w / 2, y + 28, value, 16, C.navy, 700)}</g>`;
}

function coverFront() {
  const w = 1800, h = 2700;
  const nodes = Array.from({ length: 42 }, (_, i) => {
    const a = i * 0.56;
    const r = 54 + i * 13;
    const x = 900 + Math.cos(a) * r;
    const y = 1090 + Math.sin(a) * r * 0.78;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 5 === 0 ? 13 : 8}" fill="${i % 4 === 0 ? C.gold : C.blue}" opacity="${0.45 + (i % 4) * 0.12}"/>`;
  }).join("\n");
  const lines = Array.from({ length: 36 }, (_, i) => {
    const a1 = i * 0.56, a2 = (i + 1) * 0.56;
    const r1 = 54 + i * 13, r2 = 54 + (i + 1) * 13;
    const x1 = 900 + Math.cos(a1) * r1;
    const y1 = 1090 + Math.sin(a1) * r1 * 0.78;
    const x2 = 900 + Math.cos(a2) * r2;
    const y2 = 1090 + Math.sin(a2) * r2 * 0.78;
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${C.blue}" stroke-width="4" opacity="0.25"/>`;
  }).join("\n");

  const body = `
  <rect width="${w}" height="${h}" fill="${C.navy}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)" opacity="0.16"/>
  <circle cx="900" cy="1110" r="650" fill="${C.blue}" opacity="0.08"/>
  ${lines}
  ${nodes}
  <path d="M640 1850c140-80 250-82 340-10 58 45 96 110 152 142 66 38 150 15 250-65" fill="none" stroke="${C.gold}" stroke-width="18" stroke-linecap="round" opacity="0.9"/>
  <path d="M748 1914c40-128 94-210 156-246 42-24 86-27 131-8" fill="none" stroke="${C.sand}" stroke-width="12" stroke-linecap="round"/>
  <circle cx="1036" cy="1658" r="34" fill="${C.gold}"/>
  <path d="M1034 1694c-18 70-34 128-48 176" stroke="${C.sand}" stroke-width="22" stroke-linecap="round"/>
  <path d="M986 1820c-66 28-113 74-141 138" stroke="${C.sand}" stroke-width="20" stroke-linecap="round"/>
  <path d="M994 1822c62 34 111 83 148 148" stroke="${C.sand}" stroke-width="20" stroke-linecap="round"/>
  <rect x="210" y="154" width="1380" height="8" fill="${C.gold}"/>
  ${text(210, 370, "OPC", 168, C.gold, 900)}
  ${text(210, 540, "生存手册", 132, C.bg, 900)}
  ${text(215, 660, "AI时代一人创作者的生存实战指南", 52, C.sand, 600)}
  <rect x="214" y="760" width="460" height="78" rx="39" fill="${C.gold}"/>
  ${centered(444, 812, "One Person Creator", 34, C.navy, 800)}
  ${text(210, 2400, "一个人 + AI = 一个团队", 58, C.bg, 800)}
  ${text(210, 2490, "从0到月入$10K的创作、分发与变现系统", 42, C.sand, 500)}
  ${text(210, 2600, "MoKangMedical · 2026", 34, C.gold, 700)}
  `;
  return { name: "cover/front-cover", width: w, height: h, svg: svgWrap(w, h, body) };
}

function coverWrap() {
  const w = 3675, h = 2775;
  const body = `
  <rect width="${w}" height="${h}" fill="${C.navy}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)" opacity="0.12"/>
  <rect x="80" y="80" width="3515" height="2615" rx="28" fill="none" stroke="${C.gold}" stroke-width="6" opacity="0.65"/>
  <rect x="1745" y="80" width="185" height="2615" fill="${C.navy2}" opacity="0.9"/>
  ${centered(1838, 1110, "OPC", 90, C.gold, 900)}
  ${centered(1838, 1230, "生存手册", 48, C.bg, 800)}
  ${centered(1838, 2550, "2026", 34, C.sand, 700)}
  ${text(260, 360, "写给AI时代一人创作者的实战手册", 56, C.gold, 900)}
  ${text(260, 470, "这本书解决三个问题：如何选方向，如何用AI把一个人扩成一个团队，如何把内容、产品和信任变成稳定收入。", 36, C.bg, 500)}
  ${text(260, 560, "它不是鸡血故事，而是一套从定位、工具、生产线、分发、变现到风险控制的操作系统。", 36, C.bg, 500)}
  <rect x="260" y="850" width="1140" height="620" rx="34" fill="${C.bg}" opacity="0.96"/>
  ${text(330, 960, "适合谁阅读", 46, C.navy, 900)}
  ${text(330, 1070, "• 想用AI做副业或独立产品的人", 34, C.navy, 600)}
  ${text(330, 1150, "• 需要把专业能力产品化的自由职业者", 34, C.navy, 600)}
  ${text(330, 1230, "• 已经在创作，但缺少商业闭环的内容创作者", 34, C.navy, 600)}
  ${text(330, 1310, "• 想批量发布电子书、模板、课程和微产品的OPC", 34, C.navy, 600)}
  <rect x="650" y="2200" width="420" height="420" fill="${C.bg}"/>
  ${centered(860, 2420, "BARCODE", 46, C.navy, 800)}
  ${text(2070, 370, "OPC", 168, C.gold, 900)}
  ${text(2070, 540, "生存手册", 132, C.bg, 900)}
  ${text(2076, 660, "AI时代一人创作者的生存实战指南", 52, C.sand, 600)}
  <circle cx="2890" cy="1260" r="610" fill="${C.blue}" opacity="0.08"/>
  <path d="M2570 1840c140-80 250-82 340-10 58 45 96 110 152 142 66 38 150 15 250-65" fill="none" stroke="${C.gold}" stroke-width="18" stroke-linecap="round"/>
  ${text(2070, 2400, "一个人 + AI = 一个团队", 58, C.bg, 800)}
  ${text(2070, 2490, "MoKangMedical · 2026", 34, C.gold, 700)}
  `;
  return { name: "cover/print-wrap-cover", width: w, height: h, svg: svgWrap(w, h, body) };
}

function chapterAsset(name, number, title, subtitle, scene) {
  const w = 1200, h = 1600;
  const body = `
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)" opacity="0.34"/>
  <rect x="70" y="70" width="1060" height="1460" rx="42" fill="${C.card}" filter="url(#softShadow)"/>
  <rect x="70" y="70" width="1060" height="1460" rx="42" fill="none" stroke="${C.line}" stroke-width="2"/>
  ${label(130, 180, `第${number}章`, C.gold)}
  ${text(130, 278, title, 58, C.navy, 900)}
  ${text(134, 336, subtitle, 28, C.ink2, 500)}
  <g transform="translate(110 430)">
    ${sceneGraphic(scene)}
  </g>
  <rect x="130" y="1390" width="280" height="8" fill="${C.gold}"/>
  ${text(130, 1460, "OPC SURVIVAL HANDBOOK", 25, C.ink2, 800)}
  `;
  return { name: `illustrations/${name}`, width: w, height: h, svg: svgWrap(w, h, body) };
}

function sceneGraphic(scene) {
  const base = `<rect x="20" y="20" width="940" height="790" rx="38" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>`;
  const scenes = {
    city: `
      ${base}<rect x="60" y="90" width="860" height="500" rx="28" fill="${C.navy}"/>
      <circle cx="780" cy="170" r="74" fill="${C.gold}" opacity="0.9"/>
      ${[120,220,330,470,590,700,820].map((x,i)=>`<rect x="${x}" y="${350-i*25}" width="${72+i*8}" height="${240+i*25}" fill="${i%2?C.blue:C.sand}" opacity="0.88"/>`).join("")}
      <rect x="380" y="610" width="230" height="95" rx="18" fill="${C.navy2}"/>
      <rect x="420" y="540" width="150" height="70" rx="20" fill="${C.card}" stroke="${C.gold}" stroke-width="8"/>
      <circle cx="497" cy="500" r="42" fill="${C.gold}"/>
      <path d="M496 544v112M496 600l-82 74M496 600l88 72" stroke="${C.navy}" stroke-width="22" stroke-linecap="round"/>
      <path d="M220 260c250-110 474-98 670 42" fill="none" stroke="${C.gold}" stroke-width="8" stroke-dasharray="18 18" opacity="0.75"/>`,
    climb: `
      ${base}<rect x="60" y="80" width="860" height="560" rx="28" fill="${C.navy}"/>
      <path d="M135 640 470 120 805 640Z" fill="${C.ink2}"/>
      <path d="M470 120 890 640H620Z" fill="${C.navy2}"/>
      <path d="M342 520c50-80 94-124 132-132 34-7 72 14 114 64" fill="none" stroke="${C.gold}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="486" cy="365" r="34" fill="${C.gold}"/>
      <path d="M506 382l74 82M488 402l-64 76M520 402l-4 120" stroke="${C.sand}" stroke-width="20" stroke-linecap="round"/>
      <path d="M610 210c88 8 150 46 184 114" fill="none" stroke="${C.blue}" stroke-width="22" stroke-linecap="round"/>
      <circle cx="803" cy="332" r="26" fill="${C.blue}"/>`,
    ikigai: `
      ${base}<rect x="60" y="80" width="860" height="560" rx="28" fill="${C.navy}"/>
      <circle cx="408" cy="320" r="180" fill="${C.teal}" opacity="0.45"/>
      <circle cx="548" cy="320" r="180" fill="${C.gold}" opacity="0.45"/>
      <circle cx="478" cy="220" r="180" fill="${C.purple}" opacity="0.40"/>
      <circle cx="478" cy="420" r="180" fill="${C.coral}" opacity="0.38"/>
      ${centered(478, 338, "AI", 72, C.bg, 900)}
      ${centered(320, 318, "热爱", 30, C.bg, 800)}
      ${centered(640, 318, "技能", 30, C.bg, 800)}
      ${centered(478, 174, "需求", 30, C.bg, 800)}
      ${centered(478, 520, "付费", 30, C.bg, 800)}
      <path d="M210 660h540" stroke="${C.gold}" stroke-width="10" stroke-linecap="round"/>`,
    dashboard: `
      ${base}<rect x="60" y="80" width="860" height="560" rx="28" fill="${C.navy}"/>
      ${[0,1,2,3].map((i)=>`<rect x="${120+i*185}" y="${140+(i%2)*70}" width="150" height="210" rx="18" fill="${i%2?C.blue:C.gold}" opacity="0.16" stroke="${i%2?C.blue:C.gold}" stroke-width="4"/>
      <path d="M145 ${200+(i%2)*70}h95M145 ${240+(i%2)*70}h70M145 ${280+(i%2)*70}h105" stroke="${i%2?C.blue:C.gold}" stroke-width="8" stroke-linecap="round"/>`).join("")}
      <circle cx="478" cy="480" r="96" fill="${C.bg}" opacity="0.95"/>
      ${centered(478, 504, "OPC", 42, C.navy, 900)}
      <path d="M478 380V270M388 438 240 300M568 438 720 300" stroke="${C.gold}" stroke-width="8" stroke-dasharray="16 14"/>`,
    factory: `
      ${base}<rect x="60" y="90" width="860" height="540" rx="28" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>
      <path d="M150 490h640" stroke="${C.navy}" stroke-width="42" stroke-linecap="round"/>
      ${["选题","初稿","润色","分发"].map((v,i)=>`<rect x="${135+i*190}" y="${235}" width="150" height="160" rx="22" fill="${[C.teal,C.gold,C.purple,C.coral][i]}" opacity="0.18" stroke="${[C.teal,C.gold,C.purple,C.coral][i]}" stroke-width="4"/>
      ${centered(210+i*190, 325, v, 28, C.navy, 800)}
      <circle cx="${210+i*190}" cy="490" r="34" fill="${[C.teal,C.gold,C.purple,C.coral][i]}"/>`).join("")}
      <path d="M310 490h60M500 490h60M690 490h60" stroke="${C.bg}" stroke-width="10" stroke-linecap="round"/>`,
    signal: `
      ${base}<rect x="60" y="80" width="860" height="560" rx="28" fill="${C.navy}"/>
      <path d="M110 615c180-170 520-168 800 0Z" fill="${C.ink2}"/>
      <circle cx="478" cy="390" r="58" fill="${C.gold}"/>
      <path d="M478 448v126" stroke="${C.gold}" stroke-width="18"/>
      ${[[240,220,"X"],[720,230,"R"],[210,500,"微"],[745,500,"YT"],[480,150,"SEO"]].map(([x,y,t])=>`<path d="M478 392 L${x} ${y}" stroke="${C.blue}" stroke-width="6" opacity="0.65"/><circle cx="${x}" cy="${y}" r="56" fill="${C.bg}" opacity="0.96"/>${centered(x,y+10,t,30,C.navy,900)}`).join("")}`,
    tree: `
      ${base}<rect x="60" y="90" width="860" height="540" rx="28" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>
      <path d="M480 580c-30-150-26-284 18-404" stroke="${C.navy}" stroke-width="44" stroke-linecap="round"/>
      <path d="M490 360c-120-20-206-82-258-184M502 330c116-32 200-96 252-190M492 430c-100 18-174 72-222 162M508 430c108 20 192 74 252 162" stroke="${C.navy}" stroke-width="26" stroke-linecap="round"/>
      ${[[260,165,"订"],[745,140,"$"],[250,595,"课"],[768,595,"SaaS"],[480,170,"信任"]].map(([x,y,t],i)=>`<circle cx="${x}" cy="${y}" r="${i===4?72:52}" fill="${[C.teal,C.gold,C.purple,C.coral,C.green][i]}" opacity="0.88"/>${centered(x,y+10,t,26,C.bg,900)}`).join("")}
      <path d="M270 650h420" stroke="${C.gold}" stroke-width="22" stroke-linecap="round"/>`,
    shield: `
      ${base}<rect x="60" y="80" width="860" height="560" rx="28" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>
      ${[350,270,190,110].map((r,i)=>`<circle cx="480" cy="360" r="${r}" fill="none" stroke="${[C.navy,C.gold,C.blue,C.coral][i]}" stroke-width="20" opacity="${0.18+i*0.17}"/>`).join("")}
      <path d="M480 165 640 232v122c0 120-58 204-160 254-102-50-160-134-160-254V232Z" fill="${C.navy}" opacity="0.9"/>
      ${centered(480, 374, "OPC", 58, C.gold, 900)}
      ${[["法务",480,105],["财务",780,360],["数据",480,690],["心理",178,360]].map(([v,x,y])=>chip(x-58,y-22,v,C.gold,116)).join("")}`,
    scale: `
      ${base}<rect x="60" y="90" width="860" height="540" rx="28" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>
      <rect x="450" y="190" width="60" height="390" rx="30" fill="${C.navy}"/>
      <path d="M280 270h400" stroke="${C.navy}" stroke-width="18" stroke-linecap="round"/>
      <path d="M300 270 220 455h160Z" fill="${C.blue}" opacity="0.22" stroke="${C.blue}" stroke-width="6"/>
      <path d="M660 270 580 455h160Z" fill="${C.gold}" opacity="0.22" stroke="${C.gold}" stroke-width="6"/>
      ${centered(300, 422, "AI工作", 30, C.navy, 800)}
      ${centered(660, 422, "身体", 30, C.navy, 800)}
      <path d="M345 515h270" stroke="${C.gold}" stroke-width="20" stroke-linecap="round"/>
      <circle cx="480" cy="270" r="42" fill="${C.gold}"/>`,
    mirror: `
      ${base}<rect x="60" y="80" width="860" height="560" rx="28" fill="${C.navy}"/>
      <rect x="345" y="130" width="270" height="430" rx="135" fill="${C.bg}" opacity="0.92"/>
      <rect x="378" y="172" width="204" height="346" rx="102" fill="${C.blue}" opacity="0.22"/>
      ${Array.from({length:18},(_,i)=>`<circle cx="${398+(i%6)*36}" cy="${232+Math.floor(i/6)*68}" r="17" fill="${i%3===0?C.gold:C.navy}" opacity="${i%3===0?0.9:0.65}"/>`).join("")}
      <circle cx="480" cy="650" r="45" fill="${C.gold}"/>
      <path d="M480 696v100M480 742l-92 76M480 742l92 76" stroke="${C.navy}" stroke-width="24" stroke-linecap="round"/>
      <path d="M190 670c160-74 418-74 580 0" fill="none" stroke="${C.gold}" stroke-width="10" stroke-dasharray="18 18"/>`,
  };
  return scenes[scene] || base;
}

function roadmapAsset() {
  const w = 1200, h = 1600;
  const phases = [
    ["Phase 1", "验证", "$0-500", "第一单", C.teal, 230, 1270],
    ["Phase 2", "优化", "$500-1.5K", "$1K MRR", C.gold, 760, 1050],
    ["Phase 3", "规模", "$2K-5K", "内容工厂", C.purple, 340, 740],
    ["Phase 4", "多元", "$5K-10K+", "产品矩阵", C.coral, 820, 455],
  ];
  const body = `
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)" opacity="0.28"/>
  ${centered(600, 135, "OPC变现路线图", 58, C.navy, 900)}
  ${centered(600, 188, "从$0到$10K/月的一人创作者路径", 27, C.ink2, 600)}
  <path d="M190 1320 C 870 1320, 250 900, 710 850 S 1030 520, 805 350" fill="none" stroke="${C.sand}" stroke-width="74" stroke-linecap="round"/>
  <path d="M190 1320 C 870 1320, 250 900, 710 850 S 1030 520, 805 350" fill="none" stroke="${C.gold}" stroke-width="34" stroke-linecap="round"/>
  ${phases.map(([p,n,income,milestone,color,x,y])=>`
    <g filter="url(#softShadow)">
      <rect x="${x-145}" y="${y-105}" width="290" height="210" rx="28" fill="${C.card}" stroke="${color}" stroke-width="5"/>
      ${centered(x, y-52, p, 24, color, 900)}
      ${centered(x, y-10, n, 38, C.navy, 900)}
      ${centered(x, y+42, income, 34, color, 900)}
      ${centered(x, y+84, milestone, 22, C.ink2, 700)}
    </g>`).join("")}
  ${text(115, 1480, "核心原则：每个阶段只优化一个主指标，不要提前复杂化。", 30, C.navy, 700)}
  `;
  return { name: "infographics/monetization-roadmap", width: w, height: h, svg: svgWrap(w, h, body) };
}

function matrixAsset() {
  const w = 1200, h = 1600;
  const rows = [["写作", "ChatGPT / Claude / Custom GPTs"], ["图像", "DALL-E / Midjourney / SDXL"], ["视频", "CapCut / Runway / HeyGen"], ["音频", "Descript / ElevenLabs / Suno"], ["代码", "v0 / Cursor / Claude Code"], ["自动化", "Zapier / Make / Agents"]];
  const cols = ["入门", "进阶", "高级"];
  const body = `
  <rect width="${w}" height="${h}" fill="${C.navy}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)" opacity="0.12"/>
  ${centered(600, 125, "AI工具选择矩阵", 58, C.bg, 900)}
  ${centered(600, 180, "50+ Tools for One Person Creators", 28, C.sand, 700)}
  ${cols.map((c,i)=>centered(405+i*245, 294, c, 30, [C.teal,C.gold,C.purple][i], 900)).join("")}
  ${rows.map((r,ri)=>`
    ${text(90, 390+ri*170, r[0], 28, C.gold, 900)}
    ${cols.map((c,ci)=>`<rect x="${285+ci*245}" y="${330+ri*170}" width="205" height="118" rx="20" fill="${[C.teal,C.gold,C.purple][ci]}" opacity="0.14" stroke="${[C.teal,C.gold,C.purple][ci]}" stroke-width="3"/>
      ${centered(388+ci*245, 384+ri*170, r[1].split(" / ")[ci] || "AI", 20, C.bg, 800)}
      ${centered(388+ci*245, 418+ri*170, ci===0?"Starter":ci===1?"Pro":"Agent", 15, C.sand, 600)}`).join("")}
  `).join("")}
  <rect x="90" y="1395" width="1020" height="92" rx="26" fill="${C.bg}" opacity="0.95"/>
  ${text(130, 1455, "选择原则：先用入门工具验证需求，再为瓶颈升级，不为工具本身付费。", 28, C.navy, 800)}
  `;
  return { name: "infographics/ai-tools-matrix", width: w, height: h, svg: svgWrap(w, h, body) };
}

function checklistAsset() {
  const w = 1200, h = 1600;
  const weeks = [
    ["选择方向", C.teal, ["列技能兴趣", "分析niche", "定用户画像", "调研竞品", "使命宣言", "差异化", "验证假设"]],
    ["搭建工具", C.gold, ["注册AI账号", "设计工具", "落地页", "收款账户", "域名邮箱", "自动化", "工作台"]],
    ["创作内容", C.purple, ["产品大纲", "完成初稿", "社媒帖子", "首次发布", "长文", "短视频", "内容日历"]],
    ["发布变现", C.coral, ["上架产品", "社群分享", "发布文案", "设置价格", "邀请反馈", "快速迭代", "复盘目标"]],
  ];
  const body = `
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  ${centered(600, 110, "OPC 30天启动清单", 56, C.navy, 900)}
  ${centered(600, 160, "从零到第一单，每天完成一个动作", 28, C.ink2, 600)}
  ${weeks.map((week, wi)=>`
    <rect x="75" y="${230+wi*315}" width="1050" height="268" rx="28" fill="${week[1]}" opacity="0.10" stroke="${week[1]}" stroke-width="4"/>
    ${text(110, 284+wi*315, `第${wi+1}周 · ${week[0]}`, 30, week[1], 900)}
    ${week[2].map((item,di)=>`
      <rect x="${110+(di%4)*248}" y="${310+wi*315+Math.floor(di/4)*86}" width="220" height="58" rx="16" fill="${C.card}" stroke="${C.line}"/>
      ${text(130+(di%4)*248, 348+wi*315+Math.floor(di/4)*86, `${String(wi*7+di+1).padStart(2,"0")} ${item}`, 19, C.navy, 800)}
    `).join("")}
  `).join("")}
  <rect x="110" y="1500" width="980" height="28" rx="14" fill="${C.line}"/>
  <rect x="110" y="1500" width="980" height="28" rx="14" fill="${C.gold}"/>
  ${centered(600, 1568, "30/30 完成后，你至少拥有一个可售卖产品和一个分发闭环", 25, C.navy, 800)}
  `;
  return { name: "infographics/30-day-checklist", width: w, height: h, svg: svgWrap(w, h, body) };
}

function comparisonAsset() {
  const w = 1200, h = 1600;
  const rows = [
    ["团队规模", "10-50人", "1人+AI"],
    ["启动资金", "$50K+", "$0-500"],
    ["试错成本", "高", "低"],
    ["决策速度", "周级", "即时"],
    ["风险类型", "系统风险", "个人可控"],
    ["AI杠杆", "辅助", "核心引擎"],
  ];
  const body = `
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  <rect x="0" y="0" width="600" height="${h}" fill="#E8EDF2"/>
  <rect x="600" y="0" width="600" height="${h}" fill="#FFF8ED"/>
  <rect x="590" width="20" height="${h}" fill="${C.gold}"/>
  ${centered(600, 120, "传统创业 vs OPC创业", 52, C.navy, 900)}
  ${centered(600, 172, "AI时代的创业范式转移", 27, C.ink2, 700)}
  ${centered(300, 280, "传统创业", 42, "#5B6E8A", 900)}
  ${centered(900, 280, "OPC创业", 42, C.gold, 900)}
  <g opacity="0.85">
    <rect x="175" y="350" width="250" height="160" rx="28" fill="#5B6E8A"/>
    ${Array.from({length:12},(_,i)=>`<circle cx="${215+(i%4)*55}" cy="${395+Math.floor(i/4)*45}" r="18" fill="${C.bg}" opacity="0.8"/>`).join("")}
    <rect x="780" y="350" width="240" height="160" rx="28" fill="${C.gold}"/>
    <circle cx="900" cy="410" r="42" fill="${C.navy}"/>
    <path d="M900 455v70M900 480l-62 50M900 480l62 50" stroke="${C.navy}" stroke-width="18" stroke-linecap="round"/>
  </g>
  ${rows.map((r,i)=>`
    <rect x="100" y="${610+i*120}" width="1000" height="74" rx="37" fill="${C.card}" filter="url(#softShadow)"/>
    ${text(138, 658+i*120, r[1], 24, "#5B6E8A", 800)}
    ${centered(600, 658+i*120, r[0], 25, C.navy, 900)}
    ${text(885, 658+i*120, r[2], 26, C.gold, 900, 'text-anchor="middle"')}
  `).join("")}
  ${centered(600, 1450, "创业范式的根本转移：更少资源，更快验证，更强AI杠杆", 28, C.navy, 800)}
  `;
  return { name: "infographics/traditional-vs-opc", width: w, height: h, svg: svgWrap(w, h, body) };
}

async function writeAsset(asset) {
  const svgPath = join(assetRoot, `${asset.name}.svg`);
  const pngPath = join(assetRoot, `${asset.name}.png`);
  const svg = asset.svg.split("\n").map((line) => line.trimEnd()).join("\n") + "\n";
  await mkdir(dirname(svgPath), { recursive: true });
  await writeFile(svgPath, svg, "utf8");
  if (comfyRasterOverrides.has(asset.name)) {
    await copyFile(join(assetRoot, comfyRasterOverrides.get(asset.name)), pngPath);
  } else {
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  }
  console.log(`generated ${asset.name}.svg + .png`);
}

for (const asset of assets) {
  await writeAsset(asset);
}
