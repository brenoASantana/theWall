# 🎮 Guia Rápido: Iniciando theWall

## ⚡ 3 Formas de Começar

### 1️⃣ **Para Jogar Localmente** (Seu PC)

```bash
make dev
```

Isso inicia:
- ✅ Backend (Go) na porta 8080
- ✅ Frontend (React) na porta 3000
- ✅ Abre automaticamente no navegador

### 2️⃣ **Para Jogar com Amigos (Mesma Rede)**

**Terminal 1 - Inicia Servidor:**
```bash
make server
```

**Terminal 2 - Amigos Conectam:**
```bash
# Descubra seu IP (Linux/macOS):
hostname -I

# Windows:
ipconfig
```

**Amigos acessam em:**
```
http://SEU_IP:3000
```

### 3️⃣ **Para Produção (Build Otimizado)**

```bash
make prod
```

Isso cria:
- ✅ Binário otimizado: `backend/thewall-server`
- ✅ Build React: `frontend/build/`

---

## 📋 Todos os Comandos

### 🚀 Iniciar

| Comando | O que faz |
|---------|-----------|
| `make dev` | Backend + Frontend para desenvolvimento |
| `make server` | Servidor multiplayer apenas |
| `make frontend-dev` | Frontend (React) só |
| `make backend-run` | Backend (Go) só |

### 🏗️ Compilar

| Comando | O que faz |
|---------|-----------|
| `make build` | Compila tudo para produção |
| `make backend-build` | Compila só backend |
| `make frontend-build` | Compila só frontend |

### 🌐 Rede

| Comando | O que faz |
|---------|-----------|
| `make server-setup` | Guia de configuração LAN |
| `make server-public` | Guia para internet/ngrok |
| `make check-ports` | Verifica portas em uso |

### 🧹 Limpeza

| Comando | O que faz |
|---------|-----------|
| `make clean` | Remove binários |
| `make clean-all` | Remove tudo + node_modules |

### ℹ️ Informação

| Comando | O que faz |
|---------|-----------|
| `make info` | Versões de Go, Node, npm |
| `make help` | Mostra todos os comandos |

---

## 🚨 Troubleshooting Rápido

**"Comando não encontrado"**
```bash
# Instale Go e Node.js primeiro:
# - Go: https://golang.org/dl/
# - Node.js: https://nodejs.org/
```

**"Porta 8080 já está em uso"**
```bash
# Descubra qual programa usa:
lsof -i :8080          # Linux/macOS
netstat -ano | findstr :8080  # Windows

# Ou inicie em porta diferente:
# Edite backend/main.go e mude :8080 para :8081
```

**"Cannot find npm/node"**
```bash
# Reinstale Node.js e reinicie o terminal
```

**"Frontend não conecta ao servidor"**
```bash
# Edite frontend/src/App.js
# Procure por: const WS_URL = ...
# Mude para seu IP local:
const WS_URL = 'ws://192.168.1.50:8080';
```

---

## 📁 Estrutura de Arquivos

```
theWall/
├── backend/              # Servidor Go
│   ├── main.go
│   ├── go.mod
│   └── thewall-server    (compilado)
├── frontend/             # React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── build/            (compilado)
├── Makefile              # ← Você está aqui
├── Makefile.help         # Versão com help
├── config.json           # Configurações
└── scripts/
    ├── setup-lan.sh      # Setup automático (Linux/macOS)
    └── setup-lan.bat     # Setup automático (Windows)
```

---

## 🎯 Fluxo Recomendado

### 1. Primeira Vez

```bash
make install        # Instala dependências
make dev            # Inicia desenvolvimento
```

### 2. Desenvolver

```bash
make dev            # Ambos rodando
# Ou em abas diferentes:
make backend-run    # Aba 1
make frontend-dev   # Aba 2
```

### 3. Testar com Amigos

```bash
make server-setup   # Leia configuração LAN
make server         # Inicie servidor
# Amigos acessam IP:3000
```

### 4. Deploy

```bash
make prod           # Build otimizado
make server         # Inicie servidor de produção
```

---

## 🔥 Dicas Avançadas

### Monitorar Mudanças Automáticas

```bash
# Backend com auto-reload:
make backend-watch

# Frontend já faz isso automaticamente
```

### Debug

```bash
# Ver logs detalhados:
make check-ports
make info

# Verificar conectividade:
ping SEU_IP
telnet SEU_IP 8080
```

### Performance

```bash
# Build otimizado backend:
cd backend && go build -o thewall-server -ldflags="-s -w" main.go

# Build frontend (já otimizado):
make frontend-build
```

---

## 💡 Exemplos Prático

### Cenário 1: Você + 2 Amigos

```bash
# Computador 1 (Servidor):
make server

# Computador 2 + 3:
# Editem frontend/src/App.js com IP do PC 1
# Depois: make frontend-dev
# Acessem: http://localhost:3000
```

### Cenário 2: Desenvolvimento

```bash
# Terminal 1:
make backend-run

# Terminal 2:
make frontend-dev

# Abra: http://localhost:3000
```

### Cenário 3: Produção

```bash
# Compilar:
make prod

# Rodar:
cd backend
./thewall-server

# Acessem: http://SEU_IP:3000
```

---

## 🆘 Precisa de Ajuda?

```bash
make help           # Todos os comandos
make server-setup   # Guia LAN
make server-public  # Guia Internet
```

---

**Aproveita o jogo! 🎮☠️**
