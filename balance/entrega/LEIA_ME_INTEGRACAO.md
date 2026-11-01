# Integração (preparado para levar de uma vez ao ChatGPT, quando todo o balanceamento terminar)

Base: v54 original (`v54/`). Cópia balanceada com tudo o que já foi aprovado: `game/`.

Patches cumulativos:
- `v54_para_balanceado_dist.diff` — código do jogo: 3 arquivos novos e 3 alterados;
- `v54_para_balanceado_tests_scripts.diff` — testes e script de validação.

Aprovados até agora:
- P1: curva de força, 33 personagens, 11 traits numéricos;
- P2: 6 mecânicas de traits, suportes modelo B, Fearless V4;
- P3: 24 decks, milestones e desbloqueios de ordem.

Ordem de carga no `index.html`:
`game-0` → **balance-p1** → **decks-p3** → … → `traits-v54` → **supports-b** → …

Validação: `node scripts/validate-balance-base.cjs` dentro de `game/` → PASS.

Ainda não estão aplicados: dificuldade dos mapas, economia, decks inimigos por mapa e árvore. São as próximas etapas.
