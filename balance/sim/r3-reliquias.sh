#!/bin/bash
# Laboratório de relíquias (Carlos 08/11, só medição). Pareado: 10 decks de teste x 20 seeds, uma árvore por chamada.
# Configurações: base; sem relíquias; +35 de ouro no início (preço médio); começar com cada uma das 25 relíquias equipada.
# Uso: r3-reliquias.sh <árvore ex. nodes10> <saída>
cd "$(dirname "$0")/../.."; T=$1; O=$2; mkdir -p $O
D=${DECKS:-vanguard,fireline,corsair,blades,balanced,swift,dark_court,goblin_horde,dawncrest_choir,centaur_charge}
R=${RELICS:-$(node -e 'process.env.GJ_ROOT="game_r3";const l=console.log;console.log=()=>{};const E=require("./balance/sim/engine.cjs");console.log=l;console.log(E.G.ARTIFACTS.map(a=>a.id).join(" "))' 2>/dev/null | tail -1)}
{ echo "base -"; echo "semreliquia -"; echo "ouro35 -"; for r in $R; do echo "rel $r"; done; } | xargs -P 4 -L 1 bash -c 'X=""; [ "$0" = semreliquia ] && X="GJ_NO_RELICS=1"; [ "$0" = ouro35 ] && X="GJ_START_GOLD=35"; [ "$0" = rel ] && X="GJ_FORCE_RELIC=$1"; env $X GJ_ROOT=game_r3 node balance/sim/run.cjs --decks '$D' --seeds ${SEEDS:-1-20} --tree '$T' --treebuy all --events safe --shop balanced --out '$O'/$0_$1.jsonl > '$O'/$0_$1.log 2>&1'
echo REL_DONE $T $(date +%T)
