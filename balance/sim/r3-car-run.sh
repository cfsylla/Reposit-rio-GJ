#!/bin/bash
# Etapa 4: carreiras (10 decks x 4 x 40 runs) com uma variante. Uso: r3-car-run.sh <nome>
cd "$(dirname "$0")/../.."; N=$1; O=balance/out/rodada3/etapa4_car_$N; mkdir -p $O
export GJ_TREE_VARIANT=balance/rodada3/variants/etapa4/$N.json
for d in vanguard fireline corsair blades balanced swift dark_court goblin_horde dawncrest_choir centaur_charge; do for c in 1 2 3 4; do echo "$d $c"; done; done |
  xargs -P 4 -L 1 bash -c 'GJ_ROOT=game_r3 node balance/sim/career.cjs --decks $0 --careers $1 --runs 40 --out '$O'/car_$0_$1.jsonl > '$O'/car_$0_$1.log 2>&1'
node balance/sim/r3-aneis-report.cjs $O balance/out/rodada3/etapa3_aneis > $O/RELATORIO.txt; echo CAR_DONE $N
