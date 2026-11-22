#!/bin/bash
# ENDGAME (v65): roda jobs em paralelo. Uso: eg-batch.sh <jobs.txt> <saida>
# Cada linha de jobs: "<nome> <arvore> <deck> <seeds> [args extras do run.cjs...]". Variante por job: env V_<nome> não usado; use GJ_TREE_VARIANT no args via 'VAR=arquivo'.
cd "$(dirname "$0")/../.."; J=$1; O=$2; mkdir -p $O
cat $J | xargs -P ${PAR:-4} -L 1 bash -c 'n=$0; t=$1; d=$2; s=$3; shift 3; V=""; if [ "${1#VAR=}" != "$1" ]; then V=${1#VAR=}; shift; fi; f='$O'/${n}_${t}_${d}.jsonl; [ -s $f ] && exit 0; GJ_TREE_VARIANT=$V GJ_ROOT=${GJ_ROOT:-game_v65} node balance/sim/run.cjs --decks $d --seeds $s --tree $t --treebuy all --events safe --shop balanced "$@" --out $f.tmp > /dev/null 2>&1 && mv $f.tmp $f'
sed -n 1p /dev/null; echo "BATCH_DONE $(date +%T)"
