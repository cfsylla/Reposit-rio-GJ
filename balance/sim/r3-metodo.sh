#!/bin/bash
# Método novo das relíquias (Carlos 09/11, só medição): bônus puros e relíquias vazias (custo das casas/formatos).
# Pareado: 10 decks de teste x SEEDS, mesma árvore. Uso: r3-metodo.sh <árvore ex. nodes10> <saída> <grupo: bonus|formatos|tudo>
cd "$(dirname "$0")/../.."; T=$1; O=$2; W=${3:-tudo}; mkdir -p $O
D=${DECKS:-vanguard,fireline,corsair,blades,balanced,swift,dark_court,goblin_horde,dawncrest_choir,centaur_charge}
{ echo "base -"; echo "ouro35 GJ_START_GOLD=35"
  if [ $W != formatos ]; then for b in atk:0.05 atk:0.1 atk:0.2 hp:0.1 hp:0.2 shield:0.1 crit:0.1 speed:0.1 skill:0.2 charge:0.3; do echo "bonus_${b/:/_} GJ_PURE_BONUS=$b"; done; fi
  if [ $W != bonus ]; then for f in dot domino diag2 bridge line3 L3 diag3 square T S line4 L4 cross U P L5; do echo "vazia_$f GJ_TEST_FORMATS=1 GJ_FORCE_RELIC=vazia_$f"; done; fi
} | xargs -P 4 -L 1 bash -c 'N=$0; X="$1"; [ "$X" = - ] && X=""; env $X GJ_ROOT=game_r3 node balance/sim/run.cjs --decks '$D' --seeds ${SEEDS:-1-40} --tree '$T' --treebuy all --events safe --shop balanced --out '$O'/$N.jsonl > '$O'/$N.log 2>&1'
echo METODO_DONE $T $W $(date +%T)
