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
  const [connectionStatus, setConnectionStatus] = useState("Iniciando...");
  const [audioStats, setAudioStats] = useState(null);
  const [echoActive, setEchoActive] = useState(false);
  const [darkEchoMode, setDarkEchoMode] = useState(false);
  const soundNavRef = useRef(null);
  const darkEchoRef = useRef(null);

  useEffect(() => {
    // Inicializar jogo local (sem servidor)
    console.log("Inicializando jogo local...");
    setConnectionStatus("Modo Local");

    // Criar jogador e estado inicial
    const initialPlayer = {
      id: "local-player",
      x: 0,
      y: 1.6,
      z: 0,
      rotY: 0,
    };

    const initialGameState = {
      players: {},
      exitX: 50,
      exitZ: 50,
      objects: [],
    };

    setPlayer(initialPlayer);
    setGameState(initialGameState);
    initializeAudio();
  }, []);

  const handleExitFound = (msg) => {
    // Exibir mensagem de vitória
    console.log("VOCÊ ENCONTROU A SAÍDA!");
    alert("🎉 PARABÉNS! VOCÊ ENCONTROU A SAÍDA!");
  };

  const initializeAudio = () => {
    // Inicializar áudio ambiente (opcional)
    try {
      const ambientSound = new Howl({
        src: ["ambient-horror.mp3"],
        loop: true,
        volume: 0.3,
      });
      ambientSound.play();
    } catch (error) {
      console.log("Áudio ambiente não disponível");
    }
  };

  const sendPlayerUpdate = (x, y, z, rotY) => {
    // Modo local - apenas atualizar estado local
    if (player) {
      setPlayer({ ...player, x, y, z, rotY });
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
          <p className="subtitle">Preparando ambiente...</p>
        </div>
      )}
    </div>
  );
}

export default App;
