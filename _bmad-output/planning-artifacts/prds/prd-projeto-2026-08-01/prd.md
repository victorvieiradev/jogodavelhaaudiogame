---
title: PRD - Jogo da Velha Acessível por Áudio (Audio Game)
created: 2026-08-01
updated: 2026-08-01
status: final
---

# PRD: Jogo da Velha Acessível por Áudio (Audio Game)

## 0. Document Purpose
Este PRD define os requisitos do produto para a versão 1.0 do **Jogo da Velha Acessível por Áudio**. É voltado para a equipe de desenvolvimento, UX/Acessibilidade e testes. O documento estabelece a visão, requisitos funcionais, termos do domínio, jornadas de usuário e diretrizes de acessibilidade para garantir um jogo 100% jogável via teclado e respostas auditivas para pessoas com deficiência visual (cegos e baixa visão).

---

## 1. Vision
O **Jogo da Velha Acessível por Áudio** é uma aplicação web simples, fluida e altamente inclusiva voltada para pessoas com deficiência visual. O jogo recria a clássica experiência do Jogo da Velha (Tic-Tac-Toe) substituindo os elementos puramente visuais por uma espacialização e navegação auditiva rica. 

Utilizando apenas as setas direcionais do teclado e a tecla de confirmação, o jogador navega pela grade 3x3 do tabuleiro, ouvindo em tempo real a posição atual e o status da casa (vazia, marcada por X ou por O). As partidas ocorrem no modo Single-Player contra uma inteligência artificial (computador), garantindo feedback sonoro imediato em cada movimento, vitória, derrota ou empate.

---

## 2. Target User

### 2.1 Jobs To Be Done (JTBD)
- **Funcional:** Quero jogar uma partida rápida de jogo da velha de forma independente, utilizando apenas o teclado e ouvindo todas as instruções e estados do jogo sem precisar olhar para a tela.
- **Emocional:** Quero me divertir com um jogo que foi verdadeiramente pensado para a minha condição auditiva e tátil, sem barreiras de acessibilidade ou menus confusos.
- **Social:** Quero ter acesso a jogos digitais inclusivos e me sentir integrado ao ecossistema de jogos acessíveis.

### 2.2 Non-Users (v1)
- Jogadores que buscam partidas multiplayer online contra outras pessoas em tempo real (v1 é focada estritamente em Single-Player contra IA).
- Jogadores que dependem exclusivamente de controles touch/touchscreen sem leitores de tela ou teclado.

### 2.3 Key User Journeys

> **UJ-1. Carlos (deficiente visual total) navega pelo tabuleiro e joga uma partida contra a IA**
> **Persona + Contexto:** Carlos é cego, utiliza leitor de tela no dia a dia e deseja jogar um áudio game rápido no navegador.
> **Entrada:** Abre a página web do jogo no navegador. A aplicação faz o anúncio de boas-vindas por áudio: *"Bem-vindo ao Jogo da Velha Acessível. Use as setas para navegar e Espaço para marcar. Você é o X."*
> **Caminho:** 
> 1. Carlos pressiona a seta para a direita. O áudio anuncia: *"Linha 1, Coluna 2: Vazio"*.
> 2. Pressiona a seta para a direita novamente: *"Linha 1, Coluna 3: Vazio"*.
> 3. Pressiona `Espaço`. O jogo toca o efeito sonoro de marcação do `X` e anuncia: *"X marcado em Linha 1, Coluna 3. Vez da IA."*.
> 4. A IA realiza a jogada em 1 segundo. Um efeito sonoro de oponente toca e o áudio diz: *"IA marcou O em Linha 2, Coluna 2"*.
> 5. Carlos navega usando as setas até fechar uma linha de 3 `X`.
> **Ápice:** Ao completar a terceira marcação, o jogo toca um jingle festivo de vitória e anuncia por voz: *"Parabéns! Você venceu a partida!"*.
> **Resolução:** O jogo pergunta: *"Pressione Enter para jogar novamente"*. Carlos pressiona `Enter` e um novo tabuleiro é iniciado.
> **Edge Case:** Se Carlos tentar marcar uma casa já ocupada (`O` ou `X`), o jogo toca um som de alerta/erro suave e anuncia: *"Casa já ocupada por O. Escolha outra casa."*.

---

## 3. Glossary

- **Tabuleiro (Board):** Grade 3x3 composta por 9 casas dispostas em 3 linhas (1 a 3) e 3 colunas (1 a 3).
- **Casa (Cell):** Cada um dos 9 posições individuais do tabuleiro, identificada por suas coordenadas `[Linha, Coluna]`.
- **Estado da Casa:** Condição atual da casa, podendo ser `Vazio`, `X` (Jogador) ou `O` (IA).
- **Foco Auditivo:** A posição da casa selecionada atualmente pelo jogador no tabuleiro via setas.
- **Leitor de Tela / ARIA Live Region:** Mecanismo acessível web que anuncia dinamicamente atualizações de texto sem recarregar a página.
- **Sintetizador de Voz (Speech Synthesis / TTS):** Recurso nativo do navegador para leitura falada das coordenadas e estados do jogo.
- **Feedback Sonoro (Sound FX):** Efeitos sonoros curtos e distintos para navegação, marcação de peças, erros e final de jogo.

---

## 4. Features

### 4.1 Navegação por Teclado e Foco Auditivo
**Descrição:** O usuário se desloca pela grade 3x3 utilizando exclusivamente as setas direcionais do teclado (`Setas Cima/Baixo/Esquerda/Direita`). Ao mudar o foco de uma casa para outra, o jogo emite um bipe de movimentação e anuncia a coordenada e o estado da casa focada. Realiza UJ-1. `[ASSUMPTION: O tabuleiro é circular na navegação: pressionar a seta direita na Coluna 3 leva para a Coluna 1 da mesma linha]`.

**Functional Requirements:**

#### FR-1: Navegação Grid 3x3 via Setas
O jogador pode pressionar as setas do teclado para alternar o foco entre as 9 casas do tabuleiro. Realiza UJ-1.
**Consequências (testáveis):**
- Pressionar `Seta Direita` na posição `[Linha 1, Coluna 1]` move o foco imediatamente para `[Linha 1, Coluna 2]`.
- Cada mudança de foco dispara a fala imediata das coordenadas e estado (ex: *"Linha 1, Coluna 2: Vazio"* ou *"Linha 1, Coluna 2: X"*).

#### FR-2: Feedback Sonoro de Posicionamento (Tom Padrão)
O sistema deve emitir um tom de áudio diferenciado (frequência/pitch) de acordo com a posição da linha/coluna para auxiliar a orientação espacial do jogador. Realiza UJ-1. `[ASSUMPTION: Linhas superiores possuem tom mais agudo e linhas inferiores tom mais grave]`.

---

### 4.2 Mecânica de Jogada e Validação
**Descrição:** O jogador confirma a escolha da casa focada pressionando a tecla `Espaço` ou `Enter`. O sistema valida se a casa está livre. Se estiver livre, marca a jogada com o símbolo `X`, dispara o áudio de marcação e transfere o turno para a IA. Realiza UJ-1.

**Functional Requirements:**

#### FR-3: Marcação de Casa via Tecla de Ação
O jogador pode marcar a casa focada pressionando a tecla `Espaço` ou `Enter`. Realiza UJ-1.
**Consequências (testáveis):**
- Se a casa for `Vazia`, a jogada é confirmada, alterando seu estado para `X`.
- O jogo emite o som característico do `X` e anuncia: *"X marcado em Linha A, Coluna B"*.

#### FR-4: Bloqueio e Erro em Casas Ocupadas
O sistema impede a marcação em uma casa que já possui `X` ou `O`. Realiza UJ-1.
**Consequências (testáveis):**
- Pressionar a marcação em uma casa ocupada toca o som de aviso de erro e fala: *"Casa ocupada"*. O turno continua com o jogador.

---

### 4.3 Oponente de IA (Single-Player)
**Descrição:** Após a jogada do jogador, o sistema executa automaticamente a jogada da IA (computador) que joga como `O`. A IA realiza sua escolha e o jogo anuncia o movimento feito pela IA. Realiza UJ-1.

**Functional Requirements:**

#### FR-5: Processamento da Jogada da IA
O sistema executa o turno da IA em um tempo entre 600ms e 1200ms após a jogada do usuário para simular pensamento. Realiza UJ-1. `[ASSUMPTION: A IA utilizará um nível de dificuldade médio no MVP — priorizando bloquear vitórias do jogador e fechar as próprias linhas]`.
**Consequências (testáveis):**
- A IA seleciona uma casa válida vazia e a marca como `O`.
- O sistema anuncia por áudio a jogada da IA: *"IA marcou O em Linha X, Coluna Y"*.

---

### 4.4 Condição de Fim de Jogo e Anúncios de Resultado
**Descrição:** O sistema avalia a cada jogada se houve vitória de um dos lados (3 símbolos iguais na horizontal, vertical ou diagonal) ou se o tabuleiro encheu sem vencedor (empate/velha). Realiza UJ-1.

**Functional Requirements:**

#### FR-6: Detecção e Anúncio de Resultado
O sistema identifica e encerra a partida assim que a condição de fim de jogo é atendida. Realiza UJ-1.
**Consequências (testáveis):**
- **Vitória do Jogador:** Toca o efeito sonoro de vitória e anuncia: *"Parabéns! Você venceu a partida!"*.
- **Vitória da IA:** Toca o efeito sonoro de derrota e anuncia: *"IA venceu a partida. Tente novamente!"*.
- **Empate:** Toca o som de empate e anuncia: *"Deu Velha! Empate!"*.
- O tabuleiro é bloqueado contra novas marcações até a reinicialização.

#### FR-7: Reinício Rápido da Partida
O jogador pode reiniciar uma nova partida a qualquer momento ou após o fim de jogo pressionando a tecla `R` ou `Enter` na tela de fim de jogo. Realiza UJ-1.

---

### 4.5 Acessibilidade e Web Audio (WCAG / ARIA)
**Descrição:** A aplicação cumpre com as diretrizes de acessibilidade WCAG 2.1 AA / Section 508.

**Functional Requirements:**

#### FR-8: Suporte Nativo a Leitores de Tela (ARIA Live Regions)
O sistema deve conter regiões `aria-live="assertive"` e `role="status"` no HTML para garantir compatibilidade com leitores de tela populares (NVDA, JAWS, TalkBack, VoiceOver).
**Consequências (testáveis):**
- Toda alteração de estado do jogo é refletida na região ARIA Live sem necessidade de foco de leitura manual.

#### FR-9: Sintetizador Web Audio Fallback (TTS + SFX)
A aplicação possui um sintetizador interno usando `window.speechSynthesis` e `Web Audio API` para gerar bipes e fala mesmo se o usuário não estiver com um leitor de tela externo ativado.

---

### 4.6 Seleção de Nível de Dificuldade da IA
**Descrição:** O jogador pode alternar dinamicamente entre 3 níveis de dificuldade para a IA utilizando a tecla `D` no teclado ou o botão acessível na interface. A cada alteração, o jogo dispara um efeito sonoro característico e anuncia a nova dificuldade por voz.

**Functional Requirements:**

#### FR-10: Níveis de Dificuldade da IA e Controle por Teclado
O sistema oferece 3 níveis de inteligência para o computador (Fácil, Médio e Impossível) e permite alterá-los a qualquer momento.
**Consequências (testáveis):**
- **Fácil:** IA joga com comportamento predominantemente aleatório (70% aleatório, 30% estratégico).
- **Médio:** IA joga com heurística padrão (bloqueia vitórias do jogador, busca centro e cantos).
- **Impossível:** IA utiliza o algoritmo **Minimax** otimizado para jogar de maneira impecável (imbatível).
- Pressionar a tecla `D` alterna ciclicamente a dificuldade: `Fácil` ➔ `Médio` ➔ `Impossível` ➔ `Fácil`.
- A mudança dispara o anúncio de voz (*"Dificuldade alterada para: [Nível]"*) e atualiza a região ARIA Live.

---

## 5. Non-Goals (Explicit)
- **v1 NÃO terá modo Multiplayer:** Não haverá partidas entre 2 jogadores humanos (nem local no mesmo teclado, nem online).
- **v1 NÃO terá ranking/leaderboard nem login:** Não haverá criação de conta de usuário ou salvamento de histórico de pontuação em nuvem.
- **v1 NÃO exigirá suporte a telas touch:** A experiência v1 é otimizada e testada estritamente para entrada via Teclado em navegadores web de desktop.

---

## 6. MVP Scope

### 6.1 In Scope
- Tabuleiro 3x3 acessível.
- Navegação completa por setas do teclado.
- Feedback sonoro (efeitos sonoros sintetizados + fala Web Speech API).
- Oponente IA com 3 níveis de dificuldade (Fácil, Médio, Impossível).
- Atalho de troca de dificuldade (`D`).
- Anúncio de status da casa, turno, vitória, derrota e empate.
- Suporte a suporte nativo ARIA Live.
- Atalho de reinício da partida (`R` ou `Enter`).

### 6.2 Out of Scope for MVP
- Modo 2 Jogadores no mesmo computador `[Diferido para v2]`.
- Personalização de vozes ou temas de som `[Diferido para v2]`.

---

## 7. Success Metrics

### Primary Metrics
- **SM-1:** 100% de jogabilidade autônoma por pessoas cegas ou com baixa visão sem necessidade de auxílio de visão ou mouse. Valida FR-1 a FR-9.
- **SM-2:** Tempo médio para realizar uma jogada < 3 segundos após a finalização do turno da IA. Valida FR-1 e FR-3.

### Counter-Metrics
- **SM-C1 (Taxa de Abandono por Erro de Comunicação):** O percentual de partidas abandonadas após erro de marcação deve ser menor que 5%, garantindo que as orientações de voz não causem confusão.

---

## 8. Open Questions
1. **[OQ-1]** Devemos incluir uma tecla de atalho dedicada (ex: tecla `S` ou `T`) para que o jogador possa ouvir o resumo do tabuleiro completo a qualquer momento?
2. **[OQ-2]** Qual a velocidade ideal de fala (rate) do sintetizador de áudio padrão para não soar muito lenta para usuários experientes em leitores de tela?

---

## 9. Assumptions Index
- **[ASSUMPTION §4.1]** A navegação no tabuleiro é circular (ao chegar na ponta direita/inferior, a próxima seta dá a volta para a ponta oposta).
- **[ASSUMPTION §4.1 - FR-2]** A variação de tom áudio (pitch) entre linhas ajuda no mapeamento espacial mental do tabuleiro.
- **[ASSUMPTION §4.3 - FR-5]** Dificuldade média da IA é o ponto ideal para o MVP (não joga 100% aleatório nem é completamente imbatível).
