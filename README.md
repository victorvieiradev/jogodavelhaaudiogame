# 🎧 Jogo da Velha Acessível por Áudio (Audio Game)

> **Aplicação Web Acessível para Pessoas com Deficiência Visual (Cegos e Baixa Visão)**  
> Desenvolvido com **Vanilla HTML5, CSS3 e JavaScript ES6+**, utilizando **Web Audio API** e **Web Speech API**.

---

## 📌 Sobre o Projeto

O **Jogo da Velha Acessível por Áudio** é um jogo web inclusivo que substitui os elementos exclusivamente visuais por um mapa auditivo espacializado e feedback falado em tempo real. O jogo permite que pessoas cegas ou com baixa visão joguem partidas no modo **Single-Player (Jogador vs. IA)** utilizando apenas o teclado.

---

## ⌨️ Controles e Navegação por Teclado

| Tecla | Ação |
| --- | --- |
| **`↑` `↓` `←` `→`** | Navegar pelas 9 casas do tabuleiro 3x3 (navegação circular). |
| **`Espaço` / `Enter`** | Marcar a jogada (`X`) na casa focada. |
| **`D`** | Alternar nível de dificuldade da IA (Fácil, Médio, Impossível). |
| **`R`** | Reiniciar a partida a qualquer momento. |
| **`S`** | Ouvir o resumo do tabuleiro completo por voz. |

---

## 🔊 Recursos de Áudio & Acessibilidade (WCAG 2.1 AA)

- 🎶 **Dual Audio Pipeline:** Efeitos sonoros sintetizados via `AudioContext` (sem arquivos MP3 externos) + Síntese de Voz nativa (`window.speechSynthesis`).
- 🧭 **Espacialização Sonora:** 
  - **Frequência por Linha (Y):** Linha 1 (440Hz / Tom agudo), Linha 2 (330Hz / Tom médio), Linha 3 (220Hz / Tom grave).
  - **Pan Estéreo por Coluna (X):** Coluna 1 (Esquerda `-0.7`), Coluna 2 (Centro `0.0`), Coluna 3 (Direita `+0.7`).
- ♿ **Suporte ARIA Live:** Região `aria-live="assertive"` integrada para suporte nativo a leitores de tela como NVDA, VoiceOver, TalkBack e JAWS.
- 🎨 **Alto Contraste Visual:** Tema escuro com bordas amarelas de alto contraste (`#ffe600`) para auxílio a usuários com baixa visão.

---

## 🤖 Oponente de IA (3 Níveis de Dificuldade)

- **Modo Single-Player:** Jogador joga como `X` e o Computador joga como `O`.
- **Níveis Selecionáveis (Tecla `D` ou Botão):**
  - 🟢 **Fácil:** Jogadas com 70% de aleatoriedade para iniciantes.
  - 🟡 **Médio:** Estratégia heurística (bloqueia vitórias e fecha linhas).
  - 🔴 **Impossível:** Algoritmo **Minimax** impecável (imbatível).
- **Delay Humano:** Atraso natural (850ms) para simular o tempo de raciocínio da IA sem sobrepor os áudios.

---

## 📁 Estrutura do Repositório

```text
/
├── index.html           # Interface principal + Regiões ARIA Live
├── README.md            # Cabeçalho e documentação do projeto
├── css/
│   └── styles.css       # Estilização de alto contraste e foco visível
├── js/
│   ├── main.js          # Orquestrador da aplicação
│   ├── game-state.js    # Lógica do tabuleiro e estado (Array 1D)
│   ├── audio-manager.js # Web Audio API + SpeechSynthesis TTS
│   ├── input-handler.js # Mapeador de eventos do teclado
│   └── ai-player.js     # Motor da Inteligência Artificial
└── _bmad-output/        # Artefatos do BMad Method (PRD, Arquitetura, Épicos)
```

---

## 👤 Autor

* **Desenvolvedor:** Victor Vieira ([@victorvieiradev](https://github.com/victorvieiradev))
* **E-mail:** `contatovictorvieira@outlook.com`
* **Repositório:** [github.com/victorvieiradev/jogodavelhaaudiogame](https://github.com/victorvieiradev/jogodavelhaaudiogame)
