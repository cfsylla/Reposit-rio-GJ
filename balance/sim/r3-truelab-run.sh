#!/bin/bash
# True Boss lab: 30 nodes, 5 decks x 80 seeds. Usage: balance/sim/r3-truelab-run.sh <variant.json> <out dir>
cd "$(dirname "$0")/../.."; V=$1; O=$2; D=blades,verdant,outlaws,blackfang_war,centaur_charge; mkdir -p $O
for h in 1-20 21-40 41-60 61-80; do echo "$h"; done | xargs -P 4 -L 1 bash -c "env GJ_BOSS_LAB=1 GJ_ROOT=game_r3 GJ_TREE_VARIANT=$V node balance/sim/run.cjs --decks $D --seeds \$0 --tree nodes30 --treebuy all --out $O/lab_nodes30_\$0.jsonl > $O/lab_nodes30_\$0.log 2>&1"
echo LAB_DONE $(date +%T)
