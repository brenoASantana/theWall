# theWall - Horror Exploration Game

Um jogo de terror em primeira pessoa desenvolvido com **Golang** (backend) e **React + Three.js** (frontend), onde você deve explorar uma escuridão misteriosa para encontrar a saída.

## 🎮 Visão Geral

**theWall** é uma experiência imersiva de terror em que você se vê preso em um vasto espaço escuro com apenas uma grande muralha branca no horizonte. Sua missão é explorar e descobrir como sair deste lugar assustador.

### Características

- ✨ Cenário 3D escuro e atmosférico com renderização em tempo real
- 🎵 Trilha sonora do **Aphex Twin** para imersão total
- 👻 Exploração em primeira pessoa com controles fluidos
- 🔍 Pistas e artefatos espalhados pelo cenário
- 🎯 Objetivo dinâmico: encontre a saída
- 🌐 Suporte multiplayer via WebSocket
- 📊 HUD com informações vitais e indicador de distância
- 🔊 **Dark Echo Mode** - Navegação por ecolocação sonora

## 🚀 Como Executar

### Opção 1: Scripts Automatizados (Recomendado)

**Linux/macOS:**
```bash
./scripts/dev-start.sh
```

**Windows:**
```bash
./scripts/run.bat
```

### Opção 2: Manual

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Terminal 2 - Backend:**
```bash
cd backend
go mod download
go run main.go
```

Acesse: **http://localhost:3000** (dev) ou **http://localhost:8080** (prod)

## 🎮 Controles

| Ação           | Tecla   |
| -------------- | ------- |
| Mover          | W/A/S/D |
| Olhar          | Mouse   |
| Ecolocação     | R       |
| Dark Echo Mode | D       |
| Modo Blind     | B       |
| Sair           | ESC     |

## 📚 Documentação Adicional

- 📖 **[Guias e Tutoriais](docs/guides/)** - Guias detalhados sobre áudio, Dark Echo Mode, desenvolvimento e mais
- 📦 **[Documentação Legada](docs/legacy/)** - Documentação antiga e histórico do projeto

## 🏗️ Estrutura do Projeto

```
theWall/
├── backend/          # Servidor Go + WebSocket
├── frontend/         # App React + Three.js
├── scripts/          # Scripts de inicialização
├── docs/
│   ├── guides/       # Guias de desenvolvimento
│   └── legacy/       # Documentação histórica
├── config.json       # Configuração do jogo
├── Makefile          # Comandos make
└── README.md         # Este arquivo
```

## 🛠️ Tecnologias

**Backend:**
- Go 1.21+
- gorilla/websocket

**Frontend:**
- React 18
- Three.js
- Howler.js
- WebSocket API

## 🔧 Usando o Makefile

```bash
make help          # Ver todos os comandos disponíveis
make dev           # Iniciar modo desenvolvimento
make build         # Build do projeto
make clean         # Limpar builds
```

## 📝 Licença

Projeto educacional.

---

**Desenvolvido com 💀 e 🎵**

*Mergulhe na escuridão... se ousar.*
