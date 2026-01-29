#!/bin/bash

# theWall - Startup Script
# Inicia o servidor backend e frontend

set -e

echo "🎮 theWall - Horror Exploration Game"
echo "===================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar pré-requisitos
echo -e "${YELLOW}Verificando pré-requisitos...${NC}"

if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go não está instalado${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Go e Node.js encontrados${NC}"
echo ""

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Build frontend
echo -e "${YELLOW}Compilando frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm install
npm run build
echo -e "${GREEN}✅ Frontend compilado${NC}"
echo ""

# Instalar dependências Go
echo -e "${YELLOW}Instalando dependências Go...${NC}"
cd "$PROJECT_DIR/backend"
go mod download
echo -e "${GREEN}✅ Dependências Go instaladas${NC}"
echo ""

# Iniciar backend
echo -e "${YELLOW}Iniciando servidor...${NC}"
cd "$PROJECT_DIR/backend"
go run main.go &
BACKEND_PID=$!

sleep 2

echo -e "${GREEN}✅ Servidor iniciado (PID: $BACKEND_PID)${NC}"
echo ""
echo -e "${GREEN}🎮 theWall está rodando em http://localhost:8080${NC}"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

# Aguardar
wait $BACKEND_PID
