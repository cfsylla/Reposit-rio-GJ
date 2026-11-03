#!/usr/bin/env bash
# Post-game step 1 by deck group (partial deliveries): for each group (comuns, blackfang, dawncrest), runs the base,
# each challenge alone and each Advantage alone at tree level 25 (cap250), 20 seeds, skipping files already complete.
# Writes "GROUP <name> DONE" to stdout after each group.
SEEDS=${SEEDS:-1-20}; NEED=${NEED:-20}; TREE=${TREE:-cap250}
CH="none veterans tough relentless commanders bossrounds reinforcements raidfury inflation lightpurse scarce bag heavydeck treecap fewrelics cursed"
AD="travel_relic pretraining reinforcement twin full_purse chosen_relic trained_eye rehearsal steady_hand saved_energy cleanse path_blessing interest elite_hunter second_chance"
mkdir -p balance/out/chal_L25 balance/out/adv_L25
for g in comuns blackfang dawncrest; do
  J=$(mktemp)
  for d in $(cat balance/out/logs/grupo_$g.txt); do
    for c in $CH; do f=balance/out/chal_L25/${c}_$d.jsonl; [ -f $f ] && [ $(grep -c . $f) -ge $NEED ] || echo "chal $c $d" >> $J; done
    for a in $AD; do f=balance/out/adv_L25/${a}_$d.jsonl; [ -f $f ] && [ $(grep -c . $f) -ge $NEED ] || echo "adv $a $d" >> $J; done
  done
  cat $J | xargs -P 4 -L 1 sh -c 'k=$0; i=$1; d=$2; if [ $k = chal ]; then A=""; [ $i != none ] && A="--challenges $i"; GJ_ROOT=game_p5 node balance/sim/run.cjs --decks $d --seeds '$SEEDS' --events safe --shop balanced --tree '$TREE' $A --out balance/out/chal_L25/${i}_$d.jsonl > /dev/null 2>&1; else GJ_ROOT=game_p5 node balance/sim/run.cjs --decks $d --seeds '$SEEDS' --events safe --shop balanced --tree '$TREE' --advantages $i --out balance/out/adv_L25/${i}_$d.jsonl > /dev/null 2>&1; fi'
  for d in $(cat balance/out/logs/grupo_$g.txt); do cp -f balance/out/chal_L25/none_$d.jsonl balance/out/adv_L25/none_$d.jsonl 2>/dev/null; done
  rm -f $J; echo "GROUP $g DONE $(date +%H:%M)"
done
echo "ALL GROUPS DONE"
