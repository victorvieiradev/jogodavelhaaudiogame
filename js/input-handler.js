/**
 * InputHandler — Mapeador de Eventos de Teclado e Ações
 * Atende às diretrizes AD-4, FR-1, FR-3, FR-7 do projeto.
 */
class InputHandler {
    constructor(gameController) {
        this.gameController = gameController;
        this.isLocked = false;
        this.initListeners();
    }

    initListeners() {
        document.addEventListener('keydown', (e) => {
            // Evita a ação padrão das setas/espaço para não rolar a tela
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'r', 'R', 's', 'S'].includes(e.key)) {
                if (e.key === ' ' || e.key.startsWith('Arrow')) {
                    e.preventDefault();
                }
            }

            if (this.isLocked) return;

            switch (e.key) {
                case 'ArrowUp':
                    this.gameController.handleNavigation('UP');
                    break;
                case 'ArrowDown':
                    this.gameController.handleNavigation('DOWN');
                    break;
                case 'ArrowLeft':
                    this.gameController.handleNavigation('LEFT');
                    break;
                case 'ArrowRight':
                    this.gameController.handleNavigation('RIGHT');
                    break;
                case ' ':
                case 'Enter':
                    this.gameController.handleActionKey();
                    break;
                case 'r':
                case 'R':
                    this.gameController.restartGame();
                    break;
                case 's':
                case 'S':
                    this.gameController.announceBoardSummary();
                    break;
            }
        });
    }

    lockInput() {
        this.isLocked = true;
    }

    unlockInput() {
        this.isLocked = false;
    }
}

window.InputHandler = InputHandler;
