#!/bin/bash
# Parte 3 (escada por blocos). Uso: eg-e6-jobs.sh <saida_jobs>
# Duas versões de blocos (6×3 e 3×6), níveis 1 a 18, escala 2% (padrão da cópia de teste), árvore esperada no nível N (300 + 115 × (N−1) de XP),
# sem vantagens ("s") e com N−1 vantagens na ordem do impacto do CP4 ("c"). Ordem dentro do bloco sorteada por seed (run.cjs --blocks/--level).
cd "$(dirname "$0")/../.."; J=$1; : > $J
D="vanguard fireline corsair blades balanced swift dark_court goblin_horde dawncrest_choir centaur_charge"
B63="reinforcements,fortified,moreelites|commanders,fatigue,cursedrelics|lesssupport,heavydeck,smallshop|inflation,cursed,bossrounds|lightpurse,veterans,dissipate|reinforceddecks,lostgold,bag"
B36="reinforcements,fortified,fatigue,heavydeck,moreelites,smallshop|commanders,lesssupport,inflation,cursed,cursedrelics,bag|lightpurse,veterans,reinforceddecks,bossrounds,dissipate,lostgold"
AD=(flex_prep elite_experience saved_energy path_blessing planned_hand full_purse travel_relic second_chance elite_hunter pretraining rehearsal cleanse interest efficient_fusion trained_eye)
for N in $(seq 1 18); do
  XP=$((300 + 115 * (N - 1))); [ $XP -ge 1754 ] && T=full || T=cap$XP
  k=$((N-1)); [ $k -gt 15 ] && k=15; a=$(IFS=,; echo "${AD[*]:0:$k}")
  NN=$(printf %02d $N)
  for v in 63 36; do B=B$v; for d in $D; do
    echo "V${v}N${NN}s $T $d 1-15 --blocks ${!B} --level $N" >> $J
    if [ -n "$a" ]; then echo "V${v}N${NN}c $T $d 1-15 --blocks ${!B} --level $N --advantages $a" >> $J; else echo "V${v}N${NN}c $T $d 1-15 --blocks ${!B} --level $N" >> $J; fi
  done; done
done
sed -i "s/[[:space:]]*\$//" $J; wc -l $J
