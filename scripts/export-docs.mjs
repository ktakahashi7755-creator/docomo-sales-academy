// 正式ドキュメント（docs/PGA-*）を A4 PDF へ書き出す。
// 使い方: npm i --no-save marked mermaid && \
//   PW_EXECUTABLE_PATH=/opt/pw-browsers/chromium node scripts/export-docs.mjs [出力先dir]
// mermaid コードブロックは実レンダリングし、絵文字マーカーは色付き記号に置換する。
import { chromium } from "@playwright/test";
import { marked } from "marked";
import { readFileSync, mkdirSync } from "fs";
import { resolve } from "path";

const OUT = process.argv[2] ?? "/tmp/pga-docs";
mkdirSync(OUT, { recursive: true });

const DOCS = [
  ["REQUIREMENTS_SPEC.md", "PGA-RD-001_要件定義書"],
  ["BASIC_DESIGN.md", "PGA-BD-001_基本設計書"],
  ["DETAILED_DESIGN.md", "PGA-DD-001_詳細設計書"],
  ["WBS_SCHEDULE.md", "PGA-PM-001_WBS・スケジュール"],
  ["TEST_SPEC.md", "PGA-QA-001_テスト仕様書"],
  ["OPERATIONS_RELEASE.md", "PGA-OPS-001_運用・リリース手順書"],
];

const CSS = `
  *{box-sizing:border-box}
  body{font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP",Meiryo,sans-serif;
       color:#1e293b;font-size:10.5pt;line-height:1.8;margin:0;padding:0 4px}
  h1{font-size:17pt;color:#16305a;border-bottom:3px solid #16305a;padding-bottom:8px;
     margin:0 0 14px;letter-spacing:-.01em;line-height:1.35}
  h2{font-size:13pt;color:#16305a;margin:22px 0 8px;padding-left:10px;border-left:4px solid #2563eb}
  h3{font-size:11.5pt;color:#1e293b;margin:16px 0 6px}
  p{margin:6px 0}
  table{border-collapse:collapse;width:100%;margin:8px 0 14px;font-size:9pt;line-height:1.6}
  th{background:#16305a;color:#fff;font-weight:700;text-align:left;padding:5px 8px;border:1px solid #16305a}
  td{padding:5px 8px;border:1px solid #cbd5e1;vertical-align:top}
  tr:nth-child(even) td{background:#f6f8fb}
  code{font-family:"SFMono-Regular",Consolas,Menlo,monospace;font-size:8.5pt;background:#eef2f7;
       border-radius:3px;padding:1px 4px;color:#0f3d8c}
  pre{background:#f6f8fb;border:1px solid #dbe3ee;border-radius:8px;padding:10px 12px;overflow:hidden;
      white-space:pre-wrap;word-break:break-all}
  pre code{background:none;padding:0}
  blockquote{margin:8px 0;padding:8px 14px;border-left:4px solid #d97706;background:#fffaf0;color:#7c5205}
  ul,ol{margin:6px 0;padding-left:22px}
  li{margin:2px 0}
  hr{border:0;border-top:1px solid #cbd5e1;margin:16px 0}
  a{color:#2563eb;text-decoration:none}
  .mermaid{display:flex;justify-content:center;margin:10px 0 16px}
  .mermaid svg{max-width:100%;height:auto}
  .mermaid.wide{width:1180px;display:block}
  .mermaid.wide svg{max-width:none}
  h1,h2,h3{page-break-after:avoid}
  table,pre,.mermaid{page-break-inside:avoid}
  .sev{font-weight:700}
`;

function toHtml(md) {
  // mermaid フェンスを退避してから markdown 変換
  const blocks = [];
  md = md.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    blocks.push(code);
    return `%%MERMAID${blocks.length - 1}%%`;
  });
  let html = marked.parse(md, { gfm: true, breaks: false });
  html = html.replace(/%%MERMAID(\d+)%%/g, (_, i) => {
    const code = blocks[+i];
    // ガントは横幅が必要なため広幅で描画し、後段で紙面幅へ zoom フィットさせる
    const wide = /^\s*gantt/m.test(code) ? " wide" : "";
    return `<div class="mermaid${wide}">${code}</div>`;
  });
  // 絵文字マーカーをPDF安全な色付き記号へ
  html = html
    .replaceAll("🔴", '<span class="sev" style="color:#dc2626">［重大］</span>')
    .replaceAll("🟡", '<span class="sev" style="color:#d97706">［注意］</span>')
    .replaceAll("🟢", '<span class="sev" style="color:#059669">［良好］</span>');
  return html;
}

const browser = await chromium.launch({
  executablePath: process.env.PW_EXECUTABLE_PATH || undefined,
});
const page = await browser.newPage();
const mermaidJs = readFileSync(resolve("node_modules/mermaid/dist/mermaid.min.js"), "utf8");

for (const [file, outName] of DOCS) {
  const md = readFileSync(resolve("docs", file), "utf8");
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${toHtml(md)}</body></html>`;
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.addScriptTag({ content: mermaidJs });
  const failed = await page.evaluate(async () => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      fontFamily: '"Hiragino Sans","Noto Sans JP",sans-serif',
      gantt: { fontSize: 11, barHeight: 16 },
    });
    const fails = [];
    const nodes = Array.from(document.querySelectorAll(".mermaid"));
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      const src = el.textContent ?? "";
      try {
        await mermaid.run({ nodes: [el] });
      } catch (e) {
        fails.push({ i, message: String(e && e.message ? e.message : e) });
        const pre = document.createElement("pre");
        pre.textContent = src;
        el.replaceWith(pre);
      }
    }
    // 広幅ガントを紙面幅へフィット（実SVG幅で計算。zoom はレイアウト幅も縮む）
    const bodyW = document.body.clientWidth;
    document.querySelectorAll(".mermaid.wide").forEach((el) => {
      const svg = el.querySelector("svg");
      const w = svg ? svg.getBoundingClientRect().width : 1180;
      el.style.zoom = String(Math.min(1, bodyW / (w + 8)));
    });
    return fails;
  });
  for (const f of failed) console.warn(`  mermaid失敗(${file} #${f.i}): ${f.message}`);
  await page.waitForTimeout(300);
  await page.pdf({
    path: `${OUT}/${outName}.pdf`,
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
    displayHeaderFooter: true,
    headerTemplate: `<div style="width:100%;font-size:7px;color:#94a3b8;padding:0 14mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>Provide Growth Academy</span><span>${outName.replace(/_/g, " ")}</span></div>`,
    footerTemplate: `<div style="width:100%;font-size:7px;color:#94a3b8;padding:0 14mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>プロバイド株式会社</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });
  console.log("pdf:", outName);
}

await browser.close();
console.log("DONE", OUT);
