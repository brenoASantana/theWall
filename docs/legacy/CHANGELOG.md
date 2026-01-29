# Changelog - theWall

## [1.1.0] - Dark Echo Mode Release

### 🎉 Novo

#### Dark Echo Mode - Sistema Completo de Navegação por Som
- **Ecolocação Espacial**: Emita sons e detecte reflexos em tempo real
  - Raycasting de som em 16 direções
  - Cálculo de distância e delay apropriado
  - Mapeamento visual em bússola sonora

- **Sons Procedurais Dinâmicos**: Geração em tempo real (sem dependência de arquivos)
  - Pistas (600 Hz - sine wave)
  - Objetos (800 Hz - ping agudo)
  - Saída (melodia harmônica 523-659-784 Hz)
  - Perigos (200 Hz - square wave grave)
  - Movimento (frequência variável com velocidade)
  - Ambiente (tons aleatórios para atmosfera)

- **Pan Estéreo 3D**: Localização de objetos por distribuição L/R
  - Cálculo matemático preciso de ângulo relativo
  - Suporte para headphones stereo
  - Feedback imediato de direção

- **Modo Blind**: Desabilitar visual completamente
  - Apenas som para navegação
  - Máximo nível de imersão
  - Desafio supremo

- **Audio HUD**: Interface específica para Dark Echo
  - Bússola sonora interativa
  - Analisador de frequências em tempo real
  - Indicador de proximidade
  - Controles de som
  - Inventário visual de objetos

- **Novo Componente: SoundNavigation.js**
  - Classe com métodos para todos os tipos de som
  - Geração de WAV procedural
  - Envelope ADSR
  - Ecolocação completa

- **Novo Componente: DarkEchoMode.js**
  - Gerenciador de gameplay baseado em som
  - Controle de ecolocação contínua
  - Criação de marcadores sonoros
  - Sistema de guia para saída

### 🎮 Novo Gameplay

- Tecla **D**: Ativar/desativar Dark Echo Mode
- Tecla **R**: Ecolocação (detectar ambiente)
- Tecla **E**: Som guia para saída
- Tecla **T**: Reproduzir sons ambiente
- Tecla **B**: Modo Blind (sem visual)

### 📚 Novo

- **DARK_ECHO_GUIDE.md**: Guia completo do sistema
  - Explicação detalhada do gameplay
  - Estratégias de navegação
  - Fórmulas matemáticas
  - Instruções para desenvolvedores
  - Ideias de conquistas

### 🔧 Melhorias

- Integração de SoundNavigation em GameScene
- AudioHUD como alternativa a GameHUD
- Suporte para múltiplos marcadores sonoros
- Sistema de estatísticas de áudio
- Controle de volume por distância

- README.md atualizado com Dark Echo
  - Novo seção "🔊 Dark Echo Mode"
  - Controles expandidos
  - Link para guia completo

### 📁 Estrutura

```
frontend/src/
├── utils/
│   ├── SoundNavigation.js      (NOVO)
│   └── DarkEchoMode.js         (NOVO)
├── components/
│   ├── AudioHUD.js             (NOVO)
│   └── AudioHUD.css            (NOVO)
└── ...

docs/
└── DARK_ECHO_GUIDE.md          (NOVO)
```

### 🎵 Áudio

- Sons procedurais não requerem arquivos externos
- Suporte para Web Audio API
- Geração WAV em tempo real
- Envelope ADSR implementado
- Pan estéreo com cálculo matemático preciso

### 🔊 Especificações Técnicas

**Frequências:**
- Pistas: 600 Hz
- Objetos: 800 Hz
- Saída: 523, 659, 784 Hz (C5, E5, G5)
- Perigos: 200 Hz
- Movimento: 200 + (velocidade × 100) Hz

**Delay (Eco):**
- Velocidade do som: 343 m/s
- Formula: delay = distância / 343

**Volume:**
- Atenuação por distância
- Máximo: 100 metros
- Pan estéreo: -1.0 a 1.0

### 🐛 Correções

- N/A (Release inicial de Dark Echo)

### ⚠️ Notas de Compatibilidade

- Requer navegador com Web Audio API
- Testado em Chrome, Firefox, Edge
- Melhor com headphones para pan estéreo
- Funciona em desktop e mobile (sem intenção de otimizar mobile ainda)

### 🎓 Para Desenvolvedores

Ver [DARK_ECHO_GUIDE.md](DARK_ECHO_GUIDE.md) seção "🔧 Implementação Técnica"

Exemplos de extensão:
- Adicionar novos tipos de som
- Criar marcadores customizados
- Implementar novos controles
- Modificar fórmulas de distância/volume

### 📊 Performance

- Sons procedurais: ~2ms por geração
- Ecolocação: ~5ms (raycasting de 16 raios)
- Pan estéreo: ~1ms
- HUD atualização: 60fps

### 🎯 Roadmap

Versão 1.2.0:
- [ ] Suporte para ambisonics (VR)
- [ ] Efeitos de reverb
- [ ] Sistema de multiplayer com ecos compartilhados
- [ ] Replay system (gravar/reproduzir movimentos)
- [ ] Tutorial interativo de ecolocação

### 📝 Créditos

Inspirado por:
- Jogo **Dark Echo** (2015) - Consultar Media
- Pesquisas sobre ecolocação de morcegos
- Web Audio API documentation
- Three.js raycast system

---

**Versão:** 1.1.0
**Data:** Janeiro 28, 2026
**Status:** Release
**Próxima versão:** 1.2.0
