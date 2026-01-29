import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import AudioHUD from "./components/AudioHUD";
import GameHUD from "./components/GameHUD";
import GameScene from "./components/GameScene";

function App() {
  const containerRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [player, setPlayer] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Conectando...");
  const [audioStats, setAudioStats] = useState(null);
  const [echoActive, setEchoActive] = useState(false);
  const [darkEchoMode, setDarkEchoMode] = useState(false);
  const wsRef = useRef(null);
  const soundNavRef = useRef(null);
  const darkEchoRef = useRef(null);

  useEffect(() => {
    // Conectar ao servidor WebSocket LOCAL
    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => {
      console.log("Conectado ao servidor local");
      setConnectionStatus("Conectado");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      handleServerMessage(msg);
    };

    ws.onerror = (error) => {
      console.error("Erro WebSocket:", error);
      setConnectionStatus("Erro de conexão - Servidor rodando?");
    };

    ws.onclose = () => {
      console.log("Desconectado do servidor");
      setConnectionStatus("Desconectado");
    };

    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleServerMessage = (msg) => {
    switch (msg.type) {
      case "init":
        setPlayer(msg.player);
        setGameState(msg.gameState);
        initializeAudio(msg.music);
        break;
      case "playerMove":
        // Atualizar estado de outro jogador
        break;
      case "exitFound":
        handleExitFound(msg);
        break;
      case "objectFound":
        // Objeto coletado
        break;
      default:
        break;
    }
  };

  const handleExitFound = (msg) => {
    // Exibir mensagem de vitória
    console.log(msg.message);
  };

  const initializeAudio = (musicType) => {
    // Inicializar áudio ambiente
    const ambientSound = new Howl({
      src: ["ambient-horror.mp3"],
      loop: true,
      volume: 0.3,
    });
    ambientSound.play();
  };

  const sendPlayerUpdate = (x, y, z, rotY) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "move",
          x,
          y,
          z,
          rotY,
        }),
      );
    }
  };

  return (
    <div className="App">
      {gameState && player ? (
        <>
          <GameScene
            containerRef={containerRef}
            gameState={gameState}
            player={player}
            onPlayerMove={sendPlayerUpdate}
            soundNavRef={soundNavRef}
            darkEchoRef={darkEchoRef}
            onDarkEchoToggle={(active) => setDarkEchoMode(active)}
            onAudioStatsUpdate={setAudioStats}
            onEchoActiveChange={setEchoActive}
          />
          {!darkEchoMode && (
            <GameHUD player={player} connectionStatus={connectionStatus} />
          )}
          {darkEchoMode && (
            <AudioHUD
              player={player}
              audioStats={audioStats}
              isEchoActive={echoActive}
            />
          )}
        </>
      ) : (
        <div className="loading-screen">
          <h1>theWall</h1>
          <p>{connectionStatus}</p>
          <p className="subtitle">Explorando a escuridão...</p>
        </div>
      )}
    </div>
  );
}

export default App;
