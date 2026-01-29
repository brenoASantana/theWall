package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Player struct {
	ID        string   `json:"id"`
	X         float64  `json:"x"`
	Y         float64  `json:"y"`
	Z         float64  `json:"z"`
	RotY      float64  `json:"rotY"`
	Found     bool     `json:"found"`
	ExitDist  float64  `json:"exitDist"`
	Inventory []string `json:"inventory"`
}

type GameState struct {
	Players   map[string]*Player `json:"players"`
	ExitX     float64            `json:"exitX"`
	ExitY     float64            `json:"exitY"`
	ExitZ     float64            `json:"exitZ"`
	ExitFound bool               `json:"exitFound"`
	Objects   []GameObject       `json:"objects"`
}

type GameObject struct {
	ID    string  `json:"id"`
	Type  string  `json:"type"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
	Z     float64 `json:"z"`
	Info  string  `json:"info"`
	Found bool    `json:"found"`
}

type Message struct {
	Type     string          `json:"type"`
	PlayerID string          `json:"playerId"`
	X        float64         `json:"x"`
	Y        float64         `json:"y"`
	Z        float64         `json:"z"`
	RotY     float64         `json:"rotY"`
	Data     json.RawMessage `json:"data"`
}

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	gameState = GameState{
		Players:   make(map[string]*Player),
		ExitX:     50,
		ExitY:     1,
		ExitZ:     50,
		ExitFound: false,
		Objects: []GameObject{
			{ID: "hint1", Type: "hint", X: 20, Y: 1, Z: 20, Info: "A muralha branca ao longe... há algo lá", Found: false},
			{ID: "hint2", Type: "hint", X: 45, Y: 1, Z: 10, Info: "Os sussurros ecoam mais forte", Found: false},
			{ID: "hint3", Type: "hint", X: 50, Y: 1, Z: 55, Info: "A saída está perto... você consegue ouvi-la", Found: false},
			{ID: "key1", Type: "key", X: 30, Y: 0.5, Z: 35, Info: "Você encontrou uma chave antiga", Found: false},
			{ID: "artifact", Type: "artifact", X: 50, Y: 2, Z: 50, Info: "Um artefato antigo brilha fracamente", Found: false},
		},
	}
	clientsMutex sync.RWMutex
	clients      = make(map[*websocket.Conn]string)
)

func handleWS(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Erro ao fazer upgrade:", err)
		return
	}
	defer ws.Close()

	playerID := fmt.Sprintf("player_%d", time.Now().UnixNano())
	player := &Player{
		ID:        playerID,
		X:         0,
		Y:         1,
		Z:         0,
		RotY:      0,
		Found:     false,
		Inventory: []string{},
	}

	clientsMutex.Lock()
	clients[ws] = playerID
	gameState.Players[playerID] = player
	clientsMutex.Unlock()

	// Enviar estado inicial
	initialState := map[string]interface{}{
		"type":      "init",
		"player":    player,
		"gameState": gameState,
		"music":     "ambient-horror",
	}
	ws.WriteJSON(initialState)

	// Broadcast novo jogador
	broadcastPlayerJoined(player)

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			handleDisconnect(ws, playerID)
			return
		}

		handleMessage(&msg, ws, playerID)
	}
}

func handleMessage(msg *Message, ws *websocket.Conn, playerID string) {
	clientsMutex.Lock()
	player, exists := gameState.Players[playerID]
	clientsMutex.Unlock()

	if !exists {
		return
	}

	switch msg.Type {
	case "move":
		player.X = msg.X
		player.Y = msg.Y
		player.Z = msg.Z
		player.RotY = msg.RotY

		// Verificar coleta de objetos
		checkObjectCollision(playerID, player)

		// Verificar saída
		dist := math.Sqrt(math.Pow(player.X-gameState.ExitX, 2) + math.Pow(player.Z-gameState.ExitZ, 2))
		player.ExitDist = dist

		if dist < 2 && !player.Found {
			player.Found = true
			broadcastExit(playerID)
		}

		broadcastPlayerMove(player)

	case "interact":
		// Lógica de interação
		handleInteraction(playerID, player)
	}
}

func checkObjectCollision(playerID string, player *Player) {
	for i := range gameState.Objects {
		obj := &gameState.Objects[i]
		if !obj.Found {
			dist := math.Sqrt(math.Pow(player.X-obj.X, 2) + math.Pow(player.Z-obj.Z, 2))
			if dist < 1.5 {
				obj.Found = true
				player.Inventory = append(player.Inventory, obj.ID)
				broadcastObjectFound(obj, playerID)
			}
		}
	}
}

func handleInteraction(playerID string, player *Player) {
	// Lógica de interação com o mundo
}

func handleDisconnect(ws *websocket.Conn, playerID string) {
	clientsMutex.Lock()
	delete(clients, ws)
	delete(gameState.Players, playerID)
	clientsMutex.Unlock()

	broadcastPlayerLeft(playerID)
}

func broadcastPlayerMove(player *Player) {
	clientsMutex.RLock()
	defer clientsMutex.RUnlock()

	msg := map[string]interface{}{
		"type":   "playerMove",
		"player": player,
	}

	for ws := range clients {
		ws.WriteJSON(msg)
	}
}

func broadcastPlayerJoined(player *Player) {
	clientsMutex.RLock()
	defer clientsMutex.RUnlock()

	msg := map[string]interface{}{
		"type":   "playerJoined",
		"player": player,
	}

	for ws := range clients {
		ws.WriteJSON(msg)
	}
}

func broadcastPlayerLeft(playerID string) {
	clientsMutex.RLock()
	defer clientsMutex.RUnlock()

	msg := map[string]interface{}{
		"type":     "playerLeft",
		"playerId": playerID,
	}

	for ws := range clients {
		ws.WriteJSON(msg)
	}
}

func broadcastObjectFound(obj *GameObject, playerID string) {
	clientsMutex.RLock()
	defer clientsMutex.RUnlock()

	msg := map[string]interface{}{
		"type":     "objectFound",
		"object":   obj,
		"playerId": playerID,
	}

	for ws := range clients {
		ws.WriteJSON(msg)
	}
}

func broadcastExit(playerID string) {
	clientsMutex.RLock()
	defer clientsMutex.RUnlock()

	msg := map[string]interface{}{
		"type":     "exitFound",
		"playerId": playerID,
		"message":  "VOCÊ ENCONTROU A SAÍDA!",
	}

	for ws := range clients {
		ws.WriteJSON(msg)
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())

	http.HandleFunc("/ws", handleWS)
	http.Handle("/", http.FileServer(http.Dir("../frontend/build")))

	fmt.Println("🎮 Servidor theWall rodando em :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
