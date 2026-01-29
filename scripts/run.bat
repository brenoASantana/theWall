@echo off
REM theWall - Startup Script for Windows
REM Inicia o servidor backend e frontend

echo 🎮 theWall - Horror Exploration Game
echo ====================================
echo.

REM Get script directory and project root
set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..

REM Verificar pré-requisitos
echo Verificando pré-requisitos...

where go >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Go não está instalado
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado
    exit /b 1
)

echo ✅ Go e Node.js encontrados
echo.

REM Build frontend
echo Compilando frontend...
cd "%PROJECT_DIR%\frontend"
call npm install
call npm run build
echo ✅ Frontend compilado
echo.

REM Instalar dependências Go
echo Instalando dependências Go...
cd "%PROJECT_DIR%\backend"
call go mod download
echo ✅ Dependências Go instaladas
echo.

REM Iniciar backend
echo Iniciando servidor...
cd "%PROJECT_DIR%\backend"
start cmd /k go run main.go

timeout /t 2 /nobreak

echo ✅ Servidor iniciado
echo.
echo 🎮 theWall está rodando em http://localhost:8080
echo.
echo Feche a janela do servidor para parar
pause
