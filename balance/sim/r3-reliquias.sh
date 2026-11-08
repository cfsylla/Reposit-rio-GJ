#!/bin/bash
# Laboratório de relíquias (Carlos 08/11, só medição). Pareado: 10 decks de teste x 20 seeds, uma árvore por chamada.
# Configurações: base; sem relíquias; +35 de ouro no início (preço médio); começar com cada uma das 25 relíquias equipada.
# Uso: r3-reliquias.sh <árvore ex. nodes10> <saída>
cd "$(dirname "$0")/../.."; T=$1; O=$2; mkdir -p $O
D=vanguard,fireline,corsair,blades,balanced,swift,dark_court,goblin_horde,dawncrest_choir,centaur_charge
R="banner heart scope tome boots shield precision hourglass recovery merchant quickstart spark luckycharm plating laststand repulsion fang execution ember bell captain_standard profane_idol colossal_heart dormant_sword travelers_mirror"
{ echo "base -"; echo "semreliquia -"; echo "ouro35 -"; for r in $R; do echo "rel $r"; done; } | xargs -P 4 -L 1 bash -c 'X=""; [ "$0" = semreliquia ] && X="GJ_NO_RELICS=1"; [ "$0" = ouro35 ] && X="GJ_START_GOLD=35"; [ "$0" = rel ] && X="GJ_FORCE_RELIC=$1"; env $X GJ_ROOT=game_r3 node balance/sim/run.cjs --decks '$D' --seeds ${SEEDS:-1-20} --tree '$T' --treebuy all --events safe --shop balanced --out '$O'/$0_$1.jsonl > '$O'/$0_$1.log 2>&1'
echo REL_DONE $T $(date +%T)
