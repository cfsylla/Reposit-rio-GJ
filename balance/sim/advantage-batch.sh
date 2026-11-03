#!/usr/bin/env bash
# Usage: TREE=cap250 balance/sim/advantage-batch.sh SEEDS OUTDIR ["advantage list"] -> OUTDIR/<advantage>_<deck>.jsonl (each Advantage alone)
set -e
SEEDS=$1; OUT=$2; AD=${3:-"travel_relic pretraining reinforcement twin full_purse chosen_relic trained_eye rehearsal steady_hand saved_energy cleanse path_blessing interest elite_hunter second_chance"}; mkdir -p $OUT
for a in $AD; do
  cat balance/out/rev1/decks.txt | xargs -P 4 -I{} sh -c "GJ_ROOT=game_p5 node balance/sim/run.cjs --decks {} --seeds $SEEDS --events safe --shop balanced --tree ${TREE:-cap250} --advantages $a --out $OUT/${a}_{}.jsonl > $OUT/${a}_{}.log 2>&1"
  echo "$a done"
done
