// Utilitários gerais do jogo

export const GameConfig = {
  // Mundo
  WORLD_SIZE: 200,
  WORLD_HEIGHT: 100,

  // Player
  PLAYER_HEIGHT: 1.6,
  PLAYER_SPEED: 0.15,
  PLAYER_FRICTION: 0.95,

  // Camera
  FOV: 75,
  NEAR: 0.1,
  FAR: 2000,

  // Iluminação
  FOG_NEAR: 150,
  FOG_FAR: 200,
  AMBIENT_LIGHT: 0x111111,
  AMBIENT_INTENSITY: 0.5,

  // Saída
  EXIT_COLLISION_RADIUS: 2,

  // Objetos
  HINT_COLLISION_RADIUS: 1.5,
  OBJECT_COLLISION_RADIUS: 1.5,

  // Áudio
  AUDIO_MASTER_VOLUME: 0.5,
  AUDIO_AMBIENT_VOLUME: 0.3,
};

// Cálculo de distância 3D
export function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Cálculo de distância 2D (horizontal)
export function calculateDistance2D(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dz * dz);
}

// Verificar colisão entre dois objetos
export function checkCollision(obj1, obj2, radius1 = 0.5, radius2 = 0.5) {
  const distance = calculateDistance(obj1, obj2);
  return distance < radius1 + radius2;
}

// Gerar ID único
export function generateUniqueId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Converter graus para radianos
export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Converter radianos para graus
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Normalizar ângulo para 0-360
export function normalizeAngle(angle) {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

// Lerp (interpolação linear)
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Easing functions
export const Easing = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
};

// Animação com easing
export function animateValue(start, end, duration, callback, easing = Easing.easeInOut) {
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = lerp(start, end, easing(progress));

    callback(value);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}

// Formatador de números
export function formatNumber(num, decimals = 2) {
  return Number(num).toFixed(decimals);
}

// Formatar tempo em MM:SS
export function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Sistema de particulas simples
export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
  }

  emit(position, velocity, lifetime = 1000, color = 0xffffff) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    this.scene.add(mesh);

    const startTime = Date.now();
    const particle = {
      mesh,
      velocity,
      startTime,
      lifetime,
    };

    this.particles.push(particle);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > lifetime) {
        this.scene.remove(mesh);
        this.particles = this.particles.filter((p) => p !== particle);
      } else {
        const progress = elapsed / lifetime;
        mesh.position.add(velocity);
        mesh.material.opacity = 1 - progress;
        mesh.scale.set(1 - progress, 1 - progress, 1 - progress);
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}

// Logger com timestamp
export class GameLogger {
  static log(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`, data);
  }

  static error(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[${timestamp}] ❌ ${message}`, data);
  }

  static warn(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.warn(`[${timestamp}] ⚠️  ${message}`, data);
  }

  static info(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.info(`[${timestamp}] ℹ️  ${message}`, data);
  }
}

// Gerenciador de eventos do jogo
export class EventManager {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }

  clear(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// Sistema de inventário
export class Inventory {
  constructor(maxSlots = 10) {
    this.items = [];
    this.maxSlots = maxSlots;
  }

  add(item) {
    if (this.items.length < this.maxSlots) {
      this.items.push(item);
      return true;
    }
    return false;
  }

  remove(index) {
    if (index >= 0 && index < this.items.length) {
      const item = this.items[index];
      this.items.splice(index, 1);
      return item;
    }
    return null;
  }

  get(index) {
    return this.items[index] || null;
  }

  getAll() {
    return [...this.items];
  }

  clear() {
    this.items = [];
  }

  isFull() {
    return this.items.length >= this.maxSlots;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

export default {
  GameConfig,
  calculateDistance,
  calculateDistance2D,
  checkCollision,
  generateUniqueId,
  degreesToRadians,
  radiansToDegrees,
  normalizeAngle,
  lerp,
  Easing,
  animateValue,
  formatNumber,
  formatTime,
  ParticleSystem,
  GameLogger,
  EventManager,
  Inventory,
};
