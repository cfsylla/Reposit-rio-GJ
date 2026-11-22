# Mudanças relevantes após CP4 — base publicada v65

## Progressão e carreira (bloco v57–v60)

O histórico do projeto agrupa v57–v60: Anexos A/C/D, total102 milestones, desbloqueios de decks/boosters/relíquias e sua ordenação/textos. Sem compra direta de decks emprestados por25 diamantes. Titans raids sem relíquias. Parte desse bloco pode já estar na base v57 do laboratório: compare o motor, não reaplique tudo como se fosse novo.

## v61

- Espada Adormecida: 1,5% ATQ inicial +1,5pp por elite vencido enquanto equipada, teto9%; bosses não contam. Correção da progressão para atingir o teto e alinhamento do texto.
- Missão Chave do Prisioneiro: destino único alcançável pelo menos quatro camadas à frente.
- Bolsa reduzida: correção do arraste e dos slots bloqueados, também com expansão da bolsa.
- Vanguarda da Aurora primeiro; outros dois iniciais após encerrar run tutorial. Popups mapas2/3, unlocks/milestones no fim de run, arte anime nos unlocks, traits ocultos, estabilidade da tela com mão vazia e remoção da dica de fusão.

## v62

- Boss map: [1.037,0.965,1.198] → [1.037,1.10,1.35], sobre HP/ATQ do líder. Mapa2 +13,99%; mapa3 +12,69%. Individuais boss[id], barreira e true2 preservados. FormaI do True Boss acompanha mapa3; não aplicar incremento extra à formaII ou Titans.
- Exemplo enemyScaleSources boss:orc: mapa2 .566455→.645700; mapa3 .703226→.792450.
- Ofertas genéricas de relíquia de nós/eventos usam os mesmos pesos da loja (C/U/R/Ultra): mapa1 [70,22,8,0], mapa2 [50,30,15,5], mapa3 [35,30,25,10]. Garantias explícitas/forja continuam respeitadas.
- recruitOffer.offeredLevels registra upgrade por ID. Caravana agora concede o upgrade mostrado.

## v63

- Ranger arremessa Trap até145, velocidade450/s, recuo55 igual Gunner. Primeiro inimigo na trajetória ativa; sem colisão, fica armada no destino. Área+10% = raio20×sqrt(1.10), não raio+10%. Um alvo/ativação; dano160%ATQ×skill e root1,5s preservados, vida total até5s.
- Filtros de relíquias por efeito, sem alteração de valores/ofertas.

## v64 salva, incorporada à v65 publicada

- 24 raridades conforme dados_aprovados/raridades.json, aplicadas após os templates de boss/heróis. Sem alteração de atributos de combate dos personagens comuns. Preços diamantados continuam10/15/20/25 por raridade. Afeta boosters, catálogo e ofertas condicionadas por raridade.
- 17 heróis conforme dados_aprovados/herois.json: novos HP/ATQ/DEF/rate/speed/crit/carga; todos custo4/Ultra. Ratings e alcance preservados. Carga4/6/7segundos.
- Oracle skillScale3.946: dano631,36%ATQ e cura31,568%PV na escala-base; Fairy2.256: cura/escudo22,56%PV nos dois mais feridos. UI arredonda esses percentuais.
- Carta First Wayfarer usa cleave:180% no alvo e90% a até70. Boss mantém light. A revisão de heróis não alterou nenhum template/definição/tuning de boss.

## v65

Dez efeitos aprovados integrados: A01v002; A02 pesado/circular; A03–A07; A08 cruzado/combo2. Visuais seguem os hits reais e o relógio do combate; não alteram dano, cooldown, targeting ou resultado. Combate comparado com/sem hooks em1/1,5/2/3×.

## Ainda não implementado

Secret Boss e Desafio Final; propostas novas de desafios; filtro de milestones alcançados/não alcançados e retirada de “each milestone grants…”. Ideias/pendências do documento de projeto não fazem parte do motor publicado.
