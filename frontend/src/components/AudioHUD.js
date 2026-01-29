import { useEffect, useState } from 'react';

/**
 * HUD específico para navegação por som (Dark Echo style)
 */
const AudioHUD = ({ player, audioStats, isEchoActive }) => {
  const [frequencyBars, setFrequencyBars] = useState([]);
  const [soundDirection, setSoundDirection] = useState(0);

  useEffect(() => {
    if (!audioStats) return;

    // Atualizar visualização de frequências
    setFrequencyBars(audioStats.frequencies || []);
    setSoundDirection(audioStats.direction || 0);
  }, [audioStats]);

  return (
    <div className="audio-hud">
      {/* Indicador de ecolocação */}
      <div className="echo-indicator">
        <div className={`echo-pulse ${isEchoActive ? 'active' : ''}`}>
          {isEchoActive ? '◉ ECOLOCANDO' : '◯ INATIVO'}
        </div>
      </div>

      {/* Visualizador de som espacial (compass de som) */}
      <div className="sound-compass">
        <svg viewBox="0 0 200 200" width="200" height="200">
          {/* Círculo exterior */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="#0f0" strokeWidth="2" opacity="0.3" />

          {/* Eixos cruciais */}
          <line x1="100" y1="10" x2="100" y2="30" stroke="#0f0" strokeWidth="2" opacity="0.5" />
          <line x1="100" y1="170" x2="100" y2="190" stroke="#0f0" strokeWidth="2" opacity="0.5" />
          <line x1="10" y1="100" x2="30" y2="100" stroke="#0f0" strokeWidth="2" opacity="0.5" />
          <line x1="170" y1="100" x2="190" y2="100" stroke="#0f0" strokeWidth="2" opacity="0.5" />

          {/* Indicador de direção do som */}
          <g transform={`rotate(${soundDirection} 100 100)`}>
            <line x1="100" y1="100" x2="100" y2="40" stroke="#ff0" strokeWidth="3" />
            <polygon points="100,35 95,45 105,45" fill="#ff0" />
          </g>

          {/* Ponto central */}
          <circle cx="100" cy="100" r="8" fill="#0f0" />
        </svg>
      </div>

      {/* Visualizador de frequências */}
      <div className="frequency-analyzer">
        <div className="freq-label">FREQUÊNCIAS</div>
        <div className="freq-bars">
          {frequencyBars.map((freq, idx) => (
            <div
              key={idx}
              className="freq-bar"
              style={{
                height: `${freq * 100}%`,
                backgroundColor: `hsl(${120 + freq * 120}, 100%, 50%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Status de objetos próximos */}
      <div className="nearby-objects">
        <div className="label">PROXIMIDADE</div>
        {player?.nearbyObjects?.map((obj, idx) => (
          <div key={idx} className="object-indicator">
            <div className="distance-text">{obj.type}: {obj.distance.toFixed(1)}m</div>
            <div className="signal-bar">
              <div
                className="signal-fill"
                style={{ width: `${Math.max(0, (100 - obj.distance * 2))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de distância da saída */}
      <div className="exit-proximity">
        <div className="label">SAÍDA</div>
        <div className="distance-meter">
          <div className="meter-text">
            {player?.exitDist ? `${player.exitDist.toFixed(1)}m` : '---'}
          </div>
          <div className="meter-bar">
            <div
              className="meter-fill"
              style={{
                width: `${Math.max(0, player?.exitDist ? (100 - player.exitDist * 2) : 0)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Controles de som */}
      <div className="sound-controls">
        <div className="label">CONTROLES</div>
        <div className="control-info">
          <div>R - Ecolocação</div>
          <div>E - Som guia</div>
          <div>T - Ambiente</div>
        </div>
      </div>

      {/* Inventário (som de objetos) */}
      <div className="sound-inventory">
        <div className="label">OBJETOS ({player?.inventory?.length || 0})</div>
        {player?.inventory?.map((item, idx) => (
          <div key={idx} className="inventory-sound">
            • {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioHUD;
