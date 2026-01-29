import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const GameScene = ({ containerRef, gameState, player, onPlayerMove }) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const playersRef = useRef({});
  const keysPressed = useRef({});
  const playerVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const [exitFound, setExitFound] = useState(false);
  const [nearbyHint, setNearbyHint] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inicializar Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 150, 200);

    // Inicializar Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000,
    );
    camera.position.set(0, 1.6, 0);

    // Inicializar Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0x111111, 0.5);
    scene.add(ambientLight);

    // Luz pontual perto da câmera (lanterna)
    const flashlight = new THREE.PointLight(0xffffff, 1, 100);
    flashlight.position.set(0, 1.6, 0);
    flashlight.castShadow = true;
    flashlight.shadow.mapSize.width = 2048;
    flashlight.shadow.mapSize.height = 2048;
    scene.add(flashlight);

    // Luz ambiente fantasmagórica
    const eerie = new THREE.AmbientLight(0x1a0033, 0.3);
    scene.add(eerie);

    // Construir cenário
    createEnvironment(scene);
    createWall(scene);
    createExit(scene);
    createObjects(scene, gameState.objects);

    // Event listeners
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (e) => {
      if (document.pointerLockElement === renderer.domElement) {
        const moveX = e.movementX;
        const moveY = e.movementY;

        // Rotação horizontal
        camera.rotation.order = "YXZ";
        camera.rotation.y -= moveX * 0.005;
        camera.rotation.x -= moveY * 0.005;

        // Limitar rotação vertical
        const maxVertical = Math.PI / 2;
        if (camera.rotation.x > maxVertical) camera.rotation.x = maxVertical;
        if (camera.rotation.x < -maxVertical) camera.rotation.x = -maxVertical;
      }
    };

    const handleClick = () => {
      renderer.domElement.requestPointerLock();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);

    // Loop de animação
    const animate = () => {
      requestAnimationFrame(animate);

      // Movimento do player
      const speed = 0.15;
      const direction = new THREE.Vector3();
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion,
      );
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(
        camera.quaternion,
      );

      if (keysPressed.current["w"] || keysPressed.current["arrowup"]) {
        direction.add(forward);
      }
      if (keysPressed.current["s"] || keysPressed.current["arrowdown"]) {
        direction.sub(forward);
      }
      if (keysPressed.current["d"] || keysPressed.current["arrowright"]) {
        direction.add(right);
      }
      if (keysPressed.current["a"] || keysPressed.current["arrowleft"]) {
        direction.sub(right);
      }

      direction.normalize();
      direction.multiplyScalar(speed);

      const newPos = new THREE.Vector3().copy(camera.position).add(direction);

      // Verificar colisão com as paredes
      if (
        Math.abs(newPos.x) < 100 &&
        Math.abs(newPos.z) < 100 &&
        newPos.y > 0.5 &&
        newPos.y < 50
      ) {
        camera.position.copy(newPos);
      }

      // Atualizar flashlight
      flashlight.position.copy(camera.position);

      // Enviar posição do player
      onPlayerMove(
        camera.position.x,
        camera.position.y,
        camera.position.z,
        camera.rotation.y,
      );

      // Verificar proximidade com objetos e saída
      checkProximities(camera.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [gameState, player, onPlayerMove]);

  const createEnvironment = (scene) => {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(300, 300);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(300, 300);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.9,
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 100;
    ceiling.receiveShadow = true;
    scene.add(ceiling);
  };

  const createWall = (scene) => {
    // Grande muralha branca ao longe
    const wallGeometry = new THREE.BoxGeometry(200, 100, 5);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x333333,
      roughness: 0.7,
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, 50, -100);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    // Paredes laterais
    const sideWallGeometry = new THREE.BoxGeometry(5, 100, 300);
    const sideWallMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
    });

    const leftWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
    leftWall.position.set(-100, 50, 0);
    leftWall.castShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
    rightWall.position.set(100, 50, 0);
    rightWall.castShadow = true;
    scene.add(rightWall);
  };

  const createExit = (scene) => {
    // Porta/saída
    const exitGeometry = new THREE.BoxGeometry(3, 4, 0.2);
    const exitMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      roughness: 0.3,
    });
    const exit = new THREE.Mesh(exitGeometry, exitMaterial);
    exit.position.set(gameState.exitX, 2, gameState.exitZ);
    exit.castShadow = true;
    scene.add(exit);

    // Aura ao redor da saída
    const auraGeometry = new THREE.SphereGeometry(5, 32, 32);
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.position.set(gameState.exitX, 2, gameState.exitZ);
    scene.add(aura);
  };

  const createObjects = (scene, objects) => {
    objects.forEach((obj) => {
      if (obj.type === "hint") {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshStandardMaterial({
          color: 0x0088ff,
          emissive: 0x0088ff,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(obj.x, obj.y + 0.5, obj.z);
        mesh.castShadow = true;
        mesh.userData.objectId = obj.id;
        mesh.userData.objectInfo = obj.info;
        scene.add(mesh);
      } else if (obj.type === "key") {
        const geometry = new THREE.BoxGeometry(0.3, 0.1, 1);
        const material = new THREE.MeshStandardMaterial({
          color: 0xffff00,
          emissive: 0xffff00,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(obj.x, obj.y, obj.z);
        mesh.castShadow = true;
        mesh.userData.objectId = obj.id;
        mesh.userData.objectInfo = obj.info;
        scene.add(mesh);
      } else if (obj.type === "artifact") {
        const geometry = new THREE.IcosahedronGeometry(0.5, 4);
        const material = new THREE.MeshStandardMaterial({
          color: 0xff00ff,
          emissive: 0xff00ff,
          metalness: 0.8,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(obj.x, obj.y, obj.z);
        mesh.castShadow = true;
        mesh.userData.objectId = obj.id;
        mesh.userData.objectInfo = obj.info;
        scene.add(mesh);
      }
    });
  };

  const checkProximities = (playerPos) => {
    // Verificar saída
    const exitDist = Math.sqrt(
      Math.pow(playerPos.x - gameState.exitX, 2) +
        Math.pow(playerPos.z - gameState.exitZ, 2),
    );

    if (exitDist < 10 && !exitFound) {
      setExitFound(true);
    }

    // Verificar dicas próximas
    const hints = gameState.objects.filter((o) => o.type === "hint");
    let nearestHint = null;
    let minDist = 15;

    hints.forEach((hint) => {
      const dist = Math.sqrt(
        Math.pow(playerPos.x - hint.x, 2) + Math.pow(playerPos.z - hint.z, 2),
      );
      if (dist < minDist) {
        minDist = dist;
        nearestHint = hint;
      }
    });

    if (nearestHint) {
      setNearbyHint(nearestHint);
    } else {
      setNearbyHint(null);
    }
  };

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default GameScene;
