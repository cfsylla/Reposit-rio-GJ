#!/usr/bin/env bash
# Re-run after the late-node cost change (x1.5): careers (40 runs), ladder (easy/hard) and limits. No combinations.
set -u
rm -rf balance/out/career_p5_CP3; RUNS=40 GJ_ROOT=game_p5 PFX=p5_ balance/sim/career-batch.sh CP3; echo "CAREERS DONE $(date +%H:%M)"
mkdir -p balance/out/ladder2
for path in easy hard; do
  cat balance/out/rev1/decks.txt | xargs -P 4 -I{} sh -c "GJ_ROOT=game_p5 node balance/sim/postgame.cjs --decks {} --careers 1-2 --runs 80 --path $path --orders balance/out/logs/orders_final.json --out balance/out/ladder2/${path}_{}.jsonl > /dev/null 2>&1"
  echo "LADDER $path DONE $(date +%H:%M)"
done
OUT=balance/out/limits2 balance/sim/limits.sh; echo "STAGE23B DONE $(date +%H:%M)"
