/**
 * AiPlayer — Inteligência Artificial do Oponente (Computador)
 * Atende às diretrizes AD-5 e FR-5 (Single-Player com Dificuldade Média)
 */
class AiPlayer {
    /**
     * Seleciona a melhor jogada no tabuleiro atual
     * @param {GameState} gameState Instância do estado do jogo
     * @returns {number} Índice escolhido (0 a 8)
     */
    getBestMove(gameState) {
        const board = [...gameState.board];
        const availableMoves = gameState.getAvailableMoves();

        if (availableMoves.length === 0) return -1;

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
     * Verifica se um determinado símbolo venceu no tabuleiro temporário
     */
    checkWin(board, symbol) {
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winCombos.some(combo => {
            const [a, b, c] = combo;
            return board[a] === symbol && board[b] === symbol && board[c] === symbol;
        });
    }
}

window.aiPlayer = new AiPlayer();
