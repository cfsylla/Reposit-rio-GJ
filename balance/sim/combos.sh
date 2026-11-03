#!/usr/bin/env bash
# Dangerous combinations: lines "NAME|tree|run.cjs args" -> balance/out/limits/<NAME>__<deck>.jsonl (24 decks x SEEDS)
SEEDS=${SEEDS:-1-10}; OUT=balance/out/limits; mkdir -p $OUT; J=$(mktemp)
while IFS='|' read -r n t a; do for d in $(cat balance/out/rev1/decks.txt); do echo "$n|$t|$d|$a" >> $J; done; done < ${1:-balance/out/logs/combos.txt}
cat $J | xargs -P 4 -I{} sh -c 'IFS="|"; set -- $(echo "{}"); n=$1; t=$2; d=$3; a=$4; unset IFS; GJ_ROOT=game_p5 node balance/sim/run.cjs --decks $d --seeds '$SEEDS' --events safe --shop balanced --tree $t $a --out '$OUT'/${n}__$d.jsonl > /dev/null 2>&1'
rm -f $J; echo "COMBOS DONE"
