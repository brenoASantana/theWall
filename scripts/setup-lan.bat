@echo off
REM ███████╗███████╗████████╗██╗   ██╗██████╗     ██╗      █████╗ ███╗   ██╗
REM ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗    ██║     ██╔══██╗████╗  ██║
REM ███████╗█████╗     ██║   ██║   ██║██████╔╝    ██║     ███████║██╔██╗ ██║
REM ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝     ██║     ██╔══██║██║╚██╗██║
REM ███████║███████╗   ██║   ╚██████╔╝██║         ███████╗██║  ██║██║ ╚████║
REM ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝         ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
REM
REM theWall - Configuração Automática para LAN (Windows)

setlocal enabledelayedexpansion
chcp 65001 >nul

REM Cores
set GREEN=[32m
set YELLOW=[33m
set BLUE=[34m
set RED=[31m
set NC=[0m

echo.
echo %BLUE%════════════════════════════════════════════════════════%NC%
echo %BLUE%  theWall - Configuração LAN (Windows)%NC%
echo %BLUE%════════════════════════════════════════════════════════%NC%
echo.

REM Verificar Go
echo %YELLOW%Verificando Go...%NC%
go version >nul 2>&1
if errorlevel 1 (
    echo %RED%✗ Go não encontrado!%NC%
    echo   Instale em: https://golang.org/dl/
    pause
    exit /b 1
) else (
    echo %GREEN%✓ Go encontrado%NC%
)

REM Verificar Node.js
echo %YELLOW%Verificando Node.js...%NC%
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%✗ Node.js não encontrado!%NC%
    echo   Instale em: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo %GREEN%✓ Node.js encontrado%NC%
)

REM Obter IP local
echo %YELLOW%Detectando IP local...%NC%

for /f "tokens=2 delims=: " %%a in ('ipconfig ^| findstr /R "IPv4 Address"') do (
    set LOCAL_IP=%%a
    goto found_ip
)

:found_ip
if not defined LOCAL_IP (
    echo %RED%✗ Não foi possível detectar IP local%NC%
    set LOCAL_IP=localhost
)

echo %GREEN%✓ IP Local: %LOCAL_IP%%NC%
echo.

REM Compilar backend
echo %YELLOW%Compilando backend...%NC%
cd backend
go build -o thewall-server.exe main.go
if errorlevel 1 (
    echo %RED%✗ Erro ao compilar backend%NC%
    pause
    exit /b 1
)
cd ..
echo %GREEN%✓ Backend compilado%NC%

REM Instalar frontend
echo %YELLOW%Instalando dependências frontend...%NC%
cd frontend
call npm install >nul 2>&1
cd ..
echo %GREEN%✓ Frontend pronto%NC%

REM Criar arquivo de configuração
echo %YELLOW%Criando configuração...%NC%
(
    echo {
    echo   "server": {
    echo     "ip": "0.0.0.0",
    echo     "port": 8080,
    echo     "publicIp": "%LOCAL_IP%"
    echo   },
    echo   "frontend": {
    echo     "wsUrl": "ws://%LOCAL_IP%:8080"
    echo   },
    echo   "security": {
    echo     "corsOrigins": [
    echo       "http://localhost:3000",
    echo       "http://%LOCAL_IP%:3000",
    echo       "http://127.0.0.1:3000"
    echo     ]
    echo   }
    echo }
) > config-lan.json
echo %GREEN%✓ Configuração criada%NC%

REM Criar script de inicialização
echo %YELLOW%Criando scripts...%NC%
(
    echo @echo off
    echo title theWall - Servidor LAN
    echo cls
    echo echo ════════════════════════════════════════════════════════
    echo echo 🌐 theWall - Servidor LAN
    echo echo ════════════════════════════════════════════════════════
    echo echo.
    echo echo ✓ Servidor: ws://%LOCAL_IP%:8080
    echo echo ✓ Frontend: http://%LOCAL_IP%:3000
    echo echo.
    echo echo Outros jogadores acessam em:
    echo echo   http://%LOCAL_IP%:3000
    echo echo.
    echo echo Pressione Ctrl+C para encerrar
    echo echo.
    echo cd backend
    echo thewall-server.exe
    echo pause
) > start-server.bat
echo %GREEN%✓ start-server.bat criado%NC%

REM Criar arquivo de instruções
(
    echo # 🎮 Instruções para Outros Jogadores
    echo.
    echo Seu servidor está rodando em: **http://%LOCAL_IP%:3000**
    echo.
    echo ## Para Jogar:
    echo.
    echo 1. **Na mesma rede WiFi/Ethernet?**
    echo    - Abra navegador
    echo    - Acesse: `http://%LOCAL_IP%:3000`
    echo    - Comece a jogar!
    echo.
    echo 2. **Problemas de conexão?**
    echo    - Certifique-se que todos estão na mesma rede
    echo    - Firewall permite porta 8080?
    echo    - Tente reiniciar o servidor
    echo.
    echo ## IP do Servidor:
    echo ```
    echo %LOCAL_IP%
    echo ```
    echo.
    echo ## Porta:
    echo ```
    echo 8080
    echo ```
    echo.
    echo Boa sorte! 🎉
) > PLAYERS.md
echo %GREEN%✓ PLAYERS.md criado%NC%

REM Adicionar firewall (opcional)
echo.
echo %YELLOW%Configurando firewall...%NC%
netsh advfirewall firewall add rule name="theWall-8080" dir=in action=allow protocol=tcp localport=8080 >nul 2>&1
echo %GREEN%✓ Porta 8080 permitida no firewall%NC%

REM Resumo final
echo.
echo %BLUE%════════════════════════════════════════════════════════%NC%
echo %BLUE%Setup Concluído! 🎉%NC%
echo %BLUE%════════════════════════════════════════════════════════%NC%
echo.

echo %GREEN%Próximas etapas:%NC%
echo.
echo  1. Inicie o servidor:
echo     start-server.bat
echo.
echo  2. Ou abra terminal e use:
echo     make server
echo.
echo  3. Compartilhe com amigos:
echo     http://%LOCAL_IP%:3000
echo.
echo %YELLOW%Configurações salvas em:%NC%
echo  • config-lan.json
echo  • PLAYERS.md
echo  • start-server.bat
echo.

pause
