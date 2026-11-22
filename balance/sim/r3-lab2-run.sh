#!/bin/bash
# Uso: r3-lab2-run.sh <grupo> <seeds> ; roda o lab2 em 4 processos para a lista de cartas do grupo
cd "$(dirname "$0")"; G=$1; S=${2:-9}; O=../out/lab2_r3/$G; mkdir -p $O
mapfile -t U < ../out/lab2_r3/lista_$G.txt
for i in 0 1 2 3; do
  L=$(for ((j=i;j<${#U[@]};j+=4)); do echo -n "${U[$j]},"; done); L=${L%,}
  [ -n "$L" ] && GJ_ROOT=../../game_r3 node lab2.cjs --seeds $S --units "$L" --out $O/s$i.jsonl > $O/s$i.log 2>&1 &
done; wait; echo "fim $G"
