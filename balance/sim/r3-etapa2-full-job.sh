#!/bin/bash
cd /home/user/Reposit-rio-GJ
if [ "$1" = car ]; then GJ_ROOT=game_r3 node balance/sim/career.cjs --decks $2 --careers $3 --runs 50 --out balance/out/rodada3/etapa2_full/car_$2_$3.jsonl > balance/out/rodada3/etapa2_full/car_$2_$3.log 2>&1
else GJ_ROOT=game_r3 node balance/sim/run.cjs --decks vanguard,balanced,swift,arcane,fortress,fireline,astral,corsair,north,keen,quake,executioners,goblin_horde,greenskins,dark_court,meowri_band,high_court,forest_guard,dawncrest_choir,blades,verdant,outlaws,blackfang_war,centaur_charge --seeds 1-20 --tree $2 --treebuy all --out balance/out/rodada3/etapa2_full/mat_$2.jsonl > balance/out/rodada3/etapa2_full/mat_$2.log 2>&1; fi
echo "JOB_DONE $1 $2 $3 $(date +%T)"
