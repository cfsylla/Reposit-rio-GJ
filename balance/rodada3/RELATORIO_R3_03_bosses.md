# Rodada 3: ajuste dos bosses (laboratório pareado)

Metas aprovadas (06/11): com 30 nós, média dos bosses comuns 95% / 88% / 83% (mapas 1/2/3), cada boss a ±5 da média, True Boss ~73%. Só dados de inimigo (boss-engine.js TUNE); cartas de bosses do jogador intactas. 5 decks × 40 seeds por rodada; margem ±5 a ±7 por boss.

Antes = v50 com modelo R3 (bosslab); depois = iteração 3 (bosslab_it3). % de vitória do mesmo jogador.

| Boss | Mapa 1 (15 nós) | Mapa 1 (30 nós) | Mapa 2 (30 nós) | Mapa 3 (30 nós) | Vida × | Ataque × |
|---|---:|---:|---:|---:|---:|---:|
| Marechal (IB) | 75 → **75** | 94 → **93** | 85 → **87** | 92 → **89** | 0.97 | 0.97 |
| Xogum (IB) | 78 → **67** | 97 → **96** | 90 → **89** | 94 → **80** | 1.14 | 1.14 |
| Jarl Rúnico (IB) | 67 → **67** | 94 → **95** | 86 → **90** | 89 → **78** | 0.96 | 0.96 |
| Pistoleiro (IB) | 83 → **70** | 98 → **94** | 97 → **90** | 93 → **85** | 1.33 | 1.33 |
| Rainha Pirata (IB) | 78 → **75** | 96 → **95** | 87 → **85** | 89 → **81** | 1.07 | 1.07 |
| Oráculo (IB) | 74 → **76** | 94 → **94** | 85 → **86** | 83 → **81** | 0.93 | 0.93 |
| Senhor dos Cervos (IB) | 55 → **61** | 91 → **96** | 85 → **90** | 82 → **82** | 0.80 | 0.80 |
| Rei Goblin (BF) | 94 → **69** | 99 → **95** | 97 → **91** | 99 → **84** | 1.90 | 1.90 |
| Rei Troll (BF) | 88 → **80** | 98 → **93** | 90 → **84** | 91 → **86** | 1.18 | 1.18 |
| Imperador Orc (BF) | 45 → **65** | 86 → **94** | 71 → **82** | 73 → **80** | 0.59 | 0.59 |
| Rainha Meowri (DC) | 75 → **66** | 98 → **96** | 91 → **88** | 95 → **87** | 1.21 | 1.21 |
| Líder Centauro (DC) | 72 → **72** | 95 → **95** | 88 → **87** | 91 → **81** | 0.99 | 0.99 |
| Rei High Elf (DC) | 77 → **79** | 94 → **94** | 83 → **85** | 83 → **79** | 0.90 | 0.90 |
| Rei Forest Elf (DC) | 97 → **59** | 99 → **95** | 98 → **92** | 99 → **88** | 1.87 | 1.87 |
| Andarilho (True IB) | — | — | — | 99 → **79** | 1.36 (forma 2: vida ×1.36, dano ×1.36) | 1.36 |
| Rei Dark Elf (True BF) | — | — | — | 97 → **77** | 1.19 (forma 2: vida ×1.19, dano ×1.19) | 1.19 |
| Rainha Fada (True DC) | — | — | — | 80 → **77** | 1.02 (forma 2: vida ×1.02, dano ×1.02) | 1.02 |

Multiplicador por mapa (todos os bosses): ×1.04 / ×0.96 / ×1.20
