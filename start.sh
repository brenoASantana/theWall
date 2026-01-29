#!/bin/bash

# theWall - Script de Início Rápido
# Execute: ./start.sh

echo "🎮 theWall - Horror Exploration Game"
echo "===================================="
echo ""

# Verifica se as dependências estão instaladas
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

# Pergunta o modo
echo "Escolha o modo de execução:"
echo "1) Desenvolvimento (frontend em http://localhost:3000)"
echo "2) Produção (tudo em http://localhost:8080)"
read -p "Opção [1-2]: " option

case $option in
    1)
        echo ""
        echo "🚀 Iniciando modo desenvolvimento..."
        echo ""
        ./scripts/dev-start.sh
        ;;
    2)
        echo ""
        echo "🚀 Iniciando modo produção..."
        echo ""
        ./scripts/run.sh
        ;;
    *)
        echo "Opção inválida!"
        exit 1
        ;;
esac
