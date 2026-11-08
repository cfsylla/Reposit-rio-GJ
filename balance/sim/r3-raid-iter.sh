#!/bin/bash
# Raids (Carlos 08/11): matriz 24 decks x 20 seeds em 0/4/10/18 nós com uma variante. Uso: r3-raid-iter.sh <nome> (variante balance/rodada3/variants/raid/<nome>.json)
cd "$(dirname "$0")/../.."; N=$1; O=balance/out/rodada3/raid_$N; mkdir -p $O
ALL=vanguard,balanced,swift,arcane,outlaws,fortress,blades,fireline,astral,corsair,north,verdant,keen,quake,executioners,goblin_horde,greenskins,dark_court,blackfang_war,meowri_band,high_court,forest_guard,centaur_charge,dawncrest_choir
for t in none nodes4 nodes10 nodes18; do echo $t; done | xargs -P 4 -I{} bash -c "GJ_ROOT=game_r3 GJ_TREE_VARIANT=balance/rodada3/variants/raid/$N.json node balance/sim/run.cjs --decks $ALL --seeds ${SEEDS:-1-20} --tree {} --treebuy all --events safe --shop balanced --out $O/mat_{}.jsonl > $O/mat_{}.log 2>&1"
node balance/sim/r3-raid-report.cjs $O mat_ > $O/RAIDS.md; echo RAID_DONE $N
