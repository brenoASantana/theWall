#!/bin/bash

# theWall - Script de Início Local
# Execute: ./start.sh

echo "🎮 theWall - Horror Exploration Game"
echo "===================================="
echo ""

# Verifica dependências
if ! command -v go &> /dev/null; then
    echo "❌ Go não encontrado. Instale Go 1.21+ primeiro."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

echo "✅ Dependências encontradas"
echo ""

# Instalar dependências se necessário
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd frontend && npm install && cd ..
fi

# Iniciar backend em background
echo "🚀 Iniciando servidor backend (Go) na porta 8080..."
cd backend
go run main.go &
BACKEND_PID=$!
cd ..

sleep 2

# Iniciar frontend
echo "🚀 Iniciando frontend (React) na porta 3000..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Jogo rodando em: http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pressione Ctrl+C para parar ambos os servidores"
echo ""

cd frontend
npm start

# Quando o frontend parar, matar o backend
kill $BACKEND_PID 2>/dev/null
