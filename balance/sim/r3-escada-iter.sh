#!/bin/bash
# Etapa 4: roda uma iteração da escada. Uso: r3-escada-iter.sh <nome> (variante balance/rodada3/variants/etapa4/<nome>.json)
cd "$(dirname "$0")/../.."; N=$1; O=balance/out/rodada3/etapa4_$N
export GJ_TREE_VARIANT=balance/rodada3/variants/etapa4/$N.json
bash balance/sim/r3-regua-run.sh $O "1.0" "none nodes2 nodes4 nodes7 nodes10 nodes13 nodes18 nodes23 nodes28" ${SEEDS:-1-20} > $O.progress 2>&1
node balance/sim/r3-escada-report.cjs $O > $O/ESCADA.md; node balance/sim/r3-barreiras.cjs $O > $O/BARREIRAS.md; echo ITER_DONE $N
