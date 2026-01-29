import { Howl } from 'howler';
import * as THREE from 'three';

/**
 * Sistema de Navegação por Som (baseado em Dark Echo)
 * Usa sons espaciais 3D para orientação do jogador
 */
export class SoundNavigation {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.soundSources = [];
    this.echoMap = new Map();
    this.soundMarkers = [];
    this.isEnabled = true;

    // Criar analisador para visualização de áudio
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
  }

  /**
   * Criar um marcador sonoro no espaço
   * Emite sons direcionais que guiam o jogador
   */
  createSoundMarker(position, soundType = 'hint', intensity = 0.7) {
    const marker = {
      id: Math.random().toString(36),
      position: position.clone(),
      soundType,
      intensity,
      active: true,
      sound: this.generateDirectionalSound(soundType, position),
    };

    this.soundMarkers.push(marker);
    return marker;
  }

  /**
   * Gerar som direcional baseado no tipo
   */
  generateDirectionalSound(type, position) {
    const sounds = {
      hint: () => this.createHintBeep(),
      danger: () => this.createDangerTone(),
      exit: () => this.createExitChime(),
      object: () => this.createObjectPing(),
      wall: () => this.createWallEcho(),
    };

    return sounds[type] ? sounds[type]() : this.createHintBeep();
  }

  /**
   * Som de dica - tom digital suave
   */
  createHintBeep() {
    return new Howl({
      src: [this.generateToneUrl(600, 0.1, 'sine')],
      loop: false,
      volume: 0.5,
      rate: 1,
    });
  }

  /**
   * Som de perigo - frequência mais grave
   */
  createDangerTone() {
    return new Howl({
      src: [this.generateToneUrl(200, 0.2, 'square')],
      loop: true,
      volume: 0.6,
      rate: 1,
    });
  }

  /**
   * Som da saída - melodia agradável
   */
  createExitChime() {
    const notes = [
      this.generateToneUrl(523, 0.1, 'sine'), // C5
      this.generateToneUrl(659, 0.1, 'sine'), // E5
      this.generateToneUrl(784, 0.1, 'sine'), // G5
    ];

    return new Howl({
      src: [notes],
      loop: false,
      volume: 0.8,
    });
  }

  /**
   * Som de objeto - ping único
   */
  createObjectPing() {
    return new Howl({
      src: [this.generateToneUrl(800, 0.08, 'sine')],
      loop: false,
      volume: 0.6,
    });
  }

  /**
   * Som de eco na parede
   */
  createWallEcho() {
    return new Howl({
      src: [this.generateToneUrl(400, 0.15, 'sine')],
      loop: false,
      volume: 0.4,
      fade: [0.4, 0, 150],
    });
  }

  /**
   * Gerar URL de tom procedural usando Web Audio API
   */
  generateToneUrl(frequency, duration, waveform = 'sine') {
    const ctx = this.audioContext;
    const sampleRate = ctx.sampleRate;
    const frames = sampleRate * duration;
    const audioBuffer = ctx.createBuffer(1, frames, sampleRate);
    const data = audioBuffer.getChannelData(0);

    for (let i = 0; i < frames; i++) {
      const t = i / sampleRate;
      let value = 0;

      switch (waveform) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          value = Math.sign(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'triangle':
          const phase = (2 * Math.PI * frequency * t) % (2 * Math.PI);
          value = (phase < Math.PI ? phase / Math.PI : 2 - phase / Math.PI) * 2 - 1;
          break;
        default:
          value = Math.sin(2 * Math.PI * frequency * t);
      }

      // Envelope ADSR simples
      const envelope = this.getADSREnvelope(t, duration);
      data[i] = value * envelope * 0.3;
    }

    // Converter para WAV e criar blob
    const wav = this.audioBufferToWav(audioBuffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  /**
   * Envelope ADSR (Attack, Decay, Sustain, Release)
   */
  getADSREnvelope(time, duration) {
    const attack = duration * 0.1;
    const decay = duration * 0.2;
    const sustain = duration * 0.5;
    const release = duration * 0.2;

    if (time < attack) return time / attack;
    if (time < attack + decay) return 1 - (time - attack) / decay * 0.3;
    if (time < attack + decay + sustain) return 0.7;
    return Math.max(0, 1 - (time - attack - decay - sustain) / release);
  }

  /**
   * Converter AudioBuffer para WAV
   */
  audioBufferToWav(audioBuffer) {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const channels = 1;
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = channels * bytesPerSample;

    const preHeader = new ArrayBuffer(44);
    const view = new DataView(preHeader);

    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + channelData.length * bytesPerSample, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, channelData.length * bytesPerSample, true);

    const bodyBuffer = new ArrayBuffer(channelData.length * bytesPerSample);
    const bodyView = new DataView(bodyBuffer);

    let offset = 0;
    for (let i = 0; i < channelData.length; i++) {
      const s = Math.max(-1, Math.min(1, channelData[i]));
      bodyView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }

    return new Uint8Array([...new Uint8Array(preHeader), ...new Uint8Array(bodyBuffer)]);
  }

  /**
   * Atualizar som direcional com base na posição relativa
   */
  updateDirectionalAudio(markerPosition, playerCamera) {
    const relativePosition = markerPosition.clone().sub(playerCamera.position);
    const distance = relativePosition.length();

    // Calcular ângulo horizontal (pan)
    const angle = Math.atan2(relativePosition.x, relativePosition.z);
    const cameraYaw = playerCamera.rotation.y;
    const angle_rel = angle - cameraYaw;

    // Pan estéreo (-1 = esquerda, 1 = direita)
    const stereo = Math.sin(angle_rel);

    // Atenuação por distância
    const maxDistance = 100;
    const volume = Math.max(0, 1 - distance / maxDistance);

    return { stereo, volume, distance, angle_rel };
  }

  /**
   * Ecolocação - enviar som e ouvir reflexos
   * Similar a Dark Echo
   */
  echoLocate(playerPosition, playerCamera) {
    const echoDistance = 50;
    const rayCount = 16;
    const echos = [];

    // Enviar raios de som em todas as direções
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const direction = new THREE.Vector3(
        Math.sin(angle),
        0,
        Math.cos(angle)
      );

      // Encontrar primeiro objeto/parede
      const raycaster = new THREE.Raycaster(playerPosition, direction);
      const intersects = raycaster.intersectObjects(this.scene.children, true);

      if (intersects.length > 0) {
        const closestHit = intersects[0];
        const distance = closestHit.distance;

        // Calcular tempo de eco (distância / velocidade do som)
        const echoTime = distance / 343; // 343 m/s = velocidade do som

        echos.push({
          distance,
          angle,
          echoTime,
          intensity: 1 - distance / echoDistance,
        });

        // Armazenar eco para reprodução
        this.echoMap.set(`echo_${angle}`, {
          distance,
          angle,
          timestamp: Date.now(),
        });
      }
    }

    return echos;
  }

  /**
   * Reproduzir ecos detectados
   */
  playEchos(echos, intensity = 0.3) {
    echos.forEach((echo) => {
      if (echo.intensity > 0.1) {
        // Criar e reproduzir tom de eco
        const sound = new Howl({
          src: [this.generateToneUrl(300 + echo.distance * 2, 0.1, 'sine')],
          volume: echo.intensity * intensity,
          rate: 1 + echo.distance / 100,
        });

        // Delay para simular reflexo
        setTimeout(() => {
          sound.play();
        }, echo.echoTime * 1000);
      }
    });
  }

  /**
   * Sistema de pistas sonoras - guiar o jogador
   */
  playGuidanceTone(playerPos, targetPos, intensity = 0.5) {
    const direction = targetPos.clone().sub(playerPos);
    const distance = direction.length();
    direction.normalize();

    // Frequência varia com proximidade (Doppler-like)
    const baseFreq = 400;
    const frequency = baseFreq + (50 / (distance + 1));

    const tone = new Howl({
      src: [this.generateToneUrl(frequency, 0.3, 'sine')],
      volume: Math.min(1, intensity * (1 - distance / 100)),
      loop: false,
    });

    tone.play();
    return tone;
  }

  /**
   * Feedback sonoro de movimento
   */
  playMovementFeedback(velocity, direction) {
    if (velocity < 0.01) return;

    // Tom que varia com velocidade
    const frequency = 200 + velocity * 100;
    const sound = new Howl({
      src: [this.generateToneUrl(frequency, 0.1, 'sine')],
      volume: velocity * 0.3,
    });

    sound.play();
  }

  /**
   * Atualizar marcadores de som a cada frame
   */
  updateSoundMarkers(playerCamera) {
    this.soundMarkers.forEach((marker) => {
      if (!marker.active) return;

      const { stereo, volume, distance } = this.updateDirectionalAudio(
        marker.position,
        playerCamera
      );

      // Ajustar pan e volume do som
      if (marker.sound && marker.sound.playing()) {
        marker.sound.stereo(stereo);
        marker.sound.volume(volume * marker.intensity);
      }

      // Parar som se muito distante
      if (distance > 150) {
        if (marker.sound && marker.sound.playing()) {
          marker.sound.stop();
        }
        marker.active = false;
      }
    });
  }

  /**
   * Reproduzir sons do cenário periodicamente
   */
  playEnvironmentalSounds(playerPos) {
    const ambientSounds = [
      { frequency: 150, duration: 0.3, volume: 0.2, type: 'triangle' },
      { frequency: 200, duration: 0.2, volume: 0.15, type: 'sine' },
      { frequency: 120, duration: 0.4, volume: 0.25, type: 'sine' },
    ];

    // Selecionar som aleatório
    const sound = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];
    const tone = new Howl({
      src: [this.generateToneUrl(sound.frequency, sound.duration, sound.type)],
      volume: sound.volume,
    });

    tone.play();
  }

  /**
   * Limpar recursos
   */
  dispose() {
    this.soundMarkers.forEach((marker) => {
      if (marker.sound) {
        marker.sound.stop();
        marker.sound.unload();
      }
    });
    this.soundMarkers = [];
    this.echoMap.clear();
  }
}

export default SoundNavigation;
