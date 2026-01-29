# Exemplos de Extensão - theWall

## 🎮 Adicionar Novos Elementos ao Jogo

### 1. Adicionar Inimigo Simples

#### Backend (Go)
```go
// Adicionar ao GameState
type Enemy struct {
    ID       string
    X        float64
    Y        float64
    Z        float64
    Speed    float64
    Behavior string // "patrol" ou "chase"
}

// Em main()
gameState.Enemies = []Enemy{
    {
        ID:       "enemy_1",
        X:        -50,
        Y:        1,
        Z:        -50,
        Speed:    0.05,
        Behavior: "patrol",
    },
}
```

#### Frontend (React/Three.js)
```javascript
// Em GameScene.js, adicione em createEnvironment():
const createEnemies = (scene, enemies) => {
    enemies.forEach((enemy) => {
        const geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(enemy.x, enemy.y, enemy.z);
        mesh.castShadow = true;
        mesh.userData.enemyId = enemy.id;
        scene.add(mesh);
    });
};
```

### 2. Sistema de Puzzle

#### Puzzle: Encontrar Código

```javascript
// Frontend - Adicione ao HUD
class PuzzleSystem {
    constructor() {
        this.currentPuzzle = {
            type: "code",
            hint: "Observe as paredes...",
            code: "1337",
            attempts: 0,
            maxAttempts: 3,
        };
    }

    checkCode(input) {
        if (input === this.currentPuzzle.code) {
            return { solved: true, message: "Correto!" };
        } else {
            this.currentPuzzle.attempts++;
            return {
                solved: false,
                message: `Incorreto (${this.currentPuzzle.attempts}/${this.currentPuzzle.maxAttempts})`
            };
        }
    }
}
```

### 3. Sistema de Objetos Interativos

```javascript
// Frontend
class InteractiveObject {
    constructor(mesh, interaction) {
        this.mesh = mesh;
        this.interaction = interaction;
        this.interacted = false;
    }

    interact(player) {
        if (!this.interacted) {
            this.interacted = true;
            this.interaction(player);
        }
    }
}

// Usar
const mysterialDoor = new InteractiveObject(
    doorMesh,
    (player) => {
        console.log("A porta se abre com um som assustador...");
        audioManager.play('door_open');
    }
);
```

### 4. Adicionar Cutscene

```javascript
class CutsceneManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
    }

    playCutscene(cutsceneData) {
        const actions = cutsceneData.actions;
        let currentAction = 0;

        const executeAction = () => {
            if (currentAction < actions.length) {
                const action = actions[currentAction];

                switch (action.type) {
                    case 'camera_move':
                        this.moveCamera(
                            action.target,
                            action.duration,
                            () => {
                                currentAction++;
                                executeAction();
                            }
                        );
                        break;
                    case 'show_text':
                        this.showText(action.text, action.duration);
                        setTimeout(() => {
                            currentAction++;
                            executeAction();
                        }, action.duration);
                        break;
                    case 'play_sound':
                        audioManager.play(action.sound);
                        currentAction++;
                        executeAction();
                        break;
                }
            }
        };

        executeAction();
    }

    moveCamera(target, duration, onComplete) {
        const start = this.camera.position.clone();
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.camera.position.x = start.x + (target.x - start.x) * progress;
            this.camera.position.y = start.y + (target.y - start.y) * progress;
            this.camera.position.z = start.z + (target.z - start.z) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };

        animate();
    }

    showText(text, duration) {
        const textElement = document.createElement('div');
        textElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 24px;
            font-family: monospace;
            text-align: center;
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border: 2px solid white;
        `;
        textElement.innerText = text;
        document.body.appendChild(textElement);

        setTimeout(() => {
            document.body.removeChild(textElement);
        }, duration);
    }
}

// Usar
const cutscene = new CutsceneManager(camera, camera);
cutscene.playCutscene({
    actions: [
        {
            type: 'show_text',
            text: 'Você não está mais sozinho...',
            duration: 3000
        },
        {
            type: 'camera_move',
            target: { x: 50, y: 5, z: 50 },
            duration: 5000
        },
        {
            type: 'play_sound',
            sound: 'scream'
        },
    ],
});
```

### 5. Efeito de Sombra Dinâmica

```javascript
// Em GameScene.js
const createDynamicShadows = (scene) => {
    // Criar luz que segue o player
    const dynamicLight = new THREE.DirectionalLight(0xffffff, 0.3);
    dynamicLight.castShadow = true;
    dynamicLight.shadow.mapSize.width = 2048;
    dynamicLight.shadow.mapSize.height = 2048;
    scene.add(dynamicLight);

    // Atualizar em loop
    const updateDynamicLight = (playerPos) => {
        dynamicLight.position.set(
            playerPos.x + 20,
            50,
            playerPos.z + 20
        );
        dynamicLight.target.position.copy(playerPos);
        dynamicLight.target.updateMatrixWorld();
    };

    return updateDynamicLight;
};
```

### 6. Sistema de Progressão

```javascript
class GameProgress {
    constructor() {
        this.stats = {
            timeStarted: Date.now(),
            distanceTraveled: 0,
            objectsCollected: [],
            hints: [],
            deaths: 0,
            lastCheckpoint: null,
        };
    }

    updateDistance(previousPos, currentPos) {
        const distance = calculateDistance(previousPos, currentPos);
        this.stats.distanceTraveled += distance;
    }

    collectObject(objectId) {
        if (!this.stats.objectsCollected.includes(objectId)) {
            this.stats.objectsCollected.push(objectId);
            return true;
        }
        return false;
    }

    findHint(hintText) {
        if (!this.stats.hints.includes(hintText)) {
            this.stats.hints.push(hintText);
        }
    }

    getStats() {
        return {
            ...this.stats,
            timeElapsed: Date.now() - this.stats.timeStarted,
            totalObjects: this.stats.objectsCollected.length,
        };
    }

    saveProgress() {
        localStorage.setItem('thewall_progress', JSON.stringify(this.stats));
    }

    loadProgress() {
        const saved = localStorage.getItem('thewall_progress');
        if (saved) {
            this.stats = JSON.parse(saved);
        }
    }
}
```

### 7. Adicionar Pré-carregador

```javascript
class ResourceManager {
    constructor() {
        this.textures = {};
        this.models = {};
        this.sounds = {};
    }

    async preloadAll() {
        const textureLoader = new THREE.TextureLoader();
        const audioLoader = new THREE.AudioLoader();

        // Pré-carregar texturas
        this.textures.dark = await new Promise((resolve) => {
            textureLoader.load('textures/dark.jpg', resolve);
        });

        // Pré-carregar sons
        this.sounds.ambient = new Howl({
            src: ['ambient-horror.mp3'],
            preload: true,
        });

        console.log('Recursos pré-carregados');
    }

    getTexture(name) {
        return this.textures[name];
    }

    getSound(name) {
        return this.sounds[name];
    }
}
```

### 8. Adicionar Respawn/Checkpoint

```javascript
class CheckpointSystem {
    constructor() {
        this.checkpoints = [];
        this.currentCheckpoint = null;
    }

    addCheckpoint(position, name = "Checkpoint") {
        const checkpoint = {
            id: generateUniqueId(),
            name,
            position: position.clone(),
            timestamp: Date.now(),
        };
        this.checkpoints.push(checkpoint);
        this.currentCheckpoint = checkpoint;
        return checkpoint;
    }

    respawnAtCheckpoint() {
        if (this.currentCheckpoint) {
            return this.currentCheckpoint.position;
        }
        return { x: 0, y: 1.6, z: 0 }; // Default spawn
    }

    loadCheckpoint(checkpointId) {
        const checkpoint = this.checkpoints.find((c) => c.id === checkpointId);
        if (checkpoint) {
            this.currentCheckpoint = checkpoint;
            return checkpoint.position;
        }
    }
}
```

## 🚀 Implementar Mudanças

1. **Backend**: Edite `backend/main.go` e adicione estruturas/lógica
2. **Frontend**: Edite `frontend/src/components/GameScene.js` e `App.js`
3. **Teste**: Reinicie servidor e navegador
4. **Sync**: Certifique-se que frontend e backend estão sincronizados

## 📝 Checklist para Novo Feature

- [ ] Definir estrutura de dados (backend)
- [ ] Implementar lógica no servidor (Go)
- [ ] Implementar renderização (Three.js)
- [ ] Sincronizar estado via WebSocket
- [ ] Testar comunicação cliente-servidor
- [ ] Adicionar feedback visual/sonoro
- [ ] Documentar no README
- [ ] Commitar com mensagem clara

---

**Expanda o jogo conforme sua criatividade! 🎮✨**
