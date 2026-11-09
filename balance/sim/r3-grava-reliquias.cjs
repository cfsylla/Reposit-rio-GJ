/* Grava no jogo os valores de uma variante de relíquias (relicTune) — Carlos 09/11 autorizou gravar.
 * Atualiza a tabela RT de game_r3/dist/game-0.js e os padrões DEF de game_r3/dist/relics-r3.js.
 * Uso: node balance/sim/r3-grava-reliquias.cjs <variante.json> [--dry] */
'use strict';
const fs = require('fs');
const [varF, dry] = process.argv.slice(2);
const tune = JSON.parse(fs.readFileSync(varF, 'utf8')).relicTune;
const FILES = [['game_r3/dist/game-0.js', /const RT=root\.JOURNEY_RELIC_TUNE=\{([^}]*)\}/], ['game_r3/dist/relics-r3.js', /const DEF=\{([^}]*)\}/]];
const fmt = v => Number.isInteger(v) ? String(v) : String(+v.toFixed(3)).replace(/^0\./, '.');
const done = new Set(), log = [];
for (const [f, re] of FILES) {
  let s = fs.readFileSync(f, 'utf8'); const m = re.exec(s); if (!m) throw new Error('tabela não encontrada em ' + f);
  let body = m[1];
  for (const [k, v] of Object.entries(tune)) {
    const kr = new RegExp('(^|,)' + k + ':([^,]*)');
    const km = kr.exec(body); if (!km) continue;
    if (km[2].startsWith('...')) continue;
    log.push(`${f.split('/').pop()} ${k}: ${km[2]} → ${fmt(v)}`);
    body = body.replace(kr, `$1${k}:${fmt(v)}`); done.add(k);
  }
  s = s.replace(m[1], body); if (dry !== '--dry') fs.writeFileSync(f, s);
}
const miss = Object.keys(tune).filter(k => !done.has(k));
console.log(log.join('\n')); if (miss.length) { console.error('SEM LUGAR NO JOGO: ' + miss.join(', ')); process.exit(1); }
