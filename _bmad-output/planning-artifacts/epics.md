---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-projeto-2026-08-01/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-projeto-2026-08-01/ARCHITECTURE-SPINE.md
---

# Jogo da Velha Acessível por Áudio - Epic Breakdown

## Overview

Este documento apresenta o detalhamento completo de Épicos e Histórias de Usuário para o **Jogo da Velha Acessível por Áudio**, decompondo os requisitos funcionais, não-funcionais e diretrizes técnicas de arquitetura em histórias prontas para implementação.

## Requirements Inventory

### Functional Requirements

- **FR-1:** Navegação Grid 3x3 via Setas (teclado direcional alterna o foco entre as 9 casas, disparando fala imediata das coordenadas e estado).
- **FR-2:** Feedback Sonoro de Posicionamento (Tom Padrão / Variação de pitch por linha e pan estéreo por coluna).
- **FR-3:** Marcação de Casa via Tecla de Ação (Espaço/Enter marca a casa focada como `X` se estiver vazia e toca o som de marcação).
- **FR-4:** Bloqueio e Erro em Casas Ocupadas (impede marcação sobre `X` ou `O` existente e emite som de aviso/fala de erro).
- **FR-5:** Processamento da Jogada da IA (IA seleciona casa vazia após atraso natural e o jogo anuncia a jogada).
- **FR-6:** Detecção e Anúncio de Resultado (identifica vitória do jogador, vitória da IA ou empate, tocando vinheta sonora e anunciando o resultado).
- **FR-7:** Reinício Rápido da Partida (tecla `R` ou `Enter` reinicia o tabuleiro e dispara nova partida).
- **FR-8:** Suporte Nativo a Leitores de Tela (ARIA Live Regions `aria-live="assertive"` e `role="status"` no HTML).
- **FR-9:** Sintetizador Web Audio Fallback (Web Audio API para SFX sintetizados + Web Speech API para TTS nativo).

### NonFunctional Requirements

- **NFR-1 (Acessibilidade):** 100% de jogabilidade autônoma por pessoas com deficiência visual (WCAG 2.1 AA).
- **NFR-2 (Desempenho e Latência):** Resposta imediata (< 50ms) para teclas de navegação e bipes de áudio.
- **NFR-3 (Compatibilidade):** Suporte nativo aos principais leitores de tela (NVDA, VoiceOver, TalkBack, JAWS) e navegadores modernos (Chrome, Firefox, Edge, Safari).

### Additional Requirements (Arquitetura)

- **AD-1:** Aplicação 100% Vanilla (HTML5, CSS3, ES6+ JS puro sem frameworks ou compilação).
- **AD-2:** Gerador de bipes sintéticos via `AudioContext` sem dependência de arquivos de áudio externos.
- **AD-3:** Matriz de frequências (440Hz / 330Hz / 220Hz) e StereoPannerNode (-0.7 a +0.7).
- **AD-4:** Bloqueio de teclado durante estado `STATE_AI_THINKING` e anúncios.
- **AD-5:** Oponente de IA assíncrono com delay humano (700ms-1000ms).
- **AD-6:** Tabuleiro armazenado em Array 1D de 9 posições `[0..8]`.

### UX Design Requirements

- **UX-DR1:** Interface de alto contraste visual (fundo escuro, bordas largas, foco amarelo visível) para usuários com baixa visão.
- **UX-DR2:** Mensagem de boas-vindas falada automaticamente ao carregar o jogo com orientações de controles.

### FR Coverage Map

- **FR-1:** Story 1.3 (Navegação Grid 3x3 por Teclado com Espacialização)
- **FR-2:** Story 1.3 (Feedback Sonoro Estéreo e Pitch por Linha/Coluna)
- **FR-3:** Story 2.1 (Marcação de Casa via Espaço/Enter)
- **FR-4:** Story 2.1 (Bloqueio e Aviso em Casas Ocupadas)
- **FR-5:** Story 2.2 (Oponente de IA com Delay Humano)
- **FR-6:** Story 2.3 (Detecção de Vitória, Derrota e Empate)
- **FR-7:** Story 2.3 (Reinício Rápido via tecla R/Enter)
- **FR-8:** Story 1.1 (Suporte ARIA Live Region para Leitores de Tela)
- **FR-9:** Story 1.2 (Engine de Web Audio Sintetizado + SpeechSynthesis TTS)

---

## Epic List

### Épico 1: Estrutura da Aplicação Web & Feedback de Navegação por Áudio
**Objetivo:** Permitir que o jogador acesse a aplicação web e navegue com total suporte auditivo pelo tabuleiro 3x3 usando o teclado, ouvindo coordenadas faladas e tons sonoros espacializados.
**FRs cobertos:** FR-1, FR-2, FR-8, FR-9

### Épico 2: Mecânica de Jogo, Inteligência Artificial e Condições de Vitória
**Objetivo:** Permitir que o jogador execute jogadas contra o computador (IA), ouça a resposta do oponente e receba o resultado completo da partida (vitória, derrota, empate e reinício).
**FRs cobertos:** FR-3, FR-4, FR-5, FR-6, FR-7

---

## Épico 1: Estrutura da Aplicação Web & Feedback de Navegação por Áudio

### Story 1.1: Estrutura HTML/CSS Base com ARIA Live Region e Alto Contraste

As a pessoa com deficiência visual ou baixa visão,
I want acessar uma página web limpa, com regiões ARIA Live para leitores de tela e visual de alto contraste,
So that eu possa carregar o jogo com segurança e orientação inicial.

**Acceptance Criteria:**

**Given** que o usuário abre a aplicação no navegador,
**When** a página carregar,
**Then** um elemento HTML com `role="status"` e `aria-live="assertive"` deve estar presente no DOM para transmitir mensagens do sistema aos leitores de tela.
**And** o layout deve utilizar tema escuro de alto contraste (fundo preto `#000`, bordas amarelas `#FFD700`, texto branco `#FFF`) atendendo `UX-DR1` e `AD-1`.

---

### Story 1.2: Engine de Áudio Duplo (Web Audio API + SpeechSynthesis TTS)

As a desenvolvedor e usuário cego,
I want um módulo de áudio sintético que emita bipes estéreo e mensagens de voz nativas,
So that o jogo forneça retorno auditivo imediato sem depender de arquivos MP3 ou conexão de rede.

**Acceptance Criteria:**

**Given** que a aplicação é iniciada no navegador,
**When** o módulo `AudioManager` é inicializado,
**Then** ele deve criar uma instância nativa de `AudioContext` para sintetizar tons via osciladores atendendo `AD-2`.
**And** deve disponibilizar funções de síntese de voz usando `window.speechSynthesis` para ler texto em Português (`pt-BR`).
**And** a mensagem de boas-vindas deve ser anunciada ao carregar atendendo `UX-DR2`.

---

### Story 1.3: Navegação Grid 3x3 por Teclado com Espacialização Sonora

As a jogador cego,
I want utilizar as setas direcionais do teclado para alternar o foco entre as 9 casas do tabuleiro,
So that eu ouça a coordenada falada (ex: "Linha 1, Coluna 2: Vazio") e um bipe com tom e pan estéreo correspondentes à posição.

**Acceptance Criteria:**

**Given** que o jogador está na posição `[Linha 1, Coluna 1]`,
**When** ele pressiona a `Seta Direita`,
**Then** o foco é alterado para `[Linha 1, Coluna 2]`, emitindo o bipe espacializado (linha aguda, pan estéreo no centro) atendendo `AD-3`.
**And** o sistema lê via TTS e ARIA Live: *"Linha 1, Coluna 2: Vazio"* (atendendo `FR-1` e `FR-2`).
**And** a navegação deve ser circular (pressionar `Seta Direita` na Coluna 3 retorna para a Coluna 1 da mesma linha).

---

## Épico 2: Mecânica de Jogo, Inteligência Artificial e Condições de Vitória

### Story 2.1: Marcação de Jogada via Tecla de Ação e Bloqueio de Casas Ocupadas

As a jogador,
I want pressionar a tecla `Espaço` ou `Enter` para marcar a casa focada como `X`,
So that minha jogada seja registrada com efeito sonoro ou eu seja avisado se a casa já estiver ocupada.

**Acceptance Criteria:**

**Given** que o jogador está com o foco em uma casa livre (`0`),
**When** ele pressiona `Espaço` ou `Enter`,
**Then** a casa passa para o estado `1` (`X`), toca o tom de confirmação de marcação e fala: *"X marcado em Linha A, Coluna B"* (atendendo `FR-3`).
**And** se a casa já contiver `X` ou `O`, o sistema bloqueia a marcação, toca o som de erro e anuncia: *"Casa ocupada por [X/O]"* (atendendo `FR-4`).

---

### Story 2.2: Oponente de IA (Single-Player) com Delay Humano

As a jogador,
I want que o computador jogue automaticamente como `O` após a minha vez,
So that eu possa disputar uma partida completa Single-Player contra a IA.

**Acceptance Criteria:**

**Given** que o jogador acabou de marcar o seu `X`,
**When** o turno passa para a IA,
**Then** o estado do jogo muda para `STATE_AI_THINKING` e as entradas do teclado são temporariamente bloqueadas atendendo `AD-4`.
**And** após um atraso entre 700ms e 1000ms (`AD-5`), a IA escolhe uma casa livre válida, marca como `O` e o sistema anuncia falado: *"IA marcou O em Linha X, Coluna Y"* (atendendo `FR-5`).

---

### Story 2.3: Detecção de Vitória, Derrota, Empate e Reinício Rápido (`R`/`Enter`)

As a jogador,
I want ser notificado com som festivo ou de derrota quando a partida terminar e poder reiniciar rapidamente com a tecla `R`,
So that eu saiba quem venceu e possa jogar novamente.

**Acceptance Criteria:**

**Given** que uma linha de 3 símbolos iguais é formada ou todas as 9 casas foram preenchidas sem vencedor,
**When** o estado do jogo verifica o término,
**Then** se o jogador venceu, toca vinheta festiva de vitória e lê: *"Parabéns! Você venceu a partida!"*.
**And** se a IA venceu, toca vinheta de derrota e lê: *"IA venceu a partida. Tente novamente!"*.
**And** se der empate, toca som de empate e lê: *"Deu Velha! Empate!"* (atendendo `FR-6`).
**And** a qualquer momento ou na tela final, pressionar a tecla `R` ou `Enter` reseta o tabuleiro para `[0,0,0,0,0,0,0,0,0]` e inicia nova partida (atendendo `FR-7`).
