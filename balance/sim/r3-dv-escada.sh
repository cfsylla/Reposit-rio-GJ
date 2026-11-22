#!/bin/bash
# Escada de desafios e vantagens (Carlos 08/11): base; 1 desafio; 1 desafio + 1 vantagem; 2 + 1; 2 + 2; ... até 15 + 15 (ordem da lista do jogo).
# 10 decks de teste x seeds (padrão 1-10), árvores 23/30/45/60 nós. Uso: r3-dv-escada.sh <saída>
cd "$(dirname "$0")/../.."; O=$1; mkdir -p $O
D=vanguard,fireline,corsair,blades,balanced,swift,dark_court,goblin_horde,dawncrest_choir,centaur_charge
CH=(veterans tough relentless commanders bossrounds reinforcements raidfury inflation lightpurse scarce bag heavydeck dissipate fewrelics cursed)
AD=(travel_relic pretraining flex_prep efficient_fusion full_purse elite_experience trained_eye rehearsal planned_hand saved_energy cleanse path_blessing interest elite_hunter second_chance)
for t in ${TREES:-nodes23 nodes30 nodes45 nodes60}; do
  echo "c0a0 $t - -"
  for k in $(seq 1 15); do
    c=$(IFS=,; echo "${CH[*]:0:$k}"); a1=$(IFS=,; echo "${AD[*]:0:$((k-1))}"); a2=$(IFS=,; echo "${AD[*]:0:$k}")
    echo "c${k}a$((k-1)) $t $c ${a1:--}"; echo "c${k}a$k $t $c $a2"
  done
done | xargs -P 4 -L 1 bash -c 'C=""; [ "$2" != - ] && C="--challenges $2"; A=""; [ "$3" != - ] && A="--advantages $3"; GJ_ROOT=game_r3 node balance/sim/run.cjs --decks '$D' --seeds '${SEEDS:-1-10}' --tree $1 --treebuy all --events safe --shop balanced $C $A --out '$O'/$0_$1.jsonl > '$O'/$0_$1.log 2>&1'
echo ESCADA_DONE $(date +%T)
