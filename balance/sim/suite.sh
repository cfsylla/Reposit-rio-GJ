#!/usr/bin/env bash
# Full suite (same method as CP1): each test in its own process, 600 s limit, game/ copy.
cd game; : > ../balance/out/logs/suite_cp2.log
for t in tests/*.cjs; do
  s=$(date +%s); timeout 600 node -r ./dist/game-0.js -r ./dist/balance-p1.js -r ./dist/decks-p3.js -r ./dist/enemy-decks-p4.js $t > /tmp/claude-0/-home-user-Reposit-rio-GJ/71dfb498-b72d-56de-b8c2-5466dc3b184c/scratchpad/t.out 2>&1; rc=$?
  echo "== $t rc=$rc $(( $(date +%s)-s ))s" >> ../balance/out/logs/suite_cp2.log; tail -3 /tmp/claude-0/-home-user-Reposit-rio-GJ/71dfb498-b72d-56de-b8c2-5466dc3b184c/scratchpad/t.out | cut -c1-300 >> ../balance/out/logs/suite_cp2.log
done; echo "SUITE DONE" >> ../balance/out/logs/suite_cp2.log
