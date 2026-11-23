#!/bin/bash
# Escada com tudo junto (23/11): desafios e vantagens por blocos, níveis 1 a 18, escala 2%, árvore 300 + 115 × (N−1) de XP,
# N − 1 vantagens sorteadas dentro do bloco (run.cjs --advblocks). V63 = 6 blocos de 3 (desafios e vantagens); V36 = 3 blocos de 6.
cd "$(dirname "$0")/../.."; J=$1; : > $J
D="vanguard fireline corsair blades balanced swift dark_court goblin_horde dawncrest_choir centaur_charge"
B63="reinforcements,fortified,moreelites|commanders,fatigue,cursedrelics|lesssupport,heavydeck,smallshop|inflation,cursed,bossrounds|lightpurse,veterans,dissipate|reinforceddecks,lostgold,bag"
B36="reinforcements,fortified,fatigue,heavydeck,moreelites,smallshop|commanders,lesssupport,inflation,cursed,cursedrelics,bag|lightpurse,veterans,reinforceddecks,bossrounds,dissipate,lostgold"
A63="elite_experience,elite_hunter,ambush|cleanse,trained_eye,travel_relic|second_chance,flex_prep,planned_hand|boss_trophy,full_purse,interest|clean_victory,saved_energy,efficient_fusion|path_blessing,pretraining,rehearsal"
A36="elite_experience,elite_hunter,ambush,cleanse,trained_eye,travel_relic|second_chance,flex_prep,planned_hand,boss_trophy,full_purse,interest|clean_victory,saved_energy,efficient_fusion,path_blessing,pretraining,rehearsal"
for N in $(seq 1 18); do
  XP=$((300 + 115 * (N - 1))); [ $XP -ge 1754 ] && T=full || T=cap$XP
  NN=$(printf %02d $N)
  for v in 63 36; do B=B$v; A=A$v; for d in $D; do
    echo "W${v}N${NN} $T $d 1-15 --blocks ${!B} --advblocks ${!A} --level $N" >> $J
  done; done
done
sed -i "s/[[:space:]]*\$//" $J; wc -l $J
