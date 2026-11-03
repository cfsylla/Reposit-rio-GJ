#!/usr/bin/env bash
# Late tree node cost test: base game at tree cap (cap500) per cost variant. DECKS=file SEEDS=range
OUT=balance/out/cost; mkdir -p $OUT; J=$(mktemp)
while read -r n; do v=balance/tree_variants/cost/$n.json; [ -f $v ] || v=balance/tree_variants/cost/none.json; for d in $(cat ${DECKS:-balance/out/rev1/decks.txt}); do echo "$n|$v|$d" >> $J; done; done < ${1:-balance/out/logs/cost_jobs.txt}
cat $J | xargs -P 4 -I{} env SEEDS=${SEEDS:-1-40} OUT=$OUT sh -c 'IFS="|"; set -- $(echo "{}"); n=$1; v=$2; d=$3; unset IFS; GJ_TREE_VARIANT=$v GJ_ROOT=game_p5 node balance/sim/run.cjs --decks $d --seeds $SEEDS --events safe --shop balanced --tree cap500 --out $OUT/${n}_$d.jsonl > /dev/null 2>&1'
rm -f $J; echo "COST DONE"
