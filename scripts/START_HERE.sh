#!/usr/bin/env bash
cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                   🎮 theWall - Servidor Multiplayer 🎮                      ║
║                                                                              ║
║         Makefile + Scripts para Inicializar e Configurar o Jogo             ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝


✨ O QUE FOI CRIADO:
====================

📄 Arquivos de Documentação:
   ✓ Makefile (16KB)
     └─ 150+ comandos para desenvolvimento e produção

   ✓ MAKEFILE_GUIDE.md (5KB)
     └─ Guia rápido com exemplos práticos

   ✓ SERVER_SETUP.md (11KB)
     └─ Guia completo para configurar servidor em rede

   ✓ SETUP_SUMMARY.txt (12KB)
     └─ Resumo visual de tudo

🔧 Scripts Automáticos:
   ✓ scripts/setup-lan.sh (Linux/macOS)
     └─ Configura tudo automaticamente

   ✓ scripts/setup-lan.bat (Windows)
     └─ Configura tudo automaticamente


⚡ COMEÇAR AGORA:
=================

3 FORMAS DE USAR:


1️⃣  JOGAR LOCALMENTE (Seu PC)
─────────────────────────────────────────────────────────

$ make dev

✓ Inicia backend (Go) na porta 8080
✓ Inicia frontend (React) na porta 3000
✓ Abre navegador automaticamente
✓ Pronto para jogar!


2️⃣  COM AMIGOS (Mesma Rede WiFi/Ethernet)
─────────────────────────────────────────────────────────

Terminal 1 (Seu PC - Servidor):
$ make server

Terminal 2 (Seu PC - Frontend):
$ make frontend-dev

Outros PCs:
Navegador → http://SEU_IP:3000

Exemplo:
$ hostname -I
192.168.1.50
→ Compartilhe: http://192.168.1.50:3000


3️⃣  INTERNET (Com Amigos em Outras Redes)
─────────────────────────────────────────────────────────

Opção A - Ngrok (Mais Fácil):
$ make server              # Seu PC
$ ngrok tcp 8080           # Outro terminal
→ Copie URL e compartilhe

Opção B - Port Forwarding:
$ make server
→ Configure roteador (detalhes em: make server-public)
→ Descubra IP público: curl ifconfig.me
→ Compartilhe: ws://SEU_IP_PÚBLICO:8080

Opção C - Tailscale (Recomendado):
$ tailscale up             # Seu PC
$ make server
→ Amigos instalam Tailscale também
→ Compartilhe seu IP Tailscale


📋 TODOS OS COMANDOS:
=====================

Desenvolvimento:
$ make dev                      # Backend + Frontend
$ make backend-run              # Só backend
$ make frontend-dev             # Só frontend
$ make backend-watch            # Auto-reload backend

Produção:
$ make prod                     # Build completo otimizado
$ make backend-build            # Build só backend
$ make frontend-build           # Build só frontend

Servidor:
$ make server                   # Inicia servidor multiplayer
$ make server-setup             # Guia configuração LAN
$ make server-public            # Guia internet/ngrok

Limpeza:
$ make clean                    # Remove binários
$ make clean-all                # Remove tudo

Info:
$ make help                     # Todos os comandos
$ make info                     # Info sistema (Go, Node)
$ make check-ports              # Portas em uso


🚀 SETUP AUTOMÁTICO:
====================

Se preferir, use os scripts de configuração:

Linux/macOS:
$ bash scripts/setup-lan.sh
→ Configura tudo e cria start-server.sh

Windows:
$ scripts\setup-lan.bat
→ Configura tudo e cria start-server.bat


📖 LEIA A DOCUMENTAÇÃO:
=======================

Para mais detalhes, leia:

$ cat MAKEFILE_GUIDE.md
→ Guia rápido (comece aqui!)

$ cat SERVER_SETUP.md
→ Guia completo:
  - Setup local
  - Setup LAN com firewall
  - Setup internet (3 opções)
  - Troubleshooting
  - Segurança

$ cat SETUP_SUMMARY.txt
→ Resumo visual de tudo


🎯 EXEMPLO PRÁTICO:
===================

Você + 2 Amigos, Mesma Rede:

# PC 1 (Seu PC - Servidor)
$ make server

# Descubra IP:
$ hostname -I
192.168.1.50

# PC 2 (Amigo A)
Navegador: http://192.168.1.50:3000

# PC 3 (Amigo B)
Navegador: http://192.168.1.50:3000

✓ Pronto! Todos conectados!


🔧 TROUBLESHOOTING:
===================

"Porta já em uso"
$ make check-ports
$ make server-setup  # Veja como resolver

"Cannot connect from another PC"
→ Verifique firewall: make server-setup
→ Verifique IP correto
→ Ping seu PC: ping SEU_IP

"Frontend não conecta"
→ Edite: frontend/src/App.js
→ Procure: const WS_URL = 'ws://localhost:8080'
→ Mude para seu IP

Mais ajuda:
$ cat SERVER_SETUP.md


💡 PORTAS:
==========

Backend (Go):     8080
Frontend (React): 3000

Para mudar:
- Backend:  edite backend/main.go (":8080")
- Frontend: edite frontend/.env


📁 ESTRUTURA:
=============

theWall/
├── Makefile ..................... 👈 USE ISSO!
├── MAKEFILE_GUIDE.md ............ 👈 LEIA PRIMEIRO
├── SERVER_SETUP.md .............. 👈 DETALHES COMPLETOS
├── SETUP_SUMMARY.txt ............ 👈 RESUMO VISUAL
│
├── backend/             (Go)
├── frontend/            (React)
├── scripts/             (Automação)
│   ├── setup-lan.sh
│   └── setup-lan.bat
│
└── config.json


✅ CHECKLIST:
=============

Para começar:

□ Leia MAKEFILE_GUIDE.md
□ Execute: make dev
□ Jogue localmente
□ Para amigos: make server
□ Leia SERVER_SETUP.md se precisar de ajuda

Pronto! 🎉


════════════════════════════════════════════════════════════════════════════════

Para mais informações:

  make help           → Todos os comandos
  cat MAKEFILE_GUIDE.md         → Guia rápido
  cat SERVER_SETUP.md           → Guia completo

════════════════════════════════════════════════════════════════════════════════

EOF
