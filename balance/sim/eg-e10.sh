#!/bin/bash
# Fator de mapa por marco (23/11): escada do endgame (1ª vitória obtida) e jogo base (mapa 2 / mapa 3 liberados, sem vitória).
cd "$(dirname "$0")/../.."; O=balance/out/endgame
GJ_ROOT=game_v65_teste GJ_WINS=1 balance/sim/eg-batch.sh $O/e10_jobs.txt $O/e10_ref
GJ_ROOT=game_v65_teste GJ_MAPS=2 balance/sim/eg-batch.sh $O/e11_m2_jobs.txt $O/e11_ref
GJ_ROOT=game_v65_teste GJ_MAPS=3 balance/sim/eg-batch.sh $O/e11_m3_jobs.txt $O/e11_ref
echo ALL_DONE $(date +%T)
