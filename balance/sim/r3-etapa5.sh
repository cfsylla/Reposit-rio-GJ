#!/bin/bash
# Etapa 5 (só medição): carreiras 24 decks x 4 x 40 runs com o jogo gravado; depois cada Desafio e cada Vantagem sozinhos com 23 nós.
cd "$(dirname "$0")/../.."; O=balance/out/rodada3/etapa5; mkdir -p $O/car $O/pg
ALL="vanguard balanced swift arcane outlaws fortress blades fireline astral corsair north verdant keen quake executioners goblin_horde greenskins dark_court blackfang_war meowri_band high_court forest_guard centaur_charge dawncrest_choir"
for d in $ALL; do for c in 1 2 3 4; do echo "$d $c"; done; done | xargs -P 4 -L 1 bash -c 'GJ_ROOT=game_r3 node balance/sim/career.cjs --decks $0 --careers $1 --runs 40 --out '$O'/car/car_$0_$1.jsonl > '$O'/car/car_$0_$1.log 2>&1'
echo CAR_DONE $(date +%T)
TREE=nodes23 balance/sim/r3-postgame-tree.sh $O/pg
echo ETAPA5_DONE $(date +%T)
