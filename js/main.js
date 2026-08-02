/**
 * Main Controller — Ponto de entrada e Orquestrador da Aplicação Web
 * Integra GameState, AudioManager, AiPlayer, InputHandler e DOM
 */
class GameController {
    constructor() {
        this.state = window.gameState;
        this.audio = window.audioManager;
        this.ai = window.aiPlayer;
        this.cellElems = document.querySelectorAll('.cell');
        this.statusBox = document.getElementById('status-message');
        this.turnIndicator = document.getElementById('current-turn');
        
        this.inputHandler = new InputHandler(this);
        this.initDOM();
    }

    /**
     * Associa eventos de clique nos elementos visuais do DOM
     */
    initDOM() {
        // Cliques nas células do tabuleiro
        this.cellElems.forEach(cell => {
            cell.addEventListener('click', () => {
                const index = parseInt(cell.dataset.index, 10);
                this.state.focusIndex = index;
                this.updateFocusDOM();
                this.handleActionKey();
            });
        });

        // Botão de reiniciar
        const btnRestart = document.getElementById('btn-restart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => this.restartGame());
        }

        // Botão de áudio / ativador
        const btnAudio = document.getElementById('btn-audio-test');
        if (btnAudio) {
            btnAudio.addEventListener('click', () => {
                this.audio.initAudio();
                const desc = this.state.getCellDescription(this.state.focusIndex);
                this.audio.speak(`Áudio ativado. Posição atual: ${desc}`);
            });
        }

        // Botão de dificuldade
        const btnDifficulty = document.getElementById('btn-difficulty');
        if (btnDifficulty) {
            btnDifficulty.addEventListener('click', () => this.cycleDifficulty());
        }

        // Sincroniza a dificuldade inicial da IA com o estado
        this.ai.setDifficulty(this.state.difficulty);
        this.updateDifficultyDOM();

        // Inicializa o foco visual na primeira célula
        this.updateFocusDOM();
        
        // Boas-vindas iniciais
        setTimeout(() => {
            const welcomeText = "Bem-vindo ao Jogo da Velha Acessível. Use as setas para navegar e Espaço para marcar. Tecla D altera a dificuldade. Posição inicial: Linha 1, Coluna 1, Vazio.";
            this.updateStatusText(welcomeText);
            this.audio.speak(welcomeText);
        }, 500);
    }

    /**
     * Alterna o nível de dificuldade da IA
     */
    cycleDifficulty() {
        const newLevel = this.state.cycleDifficulty();
        this.ai.setDifficulty(newLevel);
        
        const difficultyText = this.state.getDifficultyText();
        this.audio.playDifficultyChangeSound(newLevel);
        
        const difficultyMsg = `Dificuldade alterada para: ${difficultyText}.`;
        this.updateStatusText(difficultyMsg);
        this.audio.speak(difficultyMsg);

        this.updateDifficultyDOM();
    }

    /**
     * Atualiza o rótulo visual e atributos ARIA do botão de dificuldade
     */
    updateDifficultyDOM() {
        const btnDifficulty = document.getElementById('btn-difficulty');
        const difficultyLabel = document.getElementById('difficulty-label');
        const diffText = this.state.getDifficultyText();

        if (difficultyLabel) {
            difficultyLabel.textContent = diffText;
        }

        if (btnDifficulty) {
            btnDifficulty.setAttribute('aria-label', `Nível de Dificuldade da IA: ${diffText}. Pressione D ou clique para alterar.`);
        }
    }

    /**
     * Trata a navegação pelas setas do teclado
     */
    handleNavigation(direction) {
        if (this.state.status !== STATE_PLAYING && this.state.status !== STATE_GAME_OVER) return;

        const newIndex = this.state.navigate(direction);
        const { row, col } = this.state.getCoords(newIndex);
        
        // Toca bipe espacializado
        this.audio.playFocusBeep(row - 1, col - 1);
        
        // Atualiza a interface gráfica
        this.updateFocusDOM();

        // Anuncia o estado da casa falado
        const desc = this.state.getCellDescription(newIndex);
        this.updateStatusText(`Foco em ${desc}`);
        this.audio.speak(desc);
    }

    /**
     * Trata o acionamento da tecla de ação (Espaço / Enter)
     */
    handleActionKey() {
        if (this.state.status === STATE_GAME_OVER) {
            this.restartGame();
            return;
        }

        if (this.state.status !== STATE_PLAYING || this.state.turn !== CELL_X) return;

        const index = this.state.focusIndex;
        const success = this.state.makeMove(index, CELL_X);

        if (!success) {
            // Casa já ocupada (Erro)
            this.audio.playErrorSound();
            const errorMsg = "Casa já ocupada. Escolha outra casa vazia.";
            this.updateStatusText(errorMsg);
            this.audio.speak(errorMsg);
            return;
        }

        // Jogada válida do jogador realizada
        this.audio.playPlayerMoveSound();
        const { row, col } = this.state.getCoords(index);
        const moveMsg = `X marcado na Linha ${row}, Coluna ${col}.`;
        this.updateStatusText(moveMsg);
        this.updateBoardDOM();

        // Verifica se o jogo acabou após o movimento do jogador
        if (this.state.status === STATE_GAME_OVER) {
            this.handleGameOver();
            return;
        }

        // Passa o turno para a IA
        this.executeAiTurn();
    }

    /**
     * Executa o turno da IA (Computador) com atraso humano (700ms - 1000ms)
     */
    executeAiTurn() {
        this.state.status = STATE_AI_THINKING;
        this.state.turn = CELL_O;
        this.turnIndicator.innerHTML = '<span style="color: var(--accent-ai)">Vez da IA (O)...</span>';
        this.inputHandler.lockInput();

        setTimeout(() => {
            const aiIndex = this.ai.getBestMove(this.state);
            if (aiIndex !== -1) {
                this.state.makeMove(aiIndex, CELL_O);
                this.audio.playAiMoveSound();

                const { row, col } = this.state.getCoords(aiIndex);
                const aiMsg = `IA marcou O em Linha ${row}, Coluna ${col}.`;
                this.updateBoardDOM();
                this.updateStatusText(aiMsg);
                this.audio.speak(aiMsg);
            }

            this.inputHandler.unlockInput();

            if (this.state.status === STATE_GAME_OVER) {
                this.handleGameOver();
            } else {
                this.state.status = STATE_PLAYING;
                this.state.turn = CELL_X;
                this.turnIndicator.innerHTML = '<span style="color: var(--accent-player)">Sua Vez (X)</span>';
            }
        }, 850);
    }

    /**
     * Trata o fim de jogo (Vitória, Derrota ou Empate)
     */
    handleGameOver() {
        let finalMsg = "";
        
        if (this.state.winner === CELL_X) {
            this.audio.playWinJingle();
            finalMsg = "Parabéns! Você venceu a partida!";
            this.turnIndicator.innerHTML = '<strong style="color: var(--focus-yellow)">Vitória do Jogador!</strong>';
        } else if (this.state.winner === CELL_O) {
            this.audio.playLossSound();
            finalMsg = "A IA venceu a partida. Tente novamente!";
            this.turnIndicator.innerHTML = '<strong style="color: var(--accent-ai)">Vitória da IA!</strong>';
        } else {
            this.audio.playDrawSound();
            finalMsg = "Deu Velha! A partida empatou.";
            this.turnIndicator.innerHTML = '<strong style="color: var(--text-muted)">Empate!</strong>';
        }

        const fullMessage = `${finalMsg} Pressione a tecla R ou Enter para jogar novamente.`;
        this.updateStatusText(fullMessage);
        
        setTimeout(() => {
            this.audio.speak(fullMessage);
        }, 400);
    }

    /**
     * Anuncia o resumo completo do estado do tabuleiro (Tecla S)
     */
    announceBoardSummary() {
        let summary = "Resumo do tabuleiro: ";
        for (let i = 0; i < 9; i++) {
            summary += `${this.state.getCellDescription(i)}. `;
        }
        this.audio.speak(summary);
    }

    /**
     * Reinicia o jogo
     */
    restartGame() {
        this.state.reset();
        this.inputHandler.unlockInput();
        this.updateBoardDOM();
        this.updateFocusDOM();

        this.turnIndicator.innerHTML = '<span style="color: var(--accent-player)">Sua Vez (X)</span>';
        const restartMsg = "Nova partida iniciada! Você é o X. Foco em Linha 1, Coluna 1: Vazio.";
        this.updateStatusText(restartMsg);
        this.audio.speak(restartMsg);
    }

    /**
     * Atualiza o foco gráfico e acessível na célula atual
     */
    updateFocusDOM() {
        this.cellElems.forEach((cell, idx) => {
            if (idx === this.state.focusIndex) {
                cell.classList.add('focused');
                cell.setAttribute('tabindex', '0');
                cell.focus();
            } else {
                cell.classList.remove('focused');
                cell.setAttribute('tabindex', '-1');
            }
        });
    }

    /**
     * Atualiza os símbolos e rótulos ARIA no tabuleiro
     */
    updateBoardDOM() {
        this.cellElems.forEach((cell, idx) => {
            const val = this.state.board[idx];
            const markElem = cell.querySelector('.cell-mark');
            
            if (val === CELL_X) {
                cell.setAttribute('data-mark', 'X');
                markElem.textContent = 'X';
            } else if (val === CELL_O) {
                cell.setAttribute('data-mark', 'O');
                markElem.textContent = 'O';
            } else {
                cell.removeAttribute('data-mark');
                markElem.textContent = '';
            }

            // Atualiza aria-label para leitores de tela
            cell.setAttribute('aria-label', this.state.getCellDescription(idx));
        });
    }

    /**
     * Atualiza a mensagem na caixa de status visível
     */
    updateStatusText(msg) {
        if (this.statusBox) {
            this.statusBox.textContent = msg;
        }
    }
}

// Inicializa a aplicação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    window.gameController = new GameController();
});
