#!/bin/bash
# Desafios e vantagens somados (pedido do Carlos 08/11): base, todas as vantagens, 5/10/15 desafios (ordem da lista) com e sem vantagens.
# 10 decks de teste x 20 seeds, árvore 23/30/45/60 nós. Saída: balance/out/rodada3/combo/<config>_<árvore>.jsonl
cd "$(dirname "$0")/../.."; O=balance/out/rodada3/combo; mkdir -p $O
D=vanguard,fireline,corsair,blades,balanced,swift,dark_court,goblin_horde,dawncrest_choir,centaur_charge
C5=veterans,tough,relentless,commanders,bossrounds
C10=$C5,reinforcements,raidfury,inflation,lightpurse,scarce
C15=$C10,bag,heavydeck,dissipate,fewrelics,cursed
for t in nodes23 nodes30 nodes45 nodes60; do
  echo "base $t -"; echo "adv $t all"
  echo "ch5adv $t all $C5"; echo "ch10adv $t all $C10"; echo "ch15adv $t all $C15"; echo "ch15 $t - $C15"
done | xargs -P 4 -L 1 bash -c 'A=""; [ "$2" = all ] && A="--advantages all"; C=""; [ -n "$3" ] && C="--challenges $3"; GJ_ROOT=game_r3 node balance/sim/run.cjs --decks '$D' --seeds 1-20 --tree $1 --treebuy all --events safe --shop balanced $A $C --out '$O'/$0_$1.jsonl > '$O'/$0_$1.log 2>&1'
echo COMBO_DONE $(date +%T)
