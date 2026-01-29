#!/bin/bash

#   ███████╗███████╗████████╗██╗   ██╗██████╗     ██╗      █████╗ ███╗   ██╗
#   ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗    ██║     ██╔══██╗████╗  ██║
#   ███████╗█████╗     ██║   ██║   ██║██████╔╝    ██║     ███████║██╔██╗ ██║
#   ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝     ██║     ██╔══██║██║╚██╗██║
#   ███████║███████╗   ██║   ╚██████╔╝██║         ███████╗██║  ██║██║ ╚████║
#   ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝         ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
#
#   theWall - Configuração Automática para LAN
#   Este script facilita o setup de servidor multiplayer em rede local

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ════════════════════════════════════════════════════════════════════════════════
# FUNÇÕES
# ════════════════════════════════════════════════════════════════════════════════

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

get_local_ip() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        hostname -I | awk '{print $1}'
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | head -1
    else
        echo "127.0.0.1"
    fi
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 encontrado"
        return 0
    else
        print_error "$1 não encontrado"
        return 1
    fi
}

# ════════════════════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════════════════════

print_header "theWall - Configuração LAN"

# Verificar dependências
print_info "Verificando dependências..."
check_command "go" || (print_error "Go não instalado"; exit 1)
check_command "node" || (print_error "Node.js não instalado"; exit 1)
check_command "npm" || (print_error "npm não instalado"; exit 1)

# Obter IP local
LOCAL_IP=$(get_local_ip)
print_success "IP Local: $LOCAL_IP"

# Criar arquivo de configuração
print_info "Criando configuração..."

cat > config-lan.json << EOF
{
  "server": {
    "ip": "0.0.0.0",
    "port": 8080,
    "publicIp": "$LOCAL_IP"
  },
  "frontend": {
    "wsUrl": "ws://$LOCAL_IP:8080"
  },
  "security": {
    "corsOrigins": [
      "http://localhost:3000",
      "http://$LOCAL_IP:3000",
      "http://127.0.0.1:3000"
    ]
  }
}
EOF

print_success "Configuração criada: config-lan.json"

# Compilar backend
print_info "Compilando backend..."
cd backend
go build -o thewall-server main.go
cd ..
print_success "Backend compilado: backend/thewall-server"

# Instalar frontend
print_info "Instalando dependências frontend..."
cd frontend
npm install > /dev/null 2>&1
cd ..
print_success "Frontend pronto"

# Criar script de inicialização
cat > start-server.sh << EOF
#!/bin/bash
echo -e "\${BLUE}════════════════════════════════════════════════════════\${NC}"
echo -e "\${BLUE}🌐 theWall - Servidor LAN\${NC}"
echo -e "\${BLUE}════════════════════════════════════════════════════════\${NC}"
echo ""
echo -e "\${GREEN}✓ Servidor: ws://$LOCAL_IP:8080\${NC}"
echo -e "\${GREEN}✓ Frontend: http://$LOCAL_IP:3000\${NC}"
echo ""
echo -e "\${YELLOW}Outros jogadores acessam em:\${NC}"
echo -e "  http://$LOCAL_IP:3000"
echo ""
echo -e "\${YELLOW}Pressione Ctrl+C para encerrar\${NC}"
echo ""
cd backend
./thewall-server
EOF

chmod +x start-server.sh
print_success "Script de inicialização criado: start-server.sh"

# Criar arquivo de instruções
cat > PLAYERS.md << EOF
# 🎮 Instruções para Outros Jogadores

Seu servidor está rodando em: **http://$LOCAL_IP:3000**

## Para Jogar:

1. **Na mesma rede WiFi/Ethernet?**
   - Abra navegador
   - Acesse: \`http://$LOCAL_IP:3000\`
   - Comece a jogar!

2. **Problemas de conexão?**
   - Certifique-se que todos estão na mesma rede
   - Firewall permite porta 8080?
   - Tente reiniciar o servidor

## IP do Servidor:
\`\`\`
$LOCAL_IP
\`\`\`

## Porta:
\`\`\`
8080
\`\`\`

Boa sorte! 🎉
EOF

print_success "Instruções para jogadores criadas: PLAYERS.md"

# Resumo final
echo ""
print_header "Setup Concluído! 🎉"

echo -e "${GREEN}Próximas etapas:${NC}"
echo ""
echo "  1. Inicie o servidor:"
echo "     ./start-server.sh"
echo ""
echo "  2. Ou use o Makefile:"
echo "     make server"
echo ""
echo "  3. Compartilhe com amigos:"
echo "     http://$LOCAL_IP:3000"
echo ""
echo -e "${YELLOW}Configurações salvas em:${NC}"
echo "  • config-lan.json"
echo "  • PLAYERS.md"
echo ""
