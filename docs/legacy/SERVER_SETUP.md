# 🌐 Guia Completo: Servidor Multiplayer theWall

## Índice
1. [Quick Start](#quick-start)
2. [Configuração Local](#configuração-local)
3. [Configuração em Rede (LAN)](#configuração-em-rede-lan)
4. [Servidor Público (Internet)](#servidor-público-internet)
5. [Troubleshooting](#troubleshooting)
6. [Segurança](#segurança)

---

## Quick Start

### Para usar localmente (seu PC + outro PC na mesma rede):

```bash
# Terminal 1 - Inicia servidor
make server

# Terminal 2 - Acessa no mesmo PC
make frontend-dev

# Outro PC na mesma rede acessa:
# ws://SEU_IP_LOCAL:8080
```

---

## Configuração Local

### Passo 1: Compilar e Executar

```bash
# Compile o backend
make backend-build

# Inicie o servidor
make server
```

Você verá:
```
Iniciando servidor theWall na porta 8080
```

### Passo 2: Acessar Localmente

**No mesmo PC:**
- Abra navegador: `http://localhost:3000`
- Server WebSocket: `ws://localhost:8080`

**Outros PCs (mesma rede):**
- Descubra seu IP local:
  ```bash
  # Linux/macOS:
  hostname -I
  # macOS alternativo:
  ifconfig getifaddr en0
  # Windows:
  ipconfig
  ```
- Acesse: `http://SEU_IP:3000`
- Server WebSocket: `ws://SEU_IP:8080`

---

## Configuração em Rede (LAN)

### Cenário: Você + Amigos na Mesma Rede WiFi/Ethernet

#### Passo 1: Descobrir IP Local

```bash
# Linux
ip addr show | grep "inet " | grep -v "127.0.0.1"

# macOS
ifconfig | grep "inet " | grep -v "127.0.0.1"

# Windows
ipconfig
```

**Exemplo de saída:**
```
192.168.1.50  ← Use este IP
```

#### Passo 2: Configurar Backend para Aceitar Conexões Externas

**Editar `backend/main.go` (procure por):**

```go
// ANTES:
log.Println("Servidor roando na porta :8080")

// DEPOIS (se não estiver assim):
log.Println("Servidor rodando na porta 0.0.0.0:8080")
```

#### Passo 3: Abrir Firewall (Porta 8080)

**Linux (UFW):**
```bash
# Permitir acesso da rede local
sudo ufw allow 8080/tcp
sudo ufw allow from 192.168.1.0/24 to any port 8080

# Verificar
sudo ufw status
```

**Linux (iptables):**
```bash
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 8080 -j ACCEPT
```

**Windows:**
```powershell
# Abra PowerShell como Admin
netsh advfirewall firewall add rule name="theWall-8080" dir=in action=allow protocol=tcp localport=8080
```

**macOS:**
```bash
sudo ipfw add allow tcp from any to any 8080 in
```

#### Passo 4: Iniciar Servidor

```bash
make server
```

Você verá algo como:
```
════════════════════════════════════════════════════
🌐 Iniciando Servidor theWall (Multiplayer)
════════════════════════════════════════════════════

✓ Servidor iniciado na porta 8080

Conexões na mesma rede:
  • 192.168.1.50:8080
  • PORTA: 8080
```

#### Passo 5: Outros Jogadores Conectam

**No PC do seu amigo:**

1. Abra terminal/CMD
2. Clone o repositório ou apenas copie a pasta `frontend`
3. Configure a URL do servidor

**Editar `frontend/src/App.js` ou criar `.env`:**

```javascript
// Em App.js, procure por:
const WS_URL = 'ws://localhost:8080';

// Mude para:
const WS_URL = 'ws://192.168.1.50:8080';
```

Ou crie `frontend/.env`:
```
REACT_APP_WS_URL=ws://192.168.1.50:8080
```

4. Inicie React:
```bash
cd frontend
npm install
npm start
```

5. Acesso em: `http://localhost:3000`

---

## Servidor Público (Internet)

### Cenário: Amigos em Diferentes Redes

Você tem **3 opções**:

### Opção 1: Ngrok (Mais Fácil) ⭐

**Passo 1: Instale Ngrok**
```bash
# Download: https://ngrok.com/download
# Ou via package manager:

# macOS:
brew install ngrok

# Linux:
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip
unzip ngrok-*.zip
sudo mv ngrok /usr/local/bin
```

**Passo 2: Autentique (uma vez)**
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
# Obtenha token em: https://dashboard.ngrok.com/auth
```

**Passo 3: Exponha Porta 8080**
```bash
ngrok tcp 8080
```

Você verá:
```
Forwarding   tcp://12.tcp.ngrok.io:12345 -> localhost:8080
```

**Passo 4: Compartilhe com Amigos**
```
ws://12.tcp.ngrok.io:12345
```

**Passo 5: Amigos Conectam**

No PC do amigo, edite `frontend/.env` ou `App.js`:
```
REACT_APP_WS_URL=ws://12.tcp.ngrok.io:12345
```

### Opção 2: Port Forwarding (Mais Rápido, Permanente)

**Passo 1: Descobrir IP Externo**
```bash
curl ifconfig.me
# Resultado: 203.0.113.45  ← Este é seu IP público
```

**Passo 2: Acesse Roteador**
1. Abra navegador: `http://192.168.1.1`
2. Login com credenciais (padrão: admin/admin ou admin/senha do roteador)
3. Procure por "Port Forwarding" ou "Encaminhamento de Porta"

**Passo 3: Configure Port Forwarding**
```
Porta Externa: 8080
Porta Interna: 8080
IP Interno: 192.168.1.50 (seu IP local)
Protocolo: TCP
```

**Passo 4: Teste**
```bash
# No seu PC:
telnet localhost 8080  # Deve conectar

# De fora (outro PC):
telnet 203.0.113.45 8080  # Deve conectar
```

**Passo 5: Compartilhe com Amigos**
```
ws://203.0.113.45:8080
```

### Opção 3: Tailscale (VPN Segura) ⭐⭐

**Passo 1: Instale Tailscale**
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

**Passo 2: Faça Login**
```bash
tailscale up
# Será aberto navegador para autenticar
```

**Passo 3: Descubra IP Tailscale**
```bash
tailscale ip -4
# Resultado: 100.64.x.x
```

**Passo 4: Amigos Instalam Tailscale**
- Mesmos passos acima em seus PCs
- Conectam à mesma rede Tailscale

**Passo 5: Use IP Tailscale**
```
ws://100.64.x.x:8080
```

**Vantagens:**
- ✅ Seguro (VPN)
- ✅ Fácil
- ✅ Funciona em qualquer rede
- ✅ Sem port forwarding complexo

---

## Troubleshooting

### Problema: "Connection Refused"

**Causa:** Servidor não está rodando ou firewall está bloqueando

**Solução:**
```bash
# Verifique se servidor está rodando:
make check-ports

# Se não está, inicie:
make server

# Verifique firewall:
sudo ufw status  # Linux
sudo ipfw show   # macOS
netsh advfirewall show allprofiles  # Windows
```

### Problema: "Cannot Reach Server from Another PC"

**Causa:** IP ou porta errada

**Solução:**
```bash
# Descubra seu IP certo:
hostname -I  # Linux
ifconfig | grep inet  # macOS
ipconfig  # Windows

# Teste conectividade:
ping 192.168.1.50
telnet 192.168.1.50 8080

# Verifique porta no backend:
grep -n "8080\|:8080" backend/main.go
```

### Problema: "Porta Já em Uso"

**Causa:** Outra aplicação usando porta 8080

**Solução:**
```bash
# Descubra qual processo usa porta:
lsof -i :8080  # Linux/macOS
netstat -ano | findstr :8080  # Windows

# Mate o processo (cuidado!):
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows

# Ou use outra porta:
# Edite backend/main.go:
# log.Fatal(http.ListenAndServe(":8081", mux))
```

### Problema: "WebSocket Connection Failed"

**Causa:** Configuração de URL errada no frontend

**Solução:**
```bash
# Edite frontend/src/App.js:
# Procure por:
const WS_URL = ...;

# E mude para seu servidor:
const WS_URL = 'ws://192.168.1.50:8080';
```

### Problema: "Mixed Content" Error (HTTPS)

**Causa:** Frontend HTTPS mas backend HTTP

**Solução:**
```bash
# Se frontend está em HTTPS, use:
const WS_URL = 'wss://seu-dominio:8080';  # Secure WebSocket

# Ou mantenha ambos em HTTP
```

---

## Segurança

### ⚠️ Importante: Este Setup é Apenas para LAN/Amigos!

Para produção real, siga essas práticas:

### 1. Autenticação de Jogadores

**Adicione ao backend (`backend/main.go`):**

```go
type AuthMessage struct {
    Type     string `json:"type"`
    Username string `json:"username"`
    Token    string `json:"token"`
}

func handleAuth(msg AuthMessage) bool {
    // Validar token/username
    if len(msg.Username) < 3 {
        return false
    }
    return true
}
```

### 2. Rate Limiting

```go
import "golang.org/x/time/rate"

var limiter = rate.NewLimiter(rate.Limit(10), 1)  // 10 msgs/sec

func handleMessage(msg *Message) {
    if !limiter.Allow() {
        return  // Ignore if rate exceeded
    }
    // Process message
}
```

### 3. Validação de Dados

```go
// Validar posição do player (não deixe cheating)
if player.X < -100 || player.X > 100 {
    return  // Posição inválida
}

// Limitar velocidade máxima
timeSinceLastMove := time.Now().Sub(player.LastUpdateTime)
maxDistance := 0.5 * timeSinceLastMove.Seconds()  // 0.5 m/s

if distance > maxDistance {
    return  // Velocity hack detected
}
```

### 4. CORS Seguro

**Edite `backend/main.go`:**

```go
upgrader := websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        // ANTES (inseguro):
        return true

        // DEPOIS (seguro):
        origin := r.Header.Get("Origin")
        return origin == "http://localhost:3000" ||
               origin == "https://seu-dominio.com"
    },
}
```

### 5. Logs e Monitoramento

```bash
# Use pm2 para manter servidor rodando:
npm install -g pm2

# Inicie com pm2:
cd backend
pm2 start "go run main.go" --name thewall

# Monitore:
pm2 monit

# Veja logs:
pm2 logs thewall
```

### 6. Backup de Dados

```bash
# Crie script de backup automático:
#!/bin/bash
cp -r gamedata/ gamedata-backup-$(date +%Y%m%d).tar.gz
```

---

## Comandos Rápidos

```bash
# Desenvolvimento local
make dev                # Backend + Frontend simultaneamente

# Apenas backend
make server             # Servidor multiplayer

# Apenas frontend
make frontend-dev       # React dev server

# Produção
make prod               # Build otimizado

# Verificar sistema
make info               # Ver Go, Node, versões
make check-ports        # Quais portas estão em uso

# Limpeza
make clean              # Remove binários
make clean-all          # Remove tudo + node_modules

# Rede
make server-setup       # Guia configuração LAN
make server-public      # Guia configuração internet
```

---

## Exemplo Prático: Setup Completo

### Cenário: Você + 2 Amigos na Mesma Rede WiFi

**Computador 1 (Servidor):**
```bash
cd theWall
make server

# Output:
# ✓ Servidor iniciado na porta 8080
# ✓ IP: 192.168.1.50
```

**Computador 2:**
```bash
cd theWall
# Edite frontend/src/App.js:
# const WS_URL = 'ws://192.168.1.50:8080';

make frontend-dev
# Acesse: http://localhost:3000
```

**Computador 3:**
```bash
# Mesmo que Computador 2
```

**Resultado:** 3 pessoas jogando juntas! 🎮

---

## Próximas Melhorias

- [ ] Sistema de salas/lobbies
- [ ] Chat integrado
- [ ] Persistência de dados
- [ ] Estatísticas de jogadores
- [ ] Sistema de achievements
- [ ] Mobile support

---

## Suporte

Problemas? Execute:
```bash
make help          # Todos os comandos
make info          # Verificar sistema
make check-ports   # Verificar portas
```

Boa sorte! 🎉
