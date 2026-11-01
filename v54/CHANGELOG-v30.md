# Grand Journey v30

Correção da movimentação de combate: a caminhada agora verifica os corpos no trajeto e procura um desvio lateral livre. Uma unidade atrás de um aliado engajado contorna a formação para alcançar seu alvo, sem transmitir o movimento para aliados ou adversários. Colisões de habilidades, investidas, teleporte e empurrões intencionais continuam usando suas regras existentes. Sem espaço, a unidade aguarda ou busca outra direção livre.

Validação: reprodução Warrior na posição 3 e Fighter atrás (incluindo aproximação inicial), ambos atacam; Warrior para a 34 unidades do alvo; adversário permanece na posição inicial. Casos em ambas equipes, intervalos de simulação entre 1/60 e 0,1 s, bordas, 12 confrontos com grupos, testes Blackfang v26 e sistemas v29 passaram. Prévia no navegador abriu, mas a sessão de controle sofreu timeouts durante a observação; validação visual contínua não concluída. Android físico não testado.

Sem mudança de save, conteúdo, atributos, desbloqueios ou acessos.
