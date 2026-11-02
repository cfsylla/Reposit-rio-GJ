#!/usr/bin/env bash
# Usage: balance/sim/career-batch.sh VARIANT_NAME  -> balance/out/career_<name>/ (24 decks x careers 1-2 x 30 runs, 4 in parallel)
set -e
V=$1; OUT=balance/out/career_$V; mkdir -p $OUT
cat balance/out/rev1/decks.txt | xargs -P 4 -I{} sh -c "GJ_TREE_VARIANT=balance/tree_variants/$V.json GJ_ROOT=game node balance/sim/career.cjs --decks {} --careers 1-2 --runs 30 --out $OUT/{}.jsonl > $OUT/{}.log 2>&1"
node balance/sim/career-report.cjs $OUT > $OUT/CARREIRA.md
