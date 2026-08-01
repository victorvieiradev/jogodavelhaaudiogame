/**
 * GameState — Lógica e Gerenciamento do Estado do Jogo da Velha
 * Atende às diretrizes AD-4, AD-6, FR-1, FR-3, FR-6 e FR-7.
 */

const CELL_EMPTY = 0;
const CELL_X = 1; // Jogador
const CELL_O = 2; // IA

const STATE_PLAYING = 'PLAYING';
const STATE_AI_THINKING = 'AI_THINKING';
const STATE_GAME_OVER = 'GAME_OVER';

class GameState {
    constructor() {
        this.board = new Array(9).fill(CELL_EMPTY);
        this.focusIndex = 0; // Posição atual do foco (0 a 8)
        this.status = STATE_PLAYING;
        this.turn = CELL_X; // Jogador X começa
        this.winner = null; // null | CELL_X | CELL_O | 'DRAW'
        
        // Combinações de vitória no tabuleiro 3x3 (Linhas, Colunas, Diagonais)
        this.winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
            [0, 4, 8], [2, 4, 6]             // Diagonais
        ];
    }

    /**
     * Reinicia o estado do jogo para uma nova partida
     */
    reset() {
        this.board = new Array(9).fill(CELL_EMPTY);
        this.focusIndex = 0;
        this.status = STATE_PLAYING;
        this.turn = CELL_X;
        this.winner = null;
    }

    /**
     * Retorna a coordenada de exibição {row: 1..3, col: 1..3} a partir do índice 0..8
     * @param {number} index Índice 0 a 8
     */
    getCoords(index) {
        const row = Math.floor(index / 3) + 1;
        const col = (index % 3) + 1;
        return { row, col };
    }

    /**
     * Retorna a descrição falada do estado de uma casa
     * @param {number} index Índice 0 a 8
     */
    getCellDescription(index) {
        const { row, col } = this.getCoords(index);
        const val = this.board[index];
        let stateText = "Vazio";
        if (val === CELL_X) stateText = "Marcado com X";
        if (val === CELL_O) stateText = "Marcado com O";
        
        return `Linha ${row}, Coluna ${col}: ${stateText}`;
    }

    /**
     * Mapeia a navegação circular por setas direcionais no grid 3x3
     * @param {string} direction 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
     */
    navigate(direction) {
        let { row, col } = this.getCoords(this.focusIndex);
        // Converte para 0-indexed para operações matemáticas
        let r = row - 1;
        let c = col - 1;

        switch (direction) {
            case 'UP':
                r = (r - 1 + 3) % 3;
                break;
            case 'DOWN':
                r = (r + 1) % 3;
                break;
            case 'LEFT':
                c = (c - 1 + 3) % 3;
                break;
            case 'RIGHT':
                c = (c + 1) % 3;
                break;
        }

        this.focusIndex = r * 3 + c;
        return this.focusIndex;
    }

    /**
     * Executa a jogada em uma determinada casa
     * @param {number} index Índice da casa (0 a 8)
     * @param {number} symbol CELL_X ou CELL_O
     */
    makeMove(index, symbol) {
        if (this.board[index] !== CELL_EMPTY || this.status === STATE_GAME_OVER) {
            return false;
        }

        this.board[index] = symbol;
        this.checkGameResult();
        return true;
    }

    /**
     * Avalia o tabuleiro e verifica se houve vitória ou empate
     */
    checkGameResult() {
        for (const combo of this.winCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] !== CELL_EMPTY && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                
                this.winner = this.board[a];
                this.status = STATE_GAME_OVER;
                return;
            }
        }

        // Verifica se o tabuleiro encheu (Empate)
        if (!this.board.includes(CELL_EMPTY)) {
            this.winner = 'DRAW';
            this.status = STATE_GAME_OVER;
        }
    }

    /**
     * Retorna a lista de índices das casas vazias disponíveis
     */
    getAvailableMoves() {
        const moves = [];
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === CELL_EMPTY) {
                moves.push(i);
            }
        }
        return moves;
    }
}

window.gameState = new GameState();
