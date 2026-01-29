#!/usr/bin/env bash

# theWall - Developer Quick Start
# Script para configurar e rodar o projeto em desenvolvimento

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_header() {
  echo -e "\n${BLUE}════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}\n"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

check_command() {
  if command -v "$1" &> /dev/null; then
    print_success "$1 encontrado"
    return 0
  else
    print_error "$1 não encontrado"
    return 1
  fi
}

print_header "theWall - Configuração de Desenvolvimento"

# Verificar pré-requisitos
print_header "Verificando pré-requisitos"

if ! check_command go; then
  print_error "Go não está instalado. Visite https://golang.org/dl/"
  exit 1
fi

if ! check_command node; then
  print_error "Node.js não está instalado. Visite https://nodejs.org/"
  exit 1
fi

if ! check_command npm; then
  print_error "npm não está instalado"
  exit 1
fi

# Instalar dependências
print_header "Instalando dependências"

echo "Instalando dependências Go..."
cd "$BACKEND_DIR"
go mod download
print_success "Dependências Go instaladas"

echo "Instalando dependências Node.js..."
cd "$FRONTEND_DIR"
npm install
print_success "Dependências Node.js instaladas"

# Menu de opções
print_header "Selecione o modo de execução"

echo "1) Produção (build frontend + run backend)"
echo "2) Desenvolvimento (frontend em watch mode + backend com auto-reload)"
echo "3) Apenas Backend"
echo "4) Apenas Frontend"
echo "5) Build Frontend"

read -p "Escolha uma opção (1-5): " choice

case $choice in
  1)
    print_header "Modo Produção"
    echo "Compilando frontend..."
    cd "$FRONTEND_DIR"
    npm run build
    print_success "Frontend compilado"

    echo "Iniciando backend..."
    cd "$BACKEND_DIR"
    go run main.go
    ;;
  2)
    print_header "Modo Desenvolvimento"

    # Verificar se Air está instalado (para reload automático do backend)
    if ! command -v air &> /dev/null; then
      print_warning "Air não instalado. Instalando para reload automático..."
      go install github.com/cosmtrek/air@latest
    fi

    # Terminal 1: Frontend
    echo "Iniciando frontend em nova janela..."
    cd "$FRONTEND_DIR"

    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      open -a Terminal "$(pwd)"
      npm start
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      # Linux - tente diferentes terminais
      if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd \"$FRONTEND_DIR\" && npm start; bash"
      elif command -v xterm &> /dev/null; then
        xterm -e "cd \"$FRONTEND_DIR\" && npm start"
      else
        print_warning "Terminal gráfico não encontrado. Execute em outro terminal:"
        echo "cd \"$FRONTEND_DIR\" && npm start"
      fi
    fi

    # Terminal principal: Backend
    echo "Iniciando backend..."
    cd "$BACKEND_DIR"

    if command -v air &> /dev/null; then
      air
    else
      go run main.go
    fi
    ;;
  3)
    print_header "Apenas Backend"
    cd "$BACKEND_DIR"
    go run main.go
    ;;
  4)
    print_header "Apenas Frontend"
    cd "$FRONTEND_DIR"
    npm start
    ;;
  5)
    print_header "Build Frontend"
    cd "$FRONTEND_DIR"
    npm run build
    print_success "Build concluído: $FRONTEND_DIR/build"
    ;;
  *)
    print_error "Opção inválida"
    exit 1
    ;;
esac
