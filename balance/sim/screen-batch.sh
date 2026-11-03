#!/usr/bin/env bash
# Screening variant of cand-batch.sh: DECKS=file SEEDS=range OUT=dir balance/sim/screen-batch.sh jobs.txt
# Candidates (each alone, tree level 25, 24 decks x 20 seeds). Jobs file lines: "<name> <run.cjs args>"; variant file
# balance/tree_variants/cand/<name>.json if present (else none.json). Output: balance/out/cand/<name>_<deck>.jsonl
OUT=${OUT:-balance/out/cand}; mkdir -p $OUT; J=$(mktemp)
while read -r name args; do v=balance/tree_variants/cand/$name.json; [ -f $v ] || v=balance/tree_variants/cand/none.json
  for d in $(cat ${DECKS:-balance/out/rev1/decks.txt}); do echo "$name|$v|$d|$args" >> $J; done; done < ${1:-balance/out/logs/cand_jobs.txt}
cat $J | xargs -P 4 -I{} env SEEDS=$SEEDS OUT=$OUT sh -c 'IFS="|"; set -- $(echo "{}"); n=$1; v=$2; d=$3; a=$4; unset IFS; GJ_TREE_VARIANT=$v GJ_ROOT=game_p5 node balance/sim/run.cjs --decks $d --seeds ${SEEDS:-1-20} --events safe --shop balanced --tree cap250 $a --out $OUT/${n}_$d.jsonl > /dev/null 2>&1'
rm -f $J; echo "CAND DONE"
