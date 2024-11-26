import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import Menu from './menu';

// Componente para mostrar la tabla de puntajes
function ScoreTable({ scores, onClose }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '10px',
      }}
    >
      <h2>Tabla de Puntajes</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {scores.length > 0 ? (
          scores.map((s, index) => <li key={index}>Jugador {index + 1}: {s} puntos</li>)
        ) : (
          <li>No hay puntajes aún</li>
        )}
      </ul>
      <button
        onClick={onClose}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Volver
      </button>
    </div>
  );
}

// Componente para mostrar el punto de mira
function Crosshair() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '10px',
        height: '10px',
        backgroundColor: 'white',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    />
  );
}

// Componente para mostrar el puntaje actual
function CurrentScore({ score }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        fontSize: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5px 10px',
        borderRadius: '5px',
      }}
    >
      Score: {score}
    </div>
  );
}

function App() {
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const bullets = useRef([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState([]);

  // Función para guardar el puntaje y mostrar la tabla de puntajes
  const saveScoreAndShowTable = useCallback(() => {
    if (score > 0) setScores((prevScores) => [...prevScores, score]);
    setGameStarted(false);
    setShowScores(true);
  }, [score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.rotation.order = 'YXZ';
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const objects = [];
    const cubeVelocities = [];

    const handleKeyDown = (event) => {
        if (event.key === ' ') {
            event.preventDefault();
            if (!isJumping) {
              isJumping = true;
              jumpVelocity = jumpForce;
            }
          }
          if (event.key === 'w') keysPressed.w = true;
          if (event.key === 'a') keysPressed.a = true;
          if (event.key === 's') keysPressed.s = true;
          if (event.key === 'd') keysPressed.d = true;
    
          if (event.key === 'g' || event.key === 'G') {
            if (score > 0) {
              setScores((prevScores) => [...prevScores, score]);
              console.log('Score saved:', score);
            }
          }
    
          // Mostrar la tabla de puntajes con "P"
          if (event.key === 'p' || event.key === 'P') {
            setShowScores(true);
            setGameStarted(false);
            console.log('Showing score table');
          }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'w') keysPressed.w = false;
      if (event.key === 'a') keysPressed.a = false;
      if (event.key === 's') keysPressed.s = false;
      if (event.key === 'd') keysPressed.d = false;
    };

    const onMouseClick = (event) => {
        if (event.button === 0) shootBullet();
    };

    const onMouseMove = (event) => {
      if (!isLocked) return;
      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      camera.rotation.y -= movementX / 500;
      camera.rotation.x -= movementY / 500;
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    };

    const onPointerLockChange = () => {
      setIsLocked(document.pointerLockElement === canvas);
    };

    // Agregar listeners de eventos
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', onMouseClick);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', onMouseClick);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
    };
  }, [isLocked]);

  return (
    <div>
      {/* Menú inicial */}
      {!gameStarted && !showScores && (
        <Menu onStart={() => setGameStarted(true)} onShowScores={() => setShowScores(true)} />
      )}

      {/* Tabla de puntajes */}
      {showScores && <ScoreTable scores={scores} onClose={() => setShowScores(false)} />}

      {/* Canvas del juego */}
      {gameStarted && <canvas ref={canvasRef}></canvas>}

      {/* Punto de mira */}
      {gameStarted && <Crosshair />}

      {/* Puntaje actual */}
      {gameStarted && <CurrentScore score={score} />}
    </div>
  );
}

export default App;
