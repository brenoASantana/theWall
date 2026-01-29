.PHONY: help install dev prod build backend frontend clean run server check

# Variáveis
BACKEND_DIR := backend
FRONTEND_DIR := frontend
PORT_BACKEND := 8080
PORT_FRONTEND := 3000

# Cores para output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

help:
	@echo "$(BLUE)╔════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║         theWall - Game Development Commands            ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)🎮 Iniciação Rápida:$(NC)"
	@echo "  $(GREEN)make dev$(NC)              - Inicia desenvolvimento (backend + frontend)"
	@echo "  $(GREEN)make prod$(NC)             - Build produção (otimizado)"
	@echo "  $(GREEN)make server$(NC)           - Inicia servidor para múltiplos jogadores"
	@echo ""
	@echo "$(YELLOW)🔧 Backend (Go):$(NC)"
	@echo "  $(GREEN)make backend$(NC)         - Compila backend"
	@echo "  $(GREEN)make backend-run$(NC)     - Executa servidor Go"
	@echo "  $(GREEN)make backend-watch$(NC)   - Monitora mudanças e recompila"
	@echo "  $(GREEN)make backend-clean$(NC)   - Remove arquivos compilados"
	@echo ""
	@echo "$(YELLOW)⚛️  Frontend (React):$(NC)"
	@echo "  $(GREEN)make frontend$(NC)        - Instala dependências frontend"
	@echo "  $(GREEN)make frontend-dev$(NC)    - Inicia React dev server"
	@echo "  $(GREEN)make frontend-build$(NC)  - Build produção frontend"
	@echo "  $(GREEN)make frontend-clean$(NC)  - Limpa node_modules"
	@echo ""
	@echo "$(YELLOW)🌐 Rede & Servidor:$(NC)"
	@echo "  $(GREEN)make server-setup$(NC)    - Configura servidor para rede"
	@echo "  $(GREEN)make server-public$(NC)   - Expõe servidor na internet"
	@echo "  $(GREEN)make check-ports$(NC)     - Verifica portas em uso"
	@echo ""
	@echo "$(YELLOW)🧹 Limpeza:$(NC)"
	@echo "  $(GREEN)make clean$(NC)           - Limpa tudo"
	@echo "  $(GREEN)make clean-all$(NC)       - Limpa + remove dependências"
	@echo ""
	@echo "$(YELLOW)ℹ️  Informação:$(NC)"
	@echo "  $(GREEN)make info$(NC)            - Mostra info do sistema"
	@echo "  $(GREEN)make ports$(NC)           - Lista portas recomendadas"
	@echo ""

# ════════════════════════════════════════════════════════════════════════════════
# SETUP INICIAL
# ════════════════════════════════════════════════════════════════════════════════

install: backend frontend
	@echo "$(GREEN)✓ Instalação completa!$(NC)"
	@echo "$(YELLOW)Execute: make dev$(NC)"

backend:
	@echo "$(BLUE)Verificando Go...$(NC)"
	@command -v go >/dev/null 2>&1 || (echo "$(RED)Go não instalado!$(NC)" && exit 1)
	@cd $(BACKEND_DIR) && go mod download
	@echo "$(GREEN)✓ Backend pronto$(NC)"

frontend:
	@echo "$(BLUE)Verificando Node.js...$(NC)"
	@command -v node >/dev/null 2>&1 || (echo "$(RED)Node.js não instalado!$(NC)" && exit 1)
	@echo "$(BLUE)Instalando dependências frontend...$(NC)"
	@cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)✓ Frontend pronto$(NC)"

# ════════════════════════════════════════════════════════════════════════════════
# DESENVOLVIMENTO
# ════════════════════════════════════════════════════════════════════════════════

dev: check-deps
	@echo "$(BLUE)🎮 Iniciando theWall em MODO DESENVOLVIMENTO$(NC)"
	@echo "$(YELLOW)Aguarde alguns segundos...$(NC)"
	@echo ""
	@echo "$(GREEN)Backend em: http://localhost:$(PORT_BACKEND)$(NC)"
	@echo "$(GREEN)Frontend em: http://localhost:$(PORT_FRONTEND)$(NC)"
	@echo "$(YELLOW)Pressione Ctrl+C para encerrar$(NC)"
	@echo ""
	@./dev-start.sh

dev-backend: backend
	@echo "$(BLUE)Iniciando backend em desenvolvimento...$(NC)"
	@cd $(BACKEND_DIR) && go run main.go

dev-frontend: frontend
	@echo "$(BLUE)Iniciando frontend em desenvolvimento...$(NC)"
	@cd $(FRONTEND_DIR) && npm start

# ════════════════════════════════════════════════════════════════════════════════
# PRODUÇÃO
# ════════════════════════════════════════════════════════════════════════════════

prod: build server
	@echo "$(GREEN)✓ Ambiente de produção pronto!$(NC)"

build: backend-build frontend-build
	@echo "$(GREEN)✓ Build produção completo!$(NC)"

backend-build:
	@echo "$(BLUE)Compilando backend...$(NC)"
	@cd $(BACKEND_DIR) && go build -o thewall-server main.go
	@echo "$(GREEN)✓ Backend compilado: $(BACKEND_DIR)/thewall-server$(NC)"

frontend-build:
	@echo "$(BLUE)Compilando frontend...$(NC)"
	@cd $(FRONTEND_DIR) && npm run build
	@echo "$(GREEN)✓ Frontend compilado: $(FRONTEND_DIR)/build$(NC)"

# ════════════════════════════════════════════════════════════════════════════════
# BACKEND - COMANDOS ESPECÍFICOS
# ════════════════════════════════════════════════════════════════════════════════

backend-run: backend-build
	@echo "$(BLUE)Iniciando servidor theWall...$(NC)"
	@cd $(BACKEND_DIR) && ./thewall-server

backend-watch:
	@echo "$(BLUE)Monitorando mudanças no backend...$(NC)"
	@command -v air >/dev/null 2>&1 || (echo "$(YELLOW)Instalando air...$(NC)" && go install github.com/cosmtrek/air@latest)
	@cd $(BACKEND_DIR) && air

backend-clean:
	@echo "$(BLUE)Limpando backend...$(NC)"
	@cd $(BACKEND_DIR) && rm -f thewall-server
	@echo "$(GREEN)✓ Backend limpo$(NC)"

# ════════════════════════════════════════════════════════════════════════════════
# FRONTEND - COMANDOS ESPECÍFICOS
# ════════════════════════════════════════════════════════════════════════════════

frontend-dev: frontend
	@cd $(FRONTEND_DIR) && npm start

frontend-build:
	@echo "$(BLUE)Compilando frontend...$(NC)"
	@cd $(FRONTEND_DIR) && npm run build

frontend-test: frontend
	@cd $(FRONTEND_DIR) && npm test

frontend-clean:
	@echo "$(BLUE)Limpando node_modules frontend...$(NC)"
	@cd $(FRONTEND_DIR) && rm -rf node_modules build
	@echo "$(GREEN)✓ Frontend limpo$(NC)"

# ════════════════════════════════════════════════════════════════════════════════
# SERVIDOR MULTIPLAYER
# ════════════════════════════════════════════════════════════════════════════════

server: backend-build
	@echo "$(BLUE)════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)🌐 Iniciando Servidor theWall (Multiplayer)$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(GREEN)✓ Servidor iniciado na porta $(PORT_BACKEND)$(NC)"
	@echo ""
	@echo "$(YELLOW)Conexões locais:$(NC)"
	@echo "  • localhost:$(PORT_BACKEND)"
	@echo "  • 127.0.0.1:$(PORT_BACKEND)"
	@echo ""
	@echo "$(YELLOW)Conexões na mesma rede:$(NC)"
	@make show-local-ip
	@echo "  • PORTA: $(PORT_BACKEND)"
	@echo ""
	@echo "$(YELLOW)Para conectar de outra máquina:$(NC)"
	@echo "  1. Ensure firewall port $(PORT_BACKEND) is open"
	@echo "  2. Use your machine IP + port $(PORT_BACKEND)"
	@echo "  3. See 'make server-setup' for detailed setup"
	@echo ""
	@echo "$(YELLOW)Pressione Ctrl+C para encerrar$(NC)"
	@echo ""
	@cd $(BACKEND_DIR) && ./thewall-server

server-setup:
	@echo "$(BLUE)════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)📋 Configurando Servidor para Rede$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Descubra seu IP local:$(NC)"
	@make show-local-ip
	@echo ""
	@echo "$(YELLOW)2. Verifique firewall (abra porta $(PORT_BACKEND)):$(NC)"
	@echo "   Linux (ufw): sudo ufw allow $(PORT_BACKEND)/tcp"
	@echo "   Linux (iptables): sudo iptables -A INPUT -p tcp --dport $(PORT_BACKEND) -j ACCEPT"
	@echo "   Windows: netsh advfirewall firewall add rule name=\"theWall\" dir=in action=allow protocol=tcp localport=$(PORT_BACKEND)"
	@echo "   macOS: sudo ipfw add allow tcp from any to any $(PORT_BACKEND) in"
	@echo ""
	@echo "$(YELLOW)3. Inicie o servidor:$(NC)"
	@echo "   make server"
	@echo ""
	@echo "$(YELLOW)4. Outros jogadores acessam em:$(NC)"
	@echo "   ws://SEU_IP:$(PORT_BACKEND)"
	@echo ""

server-public:
	@echo "$(BLUE)════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)🌍 Expondo Servidor na Internet$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Opção 1 - Usando Ngrok:$(NC)"
	@echo "  1. Instale: https://ngrok.com/download"
	@echo "  2. Execute: ngrok tcp $(PORT_BACKEND)"
	@echo "  3. Compartilhe URL: ngrok.io:xxxxx"
	@echo ""
	@echo "$(YELLOW)Opção 2 - Port Forwarding no Router:$(NC)"
	@echo "  1. Acesse: http://router.local ou 192.168.1.1"
	@echo "  2. Port Forwarding → Porta Externa: $(PORT_BACKEND)"
	@echo "  3. Porta Interna: $(PORT_BACKEND)"
	@echo "  4. IP Interno: (seu IP local)"
	@echo "  5. Protocolo: TCP"
	@echo "  6. Descubra IP público: curl ifconfig.me"
	@echo "  7. Compartilhe: ws://SEU_IP_PÚBLICO:$(PORT_BACKEND)"
	@echo ""
	@echo "$(YELLOW)Opção 3 - VPN/Tailscale:$(NC)"
	@echo "  1. Instale Tailscale: https://tailscale.com"
	@echo "  2. Conecte seu PC"
	@echo "  3. Use Tailscale IP no lugar do IP local"
	@echo ""

# ════════════════════════════════════════════════════════════════════════════════
# UTILITÁRIOS DE REDE
# ════════════════════════════════════════════════════════════════════════════════

check-ports:
	@echo "$(BLUE)Verificando portas...$(NC)"
	@echo ""
	@echo "$(YELLOW)Porta $(PORT_BACKEND) (Backend):$(NC)"
	@command -v lsof >/dev/null 2>&1 && lsof -i :$(PORT_BACKEND) || echo "  (lsof não disponível)"
	@echo ""
	@echo "$(YELLOW)Porta $(PORT_FRONTEND) (Frontend):$(NC)"
	@command -v lsof >/dev/null 2>&1 && lsof -i :$(PORT_FRONTEND) || echo "  (lsof não disponível)"
	@echo ""

ports:
	@echo "$(BLUE)Portas Padrão:$(NC)"
	@echo "  Backend (Go):     $(PORT_BACKEND)"
	@echo "  Frontend (React): $(PORT_FRONTEND)"
	@echo ""
	@echo "$(YELLOW)Para mudar portas:$(NC)"
	@echo "  Backend:  edite backend/main.go (procure por ':8080')"
	@echo "  Frontend: edite frontend/.env (REACT_APP_WS_URL)"
	@echo ""

show-local-ip:
	@command -v hostname >/dev/null 2>&1 && echo "  • $$(hostname -I | awk '{print $$1}'):$(PORT_BACKEND)" || echo "  • Execute: ipconfig getifaddr en0 (macOS) ou hostname -I (Linux)"

info:
	@echo "$(BLUE)════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)ℹ️  Informações do Sistema$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Go:$(NC)"
	@command -v go >/dev/null 2>&1 && go version || echo "  ❌ Não instalado"
	@echo ""
	@echo "$(YELLOW)Node.js:$(NC)"
	@command -v node >/dev/null 2>&1 && node --version || echo "  ❌ Não instalado"
	@echo ""
	@echo "$(YELLOW)npm:$(NC)"
	@command -v npm >/dev/null 2>&1 && npm --version || echo "  ❌ Não instalado"
	@echo ""
	@echo "$(YELLOW)Git:$(NC)"
	@command -v git >/dev/null 2>&1 && git --version || echo "  ❌ Não instalado"
	@echo ""
	@echo "$(YELLOW)IP Local:$(NC)"
	@make show-local-ip
	@echo ""

# ════════════════════════════════════════════════════════════════════════════════
# LIMPEZA
# ════════════════════════════════════════════════════════════════════════════════

clean:
	@echo "$(BLUE)Limpando arquivos temporários...$(NC)"
	@make backend-clean
	@echo "$(GREEN)✓ Limpeza concluída$(NC)"

clean-all: clean frontend-clean
	@echo "$(GREEN)✓ Limpeza completa!$(NC)"

# ════════════════════════════════════════════════════════════════════════════════
# VERIFICAÇÕES
# ════════════════════════════════════════════════════════════════════════════════

check-deps:
	@command -v go >/dev/null 2>&1 || (echo "$(RED)❌ Go não instalado!$(NC)" && exit 1)
	@command -v node >/dev/null 2>&1 || (echo "$(RED)❌ Node.js não instalado!$(NC)" && exit 1)
	@command -v npm >/dev/null 2>&1 || (echo "$(RED)❌ npm não instalado!$(NC)" && exit 1)
	@echo "$(GREEN)✓ Todas as dependências encontradas$(NC)"

# ════════════════════════════════════════════════════════════════════════════════
# PADRÃO
# ════════════════════════════════════════════════════════════════════════════════

.DEFAULT_GOAL := help
