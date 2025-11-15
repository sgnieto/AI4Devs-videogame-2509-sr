// Constantes del juego
const GAME_CONFIG = {
    WIDTH: 1200,
    HEIGHT: 800,
    GRAVITY: 600,
    PLAYER_SPEED: 250,
    JUMP_VELOCITY: -500,
    PROJECTILE_SPEED: 400,
    PLAYER_LIVES: 3
};

// Puntuaciones
const SCORES = {
    MONKEY_BASIC: 100,
    MONKEY_FAST: 150,
    MONKEY_STRONG: 200,
    GORILLA_BASE: 500,
    LEVEL_COMPLETE: 1000,
    TIME_BONUS_MULTIPLIER: 10
};

// Tipos de enemigos
const ENEMY_TYPES = {
    MONKEY_BASIC: 'basic',
    MONKEY_FAST: 'fast',
    MONKEY_STRONG: 'strong'
};

// Daño y resistencia
const DAMAGE = {
    PROJECTILE: 1,
    ENEMY_TOUCH: 1
};

const RESISTANCE = {
    MONKEY_BASIC: 1,
    MONKEY_FAST: 1,
    MONKEY_STRONG: 2,
    GORILLA_LEVEL_1: 5,
    GORILLA_LEVEL_2: 7,
    GORILLA_LEVEL_3: 8  // Reducido de 12 a 8 para hacerlo más fácil de matar
};

// Velocidades de enemigos
const ENEMY_SPEEDS = {
    MONKEY_BASIC: 80,
    MONKEY_FAST: 150,
    MONKEY_STRONG: 100,
    GORILLA_LEVEL_1: 100,
    GORILLA_LEVEL_2: 130,
    GORILLA_LEVEL_3: 130  // Reducido de 200 a 130 para hacerlo menos agresivo
};

// Colores
const COLORS = {
    PLAYER: 0xffd700, // Amarillo (plátano)
    MONKEY: 0x8b4513, // Marrón
    GORILLA: 0x2c1810, // Marrón oscuro
    PROJECTILE: 0xffff00, // Amarillo brillante
    PLATFORM: 0x228b22, // Verde jungla
    BACKGROUND: 0x1a4d2e // Verde oscuro
};

