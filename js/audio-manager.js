/**
 * AudioManager — Gerenciador de Áudio Duplo (Web Audio API + SpeechSynthesis)
 * Atende às diretrizes AD-2, AD-3, FR-2, FR-8 e FR-9 do projeto.
 */
class AudioManager {
    constructor() {
        this.audioCtx = null;
        this.speechSynth = window.speechSynthesis || null;
        this.isAudioInitialized = false;
        
        // Frequências por Linha (Hz): L1 (Agudo), L2 (Médio), L3 (Grave)
        this.rowFrequencies = [440, 330, 220];
        
        // Pan Estéreo por Coluna: C1 (Esquerda), C2 (Centro), C3 (Direita)
        this.colPannings = [-0.7, 0.0, 0.7];
    }

    /**
     * Inicializa o AudioContext com resposta ao primeiro gesto do usuário
     */
    initAudio() {
        if (!this.audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.audioCtx = new AudioContextClass();
            }
        }
        
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        
        this.isAudioInitialized = true;
    }

    /**
     * Toca bipe espacializado ao focar em uma casa (Pitch por Linha + Pan por Coluna)
     * @param {number} row Index da linha (0 a 2)
     * @param {number} col Index da coluna (0 a 2)
     */
    playFocusBeep(row, col) {
        this.initAudio();
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        const freq = this.rowFrequencies[row] || 330;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Suporte a StereoPannerNode se disponível
        if (this.audioCtx.createStereoPanner) {
            const panner = this.audioCtx.createStereoPanner();
            panner.pan.setValueAtTime(this.colPannings[col] || 0, this.audioCtx.currentTime);
            osc.connect(panner);
            panner.connect(gain);
        } else {
            osc.connect(gain);
        }

        gain.connect(this.audioCtx.currentTime ? this.audioCtx.destination : this.audioCtx.destination);

        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    /**
     * Som de marcação de jogada pelo Jogador (X)
     */
    playPlayerMoveSound() {
        this.initAudio();
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        const now = this.audioCtx.currentTime;
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Som de jogada da IA (O)
     */
    playAiMoveSound() {
        this.initAudio();
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        const now = this.audioCtx.currentTime;
        osc.frequency.setValueAtTime(392.00, now); // G4
        osc.frequency.exponentialRampToValueAtTime(311.13, now + 0.18); // Eb4

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Som de Erro (Casa Ocupada)
     */
    playErrorSound() {
        this.initAudio();
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        const now = this.audioCtx.currentTime;
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(110, now + 0.1);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    /**
     * Vinheta festiva de vitória do Jogador
     */
    playWinJingle() {
        this.initAudio();
        if (!this.audioCtx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            const startTime = this.audioCtx.currentTime + index * 0.12;
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    /**
     * Som de derrota (IA venceu)
     */
    playLossSound() {
        this.initAudio();
        if (!this.audioCtx) return;

        const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
        notes.forEach((freq, index) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            const startTime = this.audioCtx.currentTime + index * 0.15;
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    }

    /**
     * Som de Empate (Deu Velha)
     */
    playDrawSound() {
        this.initAudio();
        if (!this.audioCtx) return;

        [300, 300].forEach((freq, index) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            const startTime = this.audioCtx.currentTime + index * 0.2;
            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    }

    /**
     * Anuncia mensagem por texto falado (SpeechSynthesis API) + Atualiza ARIA Live
     * @param {string} text Texto a ser anunciado
     * @param {boolean} interrupt Se verdadeiro, cancela a fala anterior
     */
    speak(text, interrupt = true) {
        // Atualiza a região ARIA Live para suporte nativo a leitores de tela (NVDA/TalkBack)
        const ariaElem = document.getElementById('aria-announce');
        if (ariaElem) {
            ariaElem.textContent = '';
            // Força reflow para garantir que leitores leiam texto idêntico repetido
            setTimeout(() => {
                ariaElem.textContent = text;
            }, 30);
        }

        // Síntese de voz interna como fallback/segundo canal
        if (!this.speechSynth) return;

        if (interrupt) {
            this.speechSynth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.1; // Velocidade ligeiramente ajustada para fluidez
        utterance.pitch = 1.0;

        this.speechSynth.speak(utterance);
    }
}

// Instância global do AudioManager
window.audioManager = new AudioManager();
