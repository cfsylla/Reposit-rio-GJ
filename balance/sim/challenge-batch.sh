#!/usr/bin/env bash
# Usage: balance/sim/challenge-batch.sh SEEDS OUTDIR "challenge list" -> OUTDIR/<challenge>_<deck>.jsonl
# (each challenge alone; tree cap300; game_p5). "none" = no challenge.
set -e
SEEDS=$1; OUT=$2; CH=${3:-"none veterans tough relentless commanders bossrounds reinforcements raidfury inflation lightpurse scarce bag heavydeck treecap fewrelics cursed"}; mkdir -p $OUT
for c in $CH; do
  ARG=""; [ "$c" != none ] && ARG="--challenges $c"
  cat balance/out/rev1/decks.txt | xargs -P 4 -I{} sh -c "GJ_ROOT=game_p5 node balance/sim/run.cjs --decks {} --seeds $SEEDS --events safe --shop balanced --tree cap300 $ARG --out $OUT/${c}_{}.jsonl > $OUT/${c}_{}.log 2>&1"
  echo "$c done"
done
