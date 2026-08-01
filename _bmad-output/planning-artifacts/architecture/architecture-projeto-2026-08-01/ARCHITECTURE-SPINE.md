---
name: Jogo da Velha Acessível por Áudio
type: architecture-spine
purpose: build-substrate
altitude: feature
paradigm: Event-Driven Unidirectional State Machine (Vanilla JS + Web Audio API)
scope: Aplicação Web de Jogo da Velha Acessível por Áudio (Single Player vs IA)
status: final
created: 2026-08-01
updated: 2026-08-01
binds: [FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9]
sources: [_bmad-output/planning-artifacts/prds/prd-projeto-2026-08-01/prd.md]
companions: []
---

# Architecture Spine — Jogo da Velha Acessível por Áudio

## Design Paradigm

A aplicação adota o paradigma **Event-Driven Unidirectional State Machine (MVC leve em Vanilla JS)**. 

Todas as entradas do usuário (teclas de seta, Espaço, Enter, R) são capturadas pelo `InputHandler`, que envia comandos para o `GameController`. O `GameController` atualiza a máquina de estado do jogo (`GameState`), que notifica simultaneamente o **`AudioManager`** (gerador de efeitos Web Audio API e síntese de voz TTS) e atualiza a região **ARIA Live** no DOM para integração perfeita com leitores de tela externos.

```mermaid
graph TD
    User Keyboard -->|Keydown Event| InputHandler
    InputHandler -->|Action Event| GameController
    GameController -->|Mutate State| GameState
    GameState -->|Notify Change| AudioManager
    GameState -->|Update Text| ARIA Live Region (DOM)
    GameController -->|Trigger AI Turn| AiPlayer
    AiPlayer -->|Select Cell| GameController
    AudioManager -->|Oscillators & TTS| User Audio Output
```

---

## Invariants & Rules

### AD-1 — Zero Dependências de Runtimes Externos (Vanilla Web Standards)
- **Binds:** `all` (todos os módulos da aplicação).
- **Prevents:** Lentidão no carregamento, incompatibilidades com leitores de tela e complexidade de compilação.
- **Rule:** O projeto será desenvolvido exclusivamente em **HTML5, CSS3 Vanilla e JavaScript ES6+** nativo do navegador. Nenhuma biblioteca externa (React, Vue, jQuery) é permitida para garantir latência zero na resposta a eventos de teclado.

### AD-2 — Pipeline de Áudio Duplo (Sintetizador Web Audio API + SpeechSynthesis API)
- **Binds:** `FR-1`, `FR-2`, `FR-3`, `FR-4`, `FR-6`, `FR-8`, `FR-9`.
- **Prevents:** Falha de carregamento de arquivos de áudio externos (`.mp3` ou `.wav`) e dependência de conexão de rede para sons.
- **Rule:** Todos os bipes de movimentação e vinhetas sonoras (vitória, derrota, erro) devem ser gerados sinteticamente via `Web Audio API` (`AudioContext` com osciladores). O áudio falado deve utilizar a API nativa `window.speechSynthesis` com fallback inteligente para região `aria-live` do DOM.

### AD-3 — Mapeamento Estéreo e Espacialização por Frequência
- **Binds:** `FR-2`, `FR-1`.
- **Prevents:** Desorientação espacial do jogador no tabuleiro 3x3.
- **Rule:** 
  1. **Linhas (Eixo Y):** A frequência base do som de foco varia com a linha (Linha 1 = 440Hz / tom agudo, Linha 2 = 330Hz / tom médio, Linha 3 = 220Hz / tom grave).
  2. **Colunas (Eixo X):** O som é panoramizado com `StereoPannerNode` (Coluna 1 = Esquerda `-0.7`, Coluna 2 = Centro `0.0`, Coluna 3 = Direita `+0.7`).

### AD-4 — Bloqueio de Eventos Durante Transição de Turno
- **Binds:** `FR-1`, `FR-3`, `FR-5`.
- **Prevents:** Condição de corrida (race condition) onde o usuário pressiona teclas enquanto a IA está jogando ou o áudio de anúncio está ocorrendo.
- **Rule:** O `InputHandler` deve desabilitar temporariamente entradas do teclado enquanto o estado do jogo estiver em `STATE_AI_THINKING` ou durante anúncios de fim de jogo.

### AD-5 — Motor de IA Assíncrono com Delay Humano
- **Binds:** `FR-5`.
- **Prevents:** Jogada instantânea da IA que sobreponha o som da jogada do usuário.
- **Rule:** A jogada da IA deve ser calculada usando o algoritmo Minimax (dificuldade média) e executada após um atraso assíncrono controlado (`setTimeout` entre 700ms e 1000ms), permitindo que o anúncio da jogada do usuário seja concluído antes do áudio da IA iniciar.

### AD-6 — Representação Flat do Tabuleiro (Array 1D de 9 posições)
- **Binds:** `FR-1`, `FR-3`, `FR-6`.
- **Prevents:** Complexidade desnecessária de matrizes bidimensionais e divergência na indexação de posições.
- **Rule:** O tabuleiro de 9 posições será representado por um Array unidimensional de tamanho 9: `[0, 0, 0, 0, 0, 0, 0, 0, 0]`, onde `0 = Vazio`, `1 = X (Jogador)` e `2 = O (IA)`. A navegação converte o índice `0..8` em coordenadas de exibição `Linha = Math.floor(index / 3) + 1` e `Coluna = (index % 3) + 1`.

---

## Consistency Conventions

| Concern | Convenção |
| --- | --- |
| Nomenclatura de Arquivos | `kebab-case` para arquivos (ex: `game-state.js`, `audio-manager.js`). |
| Nomenclatura de Classes / Módulos | `PascalCase` para construtores e classes (`GameState`, `AudioManager`, `InputHandler`). |
| Métodos e Variáveis | `camelCase` para métodos e propriedades (`currentFocusIndex`, `playMove()`). |
| Constantes de Estado | `UPPER_SNAKE_CASE` (ex: `CELL_EMPTY = 0`, `CELL_X = 1`, `CELL_O = 2`). |
| Estrutura de Resposta do Áudio | Sempre retornar uma Promise ao tocar áudio/fala para permitir encadeamento `.then()`. |

---

## Stack

| Tecnologia / API | Versão / Padrão | Uso |
| --- | --- | --- |
| HTML5 | Padrão W3C | Estrutura semântica e regiões ARIA Live |
| CSS3 | Vanilla CSS | Estilização de alto contraste e acessibilidade visual |
| JavaScript | ES6+ Standard | Lógica do jogo, controle de estado e manipulador de teclado |
| Web Audio API | Standard W3C | Osciladores e sintetizador de áudio de efeitos sonoros |
| Web Speech API | SpeechSynthesis | Sintetizador de voz falada nativo do navegador |

---

## Structural Seed

```text
/
├── index.html           # Estrutura HTML principal + Elemento ARIA Live Region
├── css/
│   └── styles.css       # Estilos CSS de alto contraste, foco visível e layout
├── js/
│   ├── main.js          # Ponto de entrada, inicialização e bindings
│   ├── game-state.js    # Gerenciador de estado do tabuleiro e regras do jogo
│   ├── audio-manager.js # Gerador de Web Audio (bipes, panner) e Speech Synthesis
│   ├── input-handler.js # Mapeamento de setas do teclado, Enter, Espaço, R
│   └── ai-player.js     # Lógica do oponente de IA (Minimax / Escolha de jogada)
└── assets/
    └── favicon.ico      # Ícone da aplicação
```

---

## Capability → Architecture Map

| Requisito PRD | Módulo Responsável | Governança / Regra |
| --- | --- | --- |
| **FR-1:** Navegação 3x3 por Setas | `js/input-handler.js`, `js/game-state.js` | AD-3, AD-6 |
| **FR-2:** Feedback Sonoro de Posição | `js/audio-manager.js` | AD-2, AD-3 |
| **FR-3:** Marcação via Espaço/Enter | `js/input-handler.js`, `js/game-state.js` | AD-4, AD-6 |
| **FR-4:** Bloqueio de Casa Ocupada | `js/game-state.js`, `js/audio-manager.js` | AD-2 |
| **FR-5:** Processamento da IA | `js/ai-player.js` | AD-4, AD-5 |
| **FR-6:** Fim de Jogo (Vitória/Derrota/Empate) | `js/game-state.js`, `js/audio-manager.js` | AD-2, AD-4 |
| **FR-7:** Reinício Rápido (`R`/`Enter`) | `js/input-handler.js`, `js/game-state.js` | AD-4 |
| **FR-8:** Suporte ARIA Live | `index.html`, `js/audio-manager.js` | AD-1, AD-2 |
| **FR-9:** Fallback Web Audio + TTS | `js/audio-manager.js` | AD-2 |

---

## Deferred

- **Multiplayer Online / WebSockets:** Adiar para versão 2.0.
- **Suporte a Controles Gamepad / Touch Gestures:** Adiar para versão 2.0.
- **Persistência de Dados (LocalStorage):** Adiar estatísticas de vitórias para v1.1.
