# Guia de Desenvolvimento - theWall

## 📋 Arquitetura do Projeto

### Backend (Go)
O servidor backend gerencia:
- **WebSocket**: Comunicação em tempo real com clientes
- **Game State**: Posição de players, objetos, saída
- **Physics**: Colisões e proximidade
- **Broadcasting**: Sincronização entre múltiplos jogadores

### Frontend (React + Three.js)
O cliente renderiza:
- **3D Scene**: Ambiente escuro com Three.js
- **Player Movement**: Controles em primeira pessoa
- **UI/HUD**: Interface de jogo
- **Audio**: Trilha sonora imersiva

## 🔧 Configuração de Desenvolvimento

### 1. Backend Development

```bash
cd backend

# Instalar dependências
go mod download

# Rodar com reload automático (instale air primeiro)
go install github.com/cosmtrek/air@latest
air

# Ou rodar normalmente
go run main.go
```

### 2. Frontend Development

```bash
cd frontend

# Instalar dependências
npm install

# Modo desenvolvimento com hot reload
npm start

# Build para produção
npm run build
```

## 🎨 Personalizações Importantes

### Adicionar Nova Pista/Objeto

Em `backend/main.go`, função `main()`:

```go
gameState.Objects = append(gameState.Objects, GameObject{
    ID:    "hint4",
    Type:  "hint",
    X:     -30,
    Y:     1,
    Z:     -40,
    Info:  "Uma nova descoberta assustadora",
    Found: false,
})
```

Em `frontend/src/components/GameScene.js`, função `createObjects()`:

```javascript
} else if (obj.type === "custom") {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(obj.x, obj.y + 0.5, obj.z);
    scene.add(mesh);
}
```

### Ajustar Atmosfera Escura

Em `GameScene.js`:

```javascript
// Aumentar escuridão
const ambientLight = new THREE.AmbientLight(0x111111, 0.2); // reduzir 0.5 → 0.2

// Ajustar cor da névoa
scene.fog = new THREE.Fog(0x000000, 100, 150); // reduzir distância
```

### Integrar Soundtrack Aphex Twin

1. Coloque arquivo MP3 em `frontend/public/`
2. Em `App.js`, atualize:

```javascript
const ambientSound = new Howl({
    src: ['seu-arquivo.mp3'],
    loop: true,
    volume: 0.3,
});
```

## 🧪 Testes

### Teste Backend

```bash
cd backend

# Teste de conexão WebSocket
go test -v ./...

# Rodar com flags de debug
go run main.go -debug
```

### Teste Frontend

```bash
cd frontend

# Testes unitários
npm test

# Build e servir
npm run build
npx serve -s build
```

## 🐛 Debug

### Backend Debug

Adicione em `main.go`:

```go
import "log"

// Dentro das funções
log.Printf("DEBUG: Player position: %v", player.Position)
```

Execute com logs:
```bash
go run main.go 2>&1 | tee debug.log
```

### Frontend Debug

No console do navegador (F12):
```javascript
// Verificar conexão WebSocket
console.log(ws);

// Verificar state
console.log(gameState);

// Verificar câmera
console.log(cameraRef.current.position);
```

## 📊 Performance

### Otimizações Implementadas

1. **Backend**:
   - Mutex para thread-safety
   - Apenas broadcast quando necessário
   - Pooling de conexões

2. **Frontend**:
   - Shadow mapping otimizado
   - Fog para culling automático
   - Three.js built-in optimizations

### Melhorias Futuras

- [ ] Implementar spatial partitioning (quadtree)
- [ ] Reduzir frequência de updates
- [ ] Usar web workers para cálculos
- [ ] Implementar LOD (Level of Detail)

## 🔐 Segurança

### Considerações

1. Validar todas as mensagens WebSocket
2. Rate limit para evitar spam
3. Sanitizar dados de entrada
4. HTTPS em produção

### Implementar Rate Limiting

```go
type RateLimiter struct {
    limiter map[string]*time.Ticker
}
```

## 📦 Deploy

### Heroku

```bash
heroku create thewall-game
git push heroku main
```

### Docker

```dockerfile
FROM golang:1.21 as builder
WORKDIR /app
COPY . .
RUN go build -o backend backend/main.go

FROM node:18 as frontend
WORKDIR /app
COPY frontend .
RUN npm install && npm run build

FROM golang:1.21
COPY --from=builder /app/backend /app/
COPY --from=frontend /app/build /app/frontend/build/
EXPOSE 8080
CMD ["/app/backend"]
```

## 📚 Recursos Úteis

- [Three.js Documentation](https://threejs.org/docs/)
- [Gorilla WebSocket](https://github.com/gorilla/websocket)
- [React Documentation](https://react.dev/)
- [Howler.js Docs](https://howlerjs.com/)

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit suas mudanças: `git commit -m 'Add minha-feature'`
3. Push: `git push origin feature/minha-feature`
4. Abra um Pull Request

## 📝 Código Style

### Go
- Seguir `gofmt`
- Usar `golint` para linting
- Comentarios em inglês

### JavaScript/React
- Use ESLint (configurado)
- Prettier para formatação
- Componentes funcionais com hooks

---

Bom desenvolvimento! 🎮
