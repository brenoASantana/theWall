/**
 * Dark Echo Mode Manager
 * Gerencia gameplay centrado em áudio
 */
export class DarkEchoMode {
  constructor(scene, camera, soundNav, audioContext) {
    this.scene = scene;
    this.camera = camera;
    this.soundNav = soundNav;
    this.audioContext = audioContext;
    this.enabled = false;
    this.echoActive = false;
    this.echoInterval = null;
    this.soundStats = {
      frequencies: Array(8).fill(0),
      direction: 0,
      intensity: 0,
    };
  }

  /**
   * Ativar modo Dark Echo
   */
  enable() {
    this.enabled = true;
    this.startEchoLoop();
    console.log('🔊 Dark Echo Mode ativado');
  }

  /**
   * Desativar modo Dark Echo
   */
  disable() {
    this.enabled = false;
    this.stopEchoLoop();
    console.log('🔊 Dark Echo Mode desativado');
  }

  /**
   * Loop de ecolocação contínua
   */
  startEchoLoop() {
    this.echoInterval = setInterval(() => {
      if (this.echoActive) {
        const playerPos = this.camera.position.clone();
        const echos = this.soundNav.echoLocate(playerPos, this.camera);
        this.soundNav.playEchos(echos, 0.4);
        this.updateSoundStats(echos);
      }
    }, 500); // A cada 500ms
  }

  /**
   * Parar loop de ecolocação
   */
  stopEchoLoop() {
    if (this.echoInterval) {
      clearInterval(this.echoInterval);
      this.echoInterval = null;
    }
  }

  /**
   * Atualizar estatísticas de som
   */
  updateSoundStats(echos) {
    // Atualizar frequências baseado em distâncias
    this.soundStats.frequencies = this.soundStats.frequencies.map((_, idx) => {
      const frequency = Math.random() * 0.3 + 0.2;
      return frequency;
    });

    // Calcular direção média dos ecos
    if (echos.length > 0) {
      const avgAngle = echos.reduce((sum, e) => sum + e.angle, 0) / echos.length;
      this.soundStats.direction = (avgAngle * 180) / Math.PI;
    }

    // Intensidade baseada em quantidade de ecos
    this.soundStats.intensity = Math.min(1, echos.length / 8);
  }

  /**
   * Ativar ecolocação por comando do usuário (R)
   */
  triggerEcho() {
    if (!this.enabled) return;

    const playerPos = this.camera.position.clone();
    const echos = this.soundNav.echoLocate(playerPos, this.camera);

    // Echo único mais forte
    this.soundNav.playEchos(echos, 0.8);
    this.updateSoundStats(echos);

    // Feedback visual/sonoro
    console.log(`📍 Ecos detectados: ${echos.length}`);
  }

  /**
   * Ativar som guia para a saída (E)
   */
  activateGuidanceSound(targetPosition) {
    if (!this.enabled) return;

    const playerPos = this.camera.position.clone();
    this.soundNav.playGuidanceTone(playerPos, targetPosition, 0.7);
  }

  /**
   * Reproduzir sons ambientes (T)
   */
  playAmbientSounds() {
    if (!this.enabled) return;

    const playerPos = this.camera.position.clone();

    // Reproduzir múltiplos sons ambiente
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.soundNav.playEnvironmentalSounds(playerPos);
      }, i * 200);
    }
  }

  /**
   * Feedback de movimento
   */
  onPlayerMove(velocity, direction) {
    if (!this.enabled) return;

    // Som de pisada/movimento
    if (velocity > 0.05) {
      this.soundNav.playMovementFeedback(velocity, direction);
    }
  }

  /**
   * Criar marcadores sonoros para pistas
   */
  createHintMarker(position, hintText) {
    const marker = this.soundNav.createSoundMarker(position, 'hint', 0.6);
    marker.hintText = hintText;

    // Reproduzir som da pista a cada 2 segundos
    const interval = setInterval(() => {
      if (marker.sound && marker.active) {
        marker.sound.play();
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return marker;
  }

  /**
   * Criar marcador para objeto coletável
   */
  createObjectMarker(position, objectType) {
    return this.soundNav.createSoundMarker(position, 'object', 0.7);
  }

  /**
   * Criar marcador para a saída
   */
  createExitMarker(position) {
    return this.soundNav.createSoundMarker(position, 'exit', 0.9);
  }

  /**
   * Criar marcador de perigo (parede próxima)
   */
  createDangerMarker(position) {
    const marker = this.soundNav.createSoundMarker(position, 'danger', 0.5);

    // Aumentar intensidade quando próximo
    if (marker.sound) {
      marker.sound.play();
    }

    return marker;
  }

  /**
   * Limpar todos os marcadores
   */
  clearMarkers() {
    this.soundNav.dispose();
  }

  /**
   * Toggle do modo Dark Echo extremo (apenas som, sem visual)
   */
  toggleBlindMode() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
    }
  }

  /**
   * Obter estatísticas atuais
   */
  getStats() {
    return this.soundStats;
  }

  /**
   * Processar entrada do usuário
   */
  handleInput(key) {
    switch (key) {
      case 'r':
        this.echoActive = !this.echoActive;
        console.log(`🔊 Ecolocação ${this.echoActive ? 'ATIVADA' : 'DESATIVADA'}`);
        break;
      case 'e':
        this.activateGuidanceSound(new THREE.Vector3(50, 1, 50)); // Posição da saída
        break;
      case 't':
        this.playAmbientSounds();
        break;
      case 'b':
        this.toggleBlindMode();
        break;
      default:
        break;
    }
  }

  /**
   * Atualizar a cada frame
   */
  update(playerCamera, velocity) {
    if (!this.enabled) return;

    // Atualizar marcadores sonoros
    this.soundNav.updateSoundMarkers(playerCamera);

    // Feedback de movimento
    this.onPlayerMove(velocity, 0);

    // Ecolocação contínua (se ativa)
    if (this.echoActive) {
      // Gerenciado pelo interval
    }
  }
}

export default DarkEchoMode;
