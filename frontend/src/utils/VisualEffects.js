import * as THREE from 'three';

export class VisualEffects {
  constructor(scene) {
    this.scene = scene;
    this.postProcessing = null;
  }

  // Adicionar efeito de distorção (aberração cromática)
  addChromaticAberration(camera) {
    // Simular aberração cromática com shaders
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Criar padrão de ruído
    const imageData = ctx.createImageData(512, 512);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.floor(Math.random() * 256);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
      data[i + 3] = 10;
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.repeat.set(2, 2);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
  }

  // Adicionar efeito de luz fantasmagórica
  addGhostlyLights() {
    const lights = [];

    for (let i = 0; i < 3; i++) {
      const light = new THREE.PointLight(0xff00ff, 0.2, 50);
      light.position.set(
        (Math.random() - 0.5) * 100,
        10 + Math.random() * 20,
        (Math.random() - 0.5) * 100
      );
      this.scene.add(light);
      lights.push(light);
    }

    return lights;
  }

  // Animação de luz pulsante
  animatePulsingLight(light, speed = 0.5) {
    let time = 0;
    const animate = () => {
      time += speed;
      light.intensity = Math.sin(time) * 0.15 + 0.15;
      requestAnimationFrame(animate);
    };
    animate();
  }

  // Efeito de tremor de câmera
  applyCameraShake(camera, intensity = 0.1, duration = 100) {
    const originalPosition = camera.position.clone();
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        camera.position.x = originalPosition.x + (Math.random() - 0.5) * intensity;
        camera.position.y = originalPosition.y + (Math.random() - 0.5) * intensity;
        camera.position.z = originalPosition.z + (Math.random() - 0.5) * intensity;
        requestAnimationFrame(shake);
      } else {
        camera.position.copy(originalPosition);
      }
    };

    shake();
  }

  // Efeito de visão distorcida
  applyDistortionEffect(scene) {
    const distortionPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.05,
        wireframe: true,
      })
    );
    distortionPlane.position.z = -50;
    scene.add(distortionPlane);
  }

  // Criar partículas flutuantes (pó/neblina)
  createParticles(count = 100) {
    const particles = new THREE.Group();

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 200,
        Math.random() * 100,
        (Math.random() - 0.5) * 200
      );
      velocities.push(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.05
      );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

    const material = new THREE.PointsMaterial({
      color: 0x444444,
      size: 0.3,
      transparent: true,
      opacity: 0.3,
    });

    const points = new THREE.Points(geometry, material);
    particles.add(points);
    particles.userData = { velocities };

    return particles;
  }

  // Animar partículas
  animateParticles(particles) {
    const positions = particles.children[0].geometry.attributes.position.array;
    const velocities = particles.userData.velocities;

    const animate = () => {
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Resetar partículas que saem do alcance
        if (positions[i + 1] < 0 || positions[i + 1] > 100) {
          positions[i + 1] = 100;
        }
      }

      particles.children[0].geometry.attributes.position.needsUpdate = true;
      requestAnimationFrame(animate);
    };

    animate();
  }

  // Adicionar aberração visual (glitch effect)
  applyGlitchEffect(renderer, intensity = 0.02) {
    setInterval(() => {
      if (Math.random() < 0.1) {
        const offset = Math.random() * intensity;
        renderer.getContext().viewport(
          offset * 100,
          offset * 100,
          renderer.domElement.width,
          renderer.domElement.height
        );

        setTimeout(() => {
          renderer.getContext().viewport(
            0,
            0,
            renderer.domElement.width,
            renderer.domElement.height
          );
        }, 50);
      }
    }, 500);
  }

  // Criar efeito de sobrecarga visual quando próximo à saída
  createExitAura(position) {
    const geometry = new THREE.IcosahedronGeometry(8, 4);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    // Animação de pulsação
    let scale = 1;
    let scaleDirection = 0.01;

    const animate = () => {
      scale += scaleDirection;
      if (scale > 1.5 || scale < 0.5) scaleDirection *= -1;
      mesh.scale.set(scale, scale, scale);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      requestAnimationFrame(animate);
    };

    animate();

    return mesh;
  }
}

export default VisualEffects;
