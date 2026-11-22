#!/bin/bash
# Human-benchmark calibration: player bonus files x tree states, 10 decks x seeds. Usage: r3-regua-run.sh <out dir> "<bonus list>" "<tree list>" <seeds>
cd "$(dirname "$0")/../.."; O=$1; B=$2; T=$3; SEEDS=${4:-1-20}; mkdir -p $O
D=vanguard,fireline,corsair,blades,balanced,swift,dark_court,goblin_horde,dawncrest_choir,centaur_charge
for b in $B; do for t in $T; do echo "$b $t"; done; done | xargs -P 4 -L 1 bash -c 'GJ_ROOT=game_r3 GJ_OVERRIDES=balance/rodada3/variants/human/bonus_$0.json node balance/sim/run.cjs --decks '$D' --seeds '$SEEDS' --tree $1 --treebuy all --events safe --shop balanced --out '$O'/m$0_$1.jsonl > '$O'/m$0_$1.log 2>&1'
echo RUN_DONE $(date +%T)
