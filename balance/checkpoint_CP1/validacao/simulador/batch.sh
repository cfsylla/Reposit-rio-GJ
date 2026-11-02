#!/usr/bin/env bash
# Usage: balance/sim/batch.sh OUTDIR SEEDS "extra args"  -> one process per deck, 4 in parallel
set -e
OUT=$1; SEEDS=$2; shift 2; EXTRA="$*"
mkdir -p "$OUT"
DECKS="vanguard balanced swift arcane outlaws fortress blades fireline astral corsair"
printf "%s\n" $DECKS | xargs -P 4 -I{} sh -c "node balance/sim/run.cjs --decks {} --seeds $SEEDS $EXTRA --out $OUT/{}.jsonl > $OUT/{}.log 2>&1"
cat "$OUT"/*.jsonl > "$OUT/all.jsonl"
