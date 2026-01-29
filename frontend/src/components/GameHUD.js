
const GameHUD = ({ player, connectionStatus }) => {
  if (!player) return null;

  const exitDistance = Math.sqrt(
    Math.pow(player.x - 50, 2) + Math.pow(player.z - 50, 2)
  );

  const formattedDistance = exitDistance.toFixed(1);
  const distancePercent = Math.max(0, Math.min(100, (50 - exitDistance) / 50 * 100));

  return (
    <div className="ui-container">
      {/* Crosshair */}
      <div className="crosshair" />

      {/* HUD inferior esquerdo */}
      <div className="hud">
        <div>SISTEMA: {connectionStatus}</div>
        <div>POSIÇÃO: X:{player.x.toFixed(1)} Z:{player.z.toFixed(1)}</div>
        <div>ALTITUDE: {player.y.toFixed(1)}m</div>
      </div>

      {/* Inventário */}
      <div className="inventory">
        <div className="inventory-title">INVENTÁRIO</div>
        {player.inventory && player.inventory.length > 0 ? (
          player.inventory.map((item, idx) => (
            <div key={idx} className="inventory-item">
              • {item}
            </div>
          ))
        ) : (
          <div className="inventory-item">Vazio</div>
        )}
      </div>

      {/* Indicador de distância da saída */}
      <div className="distance-indicator">
        <div>DISTÂNCIA DA SAÍDA: {formattedDistance}m</div>
        <div className="distance-bar">
          <div
            className="distance-fill"
            style={{ width: `${distancePercent}%` }}
          />
        </div>
      </div>

      {/* Mensagens de dica */}
      {exitDistance < 15 && !player.found && (
        <div className="exit-warning">
          ▼ SAÍDA PRÓXIMA ▼
          <br />
          {formattedDistance}m
        </div>
      )}

      {player.found && (
        <div className="exit-found">
          VOCÊ ESCAPOU!
        </div>
      )}

      {/* Controles */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #fff',
          padding: '15px',
          fontSize: '12px',
          maxWidth: '200px',
        }}
      >
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>CONTROLES</div>
        <div>W/A/S/D - Mover</div>
        <div>Mouse - Olhar</div>
        <div>Clique - Capturar mouse</div>
      </div>
    </div>
  );
};

export default GameHUD;
