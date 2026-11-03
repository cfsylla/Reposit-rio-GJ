#!/usr/bin/env bash
# Limit test: base / all 15 Advantages / all 15 challenges / everything, at tree level 25 and 50. 24 decks x SEEDS.
# Output: balance/out/limits/<config>__<deck>.jsonl  (config = L25_base, L25_vant, L25_desaf, L25_tudo, L50_...)
SEEDS=${SEEDS:-1-10}; OUT=${OUT:-balance/out/limits}; mkdir -p $OUT
ALLCH=veterans,tough,relentless,commanders,bossrounds,reinforcements,raidfury,inflation,lightpurse,scarce,bag,heavydeck,dissipate,fewrelics,cursed
J=$(mktemp)
for t in 25 50; do for c in base vant desaf tudo; do for d in $(cat balance/out/rev1/decks.txt); do echo "$t $c $d" >> $J; done; done; done
cat $J | xargs -P 4 -L 1 sh -c 't=$0; c=$1; d=$2; X=""; case $c in vant) X="--advantages all";; desaf) X="--challenges '$ALLCH'";; tudo) X="--advantages all --challenges '$ALLCH'";; esac; GJ_ROOT=game_p5 node balance/sim/run.cjs --decks $d --seeds '$SEEDS' --events safe --shop balanced --tree cap${t}0 $X --out '$OUT'/L${t}_${c}__$d.jsonl > /dev/null 2>&1'
rm -f $J; echo "LIMITS DONE"
