const fs=require('node:fs');
const index=fs.readFileSync('dist/index.html','utf8'),fixture=fs.readFileSync('tests/fixtures/menu-qa.js','utf8');
const content=index.replace('</body>','<script>'+fixture+'</script></body>');
fs.writeFileSync('dist/__qa.html','<!doctype html><style>html,body{margin:0;background:#222}iframe{border:0;display:block;margin:0 auto}</style><script>const p=new URLSearchParams(location.search);window.qaMode=p.get("mode")||"setup";window.qaLang=p.get("lang")||"pt-BR";const f=document.createElement("iframe");f.width=p.get("w")||390;f.height=p.get("h")||844;f.srcdoc='+JSON.stringify(content).replaceAll('<','\\u003c')+';document.addEventListener("DOMContentLoaded",()=>document.body.append(f));</script>');
console.log('Local disposable QA: dist/__qa.html; remove before packaging.');
