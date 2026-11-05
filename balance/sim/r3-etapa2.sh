#!/bin/bash
# Round 3 stage 2: R3 model (B2 window + XP table B) on a game copy. Careers (persistent tree) + fixed-tree matrix.
# Usage: balance/sim/r3-etapa2.sh <game copy> <out dir> <decks csv> <careers e.g. 1-8> <runs per career> <matrix seeds e.g. 1-40>
cd "$(dirname "$0")/../.."; ROOT=$1; O=$2; DECKS=$3; CAR=$4; RUNS=$5; MS=$6; mkdir -p $O
lo=${CAR%-*}; hi=${CAR#*-}
jobs=(); for d in ${DECKS//,/ }; do for c in $(seq $lo $hi); do jobs+=("car $d $c"); done; done
for t in none nodes15 nodes30 nodes45 nodes60; do jobs+=("mat $t"); done
printf '%s\n' "${jobs[@]}" | xargs -P 4 -I{} bash -c 'set -- {}; if [ $1 = car ]; then GJ_ROOT='$ROOT' node balance/sim/career.cjs --decks $2 --careers $3 --runs '$RUNS' --out '$O'/car_$2_$3.jsonl > '$O'/car_$2_$3.log 2>&1; else GJ_ROOT='$ROOT' node balance/sim/run.cjs --decks '$DECKS' --seeds '$MS' --tree $2 --out '$O'/mat_$2.jsonl > '$O'/mat_$2.log 2>&1; fi; echo "JOB_DONE {} $(date +%T)"'
echo ALL_DONE $(date +%T)
