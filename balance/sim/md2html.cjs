/* Minimal Markdown -> HTML (headings, tables, lists, bold, code, links, blockquote, code blocks) for the checkpoint PDFs.
 * Usage: node md2html.cjs out.html "Title" a.md b.md ... (each file starts a new page) */
'use strict';
const fs = require('fs'); const [out, title, ...files] = process.argv.slice(2);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
function conv(md) {
  const L = md.split('\n'), o = []; let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (/^```/.test(l)) { const b = []; i++; while (i < L.length && !/^```/.test(L[i])) b.push(esc(L[i++])); i++; o.push('<pre>' + b.join('\n') + '</pre>'); continue; }
    if (/^#{1,4} /.test(l)) { const n = l.match(/^#+/)[0].length; o.push(`<h${n}>${inline(l.slice(n + 1))}</h${n}>`); i++; continue; }
    if (/^\|/.test(l)) { const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++]); const cells = r => r.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim());
      o.push('<table><tr>' + cells(rows[0]).map(c => `<th>${inline(c)}</th>`).join('') + '</tr>' + rows.slice(2).map(r => '<tr>' + cells(r).map(c => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</table>'); continue; }
    if (/^> ?/.test(l)) { const b = []; while (i < L.length && /^>/.test(L[i])) b.push(L[i++].replace(/^> ?/, '')); o.push('<blockquote>' + conv(b.join('\n')) + '</blockquote>'); continue; }
    if (/^\s*([-*]|\d+\.) /.test(l)) { const ord = /^\s*\d+\./.test(l), b = []; while (i < L.length && (/^\s*([-*]|\d+\.) /.test(L[i]) || (/^\s{2,}\S/.test(L[i]) && b.length))) { if (/^\s*([-*]|\d+\.) /.test(L[i])) b.push(L[i].replace(/^\s*([-*]|\d+\.) /, '')); else b[b.length - 1] += ' ' + L[i].trim(); i++; }
      o.push((ord ? '<ol>' : '<ul>') + b.map(x => `<li>${inline(x)}</li>`).join('') + (ord ? '</ol>' : '</ul>')); continue; }
    if (!l.trim()) { i++; continue; }
    const p = []; while (i < L.length && L[i].trim() && !/^(#|\||>|```|\s*([-*]|\d+\.) )/.test(L[i])) p.push(L[i++]); o.push('<p>' + inline(p.join(' ')) + '</p>');
  }
  return o.join('\n');
}
const css = '@page{size:A4 landscape;margin:11mm}body{font-family:"DejaVu Sans",Arial,sans-serif;font-size:8.6pt;color:#1b2430}h1{font-size:15pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:3px}h2{font-size:11.5pt;color:#12324a;margin:12px 0 4px}h3{font-size:10pt;color:#12324a}table{border-collapse:collapse;width:100%;margin:4px 0;font-size:7.6pt}th,td{border:1px solid #c8d0d8;padding:2px 4px;vertical-align:top}th{background:#e9eef3}code{background:#f1f3f5;padding:0 2px;font-size:7.4pt}pre{background:#f1f3f5;padding:6px;font-size:7.4pt;white-space:pre-wrap}blockquote{border-left:3px solid #c9a24a;margin:6px 0;padding:2px 10px;background:#faf7ef}.page{page-break-before:always}.page:first-child{page-break-before:auto}';
fs.writeFileSync(out, `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}</style></head><body>` + files.map(f => `<div class="page">${conv(fs.readFileSync(f, 'utf8'))}</div>`).join('') + '</body></html>');
console.log('wrote', out);
