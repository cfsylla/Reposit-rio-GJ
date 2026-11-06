#!/bin/bash
# Aura comparison: fixed tree 15/30 nodes, 10 decks x 30 seeds. Usage: balance/sim/r3-aura-run.sh <variant.json> <out dir>
cd "$(dirname "$0")/../.."; V=$1; O=$2; mkdir -p $O
D=arcane,astral,goblin_horde,blackfang_war,meowri_band,dawncrest_choir,blades,verdant,outlaws,centaur_charge
for t in nodes15 nodes30; do for h in 1-15 16-30; do echo "$t $h"; done; done | xargs -P 4 -L 1 bash -c "env GJ_ROOT=game_r3 GJ_TREE_VARIANT=$V node balance/sim/run.cjs --decks $D --seeds \$1 --tree \$0 --treebuy all --out $O/mat_\$0_\$1.jsonl > $O/mat_\$0_\$1.log 2>&1"
echo RUN_DONE $(date +%T)
