import { Howl } from 'howler';

export class AudioManager {
  constructor() {
    this.ambientSound = null;
    this.soundEffects = {};
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    // Som ambiente - Trilha sonora do Aphex Twin
    // Este é um placeholder - você pode usar qualquer arquivo MP3
    this.ambientSound = new Howl({
      src: [
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Placeholder
      ],
      loop: true,
      volume: 0.3,
      autoplay: false,
      preload: true,
      onload: () => {
        console.log('🎵 Áudio ambiente carregado');
      },
      onloaderror: () => {
        console.warn('⚠️ Não foi possível carregar áudio ambiente');
      }
    });

    // Efeitos sonoros
    this.soundEffects.objectFound = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
      volume: 0.5,
    });

    this.soundEffects.exitFound = new Howl({
      src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
      volume: 0.8,
    });

    this.initialized = true;
  }

  play(soundName) {
    if (this.soundEffects[soundName]) {
      this.soundEffects[soundName].play();
    }
  }

  playAmbient() {
    if (this.ambientSound) {
      this.ambientSound.play();
    }
  }

  stopAmbient() {
    if (this.ambientSound) {
      this.ambientSound.stop();
    }
  }

  setVolume(volume) {
    if (this.ambientSound) {
      this.ambientSound.volume(Math.max(0, Math.min(1, volume)));
    }
  }

  // Gerar tom procedural (alternativa a arquivos MP3)
  generateTone(frequency = 200, duration = 100, type = 'sine') {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }

  // Criar ambiente sonoro assustador
  createHorrorAmbience() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Múltiplas oscilações em diferentes frequências
    const frequencies = [50, 100, 150];
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);

    frequencies.forEach((freq) => {
      const osc = audioContext.createOscillator();
      osc.frequency.value = freq;
      osc.type = 'triangle';
      osc.connect(gainNode);
      osc.start();

      // Modulação de frequência para efeito assustador
      const lfo = audioContext.createOscillator();
      lfo.frequency.value = Math.random() * 2; // 0-2 Hz
      const lfoGain = audioContext.createGain();
      lfoGain.gain.setValueAtTime(freq * 0.1, audioContext.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
    });
  }
}

export default AudioManager;
