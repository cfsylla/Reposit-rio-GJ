#!/bin/bash
# Round 3 final validation on game_r3 (all changes): careers 24 decks x 4, fixed-tree matrix 24 decks x 20 seeds, then challenges/advantages.
cd /home/user/Reposit-rio-GJ
xargs -P 4 -L 1 bash -c 'GJ_ROOT=game_r3 node balance/sim/career.cjs --decks $0 --careers $1 --runs 50 --out balance/out/rodada3/final/car/car_$0_$1.jsonl > balance/out/rodada3/final/car/car_$0_$1.log 2>&1' < /tmp/claude-0/-home-user-Reposit-rio-GJ/15bcb469-c703-5a03-a3c5-75c370199b78/scratchpad/jobsF.txt
echo CAR_DONE $(date +%T)
ALL=vanguard,balanced,swift,arcane,outlaws,fortress,blades,fireline,astral,corsair,north,verdant,keen,quake,executioners,goblin_horde,greenskins,dark_court,blackfang_war,meowri_band,high_court,forest_guard,centaur_charge,dawncrest_choir
for t in none nodes15 nodes30 nodes45 nodes60; do echo $t; done | xargs -P 4 -I{} bash -c "GJ_ROOT=game_r3 node balance/sim/run.cjs --decks $ALL --seeds 1-20 --tree {} --treebuy all --out balance/out/rodada3/final/mat/mat_{}.jsonl > balance/out/rodada3/final/mat/mat_{}.log 2>&1"
echo MAT_DONE $(date +%T)
balance/sim/r3-postgame.sh balance/out/rodada3/final/pg
echo FINAL_DONE $(date +%T)
