/**
 * AiPlayer — Inteligência Artificial do Oponente (Computador)
 * Atende às diretrizes AD-5, FR-5 e FR-10 (Dificuldades Fácil, Médio e Impossível)
 */
class AiPlayer {
    constructor() {
        this.difficulty = 'MEDIUM'; // 'EASY' | 'MEDIUM' | 'HARD'
    }

    /**
     * Define o nível de dificuldade da IA
     * @param {string} level 'EASY' | 'MEDIUM' | 'HARD'
     */
    setDifficulty(level) {
        if (['EASY', 'MEDIUM', 'HARD'].includes(level)) {
            this.difficulty = level;
        }
    }

    /**
     * Retorna a dificuldade atual
     */
    getDifficulty() {
        return this.difficulty;
    }

    /**
     * Seleciona a melhor jogada no tabuleiro atual de acordo com a dificuldade
     * @param {GameState} gameState Instância do estado do jogo
     * @returns {number} Índice escolhido (0 a 8)
     */
    getBestMove(gameState) {
        const availableMoves = gameState.getAvailableMoves();
        if (availableMoves.length === 0) return -1;

        switch (this.difficulty) {
            case 'EASY':
                return this.getEasyMove(gameState, availableMoves);
            case 'HARD':
                return this.getHardMove(gameState, availableMoves);
            case 'MEDIUM':
            default:
                return this.getMediumMove(gameState, availableMoves);
        }
    }

    /**
     * Dificuldade Fácil: 70% jogada aleatória, 30% jogada de nível Médio
     */
    getEasyMove(gameState, availableMoves) {
        if (Math.random() < 0.7) {
            const randomIndex = Math.floor(Math.random() * availableMoves.length);
            return availableMoves[randomIndex];
        }
        return this.getMediumMove(gameState, availableMoves);
    }

    /**
     * Dificuldade Médio: Heurística (Vencer > Bloquear > Centro > Cantos > Aleatório)
     */
    getMediumMove(gameState, availableMoves) {
        const board = [...gameState.board];

        // 1. Tenta VENCER na jogada atual (Se tiver 2 'O' seguidos)
        for (const index of availableMoves) {
            const tempBoard = [...board];
            tempBoard[index] = CELL_O;
            if (this.checkWin(tempBoard, CELL_O)) {
                return index;
            }
        }

        // 2. Tenta BLOQUEAR o jogador 'X' de vencer na próxima jogada
        for (const index of availableMoves) {
            const tempBoard = [...board];
            tempBoard[index] = CELL_X;
            if (this.checkWin(tempBoard, CELL_X)) {
                return index;
            }
        }

        // 3. Prefere o centro (índice 4) se estiver livre
        if (availableMoves.includes(4)) {
            return 4;
        }

        // 4. Prefere os cantos (0, 2, 6, 8) se estiverem disponíveis
        const corners = [0, 2, 6, 8].filter(idx => availableMoves.includes(idx));
        if (corners.length > 0) {
            const randomCorner = corners[Math.floor(Math.random() * corners.length)];
            return randomCorner;
        }

        // 5. Escolhe qualquer casa restante disponível
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
    }

    /**
     * Dificuldade Impossível: Minimax Impecável (Garantia de não perder)
     */
    getHardMove(gameState, availableMoves) {
        let bestScore = -Infinity;
        let bestMove = availableMoves[0];
        const board = [...gameState.board];

        for (const index of availableMoves) {
            board[index] = CELL_O;
            const score = this.minimax(board, 0, false);
            board[index] = CELL_EMPTY;

            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }

        return bestMove;
    }

    /**
     * Algoritmo Minimax recursivo
     */
    minimax(board, depth, isMaximizing) {
        const winSymbol = this.evaluateWin(board);
        if (winSymbol === CELL_O) return 10 - depth;
        if (winSymbol === CELL_X) return depth - 10;
        
        const freeSpots = this.getFreeSpots(board);
        if (freeSpots.length === 0) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (const idx of freeSpots) {
                board[idx] = CELL_O;
                const score = this.minimax(board, depth + 1, false);
                board[idx] = CELL_EMPTY;
                bestScore = Math.max(score, bestScore);
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (const idx of freeSpots) {
                board[idx] = CELL_X;
                const score = this.minimax(board, depth + 1, true);
                board[idx] = CELL_EMPTY;
                bestScore = Math.min(score, bestScore);
            }
            return bestScore;
        }
    }

    getFreeSpots(board) {
        const spots = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === CELL_EMPTY) spots.push(i);
        }
        return spots;
    }

    evaluateWin(board) {
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of winCombos) {
            const [a, b, c] = combo;
            if (board[a] !== CELL_EMPTY && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    /**
     * Verifica se um determinado símbolo venceu no tabuleiro temporário
     */
    checkWin(board, symbol) {
        return this.evaluateWin(board) === symbol;
    }
}

window.aiPlayer = new AiPlayer();

