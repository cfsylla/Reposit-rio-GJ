#!/bin/bash
# Round 3 stage 1: v50 baseline, 24 decks x 20 seeds x 5 tree states, in groups (common, blackfang, dawncrest).
# Usage: balance/sim/r3-baseline.sh <game copy> <out dir> <prefix>
cd "$(dirname "$0")/../.."; ROOT=$1; O=$2; P=$3; mkdir -p $O
declare -A G=([comuns]=vanguard,balanced,swift,arcane,outlaws,fortress,blades,fireline,astral,corsair,north,verdant,keen,quake,executioners [blackfang]=goblin_horde,greenskins,dark_court,blackfang_war [dawncrest]=meowri_band,high_court,forest_guard,centaur_charge,dawncrest_choir)
for g in comuns blackfang dawncrest; do
  for t in none nodes15 nodes30 nodes45 nodes60; do GJ_ROOT=$ROOT node balance/sim/run.cjs --decks ${G[$g]} --seeds 1-20 --tree $t --out $O/${P}_${t}_$g.jsonl > $O/${P}_${t}_$g.log 2>&1 & done; wait
  echo "GROUP_DONE $g $(date +%T)"
done
echo ALL_DONE
