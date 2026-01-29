# Guia de Áudio - theWall

## 🎵 Integração da Trilha Sonora Aphex Twin

### Opções de Implementação

#### 1. **Usar Arquivo MP3 Local** (Recomendado)

Coloque o arquivo em `frontend/public/`:
```
frontend/public/
├── index.html
├── ambient-horror.mp3     ← Sua trilha aqui
└── ...
```

Em `frontend/src/App.js`:
```javascript
const ambientSound = new Howl({
  src: ['ambient-horror.mp3'],
  loop: true,
  volume: 0.3,
  autoplay: true,
});
```

#### 2. **Usar URL Remota**

```javascript
const ambientSound = new Howl({
  src: ['https://seu-servidor.com/trilha.mp3'],
  loop: true,
  volume: 0.3,
});
```

#### 3. **Áudio Procedural (Web Audio API)**

```javascript
// Gerar som assustador proceduralmente
function createHorrorAmbience() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Osciladores em diferentes frequências
  const baseFreq = 55; // Nota low para horror

  for (let i = 0; i < 3; i++) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.value = baseFreq * (i + 1);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.05, audioContext.currentTime);

    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
  }
}
```

## 🎧 Recomendações de Faixas Aphex Twin

### Para Ambientação de Terror

| Faixa | Características | Uso |
|-------|-----------------|-----|
| **Windowlicker** | Dark, atmospheric | Abertura/Menu |
| **Avril 14th** | Melancólico, delicado | Exploração calma |
| **Vordhosbn** | Distorcido, assustador | Ação/Tensão |
| **Come to Daddy** | Aggressive, dissonante | Clímax/Saída |
| **Merzbow** | Ruído experimental | Efeitos especiais |

### Alternativas
- Oneohtrix Point Never
- Jlin - Autechre
- Ben Frost
- Tim Hecker

## 🔊 Configuração de Áudio Avançada

### Sistema Multi-Track

```javascript
class AudioSystem {
  constructor() {
    this.tracks = {
      ambient: null,
      effects: {},
      music: null,
    };
  }

  loadTrack(name, src, loop = true) {
    this.tracks[name] = new Howl({
      src: [src],
      loop,
      volume: 0.3,
    });
  }

  play(name) {
    if (this.tracks[name]) {
      this.tracks[name].play();
    }
  }

  crossfade(from, to, duration = 1000) {
    const startVol = this.tracks[from].volume();
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);

      this.tracks[from].volume(startVol * (1 - progress));
      this.tracks[to].volume(0.3 * progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}
```

### Efeitos Sonoros Dinâmicos

```javascript
// Som baseado em distância
function updateAudioBasedOnDistance(distance) {
  const maxDistance = 100;
  const volume = Math.max(0, 1 - distance / maxDistance);
  ambientSound.volume(volume * 0.3);
}

// Som baseado em posição (espacial)
function createSpatialAudio(position, camera) {
  const angle = Math.atan2(
    position.z - camera.position.z,
    position.x - camera.position.x
  );

  const relativeAngle = angle - camera.rotation.y;

  // Usar para pan estéreo
  const stereo = Math.sin(relativeAngle);
  sound.stereo(stereo);
}
```

### Análise de Áudio (Visualização)

```javascript
// Analyzer para visualização
const analyzer = audioContext.createAnalyser();
ambientSound.on('play', function() {
  // Connect audio source to analyzer
});

analyzer.fftSize = 256;
const dataArray = new Uint8Array(analyzer.frequencyBinCount);

function animateVisualization() {
  analyzer.getByteFrequencyData(dataArray);

  // Usar dados para visualização no Three.js
  // Exemplo: modificar tamanho de objetos baseado em frequências

  requestAnimationFrame(animateVisualization);
}
```

## 🎙️ Exemplo Completo: AudioManager

```javascript
import { Howl } from 'howler';

class AudioManager {
  constructor() {
    this.sounds = {};
    this.masterVolume = 0.5;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  load(name, src, options = {}) {
    const defaultOptions = {
      volume: 0.3,
      loop: false,
      autoplay: false,
      ...options,
    };

    this.sounds[name] = new Howl({
      src: [src],
      ...defaultOptions,
    });
  }

  play(name) {
    if (this.sounds[name]) {
      this.sounds[name].play();
    }
  }

  stop(name) {
    if (this.sounds[name]) {
      this.sounds[name].stop();
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      sound.volume(this.masterVolume);
    });
  }

  fadeTo(name, targetVolume, duration = 1000) {
    if (!this.sounds[name]) return;

    const sound = this.sounds[name];
    const startVol = sound.volume();
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const newVol = startVol + (targetVolume - startVol) * progress;

      sound.volume(newVol);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  createGenerative() {
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc1.frequency.value = 55;
    osc2.frequency.value = 110;

    gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioContext.destination);

    osc1.start();
    osc2.start();

    // Modular frequências
    setInterval(() => {
      osc1.frequency.value = 50 + Math.random() * 20;
      osc2.frequency.value = 100 + Math.random() * 30;
    }, 500);
  }
}

export default AudioManager;
```

## 🔧 Troubleshooting

### Áudio não toca
1. Verifique se arquivo existe em `frontend/public/`
2. Abra DevTools (F12) → Console
3. Procure por erros de CORS
4. Tente clicar no jogo para ativar áudio

### Problemas de Performance
- Reduza número de fontes de áudio simultâneas
- Use `.dispose()` para liberar recursos
- Comprima arquivos MP3 (bitrate 128kbps)

### Não ouve diferença de volume
- Verificar mixagem do sistema operacional
- Testar em navegador diferente
- Verificar config de volume do Howler

## 📊 Análise de Frequências

```javascript
// Sincronizar visuais com áudio
function syncVisualsWithAudio() {
  const analyser = audioContext.createAnalyser();
  analyser.connect(audioContext.destination);

  const freqData = new Uint8Array(analyser.frequencyBinCount);

  function update() {
    analyser.getByteFrequencyData(freqData);

    // Valores 0-255 para cada frequência
    const lowFreq = freqData[0];
    const midFreq = freqData[Math.floor(freqData.length / 2)];
    const highFreq = freqData[freqData.length - 1];

    // Usar para animar objeto 3D
    terrifyingCube.scale.x = 1 + lowFreq / 255;
    terrifyingCube.rotation.y += midFreq / 255 * 0.01;

    requestAnimationFrame(update);
  }

  update();
}
```

---

**Mergulhe na escuridão sonora... 🎵👻**
