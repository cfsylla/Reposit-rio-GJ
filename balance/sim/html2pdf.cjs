/* HTML -> PDF (A4 landscape) with the pre-installed Playwright Chromium. Usage: node balance/sim/html2pdf.cjs in.html out.pdf */
'use strict';
const { chromium } = require('playwright'); const path = require('path');
(async () => { const [inp, out] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(inp)); await p.pdf({ path: out, format: 'A4', landscape: true, printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
  await b.close(); console.log('wrote', out); })();
