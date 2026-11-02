#!/usr/bin/env bash
# Usage: balance/sim/challenge-batch.sh SEEDS -> balance/out/chal1/<challenge>_<deck>.jsonl (each challenge alone, tree cap300, game_p5)
set -e
SEEDS=$1; OUT=balance/out/chal1; mkdir -p $OUT
CH="none veterans tough relentless commanders leaders reinforcements raidfury inflation lightpurse scarce bag fewchoices treecap fewrelics cursed"
for c in $CH; do
  ARG=""; [ "$c" != none ] && ARG="--challenges $c"
  cat balance/out/rev1/decks.txt | xargs -P 4 -I{} sh -c "GJ_ROOT=game_p5 node balance/sim/run.cjs --decks {} --seeds $SEEDS --events safe --shop balanced --tree cap300 $ARG --out $OUT/${c}_{}.jsonl > $OUT/${c}_{}.log 2>&1"
  echo "$c done"
done
