# Dark Echo Mode - Gameplay Baseado em Som

## 🔊 Visão Geral

O modo **Dark Echo** transforma **theWall** em um jogo centrado em áudio, inspirado no jogo de horror **Dark Echo**. O jogador se orienta principalmente através de:

- **Ecolocação espacial** - Emissão e recepção de sons
- **Pistas sonoras** - Objetos e pontos de interesse emitem sons
- **Navegação por tom** - Frequências diferentes indicam proximidade
- **Feedback de movimento** - Sons que variam com a velocidade

## 🎮 Como Jogar em Dark Echo Mode

### Ativar o Modo

Pressione **D** durante o jogo para ativar/desativar Dark Echo Mode.

Quando ativo:
- O HUD tradicional é substituído por um painel sonoro
- Sons ambientes guiam a navegação
- Ecolocação ajuda a detectar obstáculos

### Controles Específicos

| Tecla | Ação |
|-------|------|
| **R** | Ecolocação (detectar ambientes próximos) |
| **E** | Som guia para a saída |
| **T** | Reproduzir sons ambientes |
| **B** | Modo Blind (desabilitar visual completamente) |
| **D** | Toggle Dark Echo Mode |

## 🔊 Sistema de Som

### Ecolocação

Quando você pressiona **R**, o jogo:
1. Emite um som em seu ponto de vista
2. Calcula reflexos em paredes/objetos
3. Reproduz tons de eco com delay apropriado
4. Frequência varia com distância (som mais agudo = mais próximo)

**Equação de distância:**
```
frequência = 300 + (distância × 2)
delay = distância / 343 (velocidade do som)
```

### Tipos de Som

#### 1. **Pistas (Dicas - Azul)**
- Frequência: 600 Hz
- Tipo: Sine wave
- Padrão: Beep único a cada 2 segundos
- Volume: Varia com distância

#### 2. **Objetos (Coletáveis - Amarelo)**
- Frequência: 800 Hz
- Tipo: Sine wave agudo
- Padrão: Ping rápido
- Volume: Sinal quando próximo

#### 3. **Saída (Verde)**
- Frequência: Melodia (523, 659, 784 Hz - C5, E5, G5)
- Tipo: Chime harmônico
- Padrão: Melodia a cada 3 segundos
- Volume: Aumenta quando muito próximo

#### 4. **Perigo (Parede - Vermelho)**
- Frequência: 200 Hz
- Tipo: Square wave
- Padrão: Tom contínuo baixo
- Volume: Intenso quando muito próximo

#### 5. **Movimento (Pisada)**
- Frequência: 200 + (velocidade × 100) Hz
- Tipo: Sine wave curto
- Padrão: Sons de passos
- Volume: Proporcional à velocidade

### Pan Estéreo (Som Espacial)

O som é distribuído entre esquerda/direita baseado na posição relativa do objeto:

```javascript
const relativePosition = markerPosition - playerCamera.position;
const angle = atan2(relativePosition.x, relativePosition.z);
const cameraYaw = playerCamera.rotation.y;
const angle_rel = angle - cameraYaw;

const stereo = sin(angle_rel); // -1 = esquerda, 1 = direita
```

**Interpretação:**
- Som à **esquerda** (-1.0 a -0.5)
- Som ao **centro** (-0.5 a 0.5)
- Som à **direita** (0.5 a 1.0)

### Atenuação por Distância

O volume diminui conforme a distância aumenta:

```javascript
const maxDistance = 100;
const volume = Math.max(0, 1 - distance / maxDistance);
```

## 📊 Visualizações de Áudio

### Sound Compass (Bússola Sonora)

Mostra a direção dos sons próximos em um diagrama circular:
- Seta amarela: Direção do som mais forte
- Eixos verdes: Referência cardinal (frente/trás/esquerda/direita)
- Círculo: Zona de detecção

### Frequency Analyzer (Analisador de Frequências)

Visualiza as frequências sendo detectadas em tempo real:
- 8 barras de frequência
- Altura = intensidade
- Cor: Verde gradiente baseado na magnitude

### Proximity Indicator (Indicador de Proximidade)

Lista objetos próximos com:
- Tipo do objeto
- Distância em metros
- Barra de sinal de força

## 🎯 Estratégias de Gameplay

### Exploração Básica

1. **Orientação inicial:**
   - Use **R** para ecolocação
   - Escute tons da parede branca ao longe
   - Procure pistas sonoras (beeps azuis)

2. **Navegação:**
   - Escute sons para localizar pistas
   - Use Pan estéreo para determinar direção
   - Aumente frequência = você está se aproximando

3. **Coleta de objetos:**
   - Siga sons de ping (800 Hz)
   - Use ecolocação para confirmar proximidade
   - Colecione para "desbloquear" a saída

4. **Encontrar a saída:**
   - Pressione **E** para som guia
   - Melodia da saída fica mais forte conforme se aproxima
   - Use ecolocação para confirmar localização
   - Apenas acesse quando todos os objetos coletados

### Modo Hardcore (Blind Mode)

Pressione **B** para desabilitar completamente visual:
- Tela fica preta
- Apenas sons para orientação
- Desafio máximo de imersão
- Apenas para jogadores experientes

## 🔧 Implementação Técnica

### Estrutura de Classe

```javascript
class SoundNavigation {
  // Gerencia todos os sons espaciais
  createSoundMarker(position, soundType, intensity)
  updateDirectionalAudio(markerPosition, playerCamera)
  echoLocate(playerPosition, playerCamera)
  playEchos(echos, intensity)
  generateDirectionalSound(type, position)
}

class DarkEchoMode {
  // Gerencia gameplay Dark Echo
  enable()
  disable()
  triggerEcho()
  activateGuidanceSound(targetPosition)
  createHintMarker(position, text)
  createObjectMarker(position, type)
  createExitMarker(position)
}
```

### Ciclo de Atualização

A cada frame:
```javascript
// Atualizar sons baseado em posição
soundNav.updateSoundMarkers(playerCamera);

// Se ecolocação ativa, reproduzir ecos
if (echoActive) {
  const echos = soundNav.echoLocate(playerPos, camera);
  soundNav.playEchos(echos, intensity);
}

// Atualizar HUD de áudio
updateAudioStats(echos);
```

## 🎵 Fórmulas Matemáticas

### Cálculo de Frequência (Doppler-like)

```
baseFreq = 400 Hz
distance = distância até objeto (metros)
frequency = baseFreq + (50 / (distance + 1))

Resultado:
- 0m:   450 Hz (mais agudo)
- 10m:  405 Hz
- 50m:  401 Hz (mais grave)
```

### Cálculo de Volume

```
maxDistance = 100 metros
distance = distância até objeto
volume = max(0, 1 - (distance / maxDistance))

Resultado:
- 0m:   100% volume
- 50m:  50% volume
- 100m: 0% volume
```

### Cálculo de Pan Estéreo

```
relativePos = objectPos - cameraPos
angle = atan2(relativePos.x, relativePos.z)
cameraYaw = camera.rotation.y
relativeAngle = angle - cameraYaw

pan = sin(relativeAngle)  // -1 a 1

Interpretação:
- sin(θ) ≈ -1:  100% esquerda
- sin(θ) ≈  0:  centrado
- sin(θ) ≈  1:  100% direita
```

### Atraso de Eco (Delay)

```
velocidadeSom = 343 m/s (ar, 20°C)
distância = distância do echo (metros)
atraso = distância / velocidadeSom

Exemplo:
- Parede a 34m: delay = 0.1s
- Parede a 68m: delay = 0.2s
```

## 🎓 Dicas para Desenvolvedores

### Estender Sons

Para adicionar novo tipo de som em `SoundNavigation.js`:

```javascript
createCustomSound() {
  return new Howl({
    src: [this.generateToneUrl(frequência, duração, tipo)],
    volume: 0.7,
    rate: 1,
  });
}
```

### Criar Novo Marcador

Em `DarkEchoMode.js`:

```javascript
createCustomMarker(position) {
  return this.soundNav.createSoundMarker(
    position,
    'custom',
    0.8  // intensidade
  );
}
```

### Processar Novo Input

Em `GameScene.js`, adicione:

```javascript
if (keysPressed.current['x']) {
  darkEchoRef.current?.triggerCustomAction();
}
```

## 📈 Progressão do Jogo

### Fase 1: Orientação
- Apenas sente a parede branca
- Aprenda ecolocação básica
- Distância: 100 metros

### Fase 2: Exploração
- Encontre pistas sonoras
- Siga indicadores de som
- Distância: 50 metros

### Fase 3: Coleta
- Localize 3 objetos coletáveis
- Use pan estéreo para precisão
- Distância: 20 metros

### Fase 4: Acesso à Saída
- Melodia da saída se torna audível
- Todos os objetos devem ser coletados
- Use ecolocação para confirmação final
- Distância: 5 metros

## 🏆 Conquistas (Ideias)

- **Echo Master**: Encontrar saída usando apenas ecolocação
- **Blind Journey**: Completar em modo Blind
- **Speed Run**: Completar em menos de 5 minutos
- **Perfect Echo**: Detectar todos os obstáculos

## 📝 Notas

- Sons procedurais são gerados em tempo real (sem arquivos)
- Pan estéreo funciona com qualquer headphone/speaker
- Ecolocação foi inspirada em bats (morcegos)
- Sistema pronto para VR com áudio espacial (ambisonics)

---

**Ouça a escuridão, encontre o caminho! 🔊👻**
