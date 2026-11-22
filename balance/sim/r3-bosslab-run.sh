#!/bin/bash
# Boss lab batch. Usage: balance/sim/r3-bosslab-run.sh <variant.json|-> <out dir> [trees="nodes15 nodes30"] [decks]
cd "$(dirname "$0")/../.."; V=$1; O=$2; TREES=${3:-"nodes15 nodes30"}; D=${4:-blades,verdant,outlaws,blackfang_war,centaur_charge}; mkdir -p $O
VAR=""; [ "$V" != "-" ] && VAR="GJ_TREE_VARIANT=$V"
for t in $TREES; do for h in 1-20 21-40; do echo "$t $h"; done; done | xargs -P 4 -L 1 bash -c "env GJ_BOSS_LAB=1 GJ_ROOT=game_r3 $VAR node balance/sim/run.cjs --decks $D --seeds \$1 --tree \$0 --treebuy all --out $O/lab_\$0_\$1.jsonl > $O/lab_\$0_\$1.log 2>&1"
echo LAB_DONE $(date +%T)
