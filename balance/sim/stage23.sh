#!/usr/bin/env bash
# Stages 2 and 3 of the post-game study (authorized by Carlos, 03/11/2026).
# Stage 2: challenge ladder as post-game careers (24 decks x 2 careers, up to 80 runs, easy and hard paths).
# Stage 3: limit test (all challenges / all advantages at tree level 25 and 50) + dangerous combinations.
set -u
mkdir -p balance/out/ladder
for path in easy hard; do
  cat balance/out/rev1/decks.txt | xargs -P 4 -I{} sh -c "GJ_ROOT=game_p5 node balance/sim/postgame.cjs --decks {} --careers 1-2 --runs 80 --path $path --orders balance/out/logs/orders_final.json --out balance/out/ladder/${path}_{}.jsonl > /dev/null 2>&1"
  echo "LADDER $path DONE $(date +%H:%M)"
done
balance/sim/limits.sh; balance/sim/combos.sh; echo "STAGE23 DONE $(date +%H:%M)"
