# Grand Journey — continuidade v40

Atualização autorizada após testes da raid. Complementa e prevalece sobre os pontos correspondentes de `Grand_Journey_Projeto_v39.md`; demais regras e pendências permanecem.

- Mesmo projeto/Site, audiência e saves preservados. Raid continua somente no Treinamento, sem recompensas.
- **Sem limite de tempo na raid**, inclusive ao retomar checkpoints da v39. Rodada termina somente com todos os aliados mortos ou chefe derrotado. Vitória do chefe na quinta rodada perdida; morte simultânea dá vitória ao jogador. Não aplicar frenzy normal aos 40 s. O relógio mostra tempo decorrido e não para em dois minutos.
- HUD da arena: barra de vida com nome e valores; remove placar duplicado, contagem duplicada de derrotas, nomes de fase e explicações/antecipações. Preserva rodada, energia, capacidade e sinergias. Barra pequena repetida sobre a Árvore removida.
- Fases e habilidades continuam funcionando. Descrições removidas da arena. Entrada do treino informa ausência de limite de tempo.
- **Tela inteira fixa; somente painéis internos rolam.** Remove a rolagem da arena. Botões de resultado e início/retomada de treino ficam fora do conteúdo rolável, em rodapé opaco com safe area. Continuar visível após rodada 3. Regra obrigatória em AGENTS.md para toda tela futura/alterada.
- Árvore: referência lógica no chão (215,180), âncora na base da pixel art, margem de corpo de 30 além da colisão comum. Melee usa distância até essa margem; caminhada, destinos de skills e resolução de sobreposições respeitam o corpo. Chefe não se desloca. Checkpoints antigos migram posição/margem sem restaurar HP ou alterar dano/rodadas.
- Valores de vida, ataque, defesa, cura e fases preservados. A retirada do timeout muda o balanceamento: a amostra de vitórias da v39 é histórica e não deve ser tratada como avaliação da v40. Reavaliar após testes jogando.

Validação: testes raid-v40 (mais de 60 s nas três velocidades, save antigo, contato/skills, prioridade de vitória); raid-v39 adaptado à regra sem timeout (vida, fases, raízes, cura, reposição, determinismo, fusões, banco/freeze); v38; 60 replays normais/elites/bosses contra v38 sem diferenças. QA móvel isolado 360×740: preparação R3, rodapé de resultado, combate e contato na base; arena sem overflow e controles dentro da viewport. Sem teste em Android físico.

Arquivos principais: raid-engine.js, raid-ui.js, raid-assets.js, game-0.js, game-7.js, style.css. Não implementar outros itens pendentes sem nova autorização.
