#!/bin/bash
# Etapa 4 (escala geral). Uso: eg-e4-jobs.sh <reinforceFromRound> <saida_jobs>
# Níveis N = 1,3,5,8,10,12,15; árvore = XP esperado no nível N (300 + 115 × (N−1), premissa das campanhas); vantagens = N−1 compradas
# (ordem pelo impacto medido no CP4); desafios = os N primeiros da ordem intercalada forte/fraco (etapa 3); escala p = 0, 1%, 2%, 3%.
# Duas famílias: "esc" = N desafios + escala; "so" = só a escala do nível N (sem desafios), com as mesmas vantagens.
cd "$(dirname "$0")/../.."; RF=$1; J=$2; V=balance/tree_variants/eg/e4; mkdir -p $V; : > $J
D="vanguard fireline corsair blades balanced swift dark_court goblin_horde dawncrest_choir centaur_charge"
CH=(reinforcements fewrelics commanders bag tough dissipate heavydeck lightpurse relentless bossrounds scarce veterans inflation cursed raidfury)
AD=(flex_prep elite_experience saved_energy path_blessing planned_hand full_purse travel_relic second_chance elite_hunter pretraining rehearsal cleanse interest efficient_fusion trained_eye)
for N in 1 3 5 8 10 12 15; do
  XP=$((300 + 115 * (N - 1))); [ $XP -ge 1754 ] && T=full || T=cap$XP
  c=$(IFS=,; echo "${CH[*]:0:$N}"); a=$(IFS=,; echo "${AD[*]:0:$((N-1))}"); AA=""; [ -n "$a" ] && AA="--advantages $a"
  for p in 0 1 2 3; do
    echo "{\"challengeTune\":{\"globalScale\":0.0$p,\"reinforceFromRound\":$RF}}" > $V/esc_p$p.json
    echo "{\"challengeTune\":{\"globalScale\":0.0$p,\"scaleLevel\":$N}}" > $V/so_N${N}_p$p.json
    for d in $D; do
      echo "escN${N}p$p $T $d 1-15 VAR=$V/esc_p$p.json --challenges $c $AA" >> $J
      echo "soN${N}p$p $T $d 1-15 VAR=$V/so_N${N}_p$p.json $AA" >> $J
    done
  done
done
sed -i "s/[[:space:]]*\$//" $J  # linhas com espaço no fim fazem o xargs -L juntar com a seguinte
wc -l $J
