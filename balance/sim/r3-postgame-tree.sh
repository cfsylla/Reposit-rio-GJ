#!/bin/bash
# Round 3 stage 3: each Challenge alone and each Advantage alone vs baseline, tree ${TREE:-nodes23} (etapa 5: referência ~57% de vitória), 5 screening decks x 40 seeds,
# same seeds (paired), events safe, shop balanced (CP2 method). Usage: balance/sim/r3-postgame.sh <out dir>
cd "$(dirname "$0")/../.."; O=$1; mkdir -p $O; D=blades,verdant,outlaws,blackfang_war,centaur_charge
CH="veterans tough relentless commanders bossrounds reinforcements raidfury inflation lightpurse scarce bag heavydeck dissipate fewrelics cursed"
AD="travel_relic pretraining flex_prep efficient_fusion full_purse elite_experience trained_eye rehearsal planned_hand saved_energy cleanse path_blessing interest elite_hunter second_chance"
{ echo "none -"; for c in $CH; do echo "ch $c"; done; for a in $AD; do echo "ad $a"; done; } | xargs -P 4 -L 1 bash -c 'ARG=""; [ "$0" = ch ] && ARG="--challenges $1"; [ "$0" = ad ] && ARG="--advantages $1"; GJ_ROOT=game_r3 node balance/sim/run.cjs --decks '$D' --seeds 1-40 --tree ${TREE:-nodes23} --treebuy all --events safe --shop balanced $ARG --out '$O'/$0_$1.jsonl > '$O'/$0_$1.log 2>&1'
echo PG_DONE $(date +%T)
