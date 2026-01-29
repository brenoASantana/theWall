# Quickstart - theWall

## 🚀 Começar Rapidamente

### Opção 1: Script Automático (Recomendado)

#### Linux/macOS
```bash
cd /home/user/Coding/Pessoal/theWall
chmod +x dev-start.sh
./dev-start.sh
```

#### Windows
```bash
cd C:\Users\YourName\Coding\Pessoal\theWall
run.bat
```

### Opção 2: Manual

#### Terminal 1 - Backend
```bash
cd backend
go mod download
go run main.go
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm start
```

Acesse: **http://localhost:3000** (desenvolvimento) ou **http://localhost:8080** (produção)

## 🎮 Primeiros Passos

1. **Conectar**: Aguarde o jogo carregar
2. **Mover**: Use W/A/S/D para explorar
3. **Olhar**: Mova o mouse para olhar ao redor
4. **Objetivo**: Encontre a saída (luz verde ao longe)

## 🎵 Adicionar Trilha Sonora

1. Coloque um arquivo MP3 em `frontend/public/`
2. Edite `frontend/src/App.js`:

```javascript
const ambientSound = new Howl({
    src: ['seu-arquivo.mp3'],  // ← Aqui
    loop: true,
    volume: 0.3,
});
```

### Recomendações Aphex Twin
- Windowlicker (Remix)
- Avril 14th (Dark Version)
- Vordhosbn
- Merzbow (Collaboration)

## 🐛 Solucionar Problemas

### Porta 8080 já em uso
```bash
# Encontrar processo usando a porta
lsof -i :8080

# Matar processo
kill -9 <PID>
```

### Erro de permissão no script
```bash
chmod +x dev-start.sh
./dev-start.sh
```

### Áudio não funciona
- Clique no jogo para ativar áudio (requerimento do navegador)
- Verifique o console (F12) para erros

## 📁 Estrutura de Pastas

```
theWall/
├── backend/           # Servidor Go
├── frontend/          # App React
├── config.json        # Configurações
├── README.md          # Documentação
├── DEVELOPMENT.md     # Guia dev
└── run.sh            # Script inicializador
```

## 🔧 Build para Produção

### Frontend
```bash
cd frontend
npm run build
# Saída: build/
```

### Deploy no Heroku
```bash
heroku create thewall-game
git push heroku main
```

## 📚 Recursos

- [Guia Completo](README.md)
- [Desenvolvimento](DEVELOPMENT.md)
- [Three.js](https://threejs.org/)
- [Go WebSockets](https://github.com/gorilla/websocket)

---

**Divirta-se explorando a escuridão! 🎮👻**
