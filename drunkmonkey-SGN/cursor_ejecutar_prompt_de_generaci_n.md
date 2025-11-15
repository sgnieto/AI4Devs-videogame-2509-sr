# Ejecutar prompt de generación
_Exported on 11/15/2025 at 14:43:49 GMT+1 from Cursor (2.0.75)_

---

**User**

Ejecuta el prompt @prompt-generacion.md 

---

**Cursor**

Revisando la estructura del proyecto y creando los archivos necesarios según las especificaciones.


Creando la estructura del juego según las especificaciones. Organizando las tareas e implementando los archivos necesarios.


```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plátano Borracho vs Monos</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="game-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
    <script src="js/utils/constants.js"></script>
    <script src="js/utils/helpers.js"></script>
    <script src="js/entities/Projectile.js"></script>
    <script src="js/entities/Player.js"></script>
    <script src="js/entities/Monkey.js"></script>
    <script src="js/entities/Gorilla.js"></script>
    <script src="js/scenes/MenuScene.js"></script>
    <script src="js/scenes/GameScene.js"></script>
    <script src="js/scenes/GameOverScene.js"></script>
    <script src="js/scenes/VictoryScene.js"></script>
    <script src="js/main.js"></script>
</body>
</html>

```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
}

#game-container {
    border: 3px solid #ffd700;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    background: #000;
}

/* Estilos para el canvas de Phaser */
canvas {
    display: block;
    margin: 0 auto;
}

```

Creando los archivos de utilidades y constantes:


```javascript
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
    GORILLA_LEVEL_2: 8,
    GORILLA_LEVEL_3: 12
};

// Velocidades de enemigos
const ENEMY_SPEEDS = {
    MONKEY_BASIC: 80,
    MONKEY_FAST: 150,
    MONKEY_STRONG: 100,
    GORILLA_LEVEL_1: 100,
    GORILLA_LEVEL_2: 150,
    GORILLA_LEVEL_3: 200
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

```

```javascript
// Funciones auxiliares

/**
 * Crea un sprite simple usando Phaser Graphics
 */
function createSimpleSprite(scene, x, y, width, height, color, shape = 'rectangle') {
    const graphics = scene.add.graphics();
    
    graphics.fillStyle(color);
    
    if (shape === 'rectangle') {
        graphics.fillRect(0, 0, width, height);
    } else if (shape === 'circle') {
        graphics.fillCircle(width / 2, height / 2, width / 2);
    }
    
    const texture = graphics.generateTexture(shape + '_' + color.toString(16), width, height);
    graphics.destroy();
    
    return scene.add.image(x, y, texture);
}

/**
 * Calcula la distancia entre dos puntos
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Genera un número aleatorio entre min y max
 */
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Formatea el tiempo en formato MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

```

Creando las entidades del juego:


```javascript
class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        // Crear sprite simple si no hay textura
        const graphics = scene.add.graphics();
        graphics.fillStyle(COLORS.PROJECTILE);
        graphics.fillCircle(0, 0, 8);
        const texture = graphics.generateTexture('projectile', 16, 16);
        graphics.destroy();
        
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.direction = direction; // 1 para derecha, -1 para izquierda
        this.speed = GAME_CONFIG.PROJECTILE_SPEED;
        
        // Configurar física
        this.body.setSize(12, 12);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        
        // Velocidad inicial
        this.setVelocityX(this.speed * this.direction);
        
        // Destruir al salir de los límites
        scene.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this) {
                this.destroy();
            }
        });
    }
    
    update() {
        // El proyectil se mueve automáticamente
        // Se destruye al colisionar con plataformas o enemigos
    }
}

```

```javascript
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Crear sprite del plátano borracho
        const graphics = scene.add.graphics();
        graphics.fillStyle(COLORS.PLAYER);
        graphics.fillRoundedRect(0, 0, 40, 60, 10);
        // Ojos
        graphics.fillStyle(0x000000);
        graphics.fillCircle(10, 20, 4);
        graphics.fillCircle(30, 20, 4);
        // Boca
        graphics.fillStyle(0xff6347);
        graphics.fillEllipse(20, 35, 15, 10);
        const texture = graphics.generateTexture('player', 40, 60);
        graphics.destroy();
        
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propiedades del jugador
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.isAlive = true;
        this.facingRight = true;
        this.canJump = true;
        this.isJumping = false;
        this.invulnerable = false;
        this.hasArmor = true; // Piel del plátano
        
        // Configurar física
        this.body.setSize(35, 55);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        
        // Efecto de tambaleo borracho
        this.drunkOffset = 0;
        this.drunkSpeed = 0.05;
        
        // Tiempo de invulnerabilidad después de recibir daño
        this.invulnerableTime = 0;
        this.invulnerableDuration = 2000; // 2 segundos
        
        // Referencia a la escena para crear proyectiles
        this.scene = scene;
    }
    
    update(cursors, time) {
        if (!this.isAlive) return;
        
        // Actualizar invulnerabilidad
        if (this.invulnerable) {
            this.invulnerableTime -= time;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
                this.setAlpha(1);
            } else {
                // Efecto de parpadeo
                this.setAlpha((Math.sin(time * 0.02) + 1) / 2);
            }
        }
        
        // Movimiento horizontal
        let horizontalVelocity = 0;
        
        if (cursors.left.isDown || cursors.a.isDown) {
            horizontalVelocity = -GAME_CONFIG.PLAYER_SPEED;
            this.facingRight = false;
        } else if (cursors.right.isDown || cursors.d.isDown) {
            horizontalVelocity = GAME_CONFIG.PLAYER_SPEED;
            this.facingRight = true;
        }
        
        this.setVelocityX(horizontalVelocity);
        
        // Salto
        if ((cursors.up.isDown || cursors.w.isDown || cursors.space.isDown) && this.canJump && !this.isJumping) {
            this.jump();
        }
        
        // Verificar si está en el suelo
        if (this.body.onFloor()) {
            this.canJump = true;
            this.isJumping = false;
        } else {
            this.isJumping = true;
        }
        
        // Efecto de tambaleo borracho
        this.drunkOffset += this.drunkSpeed;
        const drunkRotation = Math.sin(this.drunkOffset) * 0.1; // Rotación suave
        this.setRotation(drunkRotation);
        
        // Movimiento lateral sutil del tambaleo
        if (horizontalVelocity === 0) {
            const drunkX = Math.sin(this.drunkOffset * 2) * 2;
            this.setX(this.x + drunkX);
        }
    }
    
    jump() {
        if (this.canJump && !this.isJumping) {
            this.setVelocityY(GAME_CONFIG.JUMP_VELOCITY);
            this.canJump = false;
            this.isJumping = true;
        }
    }
    
    throwProjectile() {
        if (!this.isAlive) return null;
        
        const direction = this.facingRight ? 1 : -1;
        const offsetX = this.facingRight ? 30 : -30;
        const projectile = new Projectile(this.scene, this.x + offsetX, this.y, direction);
        
        return projectile;
    }
    
    takeDamage() {
        if (this.invulnerable || !this.isAlive) return;
        
        this.lives--;
        this.invulnerable = true;
        this.invulnerableTime = this.invulnerableDuration;
        
        // Perder armadura (piel del plátano)
        if (this.hasArmor) {
            this.hasArmor = false;
            // Cambiar color a más claro (plátano sin piel)
            this.setTint(0xffffcc);
        }
        
        if (this.lives <= 0) {
            this.die();
        }
    }
    
    die() {
        this.isAlive = false;
        this.setVelocity(0, 0);
        this.setTint(0x666666); // Gris cuando muere
    }
    
    reset(x, y) {
        this.setPosition(x, y);
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.isAlive = true;
        this.hasArmor = true;
        this.invulnerable = false;
        this.setAlpha(1);
        this.clearTint();
        this.setVelocity(0, 0);
    }
}

```

```javascript
class Monkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = ENEMY_TYPES.MONKEY_BASIC) {
        // Crear sprite del mono según el tipo
        const graphics = scene.add.graphics();
        const size = type === ENEMY_TYPES.MONKEY_STRONG ? 50 : 40;
        const color = type === ENEMY_TYPES.MONKEY_STRONG ? 0x654321 : COLORS.MONKEY;
        
        graphics.fillStyle(color);
        graphics.fillCircle(size / 2, size / 2, size / 2);
        // Ojos
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(size / 2 - 8, size / 2 - 5, 6);
        graphics.fillCircle(size / 2 + 8, size / 2 - 5, 6);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(size / 2 - 8, size / 2 - 5, 3);
        graphics.fillCircle(size / 2 + 8, size / 2 - 5, 3);
        // Boca
        graphics.fillStyle(0x000000);
        graphics.fillEllipse(size / 2, size / 2 + 8, 12, 8);
        
        const texture = graphics.generateTexture('monkey_' + type, size, size);
        graphics.destroy();
        
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.type = type;
        this.isAlive = true;
        this.direction = Math.random() > 0.5 ? 1 : -1; // Dirección aleatoria inicial
        this.detectionRange = 200; // Rango de detección del jugador
        this.resistance = this.getResistance();
        this.speed = this.getSpeed();
        
        // Configurar física
        this.body.setSize(size - 5, size - 5);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        this.body.setVelocityX(this.speed * this.direction);
        
        // Cambiar dirección al tocar bordes
        this.body.onWorldBounds = true;
        scene.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this && (event.body.blocked.left || event.body.blocked.right)) {
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction);
            }
        });
    }
    
    getResistance() {
        switch (this.type) {
            case ENEMY_TYPES.MONKEY_BASIC:
                return RESISTANCE.MONKEY_BASIC;
            case ENEMY_TYPES.MONKEY_FAST:
                return RESISTANCE.MONKEY_FAST;
            case ENEMY_TYPES.MONKEY_STRONG:
                return RESISTANCE.MONKEY_STRONG;
            default:
                return 1;
        }
    }
    
    getSpeed() {
        switch (this.type) {
            case ENEMY_TYPES.MONKEY_BASIC:
                return ENEMY_SPEEDS.MONKEY_BASIC;
            case ENEMY_TYPES.MONKEY_FAST:
                return ENEMY_SPEEDS.MONKEY_FAST;
            case ENEMY_TYPES.MONKEY_STRONG:
                return ENEMY_SPEEDS.MONKEY_STRONG;
            default:
                return 80;
        }
    }
    
    update(player) {
        if (!this.isAlive) return;
        
        // Detectar jugador cercano
        if (player && player.isAlive) {
            const distanceToPlayer = Phaser.Math.Distance.Between(
                this.x, this.y, player.x, player.y
            );
            
            if (distanceToPlayer < this.detectionRange) {
                // Moverse hacia el jugador
                if (player.x > this.x) {
                    this.direction = 1;
                } else {
                    this.direction = -1;
                }
            }
        }
        
        // Aplicar velocidad
        this.body.setVelocityX(this.speed * this.direction);
        
        // Voltear sprite según dirección
        if (this.direction > 0) {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }
    }
    
    takeDamage() {
        this.resistance--;
        if (this.resistance <= 0) {
            this.die();
            return true; // Enemigo derrotado
        }
        return false; // Aún vivo
    }
    
    die() {
        this.isAlive = false;
        // Efecto visual de muerte
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.destroy();
        });
    }
    
    getScore() {
        switch (this.type) {
            case ENEMY_TYPES.MONKEY_BASIC:
                return SCORES.MONKEY_BASIC;
            case ENEMY_TYPES.MONKEY_FAST:
                return SCORES.MONKEY_FAST;
            case ENEMY_TYPES.MONKEY_STRONG:
                return SCORES.MONKEY_STRONG;
            default:
                return 100;
        }
    }
}

```

```javascript
class Gorilla extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, level = 1) {
        // Crear sprite del gorila (más grande y oscuro)
        const graphics = scene.add.graphics();
        const size = 80 + (level * 10); // Más grande según el nivel
        
        graphics.fillStyle(COLORS.GORILLA);
        graphics.fillRoundedRect(0, 0, size, size, 15);
        // Ojos rojos (más agresivos)
        graphics.fillStyle(0xff0000);
        graphics.fillCircle(size / 2 - 15, size / 2 - 10, 8);
        graphics.fillCircle(size / 2 + 15, size / 2 - 10, 8);
        // Boca
        graphics.fillStyle(0x000000);
        graphics.fillEllipse(size / 2, size / 2 + 15, 20, 15);
        // Pecho más claro
        graphics.fillStyle(0x3d2817);
        graphics.fillEllipse(size / 2, size / 2 + 5, 30, 25);
        
        const texture = graphics.generateTexture('gorilla_' + level, size, size);
        graphics.destroy();
        
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.level = level;
        this.isAlive = true;
        this.direction = -1; // Empieza moviéndose a la izquierda
        this.resistance = this.getResistance();
        this.maxResistance = this.resistance;
        this.speed = this.getSpeed();
        this.attackCooldown = 0;
        this.attackInterval = 2000 + (level * 500); // Más rápido en niveles altos
        
        // Configurar física
        this.body.setSize(size - 10, size - 10);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        this.body.setVelocityX(this.speed * this.direction);
        
        // Barra de vida
        this.createHealthBar(scene);
        
        // Cambiar dirección al tocar bordes
        this.body.onWorldBounds = true;
        scene.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this && (event.body.blocked.left || event.body.blocked.right)) {
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction);
            }
        });
    }
    
    getResistance() {
        switch (this.level) {
            case 1:
                return RESISTANCE.GORILLA_LEVEL_1;
            case 2:
                return RESISTANCE.GORILLA_LEVEL_2;
            case 3:
                return RESISTANCE.GORILLA_LEVEL_3;
            default:
                return RESISTANCE.GORILLA_LEVEL_1 + (this.level - 1) * 3;
        }
    }
    
    getSpeed() {
        switch (this.level) {
            case 1:
                return ENEMY_SPEEDS.GORILLA_LEVEL_1;
            case 2:
                return ENEMY_SPEEDS.GORILLA_LEVEL_2;
            case 3:
                return ENEMY_SPEEDS.GORILLA_LEVEL_3;
            default:
                return ENEMY_SPEEDS.GORILLA_LEVEL_1 + (this.level - 1) * 50;
        }
    }
    
    createHealthBar(scene) {
        // Fondo de la barra
        this.healthBarBg = scene.add.rectangle(this.x, this.y - 60, 100, 10, 0x000000);
        this.healthBarBg.setDepth(100);
        this.healthBarBg.setScrollFactor(0);
        
        // Barra de vida
        this.healthBar = scene.add.rectangle(this.x, this.y - 60, 100, 8, 0xff0000);
        this.healthBar.setDepth(101);
        this.healthBar.setScrollFactor(0);
    }
    
    update(player, time) {
        if (!this.isAlive) return;
        
        // Actualizar posición de la barra de vida
        this.healthBarBg.setPosition(this.x, this.y - 60);
        this.healthBar.setPosition(this.x - 50 + (this.resistance / this.maxResistance * 50), this.y - 60);
        this.healthBar.width = (this.resistance / this.maxResistance) * 100;
        
        // Movimiento hacia el jugador
        if (player && player.isAlive) {
            if (player.x > this.x + 50) {
                this.direction = 1;
            } else if (player.x < this.x - 50) {
                this.direction = -1;
            }
        }
        
        // Aplicar velocidad con patrón más complejo
        const baseSpeed = this.speed * this.direction;
        // Movimiento con patrón sinusoidal para hacerlo más impredecible
        const patternOffset = Math.sin(time * 0.001) * 20;
        this.body.setVelocityX(baseSpeed + patternOffset);
        
        // Voltear sprite según dirección
        if (this.direction > 0) {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }
        
        // Ataque periódico
        this.attackCooldown -= time;
        if (this.attackCooldown <= 0 && player && player.isAlive) {
            this.attack(player);
            this.attackCooldown = this.attackInterval;
        }
    }
    
    attack(player) {
        // El gorila puede lanzar proyectiles o cargar
        // Por simplicidad, aquí solo cambia de dirección rápidamente
        // En una versión más avanzada, podría lanzar proyectiles
        this.direction *= -1;
        this.body.setVelocityX(this.speed * this.direction * 1.5); // Carga rápida
    }
    
    takeDamage() {
        this.resistance--;
        if (this.resistance <= 0) {
            this.die();
            return true; // Gorila derrotado
        }
        return false; // Aún vivo
    }
    
    die() {
        this.isAlive = false;
        // Destruir barra de vida
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        
        // Efecto visual de muerte
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.destroy();
        });
    }
    
    getScore() {
        return SCORES.GORILLA_BASE * this.level;
    }
}

```

Creando las escenas del juego:


```javascript
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
            .setOrigin(0, 0);
        
        // Título del juego
        const titleStyle = {
            fontSize: '64px',
            fontFamily: 'Arial',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 5,
                stroke: true,
                fill: true
            }
        };
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 150, 'PLÁTANO BORRACHO', titleStyle)
            .setOrigin(0.5);
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 220, 'VS MONOS', {
            ...titleStyle,
            fontSize: '48px'
        }).setOrigin(0.5);
        
        // Botón Jugar
        const playButton = this.add.rectangle(GAME_CONFIG.WIDTH / 2, 400, 300, 80, 0x228b22)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('GameScene', { level: 1, score: 0, lives: GAME_CONFIG.PLAYER_LIVES });
            })
            .on('pointerover', () => {
                playButton.setFillStyle(0x32cd32);
            })
            .on('pointerout', () => {
                playButton.setFillStyle(0x228b22);
            });
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 400, 'JUGAR', {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Instrucciones
        const instructionsStyle = {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            align: 'center'
        };
        
        const instructions = [
            'CONTROLES:',
            'A/D o ←/→ : Mover',
            'W o ↑ : Saltar',
            'J o Espacio : Lanzar proyectil',
            '',
            'Derrota a los monos y enfrenta',
            'a los poderosos gorilas jefe!'
        ];
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 550, instructions, instructionsStyle)
            .setOrigin(0.5);
        
        // Efecto de fondo animado (monos moviéndose)
        this.createAnimatedBackground();
    }
    
    createAnimatedBackground() {
        // Crear algunos monos decorativos en el fondo
        for (let i = 0; i < 5; i++) {
            const monkey = this.add.circle(
                Math.random() * GAME_CONFIG.WIDTH,
                Math.random() * GAME_CONFIG.HEIGHT,
                20,
                COLORS.MONKEY,
                0.3
            );
            
            this.tweens.add({
                targets: monkey,
                x: Math.random() * GAME_CONFIG.WIDTH,
                y: Math.random() * GAME_CONFIG.HEIGHT,
                duration: 3000 + Math.random() * 2000,
                repeat: -1,
                yoyo: true
            });
        }
    }
}

```

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
            .setOrigin(0, 0);
        
        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador
        this.player = new Player(this, 100, 100);
        
        // Grupos de objetos
        this.monkeys = this.physics.add.group();
        this.gorillas = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Crear gorila jefe
        this.boss = new Gorilla(this, GAME_CONFIG.WIDTH * 2.5, 200, this.level);
        this.gorillas.add(this.boss);
        
        // Colisiones
        this.setupCollisions();
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        
        // Cámara
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 300; // 300ms entre proyectiles
    }
    
    createPlatforms() {
        // Plataformas del nivel
        const platformData = [
            { x: 0, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.8, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 1.2, y: GAME_CONFIG.HEIGHT - 200, width: GAME_CONFIG.WIDTH * 0.4 },
            { x: GAME_CONFIG.WIDTH * 1.6, y: GAME_CONFIG.HEIGHT - 100, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.0, y: GAME_CONFIG.HEIGHT - 250, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.4 } // Plataforma del jefe
        ];
        
        platformData.forEach(platform => {
            const plat = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y,
                platform.width,
                30,
                COLORS.PLATFORM
            );
            this.physics.add.existing(plat, true);
            this.platforms.add(plat);
        });
    }
    
    createEnemies() {
        // Crear monos según el nivel
        const monkeyCount = 3 + this.level * 2;
        const monkeyPositions = [
            { x: GAME_CONFIG.WIDTH * 0.2, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 0.6, y: GAME_CONFIG.HEIGHT - 300 },
            { x: GAME_CONFIG.WIDTH * 1.0, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 1.4, y: GAME_CONFIG.HEIGHT - 350 },
            { x: GAME_CONFIG.WIDTH * 1.8, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 2.2, y: GAME_CONFIG.HEIGHT - 400 }
        ];
        
        for (let i = 0; i < Math.min(monkeyCount, monkeyPositions.length); i++) {
            const pos = monkeyPositions[i];
            let type = ENEMY_TYPES.MONKEY_BASIC;
            
            // Variar tipos según el nivel
            if (this.level >= 2 && i % 3 === 0) {
                type = ENEMY_TYPES.MONKEY_FAST;
            } else if (this.level >= 3 && i % 4 === 0) {
                type = ENEMY_TYPES.MONKEY_STRONG;
            }
            
            const monkey = new Monkey(this, pos.x, pos.y, type);
            this.monkeys.add(monkey);
        }
    }
    
    setupCollisions() {
        // Jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Enemigos con plataformas
        this.physics.add.collider(this.monkeys, this.platforms);
        this.physics.add.collider(this.gorillas, this.platforms);
        
        // Proyectiles con plataformas
        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        
        // Proyectiles con enemigos
        this.physics.add.overlap(this.projectiles, this.monkeys, (projectile, monkey) => {
            projectile.destroy();
            if (monkey.takeDamage()) {
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            if (gorilla.takeDamage()) {
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Jugador con enemigos
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
        
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD
        const hudBg = this.add.rectangle(10, 10, 300, 100, 0x000000, 0.7);
        hudBg.setOrigin(0, 0);
        this.hudContainer.add(hudBg);
        
        // Textos del HUD
        this.scoreText = this.add.text(20, 20, `Puntuación: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.hudContainer.add(this.scoreText);
        
        this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff0000'
        });
        this.hudContainer.add(this.livesText);
        
        this.levelText = this.add.text(20, 80, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles
        if ((this.cursors.j.isDown || this.cursors.space.isDown) && 
            time - this.lastProjectileTime > this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
            }
        }
        
        // Actualizar enemigos
        this.monkeys.children.entries.forEach(monkey => {
            if (monkey.isAlive) {
                monkey.update(this.player);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
        
        // Verificar si todos los monos están derrotados (opcional: requerir antes de enfrentar al jefe)
        const aliveMonkeys = this.monkeys.children.entries.filter(m => m.isAlive).length;
        // El jefe solo puede ser dañado cuando todos los monos están muertos (opcional)
        // Por ahora, el jefe puede ser atacado en cualquier momento
    }
    
    completeLevel() {
        // Calcular tiempo y bonus
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((300 - elapsedTime) * SCORES.TIME_BONUS_MULTIPLIER));
        this.score += SCORES.LEVEL_COMPLETE + timeBonus;
        
        // Ir a la escena de victoria
        this.scene.start('VictoryScene', {
            level: this.level,
            score: this.score,
            lives: this.player.lives,
            timeBonus: timeBonus
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}

```

```javascript
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.finalScore = data.score || 0;
        this.level = data.level || 1;
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, 0x1a0000)
            .setOrigin(0, 0);
        
        // Título Game Over
        this.add.text(GAME_CONFIG.WIDTH / 2, 200, 'GAME OVER', {
            fontSize: '72px',
            fontFamily: 'Arial',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 5
            }
        }).setOrigin(0.5);
        
        // Información
        const infoStyle = {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            align: 'center'
        };
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 350, `Puntuación Final: ${this.finalScore}`, infoStyle)
            .setOrigin(0.5);
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 400, `Nivel Alcanzado: ${this.level}`, infoStyle)
            .setOrigin(0.5);
        
        // Botón Reintentar
        const retryButton = this.add.rectangle(GAME_CONFIG.WIDTH / 2, 550, 300, 80, 0x228b22)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('GameScene', { level: 1, score: 0, lives: GAME_CONFIG.PLAYER_LIVES });
            })
            .on('pointerover', () => {
                retryButton.setFillStyle(0x32cd32);
            })
            .on('pointerout', () => {
                retryButton.setFillStyle(0x228b22);
            });
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 550, 'REINTENTAR', {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Botón Menú Principal
        const menuButton = this.add.rectangle(GAME_CONFIG.WIDTH / 2, 650, 300, 80, 0x444444)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            })
            .on('pointerover', () => {
                menuButton.setFillStyle(0x666666);
            })
            .on('pointerout', () => {
                menuButton.setFillStyle(0x444444);
            });
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 650, 'MENÚ PRINCIPAL', {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }
}

```

```javascript
class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.timeBonus = data.timeBonus || 0;
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, 0x001a00)
            .setOrigin(0, 0);
        
        // Título Victoria
        this.add.text(GAME_CONFIG.WIDTH / 2, 150, '¡NIVEL COMPLETADO!', {
            fontSize: '56px',
            fontFamily: 'Arial',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 5
            }
        }).setOrigin(0.5);
        
        // Información del nivel
        const infoStyle = {
            fontSize: '28px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            align: 'center'
        };
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 280, `Nivel ${this.level}`, {
            ...infoStyle,
            fontSize: '36px',
            fill: '#ffff00'
        }).setOrigin(0.5);
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 340, `Puntuación: ${this.score}`, infoStyle)
            .setOrigin(0.5);
        
        if (this.timeBonus > 0) {
            this.add.text(GAME_CONFIG.WIDTH / 2, 380, `Bonus de Tiempo: +${this.timeBonus}`, {
                ...infoStyle,
                fill: '#00ff00'
            }).setOrigin(0.5);
        }
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 420, `Vidas Restantes: ${this.lives}`, infoStyle)
            .setOrigin(0.5);
        
        // Botón Siguiente Nivel
        const nextButton = this.add.rectangle(GAME_CONFIG.WIDTH / 2, 550, 350, 80, 0x228b22)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('GameScene', {
                    level: this.level + 1,
                    score: this.score,
                    lives: this.lives
                });
            })
            .on('pointerover', () => {
                nextButton.setFillStyle(0x32cd32);
            })
            .on('pointerout', () => {
                nextButton.setFillStyle(0x228b22);
            });
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 550, 'SIGUIENTE NIVEL', {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Botón Menú Principal
        const menuButton = this.add.rectangle(GAME_CONFIG.WIDTH / 2, 650, 350, 80, 0x444444)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            })
            .on('pointerover', () => {
                menuButton.setFillStyle(0x666666);
            })
            .on('pointerout', () => {
                menuButton.setFillStyle(0x444444);
            });
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 650, 'MENÚ PRINCIPAL', {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Efecto de celebración
        this.createCelebrationEffect();
    }
    
    createCelebrationEffect() {
        // Partículas de celebración
        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                Math.random() * GAME_CONFIG.WIDTH,
                Math.random() * GAME_CONFIG.HEIGHT,
                5,
                0xffd700
            );
            
            this.tweens.add({
                targets: particle,
                y: particle.y - 200,
                alpha: 0,
                duration: 2000 + Math.random() * 1000,
                delay: Math.random() * 500,
                repeat: -1
            });
        }
    }
}

```

Creando el archivo principal `main.js` con la configuración de Phaser:


```javascript
// Configuración del juego Phaser 3
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a4d2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GAME_CONFIG.GRAVITY },
            debug: false // Cambiar a true para ver hitboxes
        }
    },
    scene: [MenuScene, GameScene, GameOverScene, VictoryScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Inicializar el juego
const game = new Phaser.Game(config);

```

Revisando y corrigiendo algunos detalles en el código:


Corrigiendo la creación de plataformas en GameScene:


Corrigiendo el orden: crear el grupo de plataformas antes de agregar plataformas.


```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
            .setOrigin(0, 0);
        
        // Grupos de objetos (crear primero para poder usarlos)
        this.monkeys = this.physics.add.group();
        this.gorillas = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();
        
        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador
        this.player = new Player(this, 100, 100);
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Crear gorila jefe
        this.boss = new Gorilla(this, GAME_CONFIG.WIDTH * 2.5, 200, this.level);
        this.gorillas.add(this.boss);
        
        // Colisiones
        this.setupCollisions();
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        
        // Cámara
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 300; // 300ms entre proyectiles
    }
    
    createPlatforms() {
        // Plataformas del nivel
        const platformData = [
            { x: 0, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.8, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 1.2, y: GAME_CONFIG.HEIGHT - 200, width: GAME_CONFIG.WIDTH * 0.4 },
            { x: GAME_CONFIG.WIDTH * 1.6, y: GAME_CONFIG.HEIGHT - 100, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.0, y: GAME_CONFIG.HEIGHT - 250, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.4 } // Plataforma del jefe
        ];
        
        platformData.forEach(platform => {
            const plat = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y,
                platform.width,
                30,
                COLORS.PLATFORM
            );
            this.physics.add.existing(plat, true);
            this.platforms.add(plat);
        });
    }
    
    createEnemies() {
        // Crear monos según el nivel
        const monkeyCount = 3 + this.level * 2;
        const monkeyPositions = [
            { x: GAME_CONFIG.WIDTH * 0.2, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 0.6, y: GAME_CONFIG.HEIGHT - 300 },
            { x: GAME_CONFIG.WIDTH * 1.0, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 1.4, y: GAME_CONFIG.HEIGHT - 350 },
            { x: GAME_CONFIG.WIDTH * 1.8, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 2.2, y: GAME_CONFIG.HEIGHT - 400 }
        ];
        
        for (let i = 0; i < Math.min(monkeyCount, monkeyPositions.length); i++) {
            const pos = monkeyPositions[i];
            let type = ENEMY_TYPES.MONKEY_BASIC;
            
            // Variar tipos según el nivel
            if (this.level >= 2 && i % 3 === 0) {
                type = ENEMY_TYPES.MONKEY_FAST;
            } else if (this.level >= 3 && i % 4 === 0) {
                type = ENEMY_TYPES.MONKEY_STRONG;
            }
            
            const monkey = new Monkey(this, pos.x, pos.y, type);
            this.monkeys.add(monkey);
        }
    }
    
    setupCollisions() {
        // Jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Enemigos con plataformas
        this.physics.add.collider(this.monkeys, this.platforms);
        this.physics.add.collider(this.gorillas, this.platforms);
        
        // Proyectiles con plataformas
        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        
        // Proyectiles con enemigos
        this.physics.add.overlap(this.projectiles, this.monkeys, (projectile, monkey) => {
            projectile.destroy();
            if (monkey.takeDamage()) {
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            if (gorilla.takeDamage()) {
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Jugador con enemigos
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
        
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD
        const hudBg = this.add.rectangle(10, 10, 300, 100, 0x000000, 0.7);
        hudBg.setOrigin(0, 0);
        this.hudContainer.add(hudBg);
        
        // Textos del HUD
        this.scoreText = this.add.text(20, 20, `Puntuación: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.hudContainer.add(this.scoreText);
        
        this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff0000'
        });
        this.hudContainer.add(this.livesText);
        
        this.levelText = this.add.text(20, 80, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles
        if ((this.cursors.j.isDown || this.cursors.space.isDown) && 
            time - this.lastProjectileTime > this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
            }
        }
        
        // Actualizar enemigos
        this.monkeys.children.entries.forEach(monkey => {
            if (monkey.isAlive) {
                monkey.update(this.player);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
        
        // Verificar si todos los monos están derrotados (opcional: requerir antes de enfrentar al jefe)
        const aliveMonkeys = this.monkeys.children.entries.filter(m => m.isAlive).length;
        // El jefe solo puede ser dañado cuando todos los monos están muertos (opcional)
        // Por ahora, el jefe puede ser atacado en cualquier momento
    }
    
    completeLevel() {
        // Calcular tiempo y bonus
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((300 - elapsedTime) * SCORES.TIME_BONUS_MULTIPLIER));
        this.score += SCORES.LEVEL_COMPLETE + timeBonus;
        
        // Ir a la escena de victoria
        this.scene.start('VictoryScene', {
            level: this.level,
            score: this.score,
            lives: this.player.lives,
            timeBonus: timeBonus
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}


```

Ajustando la inicialización del jugador para usar las vidas pasadas desde la escena anterior:


```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
            .setOrigin(0, 0);
        
        // Grupos de objetos (crear primero para poder usarlos)
        this.monkeys = this.physics.add.group();
        this.gorillas = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();
        
        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador
        this.player = new Player(this, 100, 100);
        this.player.lives = this.lives; // Usar las vidas pasadas desde la escena anterior
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Crear gorila jefe
        this.boss = new Gorilla(this, GAME_CONFIG.WIDTH * 2.5, 200, this.level);
        this.gorillas.add(this.boss);
        
        // Colisiones
        this.setupCollisions();
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        
        // Cámara
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 300; // 300ms entre proyectiles
    }
    
    createPlatforms() {
        // Plataformas del nivel
        const platformData = [
            { x: 0, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.8, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 1.2, y: GAME_CONFIG.HEIGHT - 200, width: GAME_CONFIG.WIDTH * 0.4 },
            { x: GAME_CONFIG.WIDTH * 1.6, y: GAME_CONFIG.HEIGHT - 100, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.0, y: GAME_CONFIG.HEIGHT - 250, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.4 } // Plataforma del jefe
        ];
        
        platformData.forEach(platform => {
            const plat = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y,
                platform.width,
                30,
                COLORS.PLATFORM
            );
            this.physics.add.existing(plat, true);
            this.platforms.add(plat);
        });
    }
    
    createEnemies() {
        // Crear monos según el nivel
        const monkeyCount = 3 + this.level * 2;
        const monkeyPositions = [
            { x: GAME_CONFIG.WIDTH * 0.2, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 0.6, y: GAME_CONFIG.HEIGHT - 300 },
            { x: GAME_CONFIG.WIDTH * 1.0, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 1.4, y: GAME_CONFIG.HEIGHT - 350 },
            { x: GAME_CONFIG.WIDTH * 1.8, y: GAME_CONFIG.HEIGHT - 200 },
            { x: GAME_CONFIG.WIDTH * 2.2, y: GAME_CONFIG.HEIGHT - 400 }
        ];
        
        for (let i = 0; i < Math.min(monkeyCount, monkeyPositions.length); i++) {
            const pos = monkeyPositions[i];
            let type = ENEMY_TYPES.MONKEY_BASIC;
            
            // Variar tipos según el nivel
            if (this.level >= 2 && i % 3 === 0) {
                type = ENEMY_TYPES.MONKEY_FAST;
            } else if (this.level >= 3 && i % 4 === 0) {
                type = ENEMY_TYPES.MONKEY_STRONG;
            }
            
            const monkey = new Monkey(this, pos.x, pos.y, type);
            this.monkeys.add(monkey);
        }
    }
    
    setupCollisions() {
        // Jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Enemigos con plataformas
        this.physics.add.collider(this.monkeys, this.platforms);
        this.physics.add.collider(this.gorillas, this.platforms);
        
        // Proyectiles con plataformas
        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        
        // Proyectiles con enemigos
        this.physics.add.overlap(this.projectiles, this.monkeys, (projectile, monkey) => {
            projectile.destroy();
            if (monkey.takeDamage()) {
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            if (gorilla.takeDamage()) {
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Jugador con enemigos
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
        
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD
        const hudBg = this.add.rectangle(10, 10, 300, 100, 0x000000, 0.7);
        hudBg.setOrigin(0, 0);
        this.hudContainer.add(hudBg);
        
        // Textos del HUD
        this.scoreText = this.add.text(20, 20, `Puntuación: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.hudContainer.add(this.scoreText);
        
        this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff0000'
        });
        this.hudContainer.add(this.livesText);
        
        this.levelText = this.add.text(20, 80, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles
        if ((this.cursors.j.isDown || this.cursors.space.isDown) && 
            time - this.lastProjectileTime > this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
            }
        }
        
        // Actualizar enemigos
        this.monkeys.children.entries.forEach(monkey => {
            if (monkey.isAlive) {
                monkey.update(this.player);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
        
        // Verificar si todos los monos están derrotados (opcional: requerir antes de enfrentar al jefe)
        const aliveMonkeys = this.monkeys.children.entries.filter(m => m.isAlive).length;
        // El jefe solo puede ser dañado cuando todos los monos están muertos (opcional)
        // Por ahora, el jefe puede ser atacado en cualquier momento
    }
    
    completeLevel() {
        // Calcular tiempo y bonus
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((300 - elapsedTime) * SCORES.TIME_BONUS_MULTIPLIER));
        this.score += SCORES.LEVEL_COMPLETE + timeBonus;
        
        // Ir a la escena de victoria
        this.scene.start('VictoryScene', {
            level: this.level,
            score: this.score,
            lives: this.player.lives,
            timeBonus: timeBonus
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}


```

Ajustando las posiciones de los enemigos para que estén sobre las plataformas:


```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
            .setOrigin(0, 0);
        
        // Grupos de objetos (crear primero para poder usarlos)
        this.monkeys = this.physics.add.group();
        this.gorillas = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();
        
        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador
        this.player = new Player(this, 100, 100);
        this.player.lives = this.lives; // Usar las vidas pasadas desde la escena anterior
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Crear gorila jefe
        this.boss = new Gorilla(this, GAME_CONFIG.WIDTH * 2.5, 200, this.level);
        this.gorillas.add(this.boss);
        
        // Colisiones
        this.setupCollisions();
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        
        // Cámara
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 300; // 300ms entre proyectiles
    }
    
    createPlatforms() {
        // Plataformas del nivel
        const platformData = [
            { x: 0, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.8, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 1.2, y: GAME_CONFIG.HEIGHT - 200, width: GAME_CONFIG.WIDTH * 0.4 },
            { x: GAME_CONFIG.WIDTH * 1.6, y: GAME_CONFIG.HEIGHT - 100, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.0, y: GAME_CONFIG.HEIGHT - 250, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.4 } // Plataforma del jefe
        ];
        
        platformData.forEach(platform => {
            const plat = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y,
                platform.width,
                30,
                COLORS.PLATFORM
            );
            this.physics.add.existing(plat, true);
            this.platforms.add(plat);
        });
    }
    
    createEnemies() {
        // Crear monos según el nivel
        const monkeyCount = 3 + this.level * 2;
        const monkeyPositions = [
            { x: GAME_CONFIG.WIDTH * 0.2, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre primera plataforma
            { x: GAME_CONFIG.WIDTH * 0.6, y: GAME_CONFIG.HEIGHT - 200 }, // Sobre segunda plataforma
            { x: GAME_CONFIG.WIDTH * 1.0, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre tercera plataforma
            { x: GAME_CONFIG.WIDTH * 1.4, y: GAME_CONFIG.HEIGHT - 250 }, // Sobre cuarta plataforma
            { x: GAME_CONFIG.WIDTH * 1.8, y: GAME_CONFIG.HEIGHT - 150 }, // Sobre quinta plataforma
            { x: GAME_CONFIG.WIDTH * 2.2, y: GAME_CONFIG.HEIGHT - 300 } // Sobre sexta plataforma
        ];
        
        for (let i = 0; i < Math.min(monkeyCount, monkeyPositions.length); i++) {
            const pos = monkeyPositions[i];
            let type = ENEMY_TYPES.MONKEY_BASIC;
            
            // Variar tipos según el nivel
            if (this.level >= 2 && i % 3 === 0) {
                type = ENEMY_TYPES.MONKEY_FAST;
            } else if (this.level >= 3 && i % 4 === 0) {
                type = ENEMY_TYPES.MONKEY_STRONG;
            }
            
            const monkey = new Monkey(this, pos.x, pos.y, type);
            this.monkeys.add(monkey);
        }
    }
    
    setupCollisions() {
        // Jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Enemigos con plataformas
        this.physics.add.collider(this.monkeys, this.platforms);
        this.physics.add.collider(this.gorillas, this.platforms);
        
        // Proyectiles con plataformas
        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        
        // Proyectiles con enemigos
        this.physics.add.overlap(this.projectiles, this.monkeys, (projectile, monkey) => {
            projectile.destroy();
            if (monkey.takeDamage()) {
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            if (gorilla.takeDamage()) {
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Jugador con enemigos
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
        
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD
        const hudBg = this.add.rectangle(10, 10, 300, 100, 0x000000, 0.7);
        hudBg.setOrigin(0, 0);
        this.hudContainer.add(hudBg);
        
        // Textos del HUD
        this.scoreText = this.add.text(20, 20, `Puntuación: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.hudContainer.add(this.scoreText);
        
        this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff0000'
        });
        this.hudContainer.add(this.livesText);
        
        this.levelText = this.add.text(20, 80, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles
        if ((this.cursors.j.isDown || this.cursors.space.isDown) && 
            time - this.lastProjectileTime > this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
            }
        }
        
        // Actualizar enemigos
        this.monkeys.children.entries.forEach(monkey => {
            if (monkey.isAlive) {
                monkey.update(this.player);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
        
        // Verificar si todos los monos están derrotados (opcional: requerir antes de enfrentar al jefe)
        const aliveMonkeys = this.monkeys.children.entries.filter(m => m.isAlive).length;
        // El jefe solo puede ser dañado cuando todos los monos están muertos (opcional)
        // Por ahora, el jefe puede ser atacado en cualquier momento
    }
    
    completeLevel() {
        // Calcular tiempo y bonus
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((300 - elapsedTime) * SCORES.TIME_BONUS_MULTIPLIER));
        this.score += SCORES.LEVEL_COMPLETE + timeBonus;
        
        // Ir a la escena de victoria
        this.scene.start('VictoryScene', {
            level: this.level,
            score: this.score,
            lives: this.player.lives,
            timeBonus: timeBonus
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}


```

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
            .setOrigin(0, 0);
        
        // Grupos de objetos (crear primero para poder usarlos)
        this.monkeys = this.physics.add.group();
        this.gorillas = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();
        
        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador
        this.player = new Player(this, 100, 100);
        this.player.lives = this.lives; // Usar las vidas pasadas desde la escena anterior
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Crear gorila jefe (sobre la última plataforma)
        this.boss = new Gorilla(this, GAME_CONFIG.WIDTH * 2.5, GAME_CONFIG.HEIGHT - 200, this.level);
        this.gorillas.add(this.boss);
        
        // Colisiones
        this.setupCollisions();
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        
        // Cámara
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 300; // 300ms entre proyectiles
    }
    
    createPlatforms() {
        // Plataformas del nivel
        const platformData = [
            { x: 0, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.8, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 1.2, y: GAME_CONFIG.HEIGHT - 200, width: GAME_CONFIG.WIDTH * 0.4 },
            { x: GAME_CONFIG.WIDTH * 1.6, y: GAME_CONFIG.HEIGHT - 100, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.0, y: GAME_CONFIG.HEIGHT - 250, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.4 } // Plataforma del jefe
        ];
        
        platformData.forEach(platform => {
            const plat = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y,
                platform.width,
                30,
                COLORS.PLATFORM
            );
            this.physics.add.existing(plat, true);
            this.platforms.add(plat);
        });
    }
    
    createEnemies() {
        // Crear monos según el nivel
        const monkeyCount = 3 + this.level * 2;
        const monkeyPositions = [
            { x: GAME_CONFIG.WIDTH * 0.2, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre primera plataforma
            { x: GAME_CONFIG.WIDTH * 0.6, y: GAME_CONFIG.HEIGHT - 200 }, // Sobre segunda plataforma
            { x: GAME_CONFIG.WIDTH * 1.0, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre tercera plataforma
            { x: GAME_CONFIG.WIDTH * 1.4, y: GAME_CONFIG.HEIGHT - 250 }, // Sobre cuarta plataforma
            { x: GAME_CONFIG.WIDTH * 1.8, y: GAME_CONFIG.HEIGHT - 150 }, // Sobre quinta plataforma
            { x: GAME_CONFIG.WIDTH * 2.2, y: GAME_CONFIG.HEIGHT - 300 } // Sobre sexta plataforma
        ];
        
        for (let i = 0; i < Math.min(monkeyCount, monkeyPositions.length); i++) {
            const pos = monkeyPositions[i];
            let type = ENEMY_TYPES.MONKEY_BASIC;
            
            // Variar tipos según el nivel
            if (this.level >= 2 && i % 3 === 0) {
                type = ENEMY_TYPES.MONKEY_FAST;
            } else if (this.level >= 3 && i % 4 === 0) {
                type = ENEMY_TYPES.MONKEY_STRONG;
            }
            
            const monkey = new Monkey(this, pos.x, pos.y, type);
            this.monkeys.add(monkey);
        }
    }
    
    setupCollisions() {
        // Jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Enemigos con plataformas
        this.physics.add.collider(this.monkeys, this.platforms);
        this.physics.add.collider(this.gorillas, this.platforms);
        
        // Proyectiles con plataformas
        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        
        // Proyectiles con enemigos
        this.physics.add.overlap(this.projectiles, this.monkeys, (projectile, monkey) => {
            projectile.destroy();
            if (monkey.takeDamage()) {
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            if (gorilla.takeDamage()) {
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Jugador con enemigos
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
        
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD
        const hudBg = this.add.rectangle(10, 10, 300, 100, 0x000000, 0.7);
        hudBg.setOrigin(0, 0);
        this.hudContainer.add(hudBg);
        
        // Textos del HUD
        this.scoreText = this.add.text(20, 20, `Puntuación: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.hudContainer.add(this.scoreText);
        
        this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff0000'
        });
        this.hudContainer.add(this.livesText);
        
        this.levelText = this.add.text(20, 80, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles
        if ((this.cursors.j.isDown || this.cursors.space.isDown) && 
            time - this.lastProjectileTime > this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
            }
        }
        
        // Actualizar enemigos
        this.monkeys.children.entries.forEach(monkey => {
            if (monkey.isAlive) {
                monkey.update(this.player);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
        
        // Verificar si todos los monos están derrotados (opcional: requerir antes de enfrentar al jefe)
        const aliveMonkeys = this.monkeys.children.entries.filter(m => m.isAlive).length;
        // El jefe solo puede ser dañado cuando todos los monos están muertos (opcional)
        // Por ahora, el jefe puede ser atacado en cualquier momento
    }
    
    completeLevel() {
        // Calcular tiempo y bonus
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((300 - elapsedTime) * SCORES.TIME_BONUS_MULTIPLIER));
        this.score += SCORES.LEVEL_COMPLETE + timeBonus;
        
        // Ir a la escena de victoria
        this.scene.start('VictoryScene', {
            level: this.level,
            score: this.score,
            lives: this.player.lives,
            timeBonus: timeBonus
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}


```

Revisando y corrigiendo el manejo de proyectiles para que se destruyan correctamente:


Mejorando el manejo de proyectiles y ajustando la posición inicial del jugador:


```javascript
class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        // Crear sprite simple si no hay textura
        const graphics = scene.add.graphics();
        graphics.fillStyle(COLORS.PROJECTILE);
        graphics.fillCircle(0, 0, 8);
        const texture = graphics.generateTexture('projectile', 16, 16);
        graphics.destroy();
        
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.direction = direction; // 1 para derecha, -1 para izquierda
        this.speed = GAME_CONFIG.PROJECTILE_SPEED;
        
        // Configurar física
        this.body.setSize(12, 12);
        this.body.setCollideWorldBounds(false); // No colisionar con bordes, destruir manualmente
        
        // Velocidad inicial
        this.setVelocityX(this.speed * this.direction);
        
        // Guardar referencia a la escena
        this.scene = scene;
    }
    
    update() {
        // El proyectil se mueve automáticamente
        // Se destruye al colisionar con plataformas o enemigos
    }
}


```

```javascript
class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        // Crear sprite simple si no hay textura
        const graphics = scene.add.graphics();
        graphics.fillStyle(COLORS.PROJECTILE);
        graphics.fillCircle(0, 0, 8);
        const texture = graphics.generateTexture('projectile', 16, 16);
        graphics.destroy();
        
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.direction = direction; // 1 para derecha, -1 para izquierda
        this.speed = GAME_CONFIG.PROJECTILE_SPEED;
        
        // Configurar física
        this.body.setSize(12, 12);
        this.body.setCollideWorldBounds(false); // No colisionar con bordes, destruir manualmente
        
        // Velocidad inicial
        this.setVelocityX(this.speed * this.direction);
        
        // Guardar referencia a la escena
        this.scene = scene;
    }
    
    update() {
        // El proyectil se mueve automáticamente
        // Se destruye al colisionar con plataformas o enemigos
        
        // Destruir si sale de los límites del mundo
        if (this.x < -50 || this.x > GAME_CONFIG.WIDTH * 3 + 50 || 
            this.y < -50 || this.y > GAME_CONFIG.HEIGHT + 50) {
            this.destroy();
        }
    }
}


```

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
            .setOrigin(0, 0);
        
        // Grupos de objetos (crear primero para poder usarlos)
        this.monkeys = this.physics.add.group();
        this.gorillas = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();
        
        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador (sobre la primera plataforma)
        this.player = new Player(this, 100, GAME_CONFIG.HEIGHT - 150);
        this.player.lives = this.lives; // Usar las vidas pasadas desde la escena anterior
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Crear gorila jefe (sobre la última plataforma)
        this.boss = new Gorilla(this, GAME_CONFIG.WIDTH * 2.5, GAME_CONFIG.HEIGHT - 200, this.level);
        this.gorillas.add(this.boss);
        
        // Colisiones
        this.setupCollisions();
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        
        // Cámara
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 300; // 300ms entre proyectiles
    }
    
    createPlatforms() {
        // Plataformas del nivel
        const platformData = [
            { x: 0, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.8, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 1.2, y: GAME_CONFIG.HEIGHT - 200, width: GAME_CONFIG.WIDTH * 0.4 },
            { x: GAME_CONFIG.WIDTH * 1.6, y: GAME_CONFIG.HEIGHT - 100, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.0, y: GAME_CONFIG.HEIGHT - 250, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.4 } // Plataforma del jefe
        ];
        
        platformData.forEach(platform => {
            const plat = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y,
                platform.width,
                30,
                COLORS.PLATFORM
            );
            this.physics.add.existing(plat, true);
            this.platforms.add(plat);
        });
    }
    
    createEnemies() {
        // Crear monos según el nivel
        const monkeyCount = 3 + this.level * 2;
        const monkeyPositions = [
            { x: GAME_CONFIG.WIDTH * 0.2, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre primera plataforma
            { x: GAME_CONFIG.WIDTH * 0.6, y: GAME_CONFIG.HEIGHT - 200 }, // Sobre segunda plataforma
            { x: GAME_CONFIG.WIDTH * 1.0, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre tercera plataforma
            { x: GAME_CONFIG.WIDTH * 1.4, y: GAME_CONFIG.HEIGHT - 250 }, // Sobre cuarta plataforma
            { x: GAME_CONFIG.WIDTH * 1.8, y: GAME_CONFIG.HEIGHT - 150 }, // Sobre quinta plataforma
            { x: GAME_CONFIG.WIDTH * 2.2, y: GAME_CONFIG.HEIGHT - 300 } // Sobre sexta plataforma
        ];
        
        for (let i = 0; i < Math.min(monkeyCount, monkeyPositions.length); i++) {
            const pos = monkeyPositions[i];
            let type = ENEMY_TYPES.MONKEY_BASIC;
            
            // Variar tipos según el nivel
            if (this.level >= 2 && i % 3 === 0) {
                type = ENEMY_TYPES.MONKEY_FAST;
            } else if (this.level >= 3 && i % 4 === 0) {
                type = ENEMY_TYPES.MONKEY_STRONG;
            }
            
            const monkey = new Monkey(this, pos.x, pos.y, type);
            this.monkeys.add(monkey);
        }
    }
    
    setupCollisions() {
        // Jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Enemigos con plataformas
        this.physics.add.collider(this.monkeys, this.platforms);
        this.physics.add.collider(this.gorillas, this.platforms);
        
        // Proyectiles con plataformas
        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        
        // Proyectiles con enemigos
        this.physics.add.overlap(this.projectiles, this.monkeys, (projectile, monkey) => {
            projectile.destroy();
            if (monkey.takeDamage()) {
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            if (gorilla.takeDamage()) {
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Jugador con enemigos
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
        
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD
        const hudBg = this.add.rectangle(10, 10, 300, 100, 0x000000, 0.7);
        hudBg.setOrigin(0, 0);
        this.hudContainer.add(hudBg);
        
        // Textos del HUD
        this.scoreText = this.add.text(20, 20, `Puntuación: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.hudContainer.add(this.scoreText);
        
        this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff0000'
        });
        this.hudContainer.add(this.livesText);
        
        this.levelText = this.add.text(20, 80, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles
        if ((this.cursors.j.isDown || this.cursors.space.isDown) && 
            time - this.lastProjectileTime > this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
            }
        }
        
        // Actualizar enemigos
        this.monkeys.children.entries.forEach(monkey => {
            if (monkey.isAlive) {
                monkey.update(this.player);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
        
        // Verificar si todos los monos están derrotados (opcional: requerir antes de enfrentar al jefe)
        const aliveMonkeys = this.monkeys.children.entries.filter(m => m.isAlive).length;
        // El jefe solo puede ser dañado cuando todos los monos están muertos (opcional)
        // Por ahora, el jefe puede ser atacado en cualquier momento
    }
    
    completeLevel() {
        // Calcular tiempo y bonus
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((300 - elapsedTime) * SCORES.TIME_BONUS_MULTIPLIER));
        this.score += SCORES.LEVEL_COMPLETE + timeBonus;
        
        // Ir a la escena de victoria
        this.scene.start('VictoryScene', {
            level: this.level,
            score: this.score,
            lives: this.player.lives,
            timeBonus: timeBonus
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}


```

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
    }
    
    create() {
        // Fondo
        this.add.rectangle(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
            .setOrigin(0, 0);
        
        // Grupos de objetos (crear primero para poder usarlos)
        this.monkeys = this.physics.add.group();
        this.gorillas = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();
        
        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador (sobre la primera plataforma)
        this.player = new Player(this, 100, GAME_CONFIG.HEIGHT - 150);
        this.player.lives = this.lives; // Usar las vidas pasadas desde la escena anterior
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Crear gorila jefe (sobre la última plataforma)
        this.boss = new Gorilla(this, GAME_CONFIG.WIDTH * 2.5, GAME_CONFIG.HEIGHT - 200, this.level);
        this.gorillas.add(this.boss);
        
        // Colisiones
        this.setupCollisions();
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        
        // Cámara
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 300; // 300ms entre proyectiles
    }
    
    createPlatforms() {
        // Plataformas del nivel
        const platformData = [
            { x: 0, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.8, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 1.2, y: GAME_CONFIG.HEIGHT - 200, width: GAME_CONFIG.WIDTH * 0.4 },
            { x: GAME_CONFIG.WIDTH * 1.6, y: GAME_CONFIG.HEIGHT - 100, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.0, y: GAME_CONFIG.HEIGHT - 250, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.4 } // Plataforma del jefe
        ];
        
        platformData.forEach(platform => {
            const plat = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y,
                platform.width,
                30,
                COLORS.PLATFORM
            );
            this.physics.add.existing(plat, true);
            this.platforms.add(plat);
        });
    }
    
    createEnemies() {
        // Crear monos según el nivel
        const monkeyCount = 3 + this.level * 2;
        const monkeyPositions = [
            { x: GAME_CONFIG.WIDTH * 0.2, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre primera plataforma
            { x: GAME_CONFIG.WIDTH * 0.6, y: GAME_CONFIG.HEIGHT - 200 }, // Sobre segunda plataforma
            { x: GAME_CONFIG.WIDTH * 1.0, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre tercera plataforma
            { x: GAME_CONFIG.WIDTH * 1.4, y: GAME_CONFIG.HEIGHT - 250 }, // Sobre cuarta plataforma
            { x: GAME_CONFIG.WIDTH * 1.8, y: GAME_CONFIG.HEIGHT - 150 }, // Sobre quinta plataforma
            { x: GAME_CONFIG.WIDTH * 2.2, y: GAME_CONFIG.HEIGHT - 300 } // Sobre sexta plataforma
        ];
        
        for (let i = 0; i < Math.min(monkeyCount, monkeyPositions.length); i++) {
            const pos = monkeyPositions[i];
            let type = ENEMY_TYPES.MONKEY_BASIC;
            
            // Variar tipos según el nivel
            if (this.level >= 2 && i % 3 === 0) {
                type = ENEMY_TYPES.MONKEY_FAST;
            } else if (this.level >= 3 && i % 4 === 0) {
                type = ENEMY_TYPES.MONKEY_STRONG;
            }
            
            const monkey = new Monkey(this, pos.x, pos.y, type);
            this.monkeys.add(monkey);
        }
    }
    
    setupCollisions() {
        // Jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Enemigos con plataformas
        this.physics.add.collider(this.monkeys, this.platforms);
        this.physics.add.collider(this.gorillas, this.platforms);
        
        // Proyectiles con plataformas
        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        
        // Proyectiles con enemigos
        this.physics.add.overlap(this.projectiles, this.monkeys, (projectile, monkey) => {
            projectile.destroy();
            if (monkey.takeDamage()) {
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            if (gorilla.takeDamage()) {
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Jugador con enemigos
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
        
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD
        const hudBg = this.add.rectangle(10, 10, 300, 100, 0x000000, 0.7);
        hudBg.setOrigin(0, 0);
        this.hudContainer.add(hudBg);
        
        // Textos del HUD
        this.scoreText = this.add.text(20, 20, `Puntuación: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.hudContainer.add(this.scoreText);
        
        this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff0000'
        });
        this.hudContainer.add(this.livesText);
        
        this.levelText = this.add.text(20, 80, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles
        if ((this.cursors.j.isDown || this.cursors.space.isDown) && 
            time - this.lastProjectileTime > this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
            }
        }
        
        // Actualizar proyectiles
        this.projectiles.children.entries.forEach(projectile => {
            if (projectile.active) {
                projectile.update();
            }
        });
        
        // Actualizar enemigos
        this.monkeys.children.entries.forEach(monkey => {
            if (monkey.isAlive) {
                monkey.update(this.player);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
    }
    
    completeLevel() {
        // Calcular tiempo y bonus
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((300 - elapsedTime) * SCORES.TIME_BONUS_MULTIPLIER));
        this.score += SCORES.LEVEL_COMPLETE + timeBonus;
        
        // Ir a la escena de victoria
        this.scene.start('VictoryScene', {
            level: this.level,
            score: this.score,
            lives: this.player.lives,
            timeBonus: timeBonus
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}


```

Ajustando el efecto de tambaleo del jugador para que sea solo visual y no afecte las colisiones:


```javascript
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Crear sprite del plátano borracho
        const graphics = scene.add.graphics();
        graphics.fillStyle(COLORS.PLAYER);
        graphics.fillRoundedRect(0, 0, 40, 60, 10);
        // Ojos
        graphics.fillStyle(0x000000);
        graphics.fillCircle(10, 20, 4);
        graphics.fillCircle(30, 20, 4);
        // Boca
        graphics.fillStyle(0xff6347);
        graphics.fillEllipse(20, 35, 15, 10);
        const texture = graphics.generateTexture('player', 40, 60);
        graphics.destroy();
        
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propiedades del jugador
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.isAlive = true;
        this.facingRight = true;
        this.canJump = true;
        this.isJumping = false;
        this.invulnerable = false;
        this.hasArmor = true; // Piel del plátano
        
        // Configurar física
        this.body.setSize(35, 55);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        
        // Efecto de tambaleo borracho
        this.drunkOffset = 0;
        this.drunkSpeed = 0.05;
        
        // Tiempo de invulnerabilidad después de recibir daño
        this.invulnerableTime = 0;
        this.invulnerableDuration = 2000; // 2 segundos
        
        // Referencia a la escena para crear proyectiles
        this.scene = scene;
    }
    
    update(cursors, time) {
        if (!this.isAlive) return;
        
        // Actualizar invulnerabilidad
        if (this.invulnerable) {
            this.invulnerableTime -= time;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
                this.setAlpha(1);
            } else {
                // Efecto de parpadeo
                this.setAlpha((Math.sin(time * 0.02) + 1) / 2);
            }
        }
        
        // Movimiento horizontal
        let horizontalVelocity = 0;
        
        if (cursors.left.isDown || cursors.a.isDown) {
            horizontalVelocity = -GAME_CONFIG.PLAYER_SPEED;
            this.facingRight = false;
        } else if (cursors.right.isDown || cursors.d.isDown) {
            horizontalVelocity = GAME_CONFIG.PLAYER_SPEED;
            this.facingRight = true;
        }
        
        this.setVelocityX(horizontalVelocity);
        
        // Salto
        if ((cursors.up.isDown || cursors.w.isDown || cursors.space.isDown) && this.canJump && !this.isJumping) {
            this.jump();
        }
        
        // Verificar si está en el suelo
        if (this.body.onFloor()) {
            this.canJump = true;
            this.isJumping = false;
        } else {
            this.isJumping = true;
        }
        
        // Efecto de tambaleo borracho (solo visual)
        this.drunkOffset += this.drunkSpeed;
        const drunkRotation = Math.sin(this.drunkOffset) * 0.15; // Rotación suave
        this.setRotation(drunkRotation);
        
        // Efecto visual de oscilación vertical sutil
        const drunkY = Math.sin(this.drunkOffset * 1.5) * 1;
        this.setY(this.y + drunkY);
    }
    
    jump() {
        if (this.canJump && !this.isJumping) {
            this.setVelocityY(GAME_CONFIG.JUMP_VELOCITY);
            this.canJump = false;
            this.isJumping = true;
        }
    }
    
    throwProjectile() {
        if (!this.isAlive) return null;
        
        const direction = this.facingRight ? 1 : -1;
        const offsetX = this.facingRight ? 30 : -30;
        const projectile = new Projectile(this.scene, this.x + offsetX, this.y, direction);
        
        return projectile;
    }
    
    takeDamage() {
        if (this.invulnerable || !this.isAlive) return;
        
        this.lives--;
        this.invulnerable = true;
        this.invulnerableTime = this.invulnerableDuration;
        
        // Perder armadura (piel del plátano)
        if (this.hasArmor) {
            this.hasArmor = false;
            // Cambiar color a más claro (plátano sin piel)
            this.setTint(0xffffcc);
        }
        
        if (this.lives <= 0) {
            this.die();
        }
    }
    
    die() {
        this.isAlive = false;
        this.setVelocity(0, 0);
        this.setTint(0x666666); // Gris cuando muere
    }
    
    reset(x, y) {
        this.setPosition(x, y);
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.isAlive = true;
        this.hasArmor = true;
        this.invulnerable = false;
        this.setAlpha(1);
        this.clearTint();
        this.setVelocity(0, 0);
    }
}


```

Ajustando el efecto de tambaleo para que no interfiera con la física:


```javascript
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Crear sprite del plátano borracho
        const graphics = scene.add.graphics();
        graphics.fillStyle(COLORS.PLAYER);
        graphics.fillRoundedRect(0, 0, 40, 60, 10);
        // Ojos
        graphics.fillStyle(0x000000);
        graphics.fillCircle(10, 20, 4);
        graphics.fillCircle(30, 20, 4);
        // Boca
        graphics.fillStyle(0xff6347);
        graphics.fillEllipse(20, 35, 15, 10);
        const texture = graphics.generateTexture('player', 40, 60);
        graphics.destroy();
        
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propiedades del jugador
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.isAlive = true;
        this.facingRight = true;
        this.canJump = true;
        this.isJumping = false;
        this.invulnerable = false;
        this.hasArmor = true; // Piel del plátano
        
        // Configurar física
        this.body.setSize(35, 55);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        
        // Efecto de tambaleo borracho
        this.drunkOffset = 0;
        this.drunkSpeed = 0.05;
        
        // Tiempo de invulnerabilidad después de recibir daño
        this.invulnerableTime = 0;
        this.invulnerableDuration = 2000; // 2 segundos
        
        // Referencia a la escena para crear proyectiles
        this.scene = scene;
    }
    
    update(cursors, time) {
        if (!this.isAlive) return;
        
        // Actualizar invulnerabilidad
        if (this.invulnerable) {
            this.invulnerableTime -= time;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
                this.setAlpha(1);
            } else {
                // Efecto de parpadeo
                this.setAlpha((Math.sin(time * 0.02) + 1) / 2);
            }
        }
        
        // Movimiento horizontal
        let horizontalVelocity = 0;
        
        if (cursors.left.isDown || cursors.a.isDown) {
            horizontalVelocity = -GAME_CONFIG.PLAYER_SPEED;
            this.facingRight = false;
        } else if (cursors.right.isDown || cursors.d.isDown) {
            horizontalVelocity = GAME_CONFIG.PLAYER_SPEED;
            this.facingRight = true;
        }
        
        this.setVelocityX(horizontalVelocity);
        
        // Salto
        if ((cursors.up.isDown || cursors.w.isDown || cursors.space.isDown) && this.canJump && !this.isJumping) {
            this.jump();
        }
        
        // Verificar si está en el suelo
        if (this.body.onFloor()) {
            this.canJump = true;
            this.isJumping = false;
        } else {
            this.isJumping = true;
        }
        
        // Efecto de tambaleo borracho (solo visual - rotación)
        this.drunkOffset += this.drunkSpeed;
        const drunkRotation = Math.sin(this.drunkOffset) * 0.12; // Rotación suave
        this.setRotation(drunkRotation);
    }
    
    jump() {
        if (this.canJump && !this.isJumping) {
            this.setVelocityY(GAME_CONFIG.JUMP_VELOCITY);
            this.canJump = false;
            this.isJumping = true;
        }
    }
    
    throwProjectile() {
        if (!this.isAlive) return null;
        
        const direction = this.facingRight ? 1 : -1;
        const offsetX = this.facingRight ? 30 : -30;
        const projectile = new Projectile(this.scene, this.x + offsetX, this.y, direction);
        
        return projectile;
    }
    
    takeDamage() {
        if (this.invulnerable || !this.isAlive) return;
        
        this.lives--;
        this.invulnerable = true;
        this.invulnerableTime = this.invulnerableDuration;
        
        // Perder armadura (piel del plátano)
        if (this.hasArmor) {
            this.hasArmor = false;
            // Cambiar color a más claro (plátano sin piel)
            this.setTint(0xffffcc);
        }
        
        if (this.lives <= 0) {
            this.die();
        }
    }
    
    die() {
        this.isAlive = false;
        this.setVelocity(0, 0);
        this.setTint(0x666666); // Gris cuando muere
    }
    
    reset(x, y) {
        this.setPosition(x, y);
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.isAlive = true;
        this.hasArmor = true;
        this.invulnerable = false;
        this.setAlpha(1);
        this.clearTint();
        this.setVelocity(0, 0);
    }
}


```

Verificando la estructura de archivos creada:


Verificando el orden de carga de scripts en `index.html`:


Juego implementado según las especificaciones. Resumen:

## Estructura creada

- **index.html** — Archivo HTML principal con Phaser 3 desde CDN
- **css/style.css** — Estilos del juego
- **js/main.js** — Configuración e inicialización de Phaser
- **js/utils/** — Constantes y funciones auxiliares
- **js/entities/** — Player, Monkey, Gorilla, Projectile
- **js/scenes/** — MenuScene, GameScene, GameOverScene, VictoryScene

## Características implementadas

1. Protagonista (Plátano Borracho):
   - Movimiento horizontal y salto
   - Efecto de tambaleo (rotación)
   - Sistema de vidas (3 iniciales)
   - Lanzamiento de proyectiles
   - Invulnerabilidad temporal tras recibir daño

2. Enemigos (Monos):
   - Tres tipos: básico, rápido y fuerte
   - IA básica: detección y movimiento hacia el jugador
   - Diferentes resistencias según el tipo

3. Jefes (Gorilas):
   - Aumentan de poder por nivel
   - Barra de vida visible
   - Patrones de movimiento más complejos
   - Ataques periódicos

4. Sistema de juego:
   - Múltiples niveles con scroll horizontal
   - Plataformas a diferentes alturas
   - Sistema de puntuación
   - Sistema de vidas
   - Cámara que sigue al jugador

5. Escenas:
   - Menú principal con instrucciones
   - Escena de juego principal
   - Pantalla de Game Over
   - Pantalla de victoria con bonus de tiempo

## Controles

- **A/D o ←/→**: Mover izquierda/derecha
- **W o ↑**: Saltar
- **J o Espacio**: Lanzar proyectil

El juego está listo para jugar. Abre `index.html` en un navegador moderno. Los gráficos son formas geométricas generadas con Phaser Graphics API, como se especificó en el prompt.

¿Quieres que pruebe el juego o que ajuste algo?

---

**User**

genera el contenido de la carpeta assets para el juego

---

**Cursor**

Creando la estructura de carpetas `assets` y archivos de documentación que expliquen qué assets se necesitan:


```markdown
# Assets del Juego: Plátano Borracho vs Monos

Esta carpeta contiene todos los recursos del juego: imágenes, audio y mapas.

## Estructura

```
assets/
├── images/
│   ├── sprites/       # Sprites de personajes y objetos
│   └── backgrounds/   # Fondos de niveles
├── audio/
│   ├── music/         # Música de fondo
│   └── sfx/           # Efectos de sonido
└── maps/              # Mapas de niveles (opcional)
```

## Nota Importante

El juego está diseñado para funcionar **sin assets externos**. Todos los sprites se generan programáticamente usando Phaser Graphics API. Sin embargo, si deseas mejorar el juego con assets personalizados, puedes agregarlos aquí siguiendo la estructura indicada.

## Assets Generados Programáticamente

El juego genera automáticamente:
- **Sprites del jugador (plátano borracho)**: Forma amarilla con ojos y boca
- **Sprites de monos**: Círculos marrones con ojos
- **Sprites de gorilas**: Formas grandes y oscuras
- **Proyectiles**: Círculos amarillos
- **Plataformas**: Rectángulos verdes
- **Fondos**: Rectángulos de color sólido

## Si Quieres Agregar Assets Personalizados

### Sprites Recomendados
- **player.png**: Sprite del plátano borracho (40x60px recomendado)
- **monkey_basic.png**: Mono básico (40x40px)
- **monkey_fast.png**: Mono rápido (40x40px)
- **monkey_strong.png**: Mono fuerte (50x50px)
- **gorilla_1.png, gorilla_2.png, etc.**: Gorilas jefe (80x80px base, más grande según nivel)
- **projectile.png**: Proyectil (16x16px)

### Fondos Recomendados
- **jungle_bg_1.png, jungle_bg_2.png, etc.**: Fondos de jungla para cada nivel (1200x800px)

### Audio Recomendado
- **music_menu.mp3**: Música del menú principal
- **music_game.mp3**: Música de fondo durante el juego
- **sfx_jump.wav**: Sonido de salto
- **sfx_throw.wav**: Sonido de lanzar proyectil
- **sfx_hit.wav**: Sonido de impacto
- **sfx_enemy_death.wav**: Sonido de enemigo derrotado
- **sfx_player_hurt.wav**: Sonido de daño al jugador
- **sfx_game_over.wav**: Sonido de game over
- **sfx_victory.wav**: Sonido de victoria

```

```markdown
# Imágenes del Juego

Esta carpeta contiene todas las imágenes del juego.

## Estructura

- **sprites/**: Sprites de personajes, enemigos y objetos del juego
- **backgrounds/**: Fondos de niveles y escenas

## Sprites Necesarios

Si deseas reemplazar los sprites generados programáticamente, agrega aquí:

### Jugador
- `player.png` o `player_spritesheet.png` (con animaciones)

### Enemigos
- `monkey_basic.png`
- `monkey_fast.png`
- `monkey_strong.png`
- `gorilla_1.png`, `gorilla_2.png`, `gorilla_3.png`, etc.

### Objetos
- `projectile.png`
- `platform.png` (opcional, para texturizar plataformas)

## Fondos

- `jungle_bg_1.png`, `jungle_bg_2.png`, etc. para cada nivel
- `menu_bg.png` para el menú principal

## Nota

El juego funciona perfectamente sin estos archivos, ya que genera todos los sprites programáticamente.

```

```plaintext
# Esta carpeta contiene los sprites del juego

```

```plaintext
# Esta carpeta contiene los fondos del juego

```

```markdown
# Audio del Juego

Esta carpeta contiene todos los archivos de audio del juego.

## Estructura

- **music/**: Música de fondo (formato MP3 o OGG recomendado)
- **sfx/**: Efectos de sonido (formato WAV o OGG recomendado)

## Archivos de Audio Necesarios

### Música de Fondo
- `menu_music.mp3` o `menu_music.ogg`: Música del menú principal (loop)
- `game_music.mp3` o `game_music.ogg`: Música durante el juego (loop)
- `victory_music.mp3` o `victory_music.ogg`: Música de victoria

### Efectos de Sonido
- `sfx_jump.wav`: Sonido cuando el jugador salta
- `sfx_throw.wav`: Sonido al lanzar un proyectil
- `sfx_hit.wav`: Sonido cuando un proyectil impacta
- `sfx_enemy_death.wav`: Sonido cuando un enemigo muere
- `sfx_player_hurt.wav`: Sonido cuando el jugador recibe daño
- `sfx_game_over.wav`: Sonido de game over
- `sfx_victory.wav`: Sonido de victoria
- `sfx_boss_roar.wav`: Sonido del gorila jefe (opcional)

## Formatos Recomendados

- **Música**: MP3 (compatibilidad) o OGG (mejor compresión)
- **SFX**: WAV (calidad) o OGG (tamaño)

## Nota

El juego funciona sin estos archivos, pero agregarlos mejorará significativamente la experiencia del jugador.

```

```plaintext
# Esta carpeta contiene la música de fondo del juego

```

```plaintext
# Esta carpeta contiene los efectos de sonido del juego

```

```markdown
# Mapas de Niveles

Esta carpeta contiene los mapas de niveles del juego (opcional).

## Formato

Los mapas pueden estar en formato JSON, CSV, o cualquier formato que el juego pueda leer.

## Estructura de Mapa Sugerida (JSON)

```json
{
  "level": 1,
  "width": 3600,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 360,
      "height": 30
    }
  ],
  "enemies": [
    {
      "type": "monkey_basic",
      "x": 240,
      "y": 700
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 1,
    "x": 3000,
    "y": 600
  }
}
```

## Nota

Actualmente, los niveles se generan programáticamente en `GameScene.js`. Si deseas usar mapas externos, necesitarás modificar el código para cargar y parsear estos archivos.

```

```plaintext
# Esta carpeta contiene los mapas de niveles del juego

```

Creando un script de utilidad para generar assets básicos y un archivo de ejemplo de mapa:


```json
{
  "level": 1,
  "width": 3600,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 360,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 480,
      "y": 650,
      "width": 360,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 960,
      "y": 750,
      "width": 360,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 1440,
      "y": 600,
      "width": 480,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 1920,
      "y": 700,
      "width": 360,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 2400,
      "y": 550,
      "width": 360,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 2880,
      "y": 650,
      "width": 480,
      "height": 30,
      "color": "#228b22"
    }
  ],
  "enemies": [
    {
      "type": "monkey_basic",
      "x": 240,
      "y": 700
    },
    {
      "type": "monkey_basic",
      "x": 600,
      "y": 600
    },
    {
      "type": "monkey_basic",
      "x": 1200,
      "y": 700
    },
    {
      "type": "monkey_fast",
      "x": 1560,
      "y": 550
    },
    {
      "type": "monkey_basic",
      "x": 2160,
      "y": 650
    },
    {
      "type": "monkey_strong",
      "x": 2520,
      "y": 500
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 1,
    "x": 3000,
    "y": 600
  },
  "playerStart": {
    "x": 100,
    "y": 650
  }
}

```

```javascript
/**
 * Utilidad para cargar assets externos si están disponibles
 * Este archivo puede ser usado para cargar sprites, audio y fondos personalizados
 */

class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.assetsLoaded = false;
    }
    
    /**
     * Precarga todos los assets disponibles
     */
    preload() {
        // Intentar cargar sprites personalizados
        this.loadSprites();
        
        // Intentar cargar fondos personalizados
        this.loadBackgrounds();
        
        // Intentar cargar audio
        this.loadAudio();
    }
    
    /**
     * Carga sprites personalizados si están disponibles
     */
    loadSprites() {
        const sprites = [
            { key: 'player', path: 'assets/images/sprites/player.png' },
            { key: 'monkey_basic', path: 'assets/images/sprites/monkey_basic.png' },
            { key: 'monkey_fast', path: 'assets/images/sprites/monkey_fast.png' },
            { key: 'monkey_strong', path: 'assets/images/sprites/monkey_strong.png' },
            { key: 'projectile', path: 'assets/images/sprites/projectile.png' }
        ];
        
        // Cargar gorilas para diferentes niveles
        for (let i = 1; i <= 5; i++) {
            sprites.push({
                key: `gorilla_${i}`,
                path: `assets/images/sprites/gorilla_${i}.png`
            });
        }
        
        sprites.forEach(sprite => {
            try {
                this.scene.load.image(sprite.key, sprite.path);
            } catch (e) {
                console.log(`Sprite ${sprite.key} no encontrado, se usará generación programática`);
            }
        });
    }
    
    /**
     * Carga fondos personalizados si están disponibles
     */
    loadBackgrounds() {
        const backgrounds = [
            { key: 'menu_bg', path: 'assets/images/backgrounds/menu_bg.png' },
            { key: 'jungle_bg_1', path: 'assets/images/backgrounds/jungle_bg_1.png' },
            { key: 'jungle_bg_2', path: 'assets/images/backgrounds/jungle_bg_2.png' },
            { key: 'jungle_bg_3', path: 'assets/images/backgrounds/jungle_bg_3.png' }
        ];
        
        backgrounds.forEach(bg => {
            try {
                this.scene.load.image(bg.key, bg.path);
            } catch (e) {
                console.log(`Fondo ${bg.key} no encontrado, se usará color sólido`);
            }
        });
    }
    
    /**
     * Carga archivos de audio si están disponibles
     */
    loadAudio() {
        // Música
        const music = [
            { key: 'menu_music', path: 'assets/audio/music/menu_music.mp3' },
            { key: 'game_music', path: 'assets/audio/music/game_music.mp3' },
            { key: 'victory_music', path: 'assets/audio/music/victory_music.mp3' }
        ];
        
        // Efectos de sonido
        const sfx = [
            { key: 'sfx_jump', path: 'assets/audio/sfx/sfx_jump.wav' },
            { key: 'sfx_throw', path: 'assets/audio/sfx/sfx_throw.wav' },
            { key: 'sfx_hit', path: 'assets/audio/sfx/sfx_hit.wav' },
            { key: 'sfx_enemy_death', path: 'assets/audio/sfx/sfx_enemy_death.wav' },
            { key: 'sfx_player_hurt', path: 'assets/audio/sfx/sfx_player_hurt.wav' },
            { key: 'sfx_game_over', path: 'assets/audio/sfx/sfx_game_over.wav' },
            { key: 'sfx_victory', path: 'assets/audio/sfx/sfx_victory.wav' },
            { key: 'sfx_boss_roar', path: 'assets/audio/sfx/sfx_boss_roar.wav' }
        ];
        
        [...music, ...sfx].forEach(audio => {
            try {
                if (audio.key.startsWith('sfx_')) {
                    this.scene.load.audio(audio.key, audio.path);
                } else {
                    this.scene.load.audio(audio.key, audio.path);
                }
            } catch (e) {
                console.log(`Audio ${audio.key} no encontrado`);
            }
        });
    }
    
    /**
     * Verifica si un asset está disponible
     */
    hasAsset(key) {
        return this.scene.textures.exists(key) || this.scene.cache.audio.exists(key);
    }
    
    /**
     * Obtiene un sprite, usando el personalizado si está disponible, o generando uno programáticamente
     */
    getSprite(key, generatorFunction) {
        if (this.hasAsset(key)) {
            return this.scene.add.image(0, 0, key);
        } else {
            return generatorFunction();
        }
    }
}

```

```markdown
# Guía de Assets para Plátano Borracho vs Monos

## Introducción

Este juego está diseñado para funcionar **completamente sin assets externos**, generando todos los gráficos programáticamente. Sin embargo, puedes mejorar significativamente la experiencia del jugador agregando assets personalizados.

## Estructura de Carpetas

```
assets/
├── images/
│   ├── sprites/          # Sprites de personajes y objetos
│   └── backgrounds/      # Fondos de niveles
├── audio/
│   ├── music/            # Música de fondo
│   └── sfx/              # Efectos de sonido
└── maps/                 # Mapas de niveles (opcional)
```

## Sprites Necesarios

### Jugador (Plátano Borracho)
- **Tamaño recomendado**: 40x60 píxeles
- **Formato**: PNG con transparencia
- **Nombre**: `player.png`
- **Animaciones opcionales**: 
  - `player_idle.png` (quieto)
  - `player_walk_1.png`, `player_walk_2.png` (caminar)
  - `player_jump.png` (saltar)
  - `player_throw.png` (lanzar)

### Enemigos (Monos)
- **Tamaño recomendado**: 40x40 píxeles (básico y rápido), 50x50 píxeles (fuerte)
- **Formato**: PNG con transparencia
- **Nombres**: 
  - `monkey_basic.png`
  - `monkey_fast.png`
  - `monkey_strong.png`

### Jefes (Gorilas)
- **Tamaño recomendado**: 80x80 píxeles (nivel 1), aumentando 10px por nivel
- **Formato**: PNG con transparencia
- **Nombres**: `gorilla_1.png`, `gorilla_2.png`, `gorilla_3.png`, etc.

### Objetos
- **Proyectil**: 16x16 píxeles, `projectile.png`
- **Plataforma**: Textura opcional, `platform.png` (se puede repetir)

## Fondos

### Menú Principal
- **Tamaño**: 1200x800 píxeles
- **Nombre**: `menu_bg.png`
- **Tema**: Jungla con elementos temáticos

### Niveles
- **Tamaño**: 1200x800 píxeles (o más ancho para scroll)
- **Nombres**: `jungle_bg_1.png`, `jungle_bg_2.png`, etc.
- **Tema**: Fondos de jungla con diferentes profundidades y elementos

## Audio

### Música de Fondo
- **Formato**: MP3 o OGG (OGG recomendado para mejor compresión)
- **Loop**: Todas las músicas deben hacer loop
- **Archivos**:
  - `menu_music.mp3` - Música del menú (tranquila, temática)
  - `game_music.mp3` - Música durante el juego (acción, ritmo)
  - `victory_music.mp3` - Música de victoria (celebratoria)

### Efectos de Sonido
- **Formato**: WAV o OGG (WAV para calidad, OGG para tamaño)
- **Archivos**:
  - `sfx_jump.wav` - Salto del jugador (corto, ~0.2s)
  - `sfx_throw.wav` - Lanzar proyectil (corto, ~0.1s)
  - `sfx_hit.wav` - Impacto de proyectil (corto, ~0.15s)
  - `sfx_enemy_death.wav` - Muerte de enemigo (corto, ~0.3s)
  - `sfx_player_hurt.wav` - Daño al jugador (corto, ~0.2s)
  - `sfx_game_over.wav` - Game over (medio, ~1s)
  - `sfx_victory.wav` - Victoria (medio, ~1.5s)
  - `sfx_boss_roar.wav` - Rugido del gorila (opcional, ~0.5s)

## Mapas (Opcional)

Los mapas pueden estar en formato JSON. Ver `maps/level_1_example.json` para un ejemplo.

### Estructura de Mapa JSON

```json
{
  "level": 1,
  "width": 3600,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 360,
      "height": 30
    }
  ],
  "enemies": [
    {
      "type": "monkey_basic",
      "x": 240,
      "y": 700
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 1,
    "x": 3000,
    "y": 600
  },
  "playerStart": {
    "x": 100,
    "y": 650
  }
}
```

## Cómo Usar Assets Personalizados

1. **Coloca los archivos** en las carpetas correspondientes según la estructura indicada.

2. **Usa el AssetLoader** (ver `assets/js/asset-loader.js`):
   ```javascript
   const loader = new AssetLoader(this);
   loader.preload();
   ```

3. **Modifica las clases de entidades** para usar los sprites cargados en lugar de generarlos programáticamente.

## Recursos Gratuitos Recomendados

- **Sprites**: OpenGameArt.org, itch.io (assets gratuitos)
- **Audio**: Freesound.org, OpenGameArt.org
- **Herramientas**: 
  - Aseprite (sprites)
  - GIMP/Photoshop (edición de imágenes)
  - Audacity (edición de audio)

## Notas Importantes

- El juego **funciona perfectamente sin assets externos**
- Los assets son **opcionales** pero mejoran la experiencia
- Asegúrate de que los archivos tengan los nombres exactos indicados
- Los formatos recomendados son PNG para imágenes y OGG/MP3 para audio
- Mantén los archivos optimizados (tamaño razonable) para mejor rendimiento

```

Estructura de la carpeta `assets` creada. Resumen:

## Estructura creada

```
assets/
├── README.md                    # Documentación principal
├── ASSETS_GUIDE.md              # Guía completa de assets
├── images/
│   ├── README.md                # Guía de imágenes
│   ├── sprites/                 # Carpeta para sprites
│   └── backgrounds/             # Carpeta para fondos
├── audio/
│   ├── README.md                # Guía de audio
│   ├── music/                   # Carpeta para música
│   └── sfx/                     # Carpeta para efectos de sonido
├── maps/
│   ├── README.md                # Guía de mapas
│   └── level_1_example.json     # Ejemplo de mapa en JSON
└── js/
    └── asset-loader.js          # Utilidad para cargar assets
```

## Contenido generado

1. Documentación:
   - `README.md` en cada carpeta explicando su propósito
   - `ASSETS_GUIDE.md` con guía de assets, tamaños recomendados y formatos

2. Archivos de utilidad:
   - `asset-loader.js`: Clase para cargar assets externos si están disponibles
   - `level_1_example.json`: Ejemplo de estructura de mapa

3. Carpetas con `.gitkeep`:
   - Mantienen la estructura en control de versiones aunque estén vacías

## Características

- El juego funciona sin assets externos (genera todo programáticamente)
- Estructura lista para agregar assets personalizados
- Documentación sobre qué assets agregar y dónde
- Utilidad `AssetLoader` para cargar assets si están disponibles
- Ejemplo de mapa JSON para niveles personalizados

## Próximos pasos (opcional)

1. Agregar sprites personalizados en `assets/images/sprites/`
2. Agregar fondos en `assets/images/backgrounds/`
3. Agregar música y efectos de sonido en `assets/audio/`
4. Crear mapas personalizados en `assets/maps/`

La estructura está lista. El juego funciona con assets generados programáticamente, y puedes agregar assets personalizados siguiendo la documentación.

```plaintext
assets/
├── README.md                    # Documentación principal
├── ASSETS_GUIDE.md              # Guía completa de assets
├── images/
│   ├── README.md                # Guía de imágenes
│   ├── sprites/                 # Carpeta para sprites
│   └── backgrounds/             # Carpeta para fondos
├── audio/
│   ├── README.md                # Guía de audio
│   ├── music/                   # Carpeta para música
│   └── sfx/                     # Carpeta para efectos de sonido
├── maps/
│   ├── README.md                # Guía de mapas
│   └── level_1_example.json     # Ejemplo de mapa en JSON
└── js/
    └── asset-loader.js          # Utilidad para cargar assets
```

---

**User**

Genera los assets indicados en @ASSETS_GUIDE.md para 4 niveles, incluyendo imágenes, mapas y audios 

---

**Cursor**

Generando los assets para 4 niveles: mapas JSON, scripts para generar sprites y fondos, y documentación para los audios.


```json
{
  "level": 1,
  "width": 3600,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 400,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 500,
      "y": 650,
      "width": 350,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 950,
      "y": 750,
      "width": 400,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 1450,
      "y": 600,
      "width": 450,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 2000,
      "y": 700,
      "width": 350,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 2450,
      "y": 550,
      "width": 400,
      "height": 30,
      "color": "#228b22"
    },
    {
      "x": 2950,
      "y": 650,
      "width": 500,
      "height": 30,
      "color": "#228b22"
    }
  ],
  "enemies": [
    {
      "type": "monkey_basic",
      "x": 200,
      "y": 700
    },
    {
      "type": "monkey_basic",
      "x": 650,
      "y": 600
    },
    {
      "type": "monkey_basic",
      "x": 1200,
      "y": 700
    },
    {
      "type": "monkey_basic",
      "x": 1600,
      "y": 550
    },
    {
      "type": "monkey_basic",
      "x": 2200,
      "y": 650
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 1,
    "x": 3200,
    "y": 600
  },
  "playerStart": {
    "x": 100,
    "y": 700
  }
}

```

```json
{
  "level": 2,
  "width": 4200,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 350,
      "height": 30,
      "color": "#2d5016"
    },
    {
      "x": 450,
      "y": 650,
      "width": 300,
      "height": 30,
      "color": "#2d5016"
    },
    {
      "x": 850,
      "y": 550,
      "width": 350,
      "height": 30,
      "color": "#2d5016"
    },
    {
      "x": 1300,
      "y": 700,
      "width": 400,
      "height": 30,
      "color": "#2d5016"
    },
    {
      "x": 1800,
      "y": 600,
      "width": 350,
      "height": 30,
      "color": "#2d5016"
    },
    {
      "x": 2250,
      "y": 500,
      "width": 400,
      "height": 30,
      "color": "#2d5016"
    },
    {
      "x": 2750,
      "y": 650,
      "width": 300,
      "height": 30,
      "color": "#2d5016"
    },
    {
      "x": 3150,
      "y": 550,
      "width": 400,
      "height": 30,
      "color": "#2d5016"
    },
    {
      "x": 3650,
      "y": 600,
      "width": 450,
      "height": 30,
      "color": "#2d5016"
    }
  ],
  "enemies": [
    {
      "type": "monkey_basic",
      "x": 200,
      "y": 700
    },
    {
      "type": "monkey_fast",
      "x": 600,
      "y": 600
    },
    {
      "type": "monkey_basic",
      "x": 1000,
      "y": 500
    },
    {
      "type": "monkey_fast",
      "x": 1500,
      "y": 650
    },
    {
      "type": "monkey_basic",
      "x": 2000,
      "y": 550
    },
    {
      "type": "monkey_strong",
      "x": 2400,
      "y": 450
    },
    {
      "type": "monkey_fast",
      "x": 2900,
      "y": 600
    },
    {
      "type": "monkey_basic",
      "x": 3300,
      "y": 500
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 2,
    "x": 3850,
    "y": 550
  },
  "playerStart": {
    "x": 100,
    "y": 700
  }
}

```

```json
{
  "level": 3,
  "width": 4800,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 300,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 400,
      "y": 650,
      "width": 280,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 750,
      "y": 550,
      "width": 300,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 1150,
      "y": 450,
      "width": 350,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 1600,
      "y": 600,
      "width": 300,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 2000,
      "y": 500,
      "width": 350,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 2450,
      "y": 650,
      "width": 280,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 2850,
      "y": 550,
      "width": 300,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 3250,
      "y": 450,
      "width": 350,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 3700,
      "y": 600,
      "width": 300,
      "height": 30,
      "color": "#1a3d0a"
    },
    {
      "x": 4100,
      "y": 500,
      "width": 500,
      "height": 30,
      "color": "#1a3d0a"
    }
  ],
  "enemies": [
    {
      "type": "monkey_fast",
      "x": 150,
      "y": 700
    },
    {
      "type": "monkey_strong",
      "x": 550,
      "y": 600
    },
    {
      "type": "monkey_fast",
      "x": 900,
      "y": 500
    },
    {
      "type": "monkey_basic",
      "x": 1350,
      "y": 400
    },
    {
      "type": "monkey_strong",
      "x": 1750,
      "y": 550
    },
    {
      "type": "monkey_fast",
      "x": 2200,
      "y": 450
    },
    {
      "type": "monkey_strong",
      "x": 2600,
      "y": 600
    },
    {
      "type": "monkey_fast",
      "x": 3000,
      "y": 500
    },
    {
      "type": "monkey_strong",
      "x": 3450,
      "y": 400
    },
    {
      "type": "monkey_fast",
      "x": 3850,
      "y": 550
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 3,
    "x": 4350,
    "y": 450
  },
  "playerStart": {
    "x": 100,
    "y": 700
  }
}

```

```json
{
  "level": 4,
  "width": 5400,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 280,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 350,
      "y": 650,
      "width": 250,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 650,
      "y": 550,
      "width": 280,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 1000,
      "y": 450,
      "width": 300,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 1400,
      "y": 600,
      "width": 250,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 1750,
      "y": 500,
      "width": 300,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 2150,
      "y": 400,
      "width": 350,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 2600,
      "y": 550,
      "width": 250,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 2950,
      "y": 450,
      "width": 300,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 3350,
      "y": 600,
      "width": 280,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 3750,
      "y": 500,
      "width": 300,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 4150,
      "y": 400,
      "width": 350,
      "height": 30,
      "color": "#0f2a05"
    },
    {
      "x": 4600,
      "y": 550,
      "width": 600,
      "height": 30,
      "color": "#0f2a05"
    }
  ],
  "enemies": [
    {
      "type": "monkey_strong",
      "x": 150,
      "y": 700
    },
    {
      "type": "monkey_fast",
      "x": 500,
      "y": 600
    },
    {
      "type": "monkey_strong",
      "x": 800,
      "y": 500
    },
    {
      "type": "monkey_fast",
      "x": 1200,
      "y": 400
    },
    {
      "type": "monkey_strong",
      "x": 1550,
      "y": 550
    },
    {
      "type": "monkey_fast",
      "x": 1900,
      "y": 450
    },
    {
      "type": "monkey_strong",
      "x": 2300,
      "y": 350
    },
    {
      "type": "monkey_fast",
      "x": 2750,
      "y": 500
    },
    {
      "type": "monkey_strong",
      "x": 3100,
      "y": 400
    },
    {
      "type": "monkey_fast",
      "x": 3500,
      "y": 550
    },
    {
      "type": "monkey_strong",
      "x": 3900,
      "y": 450
    },
    {
      "type": "monkey_fast",
      "x": 4350,
      "y": 350
    },
    {
      "type": "monkey_strong",
      "x": 4800,
      "y": 500
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 4,
    "x": 5100,
    "y": 500
  },
  "playerStart": {
    "x": 100,
    "y": 700
  }
}

```

```javascript
/**
 * Script para generar sprites del juego usando Phaser Graphics API
 * Ejecutar este script en la consola del navegador después de cargar Phaser
 * o integrarlo en una escena de preload
 */

class SpriteGenerator {
    constructor(scene) {
        this.scene = scene;
    }
    
    /**
     * Genera el sprite del jugador (plátano borracho)
     */
    generatePlayer() {
        const graphics = this.scene.add.graphics();
        const width = 40;
        const height = 60;
        
        // Cuerpo del plátano (amarillo)
        graphics.fillStyle(0xffd700);
        graphics.fillRoundedRect(0, 0, width, height, 10);
        
        // Detalles del plátano
        graphics.fillStyle(0xffed4e);
        graphics.fillRoundedRect(2, 2, width - 4, height - 4, 8);
        
        // Ojos
        graphics.fillStyle(0x000000);
        graphics.fillCircle(10, 20, 4);
        graphics.fillCircle(30, 20, 4);
        
        // Pupilas (ojos borrachos)
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(11, 19, 1.5);
        graphics.fillCircle(31, 19, 1.5);
        
        // Boca sonriente
        graphics.fillStyle(0xff6347);
        graphics.fillEllipse(20, 35, 15, 10);
        
        // Líneas del plátano
        graphics.lineStyle(2, 0xffaa00);
        graphics.lineBetween(5, 10, 5, 50);
        graphics.lineBetween(35, 10, 35, 50);
        
        const texture = graphics.generateTexture('player', width, height);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera sprite de mono básico
     */
    generateMonkeyBasic() {
        const graphics = this.scene.add.graphics();
        const size = 40;
        
        // Cuerpo del mono
        graphics.fillStyle(0x8b4513);
        graphics.fillCircle(size / 2, size / 2, size / 2);
        
        // Ojos
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(size / 2 - 8, size / 2 - 5, 6);
        graphics.fillCircle(size / 2 + 8, size / 2 - 5, 6);
        
        graphics.fillStyle(0x000000);
        graphics.fillCircle(size / 2 - 8, size / 2 - 5, 3);
        graphics.fillCircle(size / 2 + 8, size / 2 - 5, 3);
        
        // Boca
        graphics.fillStyle(0x000000);
        graphics.fillEllipse(size / 2, size / 2 + 8, 12, 8);
        
        // Nariz
        graphics.fillStyle(0x654321);
        graphics.fillEllipse(size / 2, size / 2 + 2, 6, 4);
        
        const texture = graphics.generateTexture('monkey_basic', size, size);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera sprite de mono rápido
     */
    generateMonkeyFast() {
        const graphics = this.scene.add.graphics();
        const size = 40;
        
        // Cuerpo más delgado
        graphics.fillStyle(0x9d5a2a);
        graphics.fillEllipse(size / 2, size / 2, size / 2, size / 2.5);
        
        // Ojos más grandes (más alerta)
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(size / 2 - 8, size / 2 - 5, 7);
        graphics.fillCircle(size / 2 + 8, size / 2 - 5, 7);
        
        graphics.fillStyle(0x000000);
        graphics.fillCircle(size / 2 - 8, size / 2 - 5, 4);
        graphics.fillCircle(size / 2 + 8, size / 2 - 5, 4);
        
        // Boca
        graphics.fillStyle(0x000000);
        graphics.fillEllipse(size / 2, size / 2 + 8, 10, 6);
        
        const texture = graphics.generateTexture('monkey_fast', size, size);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera sprite de mono fuerte
     */
    generateMonkeyStrong() {
        const graphics = this.scene.add.graphics();
        const size = 50;
        
        // Cuerpo más grande y musculoso
        graphics.fillStyle(0x654321);
        graphics.fillCircle(size / 2, size / 2, size / 2);
        
        // Músculos
        graphics.fillStyle(0x5a3a1a);
        graphics.fillCircle(size / 2 - 8, size / 2, 8);
        graphics.fillCircle(size / 2 + 8, size / 2, 8);
        
        // Ojos enojados
        graphics.fillStyle(0xff0000);
        graphics.fillCircle(size / 2 - 10, size / 2 - 6, 7);
        graphics.fillCircle(size / 2 + 10, size / 2 - 6, 7);
        
        graphics.fillStyle(0x000000);
        graphics.fillCircle(size / 2 - 10, size / 2 - 6, 4);
        graphics.fillCircle(size / 2 + 10, size / 2 - 6, 4);
        
        // Boca grande
        graphics.fillStyle(0x000000);
        graphics.fillEllipse(size / 2, size / 2 + 10, 16, 10);
        
        // Dientes
        graphics.fillStyle(0xffffff);
        graphics.fillRect(size / 2 - 4, size / 2 + 8, 3, 4);
        graphics.fillRect(size / 2 + 1, size / 2 + 8, 3, 4);
        
        const texture = graphics.generateTexture('monkey_strong', size, size);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera sprite de gorila
     */
    generateGorilla(level = 1) {
        const graphics = this.scene.add.graphics();
        const size = 80 + (level * 10);
        
        // Cuerpo del gorila
        graphics.fillStyle(0x2c1810);
        graphics.fillRoundedRect(0, 0, size, size, 15);
        
        // Pecho más claro
        graphics.fillStyle(0x3d2817);
        graphics.fillEllipse(size / 2, size / 2 + 5, size * 0.4, size * 0.3);
        
        // Ojos rojos (agresivos)
        graphics.fillStyle(0xff0000);
        graphics.fillCircle(size / 2 - 15, size / 2 - 10, 8);
        graphics.fillCircle(size / 2 + 15, size / 2 - 10, 8);
        
        graphics.fillStyle(0x000000);
        graphics.fillCircle(size / 2 - 15, size / 2 - 10, 5);
        graphics.fillCircle(size / 2 + 15, size / 2 - 10, 5);
        
        // Boca grande
        graphics.fillStyle(0x000000);
        graphics.fillEllipse(size / 2, size / 2 + 15, size * 0.25, size * 0.18);
        
        // Dientes grandes
        graphics.fillStyle(0xffffff);
        graphics.fillRect(size / 2 - 6, size / 2 + 12, 4, 6);
        graphics.fillRect(size / 2 + 2, size / 2 + 12, 4, 6);
        
        // Brazos musculosos
        graphics.fillStyle(0x1a0f08);
        graphics.fillEllipse(size * 0.2, size / 2, size * 0.2, size * 0.3);
        graphics.fillEllipse(size * 0.8, size / 2, size * 0.2, size * 0.3);
        
        const texture = graphics.generateTexture(`gorilla_${level}`, size, size);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera sprite de proyectil
     */
    generateProjectile() {
        const graphics = this.scene.add.graphics();
        const size = 16;
        
        // Círculo amarillo brillante
        graphics.fillStyle(0xffff00);
        graphics.fillCircle(size / 2, size / 2, size / 2);
        
        // Brillo
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(size / 2 - 2, size / 2 - 2, 3);
        
        const texture = graphics.generateTexture('projectile', size, size);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera todos los sprites
     */
    generateAll() {
        this.generatePlayer();
        this.generateMonkeyBasic();
        this.generateMonkeyFast();
        this.generateMonkeyStrong();
        this.generateProjectile();
        
        // Generar gorilas para niveles 1-4
        for (let i = 1; i <= 4; i++) {
            this.generateGorilla(i);
        }
    }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpriteGenerator;
}

```

```javascript
/**
 * Script para generar fondos del juego usando Phaser Graphics API
 */

class BackgroundGenerator {
    constructor(scene) {
        this.scene = scene;
    }
    
    /**
     * Genera fondo del menú principal
     */
    generateMenuBackground() {
        const graphics = this.scene.add.graphics();
        const width = 1200;
        const height = 800;
        
        // Fondo base (verde jungla oscuro)
        graphics.fillStyle(0x1a4d2e);
        graphics.fillRect(0, 0, width, height);
        
        // Capa de vegetación
        graphics.fillStyle(0x2d5016);
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 30 + Math.random() * 40;
            graphics.fillCircle(x, y, size);
        }
        
        // Hojas
        graphics.fillStyle(0x228b22);
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            graphics.fillEllipse(x, y, 40 + Math.random() * 30, 20 + Math.random() * 20);
        }
        
        // Lianas
        graphics.lineStyle(3, 0x3d5a1f);
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * width;
            graphics.lineBetween(x, 0, x + (Math.random() - 0.5) * 100, height);
        }
        
        const texture = graphics.generateTexture('menu_bg', width, height);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera fondo de nivel de jungla
     */
    generateJungleBackground(level = 1) {
        const graphics = this.scene.add.graphics();
        const width = 1200;
        const height = 800;
        
        // Colores según el nivel (más oscuro en niveles avanzados)
        const baseColors = [
            { dark: 0x1a4d2e, mid: 0x2d5016, light: 0x228b22 },
            { dark: 0x153d25, mid: 0x254014, light: 0x1f6b1f },
            { dark: 0x0f2a05, mid: 0x1a3d0a, light: 0x155515 },
            { dark: 0x0a1f03, mid: 0x123008, light: 0x0f440f }
        ];
        
        const colors = baseColors[Math.min(level - 1, 3)];
        
        // Fondo base
        graphics.fillStyle(colors.dark);
        graphics.fillRect(0, 0, width, height);
        
        // Cielo (gradiente simulado)
        graphics.fillStyle(0x87ceeb);
        graphics.fillRect(0, 0, width, height * 0.3);
        
        // Nubes
        graphics.fillStyle(0xffffff);
        for (let i = 0; i < 5; i++) {
            const x = (i * 250) + Math.random() * 100;
            const y = 50 + Math.random() * 100;
            graphics.fillEllipse(x, y, 80 + Math.random() * 40, 40 + Math.random() * 20);
        }
        
        // Vegetación de fondo
        graphics.fillStyle(colors.mid);
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = height * 0.3 + Math.random() * (height * 0.7);
            const size = 20 + Math.random() * 30;
            graphics.fillCircle(x, y, size);
        }
        
        // Árboles de fondo
        graphics.fillStyle(colors.mid);
        for (let i = 0; i < 8; i++) {
            const x = i * 150 + Math.random() * 50;
            const treeHeight = 200 + Math.random() * 150;
            const treeWidth = 40 + Math.random() * 20;
            graphics.fillRect(x, height - treeHeight, treeWidth, treeHeight);
            
            // Copa del árbol
            graphics.fillStyle(colors.light);
            graphics.fillCircle(x + treeWidth / 2, height - treeHeight, 60 + Math.random() * 40);
            graphics.fillStyle(colors.mid);
        }
        
        // Hojas flotantes
        graphics.fillStyle(colors.light);
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            graphics.fillEllipse(x, y, 25 + Math.random() * 20, 15 + Math.random() * 10);
        }
        
        // Lianas
        graphics.lineStyle(2, 0x3d5a1f);
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * width;
            graphics.lineBetween(x, height * 0.3, x + (Math.random() - 0.5) * 80, height);
        }
        
        const texture = graphics.generateTexture(`jungle_bg_${level}`, width, height);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera todos los fondos
     */
    generateAll() {
        this.generateMenuBackground();
        for (let i = 1; i <= 4; i++) {
            this.generateJungleBackground(i);
        }
    }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundGenerator;
}

```

```markdown
# Guía para Generar Audio del Juego

Como no es posible generar archivos de audio binarios directamente, esta guía te ayudará a crear o encontrar los archivos de audio necesarios.

## Opción 1: Usar Recursos Gratuitos

### Sitios Recomendados
- **Freesound.org**: Efectos de sonido gratuitos con licencia Creative Commons
- **OpenGameArt.org**: Música y efectos de sonido para juegos
- **Zapsplat.com**: Efectos de sonido gratuitos (requiere registro)
- **Incompetech.com**: Música libre de derechos de Kevin MacLeod

### Búsquedas Recomendadas

#### Efectos de Sonido
- `sfx_jump.wav`: Buscar "jump sound", "hop sound"
- `sfx_throw.wav`: Buscar "throw sound", "whoosh sound"
- `sfx_hit.wav`: Buscar "hit sound", "impact sound", "punch sound"
- `sfx_enemy_death.wav`: Buscar "enemy death", "monster death", "defeat sound"
- `sfx_player_hurt.wav`: Buscar "hurt sound", "damage sound", "ouch sound"
- `sfx_game_over.wav`: Buscar "game over sound", "fail sound"
- `sfx_victory.wav`: Buscar "victory sound", "win sound", "success sound"
- `sfx_boss_roar.wav`: Buscar "roar sound", "monster roar", "gorilla sound"

#### Música
- `menu_music.mp3`: Buscar "jungle theme", "tropical music", "adventure menu"
- `game_music.mp3`: Buscar "action music", "adventure music", "jungle adventure"
- `victory_music.mp3`: Buscar "victory theme", "success music", "celebration"

## Opción 2: Generar con Herramientas

### Herramientas Gratuitas

#### Para Efectos de Sonido
1. **Bfxr** (http://www.bfxr.net/): Generador de efectos de sonido 8-bit
2. **ChipTone** (https://sfbgames.com/chiptone/): Generador de sonidos retro
3. **Audacity** (https://www.audacityteam.org/): Editor de audio gratuito

#### Para Música
1. **Bosca Ceoil** (https://boscaceoil.net/): Compositor de música chiptune
2. **LMMS** (https://lmms.io/): Estación de trabajo de audio digital
3. **MuseScore** (https://musescore.org/): Editor de partituras

### Ejemplo con Bfxr
1. Abre Bfxr en el navegador
2. Para `sfx_jump.wav`: Usa "Jump" preset
3. Para `sfx_throw.wav`: Usa "Powerup" preset y ajusta
4. Para `sfx_hit.wav`: Usa "Hit" preset
5. Exporta como WAV

### Ejemplo con Audacity
1. Abre Audacity
2. Genera → Tone para crear sonidos básicos
3. Efectos → Reverb para añadir profundidad
4. Efectos → Echo para efectos especiales
5. Exporta como WAV o MP3

## Opción 3: Usar Text-to-Speech y Convertir (Temporal)

Puedes usar servicios de TTS para generar sonidos básicos y luego procesarlos con Audacity.

## Especificaciones Técnicas

### Música
- **Formato**: MP3 (128-192 kbps) o OGG Vorbis
- **Duración**: Loop infinito (3-5 minutos recomendado)
- **Volumen**: Normalizado a -3dB
- **Frecuencia**: 44.1 kHz

### Efectos de Sonido
- **Formato**: WAV (16-bit, 44.1 kHz) o OGG
- **Duración**: 
  - Cortos: 0.1-0.3 segundos (jump, throw, hit)
  - Medios: 0.5-1.5 segundos (death, hurt, victory)
- **Volumen**: Normalizado según importancia
- **Frecuencia**: 44.1 kHz

## Estructura de Archivos Esperada

```
assets/audio/
├── music/
│   ├── menu_music.mp3
│   ├── game_music.mp3
│   └── victory_music.mp3
└── sfx/
    ├── sfx_jump.wav
    ├── sfx_throw.wav
    ├── sfx_hit.wav
    ├── sfx_enemy_death.wav
    ├── sfx_player_hurt.wav
    ├── sfx_game_over.wav
    ├── sfx_victory.wav
    └── sfx_boss_roar.wav
```

## Nota Importante

El juego funciona perfectamente sin archivos de audio. Los sonidos son opcionales pero mejoran significativamente la experiencia del jugador.

## Recursos Específicos Recomendados

### Música de Kevin MacLeod (Incompetech)
- "Jungle Adventure" para música del juego
- "Local Forecast" para menú
- "Monkeys Spinning Monkeys" (temático!)

### Freesound Tags Útiles
- `game`, `8bit`, `retro`, `jump`, `hit`, `victory`, `jungle`, `monkey`

```

```javascript
/**
 * Script principal para generar todos los assets del juego
 * Este script puede ejecutarse en una escena de preload de Phaser
 * 
 * Uso:
 * const generator = new AssetGenerator(this);
 * generator.generateAll();
 */

class AssetGenerator {
    constructor(scene) {
        this.scene = scene;
        this.spriteGenerator = new SpriteGenerator(scene);
        this.backgroundGenerator = new BackgroundGenerator(scene);
    }
    
    /**
     * Genera todos los assets del juego
     */
    generateAll() {
        console.log('Generando sprites...');
        this.spriteGenerator.generateAll();
        
        console.log('Generando fondos...');
        this.backgroundGenerator.generateAll();
        
        console.log('¡Todos los assets generados!');
    }
    
    /**
     * Preload personalizado que genera assets si no existen
     */
    preload() {
        // Intentar cargar assets externos primero
        this.loadExternalAssets();
        
        // Si no existen, generar programáticamente
        this.generateAll();
    }
    
    /**
     * Intenta cargar assets externos
     */
    loadExternalAssets() {
        // Sprites
        const sprites = [
            'player', 'monkey_basic', 'monkey_fast', 'monkey_strong', 'projectile'
        ];
        
        for (let i = 1; i <= 4; i++) {
            sprites.push(`gorilla_${i}`);
        }
        
        sprites.forEach(sprite => {
            try {
                this.scene.load.image(sprite, `assets/images/sprites/${sprite}.png`);
            } catch (e) {
                console.log(`Sprite ${sprite} no encontrado, se generará programáticamente`);
            }
        });
        
        // Fondos
        const backgrounds = ['menu_bg'];
        for (let i = 1; i <= 4; i++) {
            backgrounds.push(`jungle_bg_${i}`);
        }
        
        backgrounds.forEach(bg => {
            try {
                this.scene.load.image(bg, `assets/images/backgrounds/${bg}.png`);
            } catch (e) {
                console.log(`Fondo ${bg} no encontrado, se generará programáticamente`);
            }
        });
        
        // Audio
        const audioFiles = [
            { key: 'menu_music', path: 'assets/audio/music/menu_music.mp3' },
            { key: 'game_music', path: 'assets/audio/music/game_music.mp3' },
            { key: 'victory_music', path: 'assets/audio/music/victory_music.mp3' },
            { key: 'sfx_jump', path: 'assets/audio/sfx/sfx_jump.wav' },
            { key: 'sfx_throw', path: 'assets/audio/sfx/sfx_throw.wav' },
            { key: 'sfx_hit', path: 'assets/audio/sfx/sfx_hit.wav' },
            { key: 'sfx_enemy_death', path: 'assets/audio/sfx/sfx_enemy_death.wav' },
            { key: 'sfx_player_hurt', path: 'assets/audio/sfx/sfx_player_hurt.wav' },
            { key: 'sfx_game_over', path: 'assets/audio/sfx/sfx_game_over.wav' },
            { key: 'sfx_victory', path: 'assets/audio/sfx/sfx_victory.wav' },
            { key: 'sfx_boss_roar', path: 'assets/audio/sfx/sfx_boss_roar.wav' }
        ];
        
        audioFiles.forEach(audio => {
            try {
                this.scene.load.audio(audio.key, audio.path);
            } catch (e) {
                console.log(`Audio ${audio.key} no encontrado`);
            }
        });
    }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetGenerator;
}

```

```markdown
# Resumen de Assets Generados

## ✅ Assets Completados

### Mapas (JSON)
- ✅ `maps/level_1.json` - Mapa del nivel 1
- ✅ `maps/level_2.json` - Mapa del nivel 2 (más difícil)
- ✅ `maps/level_3.json` - Mapa del nivel 3 (aún más difícil)
- ✅ `maps/level_4.json` - Mapa del nivel 4 (máxima dificultad)

### Scripts de Generación
- ✅ `js/generate-sprites.js` - Generador de sprites programáticos
- ✅ `js/generate-backgrounds.js` - Generador de fondos programáticos
- ✅ `js/generate-all-assets.js` - Script principal para generar todos los assets
- ✅ `js/asset-loader.js` - Cargador de assets externos

### Documentación
- ✅ `ASSETS_GUIDE.md` - Guía completa de assets
- ✅ `AUDIO_GENERATION_GUIDE.md` - Guía para generar/obtener audio
- ✅ `ASSETS_SUMMARY.md` - Este archivo

## 📋 Assets que Requieren Acción Externa

### Imágenes (Opcionales)
Los sprites y fondos se generan automáticamente, pero puedes agregar:
- `images/sprites/player.png`
- `images/sprites/monkey_basic.png`
- `images/sprites/monkey_fast.png`
- `images/sprites/monkey_strong.png`
- `images/sprites/gorilla_1.png` a `gorilla_4.png`
- `images/sprites/projectile.png`
- `images/backgrounds/menu_bg.png`
- `images/backgrounds/jungle_bg_1.png` a `jungle_bg_4.png`

### Audio (Opcional pero Recomendado)
Ver `AUDIO_GENERATION_GUIDE.md` para instrucciones detalladas:
- `audio/music/menu_music.mp3`
- `audio/music/game_music.mp3`
- `audio/music/victory_music.mp3`
- `audio/sfx/sfx_jump.wav`
- `audio/sfx/sfx_throw.wav`
- `audio/sfx/sfx_hit.wav`
- `audio/sfx/sfx_enemy_death.wav`
- `audio/sfx/sfx_player_hurt.wav`
- `audio/sfx/sfx_game_over.wav`
- `audio/sfx/sfx_victory.wav`
- `audio/sfx/sfx_boss_roar.wav`

## 🎮 Cómo Usar los Assets Generados

### Mapas
Los mapas JSON están listos para usar. Para cargarlos en el juego, modifica `GameScene.js`:

```javascript
// En GameScene.js, método create()
fetch('assets/maps/level_' + this.level + '.json')
    .then(response => response.json())
    .then(mapData => {
        // Usar mapData para crear plataformas y enemigos
        this.loadMap(mapData);
    });
```

### Sprites y Fondos Generados
Los scripts de generación crean texturas en tiempo de ejecución. Se usan automáticamente si no hay assets externos.

### Audio
Una vez que agregues los archivos de audio, se cargarán automáticamente si usas el `AssetLoader`.

## 📊 Estadísticas de los Mapas

### Nivel 1
- **Ancho**: 3600px
- **Plataformas**: 7
- **Enemigos**: 5 monos básicos
- **Jefe**: Gorila nivel 1

### Nivel 2
- **Ancho**: 4200px
- **Plataformas**: 9
- **Enemigos**: 8 (mezcla de básicos, rápidos y fuertes)
- **Jefe**: Gorila nivel 2

### Nivel 3
- **Ancho**: 4800px
- **Plataformas**: 11
- **Enemigos**: 10 (más fuertes y rápidos)
- **Jefe**: Gorila nivel 3

### Nivel 4
- **Ancho**: 5400px
- **Plataformas**: 13
- **Enemigos**: 13 (mayoría fuertes y rápidos)
- **Jefe**: Gorila nivel 4

## 🚀 Próximos Pasos

1. **Probar los mapas**: Integrar la carga de mapas JSON en `GameScene.js`
2. **Agregar audio**: Seguir la guía en `AUDIO_GENERATION_GUIDE.md`
3. **Personalizar sprites**: Agregar sprites PNG personalizados si lo deseas
4. **Optimizar**: Comprimir imágenes y audio para mejor rendimiento

## 📝 Notas

- Todos los assets son **opcionales** - el juego funciona sin ellos
- Los mapas JSON están **listos para usar**
- Los sprites y fondos se generan **automáticamente** si no hay archivos externos
- El audio mejora la experiencia pero **no es esencial**

```

Assets generados para 4 niveles. Resumen:

## Assets generados

### Mapas JSON (completos)
- `maps/level_1.json` - Nivel 1: 7 plataformas, 5 enemigos básicos, gorila nivel 1
- `maps/level_2.json` - Nivel 2: 9 plataformas, 8 enemigos (mezcla), gorila nivel 2
- `maps/level_3.json` - Nivel 3: 11 plataformas, 10 enemigos (más difíciles), gorila nivel 3
- `maps/level_4.json` - Nivel 4: 13 plataformas, 13 enemigos (mayoría fuertes), gorila nivel 4

Cada mapa incluye:
- Posiciones de plataformas
- Tipos y posiciones de enemigos
- Posición del jefe (gorila)
- Punto de inicio del jugador

### Scripts de generación de imágenes

1. `js/generate-sprites.js` - Genera sprites programáticamente:
   - Jugador (plátano borracho)
   - Mono básico, rápido y fuerte
   - Gorilas para niveles 1-4
   - Proyectiles

2. `js/generate-backgrounds.js` - Genera fondos programáticamente:
   - Fondo del menú principal
   - Fondos de jungla para niveles 1-4 (más oscuros por nivel)

3. `js/generate-all-assets.js` - Script principal que genera todos los assets

### Documentación de audio

- `audio/AUDIO_GENERATION_GUIDE.md` - Guía para obtener/generar audio:
  - Sitios recomendados (Freesound, OpenGameArt, etc.)
  - Herramientas gratuitas (Bfxr, Audacity, etc.)
  - Especificaciones técnicas
  - Lista de archivos necesarios

### Documentación adicional

- `ASSETS_SUMMARY.md` - Resumen de todos los assets generados
- `ASSETS_GUIDE.md` - Guía de assets (ya existía)

## Características de los mapas

- Dificultad progresiva: cada nivel es más largo y difícil
- Variedad de enemigos: mezcla de tipos según el nivel
- Diseño de plataformas: diferentes alturas y configuraciones
- Posicionamiento estratégico: enemigos y jefes en posiciones desafiantes

## Cómo usar los assets

### Mapas
Los mapas JSON están listos. Para usarlos, modifica `GameScene.js` para cargar el JSON correspondiente al nivel.

### Sprites y fondos
Los scripts generan los assets automáticamente en tiempo de ejecución. Se usan si no hay archivos externos.

### Audio
Sigue la guía en `AUDIO_GENERATION_GUIDE.md` para obtener o generar los archivos de audio.

## Nota importante

No puedo generar archivos binarios (imágenes PNG o audio MP3/WAV). He creado:
- Mapas JSON completos
- Scripts que generan sprites y fondos programáticamente
- Documentación para obtener/generar audio

El juego funciona con los assets generados programáticamente. Los archivos de audio son opcionales pero recomendados.

¿Quieres que integre la carga de mapas JSON en `GameScene.js` o que ajuste algo más?

---

**User**

Investiga que herramientas de IA gratuitas me permitan definir los elementos de audio e imagen que me faltan. Generame los prompts necesarios para la generación de los audios e imágenes requeridos

---

**Cursor**

Investigando herramientas de IA gratuitas para generar audio e imágenes y preparando los prompts necesarios.


Creando un documento con herramientas de IA gratuitas y los prompts necesarios para generar todos los assets.


```markdown
# Herramientas de IA Gratuitas y Prompts para Assets

## 🎨 Herramientas de IA para Imágenes

### Recomendadas (Gratuitas o con Plan Gratuito)

1. **Leonardo.ai** ⭐ RECOMENDADO
   - URL: https://leonardo.ai
   - Plan gratuito: 150 imágenes/día
   - Ideal para: Sprites de personajes y fondos
   - Estilo: Permite control fino del estilo artístico

2. **Craiyon** (DALL-E Mini)
   - URL: https://www.craiyon.com
   - Completamente gratuito
   - Ideal para: Conceptos rápidos y prototipos

3. **Bing Image Creator** (DALL-E 3)
   - URL: https://www.bing.com/create
   - Gratis con cuenta Microsoft
   - Ideal para: Imágenes de alta calidad

4. **Stable Diffusion** (Hugging Face)
   - URL: https://huggingface.co/spaces/stabilityai/stable-diffusion
   - Completamente gratuito
   - Ideal para: Control avanzado con prompts detallados

5. **Pixilart AI**
   - URL: https://www.pixilart.com
   - Gratis
   - Ideal para: Sprites pixel art

### Configuración Recomendada
- **Resolución**: 512x512 para sprites, 1024x768 para fondos
- **Estilo**: Pixel art o 2D cartoon
- **Formato**: PNG con transparencia

---

## 🎵 Herramientas de IA para Audio

### Recomendadas (Gratuitas o con Plan Gratuito)

1. **Suno AI** ⭐ RECOMENDADO PARA MÚSICA
   - URL: https://suno.ai
   - Plan gratuito disponible
   - Ideal para: Música de fondo con letras opcionales
   - Características: Genera música completa con instrumentos

2. **MusicGen (Meta)** ⭐ RECOMENDADO PARA MÚSICA
   - URL: https://huggingface.co/spaces/facebook/MusicGen
   - Completamente gratuito
   - Ideal para: Música instrumental de fondo
   - Características: Control de duración y estilo

3. **AIVA** (Plan Gratuito Limitado)
   - URL: https://www.aiva.ai
   - Plan gratuito con límites
   - Ideal para: Música de fondo profesional

4. **Mubert** (Plan Gratuito Limitado)
   - URL: https://mubert.com
   - Plan gratuito disponible
   - Ideal para: Música ambiental

5. **Freesound.org + AI Processing**
   - URL: https://freesound.org
   - Completamente gratuito
   - Ideal para: Efectos de sonido (buscar y descargar)

6. **ElevenLabs** (Para Efectos de Voz)
   - URL: https://elevenlabs.io
   - Plan gratuito limitado
   - Ideal para: Rugidos, gritos, efectos de voz

### Para Efectos de Sonido Específicos
- **Bfxr**: http://www.bfxr.net (Generador de sonidos 8-bit)
- **ChipTone**: https://sfbgames.com/chiptone/ (Generador de sonidos retro)

---

## 📝 PROMPTS PARA SPRITES

### 1. Jugador - Plátano Borracho (player.png)

#### Leonardo.ai / Stable Diffusion:
```
A cute cartoon banana character, yellow banana with a happy drunk expression, 
two black dot eyes slightly misaligned, red smiling mouth, simple 2D sprite style, 
pixel art or flat cartoon, transparent background, 40x60 pixels, game sprite, 
side view, friendly character, bright colors, clean lines
```

#### Bing Image Creator:
```
Cartoon banana character sprite, yellow banana with drunk happy face, 
black dot eyes, red smile, 2D game sprite, pixel art style, 
transparent background, side view, 40x60 pixels, simple and cute
```

#### Pixilart:
```
Drunk banana character, yellow, happy face, game sprite, 
pixel art, transparent background, side view
```

---

### 2. Mono Básico (monkey_basic.png)

#### Leonardo.ai / Stable Diffusion:
```
Simple cartoon monkey sprite, brown monkey, round body, 
two white eyes with black pupils, small black nose, 
simple mouth, 2D sprite style, pixel art, transparent background, 
40x40 pixels, side view, friendly enemy character, 
game sprite, clean simple design
```

#### Bing Image Creator:
```
Cartoon monkey sprite, brown monkey character, round body, 
big eyes, simple design, 2D game sprite, pixel art, 
transparent background, 40x40 pixels, side view
```

---

### 3. Mono Rápido (monkey_fast.png)

#### Leonardo.ai / Stable Diffusion:
```
Fast cartoon monkey sprite, brown monkey, slim athletic body, 
large alert eyes, streamlined design, 2D sprite style, 
pixel art, transparent background, 40x40 pixels, side view, 
speed lines optional, game sprite, dynamic pose
```

#### Bing Image Creator:
```
Fast monkey sprite, brown monkey, slim body, alert expression, 
2D game sprite, pixel art style, transparent background, 
40x40 pixels, side view, dynamic character
```

---

### 4. Mono Fuerte (monkey_strong.png)

#### Leonardo.ai / Stable Diffusion:
```
Strong muscular monkey sprite, dark brown monkey, large body, 
angry red eyes, big muscles visible, fierce expression, 
2D sprite style, pixel art, transparent background, 50x50 pixels, 
side view, boss enemy character, game sprite, intimidating
```

#### Bing Image Creator:
```
Strong monkey sprite, dark brown muscular monkey, angry red eyes, 
large body, 2D game sprite, pixel art style, transparent background, 
50x50 pixels, side view, boss character
```

---

### 5. Gorila Nivel 1 (gorilla_1.png)

#### Leonardo.ai / Stable Diffusion:
```
Large cartoon gorilla boss sprite, dark brown gorilla, 
massive body, red glowing eyes, angry expression, 
big mouth with white teeth, muscular arms, 2D sprite style, 
pixel art, transparent background, 80x80 pixels, 
side view, game boss character, intimidating
```

#### Bing Image Creator:
```
Gorilla boss sprite, dark brown large gorilla, red eyes, 
angry face, 2D game sprite, pixel art style, 
transparent background, 80x80 pixels, side view, boss character
```

---

### 6. Gorila Nivel 2 (gorilla_2.png)

#### Leonardo.ai / Stable Diffusion:
```
Larger gorilla boss sprite, darker brown gorilla, 
even more massive body, brighter red glowing eyes, 
more muscular, fierce expression, 2D sprite style, 
pixel art, transparent background, 90x90 pixels, 
side view, advanced boss character, more intimidating
```

---

### 7. Gorila Nivel 3 (gorilla_3.png)

#### Leonardo.ai / Stable Diffusion:
```
Huge gorilla boss sprite, very dark brown almost black gorilla, 
extremely massive body, bright red glowing eyes, 
extremely muscular, very fierce expression, 2D sprite style, 
pixel art, transparent background, 100x100 pixels, 
side view, elite boss character, very intimidating
```

---

### 8. Gorila Nivel 4 (gorilla_4.png)

#### Leonardo.ai / Stable Diffusion:
```
Gigantic gorilla boss sprite, black gorilla with dark brown highlights, 
massive muscular body, bright red glowing eyes, 
extremely fierce expression, 2D sprite style, pixel art, 
transparent background, 110x110 pixels, side view, 
final boss character, extremely intimidating, powerful
```

---

### 9. Proyectil (projectile.png)

#### Leonardo.ai / Stable Diffusion:
```
Simple yellow projectile sprite, bright yellow circle, 
glowing effect, simple design, 2D sprite style, 
pixel art, transparent background, 16x16 pixels, 
game projectile, bright and visible
```

#### Bing Image Creator:
```
Yellow projectile sprite, bright yellow glowing circle, 
simple design, 2D game sprite, pixel art style, 
transparent background, 16x16 pixels
```

---

## 🖼️ PROMPTS PARA FONDOS

### 1. Fondo del Menú (menu_bg.png)

#### Leonardo.ai / Stable Diffusion:
```
Jungle background for game menu, tropical jungle scene, 
dense green vegetation, palm trees, vines, exotic plants, 
warm lighting, game background, 2D style, 1200x800 pixels, 
lush green colors, atmospheric, inviting
```

#### Bing Image Creator:
```
Tropical jungle background, dense green vegetation, 
palm trees, game menu background, 2D cartoon style, 
1200x800 pixels, warm colors, inviting atmosphere
```

---

### 2. Fondo Nivel 1 (jungle_bg_1.png)

#### Leonardo.ai / Stable Diffusion:
```
Bright jungle background level 1, tropical jungle scene, 
green trees, blue sky with white clouds, sunlight filtering through, 
lush vegetation, game background, 2D style, 1200x800 pixels, 
cheerful and bright, beginner level atmosphere
```

#### Bing Image Creator:
```
Bright tropical jungle background, green trees, blue sky, 
sunlight, game level background, 2D cartoon style, 
1200x800 pixels, bright and cheerful
```

---

### 3. Fondo Nivel 2 (jungle_bg_2.png)

#### Leonardo.ai / Stable Diffusion:
```
Darker jungle background level 2, dense tropical jungle, 
darker green tones, cloudy sky, less sunlight, 
thicker vegetation, game background, 2D style, 1200x800 pixels, 
slightly ominous, medium difficulty atmosphere
```

#### Bing Image Creator:
```
Darker jungle background, dense vegetation, cloudy sky, 
game level background, 2D cartoon style, 1200x800 pixels, 
darker tones, medium difficulty
```

---

### 4. Fondo Nivel 3 (jungle_bg_3.png)

#### Leonardo.ai / Stable Diffusion:
```
Very dark jungle background level 3, deep jungle scene, 
very dark green and brown tones, stormy sky, 
minimal sunlight, very dense vegetation, game background, 
2D style, 1200x800 pixels, ominous and challenging atmosphere
```

#### Bing Image Creator:
```
Dark jungle background, deep forest, stormy sky, 
game level background, 2D cartoon style, 1200x800 pixels, 
very dark tones, challenging atmosphere
```

---

### 5. Fondo Nivel 4 (jungle_bg_4.png)

#### Leonardo.ai / Stable Diffusion:
```
Extremely dark jungle background level 4, deepest jungle scene, 
almost black green tones, dark stormy sky, no sunlight, 
extremely dense and dangerous vegetation, game background, 
2D style, 1200x800 pixels, very ominous, final level atmosphere, 
dangerous and challenging
```

#### Bing Image Creator:
```
Very dark jungle background, deepest forest, dark sky, 
game level background, 2D cartoon style, 1200x800 pixels, 
extremely dark, final level atmosphere
```

---

## 🎵 PROMPTS PARA AUDIO

### MÚSICA

### 1. Música del Menú (menu_music.mp3)

#### Suno AI:
```
[Style: Tropical, Calm, Adventure]
[Genre: Tropical Adventure Music]
A calm and inviting tropical jungle theme music, 
light percussion, soft flute melodies, warm and welcoming, 
perfect for a game menu, loopable, 2-3 minutes, 
instrumental, no lyrics, cheerful and adventurous atmosphere
```

#### MusicGen:
```
Tropical jungle theme music, calm and inviting, 
light percussion, soft melodies, warm atmosphere, 
game menu music, loopable, instrumental, cheerful
```

---

### 2. Música del Juego (game_music.mp3)

#### Suno AI:
```
[Style: Action, Adventure, Energetic]
[Genre: Adventure Game Music]
An energetic and exciting jungle adventure music, 
upbeat tempo, drums and percussion, adventurous melody, 
perfect for platform game action, loopable, 3-4 minutes, 
instrumental, no lyrics, exciting and motivating atmosphere
```

#### MusicGen:
```
Action adventure jungle music, energetic and exciting, 
upbeat tempo, drums, adventurous, game action music, 
loopable, instrumental, motivating
```

---

### 3. Música de Victoria (victory_music.mp3)

#### Suno AI:
```
[Style: Celebration, Victory, Triumphant]
[Genre: Victory Fanfare]
A triumphant and celebratory victory music, 
brass fanfare, uplifting melody, happy and rewarding, 
perfect for level completion, 1-2 minutes, 
instrumental, no lyrics, celebratory and satisfying atmosphere
```

#### MusicGen:
```
Victory celebration music, triumphant fanfare, 
uplifting melody, happy, level completion music, 
instrumental, celebratory
```

---

### EFECTOS DE SONIDO

### 4. Salto (sfx_jump.wav)

#### Bfxr / ChipTone:
```
Jump sound effect, short and quick, 
8-bit style, upward pitch, game jump sound, 
0.2 seconds duration, retro game style
```

**Nota**: Usar Bfxr con preset "Jump" y ajustar parámetros

---

### 5. Lanzar Proyectil (sfx_throw.wav)

#### Bfxr / ChipTone:
```
Throw sound effect, whoosh sound, 
quick swoosh, 8-bit style, game throw sound, 
0.1 seconds duration, retro game style
```

**Nota**: Usar Bfxr con preset "Powerup" y ajustar

---

### 6. Impacto (sfx_hit.wav)

#### Bfxr / ChipTone:
```
Hit impact sound, punch sound, 
quick impact, 8-bit style, game hit sound, 
0.15 seconds duration, retro game style
```

**Nota**: Usar Bfxr con preset "Hit" y ajustar

---

### 7. Muerte de Enemigo (sfx_enemy_death.wav)

#### Bfxr / ChipTone:
```
Enemy defeat sound, death sound effect, 
downward pitch, 8-bit style, game enemy death, 
0.3 seconds duration, retro game style, satisfying
```

**Nota**: Usar Bfxr con preset "Pickup" invertido o "Powerup" modificado

---

### 8. Daño al Jugador (sfx_player_hurt.wav)

#### Bfxr / ChipTone:
```
Player hurt sound, damage sound effect, 
pain sound, 8-bit style, game hurt sound, 
0.2 seconds duration, retro game style, 
slightly alarming but not too harsh
```

**Nota**: Usar Bfxr con preset "Hurt" o "Damage"

---

### 9. Game Over (sfx_game_over.wav)

#### Bfxr / ChipTone / ElevenLabs (texto a voz):
```
Game over sound effect, failure sound, 
downward sad melody, 8-bit style, game over, 
1 second duration, retro game style, 
disappointing but not too harsh
```

**Alternativa con ElevenLabs**:
```
Text: "Game Over"
Voice: Deep, serious, game announcer style
```

---

### 10. Victoria (sfx_victory.wav)

#### Bfxr / ChipTone:
```
Victory sound effect, success sound, 
upward happy melody, 8-bit style, game victory, 
1.5 seconds duration, retro game style, 
celebratory and rewarding
```

**Nota**: Usar Bfxr con preset "Powerup" extendido y modificado

---

### 11. Rugido del Gorila (sfx_boss_roar.wav)

#### ElevenLabs (texto a voz):
```
Text: "ROAR" or "GRRR"
Voice: Deep, animalistic, gorilla-like, 
powerful, intimidating, boss roar, 
0.5 seconds duration, low pitch
```

**Alternativa con Bfxr**:
```
Boss roar sound, deep growl, 
low frequency, intimidating, 
8-bit style, 0.5 seconds, powerful
```

---

## 📋 Checklist de Generación

### Imágenes (Sprites)
- [ ] player.png (40x60px)
- [ ] monkey_basic.png (40x40px)
- [ ] monkey_fast.png (40x40px)
- [ ] monkey_strong.png (50x50px)
- [ ] gorilla_1.png (80x80px)
- [ ] gorilla_2.png (90x90px)
- [ ] gorilla_3.png (100x100px)
- [ ] gorilla_4.png (110x110px)
- [ ] projectile.png (16x16px)

### Imágenes (Fondos)
- [ ] menu_bg.png (1200x800px)
- [ ] jungle_bg_1.png (1200x800px)
- [ ] jungle_bg_2.png (1200x800px)
- [ ] jungle_bg_3.png (1200x800px)
- [ ] jungle_bg_4.png (1200x800px)

### Audio (Música)
- [ ] menu_music.mp3 (2-3 min, loop)
- [ ] game_music.mp3 (3-4 min, loop)
- [ ] victory_music.mp3 (1-2 min)

### Audio (Efectos)
- [ ] sfx_jump.wav (0.2s)
- [ ] sfx_throw.wav (0.1s)
- [ ] sfx_hit.wav (0.15s)
- [ ] sfx_enemy_death.wav (0.3s)
- [ ] sfx_player_hurt.wav (0.2s)
- [ ] sfx_game_over.wav (1s)
- [ ] sfx_victory.wav (1.5s)
- [ ] sfx_boss_roar.wav (0.5s)

---

## 💡 Consejos para Mejores Resultados

### Para Imágenes:
1. **Itera los prompts**: Ajusta según los resultados
2. **Usa "pixel art" o "2D sprite"**: Para estilo de juego
3. **Especifica transparencia**: "transparent background"
4. **Menciona el tamaño**: Ayuda a la IA a entender la escala
5. **Añade "game sprite"**: Para contexto de videojuego

### Para Audio:
1. **Especifica duración**: Especialmente para efectos cortos
2. **Menciona "loopable"**: Para música de fondo
3. **Usa "8-bit" o "retro"**: Para estilo de juego
4. **Ajusta volumen**: Normaliza después de generar
5. **Prueba variaciones**: Genera varias versiones y elige la mejor

---

## 🔗 Enlaces Rápidos

### Imágenes:
- Leonardo.ai: https://leonardo.ai
- Bing Image Creator: https://www.bing.com/create
- Craiyon: https://www.craiyon.com
- Stable Diffusion: https://huggingface.co/spaces/stabilityai/stable-diffusion

### Audio:
- Suno AI: https://suno.ai
- MusicGen: https://huggingface.co/spaces/facebook/MusicGen
- Bfxr: http://www.bfxr.net
- ChipTone: https://sfbgames.com/chiptone
- ElevenLabs: https://elevenlabs.io

---

## 📝 Notas Finales

- Todas las herramientas mencionadas tienen planes gratuitos
- Los resultados pueden variar, itera y ajusta los prompts
- Guarda múltiples versiones y elige las mejores
- Optimiza los archivos finales para el juego (comprime imágenes, normaliza audio)
- El juego funciona sin estos assets, pero mejoran mucho la experiencia

```

```markdown
# Guía de Assets para Plátano Borracho vs Monos

## Introducción

Este juego está diseñado para funcionar **completamente sin assets externos**, generando todos los gráficos programáticamente. Sin embargo, puedes mejorar significativamente la experiencia del jugador agregando assets personalizados.

## Estructura de Carpetas

```
assets/
├── images/
│   ├── sprites/          # Sprites de personajes y objetos
│   └── backgrounds/      # Fondos de niveles
├── audio/
│   ├── music/            # Música de fondo
│   └── sfx/              # Efectos de sonido
└── maps/                 # Mapas de niveles (opcional)
```

## Sprites Necesarios

### Jugador (Plátano Borracho)
- **Tamaño recomendado**: 40x60 píxeles
- **Formato**: PNG con transparencia
- **Nombre**: `player.png`
- **Animaciones opcionales**: 
  - `player_idle.png` (quieto)
  - `player_walk_1.png`, `player_walk_2.png` (caminar)
  - `player_jump.png` (saltar)
  - `player_throw.png` (lanzar)

### Enemigos (Monos)
- **Tamaño recomendado**: 40x40 píxeles (básico y rápido), 50x50 píxeles (fuerte)
- **Formato**: PNG con transparencia
- **Nombres**: 
  - `monkey_basic.png`
  - `monkey_fast.png`
  - `monkey_strong.png`

### Jefes (Gorilas)
- **Tamaño recomendado**: 80x80 píxeles (nivel 1), aumentando 10px por nivel
- **Formato**: PNG con transparencia
- **Nombres**: `gorilla_1.png`, `gorilla_2.png`, `gorilla_3.png`, etc.

### Objetos
- **Proyectil**: 16x16 píxeles, `projectile.png`
- **Plataforma**: Textura opcional, `platform.png` (se puede repetir)

## Fondos

### Menú Principal
- **Tamaño**: 1200x800 píxeles
- **Nombre**: `menu_bg.png`
- **Tema**: Jungla con elementos temáticos

### Niveles
- **Tamaño**: 1200x800 píxeles (o más ancho para scroll)
- **Nombres**: `jungle_bg_1.png`, `jungle_bg_2.png`, etc.
- **Tema**: Fondos de jungla con diferentes profundidades y elementos

## Audio

### Música de Fondo
- **Formato**: MP3 o OGG (OGG recomendado para mejor compresión)
- **Loop**: Todas las músicas deben hacer loop
- **Archivos**:
  - `menu_music.mp3` - Música del menú (tranquila, temática)
  - `game_music.mp3` - Música durante el juego (acción, ritmo)
  - `victory_music.mp3` - Música de victoria (celebratoria)

### Efectos de Sonido
- **Formato**: WAV o OGG (WAV para calidad, OGG para tamaño)
- **Archivos**:
  - `sfx_jump.wav` - Salto del jugador (corto, ~0.2s)
  - `sfx_throw.wav` - Lanzar proyectil (corto, ~0.1s)
  - `sfx_hit.wav` - Impacto de proyectil (corto, ~0.15s)
  - `sfx_enemy_death.wav` - Muerte de enemigo (corto, ~0.3s)
  - `sfx_player_hurt.wav` - Daño al jugador (corto, ~0.2s)
  - `sfx_game_over.wav` - Game over (medio, ~1s)
  - `sfx_victory.wav` - Victoria (medio, ~1.5s)
  - `sfx_boss_roar.wav` - Rugido del gorila (opcional, ~0.5s)

## Mapas (Opcional)

Los mapas pueden estar en formato JSON. Ver `maps/level_1_example.json` para un ejemplo.

### Estructura de Mapa JSON

```json
{
  "level": 1,
  "width": 3600,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 360,
      "height": 30
    }
  ],
  "enemies": [
    {
      "type": "monkey_basic",
      "x": 240,
      "y": 700
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 1,
    "x": 3000,
    "y": 600
  },
  "playerStart": {
    "x": 100,
    "y": 650
  }
}
```

## Cómo Usar Assets Personalizados

1. **Coloca los archivos** en las carpetas correspondientes según la estructura indicada.

2. **Usa el AssetLoader** (ver `assets/js/asset-loader.js`):
   ```javascript
   const loader = new AssetLoader(this);
   loader.preload();
   ```

3. **Modifica las clases de entidades** para usar los sprites cargados en lugar de generarlos programáticamente.

## Recursos Gratuitos Recomendados

### Generación con IA (Nuevo)
- **Ver**: `AI_TOOLS_AND_PROMPTS.md` para herramientas de IA gratuitas y prompts específicos
- **Imágenes**: Leonardo.ai, Bing Image Creator, Stable Diffusion
- **Audio**: Suno AI, MusicGen, Bfxr, ChipTone

### Recursos Tradicionales
- **Sprites**: OpenGameArt.org, itch.io (assets gratuitos)
- **Audio**: Freesound.org, OpenGameArt.org
- **Herramientas**: 
  - Aseprite (sprites)
  - GIMP/Photoshop (edición de imágenes)
  - Audacity (edición de audio)

## Notas Importantes

- El juego **funciona perfectamente sin assets externos**
- Los assets son **opcionales** pero mejoran la experiencia
- Asegúrate de que los archivos tengan los nombres exactos indicados
- Los formatos recomendados son PNG para imágenes y OGG/MP3 para audio
- Mantén los archivos optimizados (tamaño razonable) para mejor rendimiento


```

```markdown
# Referencia Rápida de Prompts

## 🎨 SPRITES - Prompts Cortos

### Jugador
```
Cute cartoon banana character, yellow, drunk happy face, 
black dot eyes, red smile, 2D sprite, pixel art, 
transparent background, 40x60px, side view
```

### Mono Básico
```
Simple brown monkey sprite, round body, big eyes, 
2D sprite, pixel art, transparent background, 40x40px, side view
```

### Mono Rápido
```
Fast brown monkey sprite, slim body, alert eyes, 
2D sprite, pixel art, transparent background, 40x40px, side view
```

### Mono Fuerte
```
Strong dark brown monkey sprite, muscular, angry red eyes, 
2D sprite, pixel art, transparent background, 50x50px, side view
```

### Gorila Nivel 1-4
```
Large dark gorilla boss sprite, red glowing eyes, 
angry expression, muscular, 2D sprite, pixel art, 
transparent background, [80-110]x[80-110]px, side view
```

### Proyectil
```
Bright yellow glowing circle, simple projectile, 
2D sprite, pixel art, transparent background, 16x16px
```

---

## 🖼️ FONDOS - Prompts Cortos

### Menú
```
Tropical jungle background, dense green vegetation, 
palm trees, warm lighting, 2D style, 1200x800px, inviting
```

### Nivel 1
```
Bright jungle background, green trees, blue sky, 
sunlight, 2D style, 1200x800px, cheerful
```

### Nivel 2
```
Darker jungle background, dense vegetation, cloudy sky, 
2D style, 1200x800px, slightly ominous
```

### Nivel 3
```
Very dark jungle background, deep forest, stormy sky, 
2D style, 1200x800px, ominous
```

### Nivel 4
```
Extremely dark jungle background, deepest forest, dark sky, 
2D style, 1200x800px, very ominous
```

---

## 🎵 AUDIO - Prompts Cortos

### Música Menú
```
Calm tropical jungle theme, light percussion, soft melodies, 
warm and welcoming, loopable, 2-3 minutes, instrumental
```

### Música Juego
```
Energetic jungle adventure music, upbeat tempo, drums, 
adventurous, loopable, 3-4 minutes, instrumental
```

### Música Victoria
```
Triumphant victory music, brass fanfare, uplifting, 
1-2 minutes, instrumental, celebratory
```

### Efectos (Bfxr)
- **Jump**: Preset "Jump", 0.2s
- **Throw**: Preset "Powerup", 0.1s
- **Hit**: Preset "Hit", 0.15s
- **Enemy Death**: Preset "Pickup" invertido, 0.3s
- **Player Hurt**: Preset "Hurt", 0.2s
- **Game Over**: Melodía triste, 1s
- **Victory**: Preset "Powerup" extendido, 1.5s
- **Boss Roar**: Deep growl, bajo, 0.5s

---

## 🔗 Herramientas Rápidas

- **Imágenes**: leonardo.ai, bing.com/create
- **Música**: suno.ai, huggingface.co/spaces/facebook/MusicGen
- **Efectos**: bfxr.net, sfbgames.com/chiptone

```

Actualizando el resumen para incluir referencias a los nuevos documentos:


```markdown
# Resumen de Assets Generados

## ✅ Assets Completados

### Mapas (JSON)
- ✅ `maps/level_1.json` - Mapa del nivel 1
- ✅ `maps/level_2.json` - Mapa del nivel 2 (más difícil)
- ✅ `maps/level_3.json` - Mapa del nivel 3 (aún más difícil)
- ✅ `maps/level_4.json` - Mapa del nivel 4 (máxima dificultad)

### Scripts de Generación
- ✅ `js/generate-sprites.js` - Generador de sprites programáticos
- ✅ `js/generate-backgrounds.js` - Generador de fondos programáticos
- ✅ `js/generate-all-assets.js` - Script principal para generar todos los assets
- ✅ `js/asset-loader.js` - Cargador de assets externos

### Documentación
- ✅ `ASSETS_GUIDE.md` - Guía completa de assets
- ✅ `AUDIO_GENERATION_GUIDE.md` - Guía para generar/obtener audio
- ✅ `AI_TOOLS_AND_PROMPTS.md` - ⭐ NUEVO: Herramientas de IA gratuitas y prompts específicos
- ✅ `PROMPTS_QUICK_REFERENCE.md` - ⭐ NUEVO: Referencia rápida de prompts
- ✅ `ASSETS_SUMMARY.md` - Este archivo

## 📋 Assets que Requieren Acción Externa

### Imágenes (Opcionales)
Los sprites y fondos se generan automáticamente, pero puedes agregar:
- `images/sprites/player.png`
- `images/sprites/monkey_basic.png`
- `images/sprites/monkey_fast.png`
- `images/sprites/monkey_strong.png`
- `images/sprites/gorilla_1.png` a `gorilla_4.png`
- `images/sprites/projectile.png`
- `images/backgrounds/menu_bg.png`
- `images/backgrounds/jungle_bg_1.png` a `jungle_bg_4.png`

### Audio (Opcional pero Recomendado)
Ver `AUDIO_GENERATION_GUIDE.md` para instrucciones detalladas:
- `audio/music/menu_music.mp3`
- `audio/music/game_music.mp3`
- `audio/music/victory_music.mp3`
- `audio/sfx/sfx_jump.wav`
- `audio/sfx/sfx_throw.wav`
- `audio/sfx/sfx_hit.wav`
- `audio/sfx/sfx_enemy_death.wav`
- `audio/sfx/sfx_player_hurt.wav`
- `audio/sfx/sfx_game_over.wav`
- `audio/sfx/sfx_victory.wav`
- `audio/sfx/sfx_boss_roar.wav`

## 🎮 Cómo Usar los Assets Generados

### Mapas
Los mapas JSON están listos para usar. Para cargarlos en el juego, modifica `GameScene.js`:

```javascript
// En GameScene.js, método create()
fetch('assets/maps/level_' + this.level + '.json')
    .then(response => response.json())
    .then(mapData => {
        // Usar mapData para crear plataformas y enemigos
        this.loadMap(mapData);
    });
```

### Sprites y Fondos Generados
Los scripts de generación crean texturas en tiempo de ejecución. Se usan automáticamente si no hay assets externos.

### Audio
Una vez que agregues los archivos de audio, se cargarán automáticamente si usas el `AssetLoader`.

## 📊 Estadísticas de los Mapas

### Nivel 1
- **Ancho**: 3600px
- **Plataformas**: 7
- **Enemigos**: 5 monos básicos
- **Jefe**: Gorila nivel 1

### Nivel 2
- **Ancho**: 4200px
- **Plataformas**: 9
- **Enemigos**: 8 (mezcla de básicos, rápidos y fuertes)
- **Jefe**: Gorila nivel 2

### Nivel 3
- **Ancho**: 4800px
- **Plataformas**: 11
- **Enemigos**: 10 (más fuertes y rápidos)
- **Jefe**: Gorila nivel 3

### Nivel 4
- **Ancho**: 5400px
- **Plataformas**: 13
- **Enemigos**: 13 (mayoría fuertes y rápidos)
- **Jefe**: Gorila nivel 4

## 🚀 Próximos Pasos

1. **Probar los mapas**: Integrar la carga de mapas JSON en `GameScene.js`
2. **Agregar audio**: Seguir la guía en `AUDIO_GENERATION_GUIDE.md`
3. **Personalizar sprites**: Agregar sprites PNG personalizados si lo deseas
4. **Optimizar**: Comprimir imágenes y audio para mejor rendimiento

## 📝 Notas

- Todos los assets son **opcionales** - el juego funciona sin ellos
- Los mapas JSON están **listos para usar**
- Los sprites y fondos se generan **automáticamente** si no hay archivos externos
- El audio mejora la experiencia pero **no es esencial**


```

He creado documentación con herramientas de IA gratuitas y prompts para generar los assets. Resumen:

## Documentos creados

### 1. `AI_TOOLS_AND_PROMPTS.md` (principal)
Incluye:
- Herramientas de IA gratuitas para imágenes y audio
- Prompts específicos para cada sprite (9 sprites)
- Prompts específicos para cada fondo (5 fondos)
- Prompts específicos para cada audio (11 archivos)
- Checklist de generación
- Consejos para mejores resultados
- Enlaces directos a las herramientas

### 2. `PROMPTS_QUICK_REFERENCE.md` (referencia rápida)
Versión condensada con prompts cortos para uso rápido.

## Herramientas recomendadas

### Para imágenes
1. Leonardo.ai (150 imágenes/día gratis)
2. Bing Image Creator (DALL-E 3, gratis con cuenta Microsoft)
3. Stable Diffusion (Hugging Face, gratis)
4. Craiyon (gratis)

### Para audio
1. Suno AI (música, plan gratuito)
2. MusicGen de Meta (música, gratis)
3. Bfxr (efectos de sonido 8-bit, gratis)
4. ChipTone (efectos retro, gratis)
5. ElevenLabs (rugidos/efectos de voz, plan gratuito limitado)

## Prompts incluidos

### Sprites (9)
- Jugador (plátano borracho)
- Mono básico, rápido y fuerte
- Gorilas niveles 1-4
- Proyectil

### Fondos (5)
- Fondo del menú
- Fondos de jungla para niveles 1-4 (dificultad progresiva)

### Audio (11)
- 3 músicas (menú, juego, victoria)
- 8 efectos de sonido (salto, lanzar, impacto, muerte enemigo, daño jugador, game over, victoria, rugido jefe)

## Cómo usar

1. Abre `AI_TOOLS_AND_PROMPTS.md`
2. Elige una herramienta (recomendado: Leonardo.ai para imágenes, Suno AI para música)
3. Copia el prompt correspondiente
4. Pega en la herramienta y genera
5. Descarga y coloca en las carpetas correspondientes

## Ejemplo rápido

Para generar el sprite del jugador:
1. Ve a https://leonardo.ai
2. Copia este prompt:
```
A cute cartoon banana character, yellow banana with a happy drunk expression, 
two black dot eyes slightly misaligned, red smiling mouth, simple 2D sprite style, 
pixel art or flat cartoon, transparent background, 40x60 pixels, game sprite, 
side view, friendly character, bright colors, clean lines
```
3. Genera y descarga
4. Guarda como `assets/images/sprites/player.png`

Todos los prompts están listos para copiar y usar. Los documentos incluyen instrucciones detalladas, consejos y enlaces directos a las herramientas.

¿Quieres que ajuste algún prompt o agregue más detalles?

```plaintext
A cute cartoon banana character, yellow banana with a happy drunk expression, 
two black dot eyes slightly misaligned, red smiling mouth, simple 2D sprite style, 
pixel art or flat cartoon, transparent background, 40x60 pixels, game sprite, 
side view, friendly character, bright colors, clean lines
```

---

**User**

He incluido las imágenes, pero el juego no las incluye correctamente. Parece que no está cargando los assets con el @asset-loader.js 

---

**Cursor**

Revisando cómo se cargan los assets y corrigiendo el `AssetLoader` para que funcione correctamente con Phaser.


El `AssetLoader` no se está usando y las entidades generan sprites programáticamente sin verificar assets externos. Corrigiéndolo: creando una escena de Preload y actualizando el AssetLoader y las entidades para usar los assets cargados.


```javascript
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    
    preload() {
        // Mostrar barra de carga
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 200, height / 2 - 30, 400, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Cargando...',
            style: {
                font: '20px Arial',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px Arial',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Actualizar barra de progreso
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 190, height / 2 - 20, 380 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // Cargar assets usando AssetLoader
        const assetLoader = new AssetLoader(this);
        assetLoader.preload();
    }
    
    create() {
        // Generar assets programáticamente si no se cargaron
        this.generateMissingAssets();
        
        // Ir al menú
        this.scene.start('MenuScene');
    }
    
    generateMissingAssets() {
        // Generar sprites si no existen
        if (!this.textures.exists('player')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generatePlayer();
        }
        if (!this.textures.exists('monkey_basic')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyBasic();
        }
        if (!this.textures.exists('monkey_fast')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyFast();
        }
        if (!this.textures.exists('monkey_strong')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyStrong();
        }
        if (!this.textures.exists('projectile')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateProjectile();
        }
        
        // Generar gorilas si no existen
        for (let i = 1; i <= 4; i++) {
            if (!this.textures.exists(`gorilla_${i}`)) {
                const spriteGen = new SpriteGenerator(this);
                spriteGen.generateGorilla(i);
            }
        }
        
        // Generar fondos si no existen
        if (!this.textures.exists('menu_bg')) {
            const bgGen = new BackgroundGenerator(this);
            bgGen.generateMenuBackground();
        }
        for (let i = 1; i <= 4; i++) {
            if (!this.textures.exists(`jungle_bg_${i}`)) {
                const bgGen = new BackgroundGenerator(this);
                bgGen.generateJungleBackground(i);
            }
        }
    }
}

```

```javascript
/**
 * Utilidad para cargar assets externos si están disponibles
 * Este archivo puede ser usado para cargar sprites, audio y fondos personalizados
 */

class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.assetsLoaded = false;
    }
    
    /**
     * Precarga todos los assets disponibles
     */
    preload() {
        // Intentar cargar sprites personalizados
        this.loadSprites();
        
        // Intentar cargar fondos personalizados
        this.loadBackgrounds();
        
        // Intentar cargar audio
        this.loadAudio();
    }
    
    /**
     * Carga sprites personalizados si están disponibles
     */
    loadSprites() {
        const sprites = [
            { key: 'player', path: 'assets/images/sprites/player.png' },
            { key: 'monkey_basic', path: 'assets/images/sprites/monkey_basic.png' },
            { key: 'monkey_fast', path: 'assets/images/sprites/monkey_fast.png' },
            { key: 'monkey_strong', path: 'assets/images/sprites/monkey_strong.png' },
            { key: 'projectile', path: 'assets/images/sprites/projectile.png' }
        ];
        
        // Cargar gorilas para diferentes niveles
        for (let i = 1; i <= 4; i++) {
            sprites.push({
                key: `gorilla_${i}`,
                path: `assets/images/sprites/gorilla_${i}.png`
            });
        }
        
        // Cargar sprites con manejo de errores
        sprites.forEach(sprite => {
            this.scene.load.image(sprite.key, sprite.path);
        });
        
        // Manejar errores de carga
        this.scene.load.on('fileerror', (file) => {
            console.log(`No se pudo cargar: ${file.key} desde ${file.src}`);
        });
    }
    
    /**
     * Carga fondos personalizados si están disponibles
     */
    loadBackgrounds() {
        const backgrounds = [
            { key: 'menu_bg', path: 'assets/images/backgrounds/menu_bg.png' },
            { key: 'jungle_bg_1', path: 'assets/images/backgrounds/jungle_bg_1.png' },
            { key: 'jungle_bg_2', path: 'assets/images/backgrounds/jungle_bg_2.png' },
            { key: 'jungle_bg_3', path: 'assets/images/backgrounds/jungle_bg_3.png' }
        ];
        
        backgrounds.forEach(bg => {
            try {
                this.scene.load.image(bg.key, bg.path);
            } catch (e) {
                console.log(`Fondo ${bg.key} no encontrado, se usará color sólido`);
            }
        });
    }
    
    /**
     * Carga archivos de audio si están disponibles
     */
    loadAudio() {
        // Música
        const music = [
            { key: 'menu_music', path: 'assets/audio/music/menu_music.mp3' },
            { key: 'game_music', path: 'assets/audio/music/game_music.mp3' },
            { key: 'victory_music', path: 'assets/audio/music/victory_music.mp3' }
        ];
        
        // Efectos de sonido
        const sfx = [
            { key: 'sfx_jump', path: 'assets/audio/sfx/sfx_jump.wav' },
            { key: 'sfx_throw', path: 'assets/audio/sfx/sfx_throw.wav' },
            { key: 'sfx_hit', path: 'assets/audio/sfx/sfx_hit.wav' },
            { key: 'sfx_enemy_death', path: 'assets/audio/sfx/sfx_enemy_death.wav' },
            { key: 'sfx_player_hurt', path: 'assets/audio/sfx/sfx_player_hurt.wav' },
            { key: 'sfx_game_over', path: 'assets/audio/sfx/sfx_game_over.wav' },
            { key: 'sfx_victory', path: 'assets/audio/sfx/sfx_victory.wav' },
            { key: 'sfx_boss_roar', path: 'assets/audio/sfx/sfx_boss_roar.wav' }
        ];
        
        [...music, ...sfx].forEach(audio => {
            try {
                if (audio.key.startsWith('sfx_')) {
                    this.scene.load.audio(audio.key, audio.path);
                } else {
                    this.scene.load.audio(audio.key, audio.path);
                }
            } catch (e) {
                console.log(`Audio ${audio.key} no encontrado`);
            }
        });
    }
    
    /**
     * Verifica si un asset está disponible
     */
    hasAsset(key) {
        return this.scene.textures.exists(key) || this.scene.cache.audio.exists(key);
    }
    
    /**
     * Obtiene un sprite, usando el personalizado si está disponible, o generando uno programáticamente
     */
    getSprite(key, generatorFunction) {
        if (this.hasAsset(key)) {
            return this.scene.add.image(0, 0, key);
        } else {
            return generatorFunction();
        }
    }
}


```

```javascript
/**
 * Utilidad para cargar assets externos si están disponibles
 * Este archivo puede ser usado para cargar sprites, audio y fondos personalizados
 */

class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.assetsLoaded = false;
    }
    
    /**
     * Precarga todos los assets disponibles
     */
    preload() {
        // Intentar cargar sprites personalizados
        this.loadSprites();
        
        // Intentar cargar fondos personalizados
        this.loadBackgrounds();
        
        // Intentar cargar audio
        this.loadAudio();
    }
    
    /**
     * Carga sprites personalizados si están disponibles
     */
    loadSprites() {
        const sprites = [
            { key: 'player', path: 'assets/images/sprites/player.png' },
            { key: 'monkey_basic', path: 'assets/images/sprites/monkey_basic.png' },
            { key: 'monkey_fast', path: 'assets/images/sprites/monkey_fast.png' },
            { key: 'monkey_strong', path: 'assets/images/sprites/monkey_strong.png' },
            { key: 'projectile', path: 'assets/images/sprites/projectile.png' }
        ];
        
        // Cargar gorilas para diferentes niveles
        for (let i = 1; i <= 4; i++) {
            sprites.push({
                key: `gorilla_${i}`,
                path: `assets/images/sprites/gorilla_${i}.png`
            });
        }
        
        // Cargar sprites con manejo de errores
        sprites.forEach(sprite => {
            this.scene.load.image(sprite.key, sprite.path);
        });
        
        // Manejar errores de carga
        this.scene.load.on('fileerror', (file) => {
            console.log(`No se pudo cargar: ${file.key} desde ${file.src}`);
        });
    }
    
    /**
     * Carga fondos personalizados si están disponibles
     */
    loadBackgrounds() {
        const backgrounds = [
            { key: 'menu_bg', path: 'assets/images/backgrounds/menu_bg.png' },
            { key: 'jungle_bg_1', path: 'assets/images/backgrounds/jungle_bg_1.png' },
            { key: 'jungle_bg_2', path: 'assets/images/backgrounds/jungle_bg_2.png' },
            { key: 'jungle_bg_3', path: 'assets/images/backgrounds/jungle_bg_3.png' },
            { key: 'jungle_bg_4', path: 'assets/images/backgrounds/jungle_bg_4.png' }
        ];
        
        // Cargar fondos
        backgrounds.forEach(bg => {
            this.scene.load.image(bg.key, bg.path);
        });
    }
    
    /**
     * Carga archivos de audio si están disponibles
     */
    loadAudio() {
        // Música
        const music = [
            { key: 'menu_music', path: 'assets/audio/music/menu_music.mp3' },
            { key: 'game_music', path: 'assets/audio/music/game_music.mp3' },
            { key: 'victory_music', path: 'assets/audio/music/victory_music.mp3' }
        ];
        
        // Efectos de sonido
        const sfx = [
            { key: 'sfx_jump', path: 'assets/audio/sfx/sfx_jump.wav' },
            { key: 'sfx_throw', path: 'assets/audio/sfx/sfx_throw.wav' },
            { key: 'sfx_hit', path: 'assets/audio/sfx/sfx_hit.wav' },
            { key: 'sfx_enemy_death', path: 'assets/audio/sfx/sfx_enemy_death.wav' },
            { key: 'sfx_player_hurt', path: 'assets/audio/sfx/sfx_player_hurt.wav' },
            { key: 'sfx_game_over', path: 'assets/audio/sfx/sfx_game_over.wav' },
            { key: 'sfx_victory', path: 'assets/audio/sfx/sfx_victory.wav' },
            { key: 'sfx_boss_roar', path: 'assets/audio/sfx/sfx_boss_roar.wav' }
        ];
        
        [...music, ...sfx].forEach(audio => {
            try {
                if (audio.key.startsWith('sfx_')) {
                    this.scene.load.audio(audio.key, audio.path);
                } else {
                    this.scene.load.audio(audio.key, audio.path);
                }
            } catch (e) {
                console.log(`Audio ${audio.key} no encontrado`);
            }
        });
    }
    
    /**
     * Verifica si un asset está disponible
     */
    hasAsset(key) {
        return this.scene.textures.exists(key) || this.scene.cache.audio.exists(key);
    }
    
    /**
     * Obtiene un sprite, usando el personalizado si está disponible, o generando uno programáticamente
     */
    getSprite(key, generatorFunction) {
        if (this.hasAsset(key)) {
            return this.scene.add.image(0, 0, key);
        } else {
            return generatorFunction();
        }
    }
}


```

```javascript
/**
 * Utilidad para cargar assets externos si están disponibles
 * Este archivo puede ser usado para cargar sprites, audio y fondos personalizados
 */

class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.assetsLoaded = false;
    }
    
    /**
     * Precarga todos los assets disponibles
     */
    preload() {
        // Intentar cargar sprites personalizados
        this.loadSprites();
        
        // Intentar cargar fondos personalizados
        this.loadBackgrounds();
        
        // Intentar cargar audio
        this.loadAudio();
    }
    
    /**
     * Carga sprites personalizados si están disponibles
     */
    loadSprites() {
        const sprites = [
            { key: 'player', path: 'assets/images/sprites/player.png' },
            { key: 'monkey_basic', path: 'assets/images/sprites/monkey_basic.png' },
            { key: 'monkey_fast', path: 'assets/images/sprites/monkey_fast.png' },
            { key: 'monkey_strong', path: 'assets/images/sprites/monkey_strong.png' },
            { key: 'projectile', path: 'assets/images/sprites/projectile.png' }
        ];
        
        // Cargar gorilas para diferentes niveles
        for (let i = 1; i <= 4; i++) {
            sprites.push({
                key: `gorilla_${i}`,
                path: `assets/images/sprites/gorilla_${i}.png`
            });
        }
        
        // Cargar sprites con manejo de errores
        sprites.forEach(sprite => {
            this.scene.load.image(sprite.key, sprite.path);
        });
        
        // Manejar errores de carga
        this.scene.load.on('fileerror', (file) => {
            console.log(`No se pudo cargar: ${file.key} desde ${file.src}`);
        });
    }
    
    /**
     * Carga fondos personalizados si están disponibles
     */
    loadBackgrounds() {
        const backgrounds = [
            { key: 'menu_bg', path: 'assets/images/backgrounds/menu_bg.png' },
            { key: 'jungle_bg_1', path: 'assets/images/backgrounds/jungle_bg_1.png' },
            { key: 'jungle_bg_2', path: 'assets/images/backgrounds/jungle_bg_2.png' },
            { key: 'jungle_bg_3', path: 'assets/images/backgrounds/jungle_bg_3.png' },
            { key: 'jungle_bg_4', path: 'assets/images/backgrounds/jungle_bg_4.png' }
        ];
        
        // Cargar fondos
        backgrounds.forEach(bg => {
            this.scene.load.image(bg.key, bg.path);
        });
    }
    
    /**
     * Carga archivos de audio si están disponibles
     */
    loadAudio() {
        // Música
        const music = [
            { key: 'menu_music', path: 'assets/audio/music/menu_music.mp3' },
            { key: 'game_music', path: 'assets/audio/music/game_music.mp3' },
            { key: 'victory_music', path: 'assets/audio/music/victory_music.mp3' }
        ];
        
        // Efectos de sonido
        const sfx = [
            { key: 'sfx_jump', path: 'assets/audio/sfx/sfx_jump.wav' },
            { key: 'sfx_throw', path: 'assets/audio/sfx/sfx_throw.wav' },
            { key: 'sfx_hit', path: 'assets/audio/sfx/sfx_hit.wav' },
            { key: 'sfx_enemy_death', path: 'assets/audio/sfx/sfx_enemy_death.wav' },
            { key: 'sfx_player_hurt', path: 'assets/audio/sfx/sfx_player_hurt.wav' },
            { key: 'sfx_game_over', path: 'assets/audio/sfx/sfx_game_over.wav' },
            { key: 'sfx_victory', path: 'assets/audio/sfx/sfx_victory.wav' },
            { key: 'sfx_boss_roar', path: 'assets/audio/sfx/sfx_boss_roar.wav' }
        ];
        
        // Cargar audio (Phaser maneja automáticamente si no existe)
        [...music, ...sfx].forEach(audio => {
            this.scene.load.audio(audio.key, audio.path);
        });
    }
    
    /**
     * Verifica si un asset está disponible
     */
    hasAsset(key) {
        return this.scene.textures.exists(key) || this.scene.cache.audio.exists(key);
    }
    
    /**
     * Obtiene un sprite, usando el personalizado si está disponible, o generando uno programáticamente
     */
    getSprite(key, generatorFunction) {
        if (this.hasAsset(key)) {
            return this.scene.add.image(0, 0, key);
        } else {
            return generatorFunction();
        }
    }
}


```

```javascript
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Intentar usar sprite cargado, si no existe, generar programáticamente
        if (scene.textures.exists('player')) {
            super(scene, x, y, 'player');
        } else {
            // Crear sprite del plátano borracho programáticamente
            const graphics = scene.add.graphics();
            graphics.fillStyle(COLORS.PLAYER);
            graphics.fillRoundedRect(0, 0, 40, 60, 10);
            // Ojos
            graphics.fillStyle(0x000000);
            graphics.fillCircle(10, 20, 4);
            graphics.fillCircle(30, 20, 4);
            // Boca
            graphics.fillStyle(0xff6347);
            graphics.fillEllipse(20, 35, 15, 10);
            const texture = graphics.generateTexture('player', 40, 60);
            graphics.destroy();
            
            super(scene, x, y, texture);
        }
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propiedades del jugador
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.isAlive = true;
        this.facingRight = true;
        this.canJump = true;
        this.isJumping = false;
        this.invulnerable = false;
        this.hasArmor = true; // Piel del plátano
        
        // Configurar física
        this.body.setSize(35, 55);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        
        // Efecto de tambaleo borracho
        this.drunkOffset = 0;
        this.drunkSpeed = 0.05;
        
        // Tiempo de invulnerabilidad después de recibir daño
        this.invulnerableTime = 0;
        this.invulnerableDuration = 2000; // 2 segundos
        
        // Referencia a la escena para crear proyectiles
        this.scene = scene;
    }
    
    update(cursors, time) {
        if (!this.isAlive) return;
        
        // Actualizar invulnerabilidad
        if (this.invulnerable) {
            this.invulnerableTime -= time;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
                this.setAlpha(1);
            } else {
                // Efecto de parpadeo
                this.setAlpha((Math.sin(time * 0.02) + 1) / 2);
            }
        }
        
        // Movimiento horizontal
        let horizontalVelocity = 0;
        
        if (cursors.left.isDown || cursors.a.isDown) {
            horizontalVelocity = -GAME_CONFIG.PLAYER_SPEED;
            this.facingRight = false;
        } else if (cursors.right.isDown || cursors.d.isDown) {
            horizontalVelocity = GAME_CONFIG.PLAYER_SPEED;
            this.facingRight = true;
        }
        
        this.setVelocityX(horizontalVelocity);
        
        // Salto
        if ((cursors.up.isDown || cursors.w.isDown || cursors.space.isDown) && this.canJump && !this.isJumping) {
            this.jump();
        }
        
        // Verificar si está en el suelo
        if (this.body.onFloor()) {
            this.canJump = true;
            this.isJumping = false;
        } else {
            this.isJumping = true;
        }
        
        // Efecto de tambaleo borracho (solo visual - rotación)
        this.drunkOffset += this.drunkSpeed;
        const drunkRotation = Math.sin(this.drunkOffset) * 0.12; // Rotación suave
        this.setRotation(drunkRotation);
    }
    
    jump() {
        if (this.canJump && !this.isJumping) {
            this.setVelocityY(GAME_CONFIG.JUMP_VELOCITY);
            this.canJump = false;
            this.isJumping = true;
        }
    }
    
    throwProjectile() {
        if (!this.isAlive) return null;
        
        const direction = this.facingRight ? 1 : -1;
        const offsetX = this.facingRight ? 30 : -30;
        const projectile = new Projectile(this.scene, this.x + offsetX, this.y, direction);
        
        return projectile;
    }
    
    takeDamage() {
        if (this.invulnerable || !this.isAlive) return;
        
        this.lives--;
        this.invulnerable = true;
        this.invulnerableTime = this.invulnerableDuration;
        
        // Perder armadura (piel del plátano)
        if (this.hasArmor) {
            this.hasArmor = false;
            // Cambiar color a más claro (plátano sin piel)
            this.setTint(0xffffcc);
        }
        
        if (this.lives <= 0) {
            this.die();
        }
    }
    
    die() {
        this.isAlive = false;
        this.setVelocity(0, 0);
        this.setTint(0x666666); // Gris cuando muere
    }
    
    reset(x, y) {
        this.setPosition(x, y);
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.isAlive = true;
        this.hasArmor = true;
        this.invulnerable = false;
        this.setAlpha(1);
        this.clearTint();
        this.setVelocity(0, 0);
    }
}


```

```javascript
class Monkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = ENEMY_TYPES.MONKEY_BASIC) {
        // Intentar usar sprite cargado, si no existe, generar programáticamente
        const spriteKey = `monkey_${type}`;
        
        if (scene.textures.exists(spriteKey)) {
            super(scene, x, y, spriteKey);
        } else {
            // Crear sprite del mono según el tipo programáticamente
            const graphics = scene.add.graphics();
            const size = type === ENEMY_TYPES.MONKEY_STRONG ? 50 : 40;
            const color = type === ENEMY_TYPES.MONKEY_STRONG ? 0x654321 : COLORS.MONKEY;
            
            graphics.fillStyle(color);
            graphics.fillCircle(size / 2, size / 2, size / 2);
            // Ojos
            graphics.fillStyle(0xffffff);
            graphics.fillCircle(size / 2 - 8, size / 2 - 5, 6);
            graphics.fillCircle(size / 2 + 8, size / 2 - 5, 6);
            graphics.fillStyle(0x000000);
            graphics.fillCircle(size / 2 - 8, size / 2 - 5, 3);
            graphics.fillCircle(size / 2 + 8, size / 2 - 5, 3);
            // Boca
            graphics.fillStyle(0x000000);
            graphics.fillEllipse(size / 2, size / 2 + 8, 12, 8);
            
            const texture = graphics.generateTexture(spriteKey, size, size);
            graphics.destroy();
            
            super(scene, x, y, texture);
        }
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.type = type;
        this.isAlive = true;
        this.direction = Math.random() > 0.5 ? 1 : -1; // Dirección aleatoria inicial
        this.detectionRange = 200; // Rango de detección del jugador
        this.resistance = this.getResistance();
        this.speed = this.getSpeed();
        
        // Configurar física
        this.body.setSize(size - 5, size - 5);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        this.body.setVelocityX(this.speed * this.direction);
        
        // Cambiar dirección al tocar bordes
        this.body.onWorldBounds = true;
        scene.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this && (event.body.blocked.left || event.body.blocked.right)) {
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction);
            }
        });
    }
    
    getResistance() {
        switch (this.type) {
            case ENEMY_TYPES.MONKEY_BASIC:
                return RESISTANCE.MONKEY_BASIC;
            case ENEMY_TYPES.MONKEY_FAST:
                return RESISTANCE.MONKEY_FAST;
            case ENEMY_TYPES.MONKEY_STRONG:
                return RESISTANCE.MONKEY_STRONG;
            default:
                return 1;
        }
    }
    
    getSpeed() {
        switch (this.type) {
            case ENEMY_TYPES.MONKEY_BASIC:
                return ENEMY_SPEEDS.MONKEY_BASIC;
            case ENEMY_TYPES.MONKEY_FAST:
                return ENEMY_SPEEDS.MONKEY_FAST;
            case ENEMY_TYPES.MONKEY_STRONG:
                return ENEMY_SPEEDS.MONKEY_STRONG;
            default:
                return 80;
        }
    }
    
    update(player) {
        if (!this.isAlive) return;
        
        // Detectar jugador cercano
        if (player && player.isAlive) {
            const distanceToPlayer = Phaser.Math.Distance.Between(
                this.x, this.y, player.x, player.y
            );
            
            if (distanceToPlayer < this.detectionRange) {
                // Moverse hacia el jugador
                if (player.x > this.x) {
                    this.direction = 1;
                } else {
                    this.direction = -1;
                }
            }
        }
        
        // Aplicar velocidad
        this.body.setVelocityX(this.speed * this.direction);
        
        // Voltear sprite según dirección
        if (this.direction > 0) {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }
    }
    
    takeDamage() {
        this.resistance--;
        if (this.resistance <= 0) {
            this.die();
            return true; // Enemigo derrotado
        }
        return false; // Aún vivo
    }
    
    die() {
        this.isAlive = false;
        // Efecto visual de muerte
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.destroy();
        });
    }
    
    getScore() {
        switch (this.type) {
            case ENEMY_TYPES.MONKEY_BASIC:
                return SCORES.MONKEY_BASIC;
            case ENEMY_TYPES.MONKEY_FAST:
                return SCORES.MONKEY_FAST;
            case ENEMY_TYPES.MONKEY_STRONG:
                return SCORES.MONKEY_STRONG;
            default:
                return 100;
        }
    }
}


```

```javascript
class Gorilla extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, level = 1) {
        // Intentar usar sprite cargado, si no existe, generar programáticamente
        const spriteKey = `gorilla_${level}`;
        
        if (scene.textures.exists(spriteKey)) {
            super(scene, x, y, spriteKey);
        } else {
            // Crear sprite del gorila programáticamente
            const graphics = scene.add.graphics();
            const size = 80 + (level * 10); // Más grande según el nivel
            
            graphics.fillStyle(COLORS.GORILLA);
            graphics.fillRoundedRect(0, 0, size, size, 15);
            // Ojos rojos (más agresivos)
            graphics.fillStyle(0xff0000);
            graphics.fillCircle(size / 2 - 15, size / 2 - 10, 8);
            graphics.fillCircle(size / 2 + 15, size / 2 - 10, 8);
            // Boca
            graphics.fillStyle(0x000000);
            graphics.fillEllipse(size / 2, size / 2 + 15, 20, 15);
            // Pecho más claro
            graphics.fillStyle(0x3d2817);
            graphics.fillEllipse(size / 2, size / 2 + 5, 30, 25);
            
            const texture = graphics.generateTexture(spriteKey, size, size);
            graphics.destroy();
            
            super(scene, x, y, texture);
        }
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.level = level;
        this.isAlive = true;
        this.direction = -1; // Empieza moviéndose a la izquierda
        this.resistance = this.getResistance();
        this.maxResistance = this.resistance;
        this.speed = this.getSpeed();
        this.attackCooldown = 0;
        this.attackInterval = 2000 + (level * 500); // Más rápido en niveles altos
        
        // Configurar física
        this.body.setSize(size - 10, size - 10);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        this.body.setVelocityX(this.speed * this.direction);
        
        // Barra de vida
        this.createHealthBar(scene);
        
        // Cambiar dirección al tocar bordes
        this.body.onWorldBounds = true;
        scene.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this && (event.body.blocked.left || event.body.blocked.right)) {
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction);
            }
        });
    }
    
    getResistance() {
        switch (this.level) {
            case 1:
                return RESISTANCE.GORILLA_LEVEL_1;
            case 2:
                return RESISTANCE.GORILLA_LEVEL_2;
            case 3:
                return RESISTANCE.GORILLA_LEVEL_3;
            default:
                return RESISTANCE.GORILLA_LEVEL_1 + (this.level - 1) * 3;
        }
    }
    
    getSpeed() {
        switch (this.level) {
            case 1:
                return ENEMY_SPEEDS.GORILLA_LEVEL_1;
            case 2:
                return ENEMY_SPEEDS.GORILLA_LEVEL_2;
            case 3:
                return ENEMY_SPEEDS.GORILLA_LEVEL_3;
            default:
                return ENEMY_SPEEDS.GORILLA_LEVEL_1 + (this.level - 1) * 50;
        }
    }
    
    createHealthBar(scene) {
        // Fondo de la barra
        this.healthBarBg = scene.add.rectangle(this.x, this.y - 60, 100, 10, 0x000000);
        this.healthBarBg.setDepth(100);
        this.healthBarBg.setScrollFactor(0);
        
        // Barra de vida
        this.healthBar = scene.add.rectangle(this.x, this.y - 60, 100, 8, 0xff0000);
        this.healthBar.setDepth(101);
        this.healthBar.setScrollFactor(0);
    }
    
    update(player, time) {
        if (!this.isAlive) return;
        
        // Actualizar posición de la barra de vida
        this.healthBarBg.setPosition(this.x, this.y - 60);
        this.healthBar.setPosition(this.x - 50 + (this.resistance / this.maxResistance * 50), this.y - 60);
        this.healthBar.width = (this.resistance / this.maxResistance) * 100;
        
        // Movimiento hacia el jugador
        if (player && player.isAlive) {
            if (player.x > this.x + 50) {
                this.direction = 1;
            } else if (player.x < this.x - 50) {
                this.direction = -1;
            }
        }
        
        // Aplicar velocidad con patrón más complejo
        const baseSpeed = this.speed * this.direction;
        // Movimiento con patrón sinusoidal para hacerlo más impredecible
        const patternOffset = Math.sin(time * 0.001) * 20;
        this.body.setVelocityX(baseSpeed + patternOffset);
        
        // Voltear sprite según dirección
        if (this.direction > 0) {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }
        
        // Ataque periódico
        this.attackCooldown -= time;
        if (this.attackCooldown <= 0 && player && player.isAlive) {
            this.attack(player);
            this.attackCooldown = this.attackInterval;
        }
    }
    
    attack(player) {
        // El gorila puede lanzar proyectiles o cargar
        // Por simplicidad, aquí solo cambia de dirección rápidamente
        // En una versión más avanzada, podría lanzar proyectiles
        this.direction *= -1;
        this.body.setVelocityX(this.speed * this.direction * 1.5); // Carga rápida
    }
    
    takeDamage() {
        this.resistance--;
        if (this.resistance <= 0) {
            this.die();
            return true; // Gorila derrotado
        }
        return false; // Aún vivo
    }
    
    die() {
        this.isAlive = false;
        // Destruir barra de vida
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        
        // Efecto visual de muerte
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.destroy();
        });
    }
    
    getScore() {
        return SCORES.GORILLA_BASE * this.level;
    }
}


```

```javascript
class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        // Intentar usar sprite cargado, si no existe, generar programáticamente
        if (scene.textures.exists('projectile')) {
            super(scene, x, y, 'projectile');
        } else {
            // Crear sprite simple programáticamente
            const graphics = scene.add.graphics();
            graphics.fillStyle(COLORS.PROJECTILE);
            graphics.fillCircle(0, 0, 8);
            const texture = graphics.generateTexture('projectile', 16, 16);
            graphics.destroy();
            
            super(scene, x, y, texture);
        }
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.direction = direction; // 1 para derecha, -1 para izquierda
        this.speed = GAME_CONFIG.PROJECTILE_SPEED;
        
        // Configurar física
        this.body.setSize(12, 12);
        this.body.setCollideWorldBounds(false); // No colisionar con bordes, destruir manualmente
        
        // Velocidad inicial
        this.setVelocityX(this.speed * this.direction);
        
        // Guardar referencia a la escena
        this.scene = scene;
    }
    
    update() {
        // El proyectil se mueve automáticamente
        // Se destruye al colisionar con plataformas o enemigos
        
        // Destruir si sale de los límites del mundo
        if (this.x < -50 || this.x > GAME_CONFIG.WIDTH * 3 + 50 || 
            this.y < -50 || this.y > GAME_CONFIG.HEIGHT + 50) {
            this.destroy();
        }
    }
}


```

```javascript
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Fondo - usar imagen si existe, sino usar color sólido
        if (this.textures.exists('menu_bg')) {
            this.add.image(0, 0, 'menu_bg').setOrigin(0, 0);
        } else {
            this.add.rectangle(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
                .setOrigin(0, 0);
        }
        
        // Título del juego
        const titleStyle = {
            fontSize: '64px',
            fontFamily: 'Arial',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 5,
                stroke: true,
                fill: true
            }
        };
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 150, 'PLÁTANO BORRACHO', titleStyle)
            .setOrigin(0.5);
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 220, 'VS MONOS', {
            ...titleStyle,
            fontSize: '48px'
        }).setOrigin(0.5);
        
        // Botón Jugar
        const playButton = this.add.rectangle(GAME_CONFIG.WIDTH / 2, 400, 300, 80, 0x228b22)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('GameScene', { level: 1, score: 0, lives: GAME_CONFIG.PLAYER_LIVES });
            })
            .on('pointerover', () => {
                playButton.setFillStyle(0x32cd32);
            })
            .on('pointerout', () => {
                playButton.setFillStyle(0x228b22);
            });
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 400, 'JUGAR', {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Instrucciones
        const instructionsStyle = {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            align: 'center'
        };
        
        const instructions = [
            'CONTROLES:',
            'A/D o ←/→ : Mover',
            'W o ↑ : Saltar',
            'J o Espacio : Lanzar proyectil',
            '',
            'Derrota a los monos y enfrenta',
            'a los poderosos gorilas jefe!'
        ];
        
        this.add.text(GAME_CONFIG.WIDTH / 2, 550, instructions, instructionsStyle)
            .setOrigin(0.5);
        
        // Efecto de fondo animado (monos moviéndose)
        this.createAnimatedBackground();
    }
    
    createAnimatedBackground() {
        // Crear algunos monos decorativos en el fondo
        for (let i = 0; i < 5; i++) {
            const monkey = this.add.circle(
                Math.random() * GAME_CONFIG.WIDTH,
                Math.random() * GAME_CONFIG.HEIGHT,
                20,
                COLORS.MONKEY,
                0.3
            );
            
            this.tweens.add({
                targets: monkey,
                x: Math.random() * GAME_CONFIG.WIDTH,
                y: Math.random() * GAME_CONFIG.HEIGHT,
                duration: 3000 + Math.random() * 2000,
                repeat: -1,
                yoyo: true
            });
        }
    }
}


```

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
    }
    
    create() {
        // Fondo - usar imagen si existe, sino usar color sólido
        const bgKey = `jungle_bg_${this.level}`;
        if (this.textures.exists(bgKey)) {
            // Crear fondo repetido para el scroll
            for (let i = 0; i < 3; i++) {
                this.add.image(i * GAME_CONFIG.WIDTH, 0, bgKey).setOrigin(0, 0);
            }
        } else {
            this.add.rectangle(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT, COLORS.BACKGROUND)
                .setOrigin(0, 0);
        }
        
        // Grupos de objetos (crear primero para poder usarlos)
        this.monkeys = this.physics.add.group();
        this.gorillas = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.platforms = this.physics.add.staticGroup();
        
        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador (sobre la primera plataforma)
        this.player = new Player(this, 100, GAME_CONFIG.HEIGHT - 150);
        this.player.lives = this.lives; // Usar las vidas pasadas desde la escena anterior
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Crear gorila jefe (sobre la última plataforma)
        this.boss = new Gorilla(this, GAME_CONFIG.WIDTH * 2.5, GAME_CONFIG.HEIGHT - 200, this.level);
        this.gorillas.add(this.boss);
        
        // Colisiones
        this.setupCollisions();
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        
        // Cámara
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 300; // 300ms entre proyectiles
    }
    
    createPlatforms() {
        // Plataformas del nivel
        const platformData = [
            { x: 0, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 0.8, y: GAME_CONFIG.HEIGHT - 50, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 1.2, y: GAME_CONFIG.HEIGHT - 200, width: GAME_CONFIG.WIDTH * 0.4 },
            { x: GAME_CONFIG.WIDTH * 1.6, y: GAME_CONFIG.HEIGHT - 100, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.0, y: GAME_CONFIG.HEIGHT - 250, width: GAME_CONFIG.WIDTH * 0.3 },
            { x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150, width: GAME_CONFIG.WIDTH * 0.4 } // Plataforma del jefe
        ];
        
        platformData.forEach(platform => {
            const plat = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y,
                platform.width,
                30,
                COLORS.PLATFORM
            );
            this.physics.add.existing(plat, true);
            this.platforms.add(plat);
        });
    }
    
    createEnemies() {
        // Crear monos según el nivel
        const monkeyCount = 3 + this.level * 2;
        const monkeyPositions = [
            { x: GAME_CONFIG.WIDTH * 0.2, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre primera plataforma
            { x: GAME_CONFIG.WIDTH * 0.6, y: GAME_CONFIG.HEIGHT - 200 }, // Sobre segunda plataforma
            { x: GAME_CONFIG.WIDTH * 1.0, y: GAME_CONFIG.HEIGHT - 100 }, // Sobre tercera plataforma
            { x: GAME_CONFIG.WIDTH * 1.4, y: GAME_CONFIG.HEIGHT - 250 }, // Sobre cuarta plataforma
            { x: GAME_CONFIG.WIDTH * 1.8, y: GAME_CONFIG.HEIGHT - 150 }, // Sobre quinta plataforma
            { x: GAME_CONFIG.WIDTH * 2.2, y: GAME_CONFIG.HEIGHT - 300 } // Sobre sexta plataforma
        ];
        
        for (let i = 0; i < Math.min(monkeyCount, monkeyPositions.length); i++) {
            const pos = monkeyPositions[i];
            let type = ENEMY_TYPES.MONKEY_BASIC;
            
            // Variar tipos según el nivel
            if (this.level >= 2 && i % 3 === 0) {
                type = ENEMY_TYPES.MONKEY_FAST;
            } else if (this.level >= 3 && i % 4 === 0) {
                type = ENEMY_TYPES.MONKEY_STRONG;
            }
            
            const monkey = new Monkey(this, pos.x, pos.y, type);
            this.monkeys.add(monkey);
        }
    }
    
    setupCollisions() {
        // Jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Enemigos con plataformas
        this.physics.add.collider(this.monkeys, this.platforms);
        this.physics.add.collider(this.gorillas, this.platforms);
        
        // Proyectiles con plataformas
        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        
        // Proyectiles con enemigos
        this.physics.add.overlap(this.projectiles, this.monkeys, (projectile, monkey) => {
            projectile.destroy();
            if (monkey.takeDamage()) {
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            if (gorilla.takeDamage()) {
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Jugador con enemigos
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
        
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive) {
                player.takeDamage();
                this.lives = player.lives;
                this.updateHUD();
                if (!player.isAlive) {
                    this.gameOver();
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD
        const hudBg = this.add.rectangle(10, 10, 300, 100, 0x000000, 0.7);
        hudBg.setOrigin(0, 0);
        this.hudContainer.add(hudBg);
        
        // Textos del HUD
        this.scoreText = this.add.text(20, 20, `Puntuación: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.hudContainer.add(this.scoreText);
        
        this.livesText = this.add.text(20, 50, `Vidas: ${this.lives}`, {
            fontSize: '20px',
            fill: '#ff0000'
        });
        this.hudContainer.add(this.livesText);
        
        this.levelText = this.add.text(20, 80, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles
        if ((this.cursors.j.isDown || this.cursors.space.isDown) && 
            time - this.lastProjectileTime > this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
            }
        }
        
        // Actualizar proyectiles
        this.projectiles.children.entries.forEach(projectile => {
            if (projectile.active) {
                projectile.update();
            }
        });
        
        // Actualizar enemigos
        this.monkeys.children.entries.forEach(monkey => {
            if (monkey.isAlive) {
                monkey.update(this.player);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
    }
    
    completeLevel() {
        // Calcular tiempo y bonus
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, Math.floor((300 - elapsedTime) * SCORES.TIME_BONUS_MULTIPLIER));
        this.score += SCORES.LEVEL_COMPLETE + timeBonus;
        
        // Ir a la escena de victoria
        this.scene.start('VictoryScene', {
            level: this.level,
            score: this.score,
            lives: this.player.lives,
            timeBonus: timeBonus
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}


```

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plátano Borracho vs Monos</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="game-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
    <script src="js/utils/constants.js"></script>
    <script src="js/utils/helpers.js"></script>
    <script src="assets/js/generate-sprites.js"></script>
    <script src="assets/js/generate-backgrounds.js"></script>
    <script src="assets/js/asset-loader.js"></script>
    <script src="js/entities/Projectile.js"></script>
    <script src="js/entities/Player.js"></script>
    <script src="js/entities/Monkey.js"></script>
    <script src="js/entities/Gorilla.js"></script>
    <script src="js/scenes/PreloadScene.js"></script>
    <script src="js/scenes/MenuScene.js"></script>
    <script src="js/scenes/GameScene.js"></script>
    <script src="js/scenes/GameOverScene.js"></script>
    <script src="js/scenes/VictoryScene.js"></script>
    <script src="js/main.js"></script>
</body>
</html>


```

```javascript
// Configuración del juego Phaser 3
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a4d2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GAME_CONFIG.GRAVITY },
            debug: false // Cambiar a true para ver hitboxes
        }
    },
    scene: [PreloadScene, MenuScene, GameScene, GameOverScene, VictoryScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Inicializar el juego
const game = new Phaser.Game(config);


```

Corrigiendo un detalle en Gorilla para que el tamaño del cuerpo se ajuste cuando se usa un sprite cargado:


```javascript
class Gorilla extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, level = 1) {
        // Intentar usar sprite cargado, si no existe, generar programáticamente
        const spriteKey = `gorilla_${level}`;
        
        if (scene.textures.exists(spriteKey)) {
            super(scene, x, y, spriteKey);
        } else {
            // Crear sprite del gorila programáticamente
            const graphics = scene.add.graphics();
            const size = 80 + (level * 10); // Más grande según el nivel
            
            graphics.fillStyle(COLORS.GORILLA);
            graphics.fillRoundedRect(0, 0, size, size, 15);
            // Ojos rojos (más agresivos)
            graphics.fillStyle(0xff0000);
            graphics.fillCircle(size / 2 - 15, size / 2 - 10, 8);
            graphics.fillCircle(size / 2 + 15, size / 2 - 10, 8);
            // Boca
            graphics.fillStyle(0x000000);
            graphics.fillEllipse(size / 2, size / 2 + 15, 20, 15);
            // Pecho más claro
            graphics.fillStyle(0x3d2817);
            graphics.fillEllipse(size / 2, size / 2 + 5, 30, 25);
            
            const texture = graphics.generateTexture(spriteKey, size, size);
            graphics.destroy();
            
            super(scene, x, y, texture);
        }
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.level = level;
        this.isAlive = true;
        this.direction = -1; // Empieza moviéndose a la izquierda
        this.resistance = this.getResistance();
        this.maxResistance = this.resistance;
        this.speed = this.getSpeed();
        this.attackCooldown = 0;
        this.attackInterval = 2000 + (level * 500); // Más rápido en niveles altos
        
        // Configurar física - usar el tamaño real del sprite
        const spriteSize = this.width || size;
        this.body.setSize(spriteSize - 10, spriteSize - 10);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        this.body.setVelocityX(this.speed * this.direction);
        
        // Barra de vida
        this.createHealthBar(scene);
        
        // Cambiar dirección al tocar bordes
        this.body.onWorldBounds = true;
        scene.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this && (event.body.blocked.left || event.body.blocked.right)) {
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction);
            }
        });
    }
    
    getResistance() {
        switch (this.level) {
            case 1:
                return RESISTANCE.GORILLA_LEVEL_1;
            case 2:
                return RESISTANCE.GORILLA_LEVEL_2;
            case 3:
                return RESISTANCE.GORILLA_LEVEL_3;
            default:
                return RESISTANCE.GORILLA_LEVEL_1 + (this.level - 1) * 3;
        }
    }
    
    getSpeed() {
        switch (this.level) {
            case 1:
                return ENEMY_SPEEDS.GORILLA_LEVEL_1;
            case 2:
                return ENEMY_SPEEDS.GORILLA_LEVEL_2;
            case 3:
                return ENEMY_SPEEDS.GORILLA_LEVEL_3;
            default:
                return ENEMY_SPEEDS.GORILLA_LEVEL_1 + (this.level - 1) * 50;
        }
    }
    
    createHealthBar(scene) {
        // Fondo de la barra
        this.healthBarBg = scene.add.rectangle(this.x, this.y - 60, 100, 10, 0x000000);
        this.healthBarBg.setDepth(100);
        this.healthBarBg.setScrollFactor(0);
        
        // Barra de vida
        this.healthBar = scene.add.rectangle(this.x, this.y - 60, 100, 8, 0xff0000);
        this.healthBar.setDepth(101);
        this.healthBar.setScrollFactor(0);
    }
    
    update(player, time) {
        if (!this.isAlive) return;
        
        // Actualizar posición de la barra de vida
        this.healthBarBg.setPosition(this.x, this.y - 60);
        this.healthBar.setPosition(this.x - 50 + (this.resistance / this.maxResistance * 50), this.y - 60);
        this.healthBar.width = (this.resistance / this.maxResistance) * 100;
        
        // Movimiento hacia el jugador
        if (player && player.isAlive) {
            if (player.x > this.x + 50) {
                this.direction = 1;
            } else if (player.x < this.x - 50) {
                this.direction = -1;
            }
        }
        
        // Aplicar velocidad con patrón más complejo
        const baseSpeed = this.speed * this.direction;
        // Movimiento con patrón sinusoidal para hacerlo más impredecible
        const patternOffset = Math.sin(time * 0.001) * 20;
        this.body.setVelocityX(baseSpeed + patternOffset);
        
        // Voltear sprite según dirección
        if (this.direction > 0) {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }
        
        // Ataque periódico
        this.attackCooldown -= time;
        if (this.attackCooldown <= 0 && player && player.isAlive) {
            this.attack(player);
            this.attackCooldown = this.attackInterval;
        }
    }
    
    attack(player) {
        // El gorila puede lanzar proyectiles o cargar
        // Por simplicidad, aquí solo cambia de dirección rápidamente
        // En una versión más avanzada, podría lanzar proyectiles
        this.direction *= -1;
        this.body.setVelocityX(this.speed * this.direction * 1.5); // Carga rápida
    }
    
    takeDamage() {
        this.resistance--;
        if (this.resistance <= 0) {
            this.die();
            return true; // Gorila derrotado
        }
        return false; // Aún vivo
    }
    
    die() {
        this.isAlive = false;
        // Destruir barra de vida
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        
        // Efecto visual de muerte
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.destroy();
        });
    }
    
    getScore() {
        return SCORES.GORILLA_BASE * this.level;
    }
}


```

Corrigiendo el typo en el nombre del archivo de fondo del nivel 4:


```javascript
/**
 * Utilidad para cargar assets externos si están disponibles
 * Este archivo puede ser usado para cargar sprites, audio y fondos personalizados
 */

class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.assetsLoaded = false;
    }
    
    /**
     * Precarga todos los assets disponibles
     */
    preload() {
        // Intentar cargar sprites personalizados
        this.loadSprites();
        
        // Intentar cargar fondos personalizados
        this.loadBackgrounds();
        
        // Intentar cargar audio
        this.loadAudio();
    }
    
    /**
     * Carga sprites personalizados si están disponibles
     */
    loadSprites() {
        const sprites = [
            { key: 'player', path: 'assets/images/sprites/player.png' },
            { key: 'monkey_basic', path: 'assets/images/sprites/monkey_basic.png' },
            { key: 'monkey_fast', path: 'assets/images/sprites/monkey_fast.png' },
            { key: 'monkey_strong', path: 'assets/images/sprites/monkey_strong.png' },
            { key: 'projectile', path: 'assets/images/sprites/projectile.png' }
        ];
        
        // Cargar gorilas para diferentes niveles
        for (let i = 1; i <= 4; i++) {
            sprites.push({
                key: `gorilla_${i}`,
                path: `assets/images/sprites/gorilla_${i}.png`
            });
        }
        
        // Cargar sprites con manejo de errores
        sprites.forEach(sprite => {
            this.scene.load.image(sprite.key, sprite.path);
        });
        
        // Manejar errores de carga
        this.scene.load.on('fileerror', (file) => {
            console.log(`No se pudo cargar: ${file.key} desde ${file.src}`);
        });
    }
    
    /**
     * Carga fondos personalizados si están disponibles
     */
    loadBackgrounds() {
        const backgrounds = [
            { key: 'menu_bg', path: 'assets/images/backgrounds/menu_bg.png' },
            { key: 'jungle_bg_1', path: 'assets/images/backgrounds/jungle_bg_1.png' },
            { key: 'jungle_bg_2', path: 'assets/images/backgrounds/jungle_bg_2.png' },
            { key: 'jungle_bg_3', path: 'assets/images/backgrounds/jungle_bg_3.png' },
            // Intentar ambos nombres por si hay typo
            { key: 'jungle_bg_4', path: 'assets/images/backgrounds/jungle_bg_4.png' },
            { key: 'jungle_bg_4', path: 'assets/images/backgrounds/jungel_bg_4.png' }
        ];
        
        // Cargar fondos
        backgrounds.forEach(bg => {
            this.scene.load.image(bg.key, bg.path);
        });
    }
    
    /**
     * Carga archivos de audio si están disponibles
     */
    loadAudio() {
        // Música
        const music = [
            { key: 'menu_music', path: 'assets/audio/music/menu_music.mp3' },
            { key: 'game_music', path: 'assets/audio/music/game_music.mp3' },
            { key: 'victory_music', path: 'assets/audio/music/victory_music.mp3' }
        ];
        
        // Efectos de sonido
        const sfx = [
            { key: 'sfx_jump', path: 'assets/audio/sfx/sfx_jump.wav' },
            { key: 'sfx_throw', path: 'assets/audio/sfx/sfx_throw.wav' },
            { key: 'sfx_hit', path: 'assets/audio/sfx/sfx_hit.wav' },
            { key: 'sfx_enemy_death', path: 'assets/audio/sfx/sfx_enemy_death.wav' },
            { key: 'sfx_player_hurt', path: 'assets/audio/sfx/sfx_player_hurt.wav' },
            { key: 'sfx_game_over', path: 'assets/audio/sfx/sfx_game_over.wav' },
            { key: 'sfx_victory', path: 'assets/audio/sfx/sfx_victory.wav' },
            { key: 'sfx_boss_roar', path: 'assets/audio/sfx/sfx_boss_roar.wav' }
        ];
        
        // Cargar audio (Phaser maneja automáticamente si no existe)
        [...music, ...sfx].forEach(audio => {
            this.scene.load.audio(audio.key, audio.path);
        });
    }
    
    /**
     * Verifica si un asset está disponible
     */
    hasAsset(key) {
        return this.scene.textures.exists(key) || this.scene.cache.audio.exists(key);
    }
    
    /**
     * Obtiene un sprite, usando el personalizado si está disponible, o generando uno programáticamente
     */
    getSprite(key, generatorFunction) {
        if (this.hasAsset(key)) {
            return this.scene.add.image(0, 0, key);
        } else {
            return generatorFunction();
        }
    }
}


```

Mejorando la lógica para manejar el typo de forma más limpia:


```javascript
/**
 * Utilidad para cargar assets externos si están disponibles
 * Este archivo puede ser usado para cargar sprites, audio y fondos personalizados
 */

class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.assetsLoaded = false;
    }
    
    /**
     * Precarga todos los assets disponibles
     */
    preload() {
        // Intentar cargar sprites personalizados
        this.loadSprites();
        
        // Intentar cargar fondos personalizados
        this.loadBackgrounds();
        
        // Intentar cargar audio
        this.loadAudio();
    }
    
    /**
     * Carga sprites personalizados si están disponibles
     */
    loadSprites() {
        const sprites = [
            { key: 'player', path: 'assets/images/sprites/player.png' },
            { key: 'monkey_basic', path: 'assets/images/sprites/monkey_basic.png' },
            { key: 'monkey_fast', path: 'assets/images/sprites/monkey_fast.png' },
            { key: 'monkey_strong', path: 'assets/images/sprites/monkey_strong.png' },
            { key: 'projectile', path: 'assets/images/sprites/projectile.png' }
        ];
        
        // Cargar gorilas para diferentes niveles
        for (let i = 1; i <= 4; i++) {
            sprites.push({
                key: `gorilla_${i}`,
                path: `assets/images/sprites/gorilla_${i}.png`
            });
        }
        
        // Cargar sprites con manejo de errores
        sprites.forEach(sprite => {
            this.scene.load.image(sprite.key, sprite.path);
        });
        
        // Manejar errores de carga
        this.scene.load.on('fileerror', (file) => {
            console.log(`No se pudo cargar: ${file.key} desde ${file.src}`);
        });
    }
    
    /**
     * Carga fondos personalizados si están disponibles
     */
    loadBackgrounds() {
        const backgrounds = [
            { key: 'menu_bg', path: 'assets/images/backgrounds/menu_bg.png' },
            { key: 'jungle_bg_1', path: 'assets/images/backgrounds/jungle_bg_1.png' },
            { key: 'jungle_bg_2', path: 'assets/images/backgrounds/jungle_bg_2.png' },
            { key: 'jungle_bg_3', path: 'assets/images/backgrounds/jungle_bg_3.png' }
        ];
        
        // Nivel 4 - intentar ambos nombres (por si hay typo)
        this.scene.load.image('jungle_bg_4', 'assets/images/backgrounds/jungle_bg_4.png');
        this.scene.load.image('jungle_bg_4_alt', 'assets/images/backgrounds/jungel_bg_4.png');
        
        // Cargar fondos
        backgrounds.forEach(bg => {
            this.scene.load.image(bg.key, bg.path);
        });
    }
    
    /**
     * Carga archivos de audio si están disponibles
     */
    loadAudio() {
        // Música
        const music = [
            { key: 'menu_music', path: 'assets/audio/music/menu_music.mp3' },
            { key: 'game_music', path: 'assets/audio/music/game_music.mp3' },
            { key: 'victory_music', path: 'assets/audio/music/victory_music.mp3' }
        ];
        
        // Efectos de sonido
        const sfx = [
            { key: 'sfx_jump', path: 'assets/audio/sfx/sfx_jump.wav' },
            { key: 'sfx_throw', path: 'assets/audio/sfx/sfx_throw.wav' },
            { key: 'sfx_hit', path: 'assets/audio/sfx/sfx_hit.wav' },
            { key: 'sfx_enemy_death', path: 'assets/audio/sfx/sfx_enemy_death.wav' },
            { key: 'sfx_player_hurt', path: 'assets/audio/sfx/sfx_player_hurt.wav' },
            { key: 'sfx_game_over', path: 'assets/audio/sfx/sfx_game_over.wav' },
            { key: 'sfx_victory', path: 'assets/audio/sfx/sfx_victory.wav' },
            { key: 'sfx_boss_roar', path: 'assets/audio/sfx/sfx_boss_roar.wav' }
        ];
        
        // Cargar audio (Phaser maneja automáticamente si no existe)
        [...music, ...sfx].forEach(audio => {
            this.scene.load.audio(audio.key, audio.path);
        });
    }
    
    /**
     * Verifica si un asset está disponible
     */
    hasAsset(key) {
        return this.scene.textures.exists(key) || this.scene.cache.audio.exists(key);
    }
    
    /**
     * Obtiene un sprite, usando el personalizado si está disponible, o generando uno programáticamente
     */
    getSprite(key, generatorFunction) {
        if (this.hasAsset(key)) {
            return this.scene.add.image(0, 0, key);
        } else {
            return generatorFunction();
        }
    }
}


```

```javascript
        // Generar fondos si no existen
        if (!this.textures.exists('menu_bg')) {
            const bgGen = new BackgroundGenerator(this);
            bgGen.generateMenuBackground();
        }
        for (let i = 1; i <= 4; i++) {
            // Para nivel 4, verificar también el nombre alternativo con typo
            const bgKey = i === 4 && this.textures.exists('jungle_bg_4_alt') 
                ? 'jungle_bg_4_alt' 
                : `jungle_bg_${i}`;
            
            if (!this.textures.exists(bgKey)) {
                const bgGen = new BackgroundGenerator(this);
                bgGen.generateJungleBackground(i);
            } else if (i === 4 && this.textures.exists('jungle_bg_4_alt')) {
                // Renombrar la textura con typo al nombre correcto
                this.textures.rename('jungle_bg_4_alt', 'jungle_bg_4');
            }
        }
```

Leyendo el archivo completo para ver su estructura:


```javascript
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    
    preload() {
        // Mostrar barra de carga
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 200, height / 2 - 30, 400, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Cargando...',
            style: {
                font: '20px Arial',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px Arial',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Actualizar barra de progreso
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 190, height / 2 - 20, 380 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // Cargar assets usando AssetLoader
        const assetLoader = new AssetLoader(this);
        assetLoader.preload();
    }
    
    create() {
        // Generar assets programáticamente si no se cargaron
        this.generateMissingAssets();
        
        // Ir al menú
        this.scene.start('MenuScene');
    }
    
    generateMissingAssets() {
        // Generar sprites si no existen
        if (!this.textures.exists('player')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generatePlayer();
        }
        if (!this.textures.exists('monkey_basic')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyBasic();
        }
        if (!this.textures.exists('monkey_fast')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyFast();
        }
        if (!this.textures.exists('monkey_strong')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyStrong();
        }
        if (!this.textures.exists('projectile')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateProjectile();
        }
        
        // Generar gorilas si no existen
        for (let i = 1; i <= 4; i++) {
            if (!this.textures.exists(`gorilla_${i}`)) {
                const spriteGen = new SpriteGenerator(this);
                spriteGen.generateGorilla(i);
            }
        }
        
        // Generar fondos si no existen
        if (!this.textures.exists('menu_bg')) {
            const bgGen = new BackgroundGenerator(this);
            bgGen.generateMenuBackground();
        }
        for (let i = 1; i <= 4; i++) {
            // Para nivel 4, verificar también el nombre alternativo con typo
            let bgKey = `jungle_bg_${i}`;
            if (i === 4 && this.textures.exists('jungle_bg_4_alt')) {
                // Renombrar la textura con typo al nombre correcto
                this.textures.rename('jungle_bg_4_alt', 'jungle_bg_4');
            }
            
            if (!this.textures.exists(bgKey)) {
                const bgGen = new BackgroundGenerator(this);
                bgGen.generateJungleBackground(i);
            }
        }
    }
}


```

Sistema de carga de assets corregido. Resumen de cambios:

## Cambios realizados

### 1. Nueva escena de precarga (`PreloadScene.js`)
- Carga todos los assets antes de iniciar el juego
- Muestra barra de progreso
- Genera assets programáticamente si no se encuentran archivos externos

### 2. AssetLoader actualizado
- Carga sprites, fondos y audio correctamente
- Maneja errores de carga
- Soporta el typo en `jungel_bg_4.png` (también busca `jungle_bg_4.png`)

### 3. Entidades actualizadas
- `Player.js`: Verifica si existe `player.png` antes de generar
- `Monkey.js`: Verifica sprites según tipo (`monkey_basic`, `monkey_fast`, `monkey_strong`)
- `Gorilla.js`: Verifica sprites por nivel (`gorilla_1` a `gorilla_4`)
- `Projectile.js`: Verifica si existe `projectile.png`

### 4. Escenas actualizadas
- `MenuScene`: Usa `menu_bg.png` si existe
- `GameScene`: Usa fondos de nivel (`jungle_bg_1` a `jungle_bg_4`) si existen

### 5. Archivos HTML y main.js
- Agregados scripts necesarios en el orden correcto
- `PreloadScene` como primera escena

## Cómo funciona ahora

1. Al iniciar, se ejecuta `PreloadScene`
2. Intenta cargar todos los assets desde `assets/`
3. Si un asset no existe, se genera programáticamente
4. Una vez cargado todo, va al menú principal
5. Las entidades usan los assets cargados si están disponibles

## Verificación

Abre la consola del navegador (F12) y verifica:
- Si aparecen errores 404, las rutas pueden estar incorrectas
- Si dice "No se pudo cargar", el archivo no existe (se generará programáticamente)
- Si no hay errores, los assets se están cargando correctamente

El juego debería usar tus imágenes ahora. Si hay problemas, revisa:
- Que los archivos estén en las rutas correctas
- Que los nombres de archivo coincidan exactamente
- La consola del navegador para ver errores de carga

¿Funciona correctamente ahora?

---

**User**

creo que necesito servir la página por http, si lo uso a ttraves de file los assets no cargan

---

**Cursor**

Los navegadores bloquean la carga de recursos locales con `file://` por CORS. Creando scripts para servir la página por HTTP local.


```python
#!/usr/bin/env python3
"""
Servidor HTTP simple para servir el juego
Uso: python server.py
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers CORS para permitir carga de assets
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Log simplificado
        print(f"{args[0]} - {args[1]}")

def main():
    # Cambiar al directorio del script
    os.chdir(Path(__file__).parent)
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 60)
        print(f"Servidor iniciado en http://localhost:{PORT}")
        print(f"Abre tu navegador en: {url}")
        print("Presiona Ctrl+C para detener el servidor")
        print("=" * 60)
        
        # Intentar abrir el navegador automáticamente
        try:
            webbrowser.open(url)
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServidor detenido.")

if __name__ == "__main__":
    main()

```

```javascript
/**
 * Servidor HTTP simple para servir el juego
 * Requiere Node.js
 * Uso: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Parsear la URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`, 'utf-8');
            }
        } else {
            // Headers CORS
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    const url = `http://localhost:${PORT}/index.html`;
    console.log('='.repeat(60));
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    console.log(`Abre tu navegador en: ${url}`);
    console.log('Presiona Ctrl+C para detener el servidor');
    console.log('='.repeat(60));

    // Intentar abrir el navegador automáticamente
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
        command = `start ${url}`;
    } else if (platform === 'darwin') {
        command = `open ${url}`;
    } else {
        command = `xdg-open ${url}`;
    }

    exec(command, (error) => {
        if (error) {
            console.log('No se pudo abrir el navegador automáticamente');
        }
    });
});

```

```bat
@echo off
echo ========================================
echo Iniciando servidor del juego
echo ========================================
echo.

REM Verificar si Python está disponible
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Usando Python...
    python server.py
    goto :end
)

REM Verificar si Node.js está disponible
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Usando Node.js...
    node server.js
    goto :end
)

echo.
echo ERROR: No se encontró Python ni Node.js
echo.
echo Por favor instala uno de los siguientes:
echo - Python: https://www.python.org/downloads/
echo - Node.js: https://nodejs.org/
echo.
echo O usa una extension de VS Code como "Live Server"
echo.
pause

:end

```

```shellscript
#!/bin/bash

echo "========================================"
echo "Iniciando servidor del juego"
echo "========================================"
echo ""

# Verificar si Python está disponible
if command -v python3 &> /dev/null; then
    echo "Usando Python3..."
    python3 server.py
    exit 0
fi

if command -v python &> /dev/null; then
    echo "Usando Python..."
    python server.py
    exit 0
fi

# Verificar si Node.js está disponible
if command -v node &> /dev/null; then
    echo "Usando Node.js..."
    node server.js
    exit 0
fi

echo ""
echo "ERROR: No se encontró Python ni Node.js"
echo ""
echo "Por favor instala uno de los siguientes:"
echo "- Python: https://www.python.org/downloads/"
echo "- Node.js: https://nodejs.org/"
echo ""
echo "O usa una extensión de VS Code como 'Live Server'"
echo ""

```

```markdown
# Instrucciones para Servir el Juego por HTTP

Los navegadores modernos bloquean la carga de recursos locales cuando se abre un archivo HTML directamente (`file://`). Por eso necesitas servir el juego a través de un servidor HTTP local.

## 🚀 Opción 1: Scripts Automáticos (Recomendado)

### Windows
Doble clic en `start-server.bat` o ejecuta en la terminal:
```bash
start-server.bat
```

### Linux/Mac
Ejecuta en la terminal:
```bash
chmod +x start-server.sh
./start-server.sh
```

El script detectará automáticamente si tienes Python o Node.js y usará el servidor correspondiente.

---

## 🐍 Opción 2: Python (Si tienes Python instalado)

### Python 3
```bash
python server.py
```

O si tienes Python 3 específicamente:
```bash
python3 server.py
```

El servidor se iniciará en `http://localhost:8000` y abrirá el navegador automáticamente.

---

## 📦 Opción 3: Node.js (Si tienes Node.js instalado)

```bash
node server.js
```

El servidor se iniciará en `http://localhost:8000` y abrirá el navegador automáticamente.

---

## 🔧 Opción 4: Python Simple (Una línea)

Si tienes Python 3, puedes usar el servidor HTTP integrado:

```bash
# Python 3
python -m http.server 8000

# O Python 2 (si solo tienes Python 2)
python -m SimpleHTTPServer 8000
```

Luego abre en tu navegador: `http://localhost:8000/index.html`

---

## 💻 Opción 5: PHP (Si tienes PHP instalado)

```bash
php -S localhost:8000
```

Luego abre en tu navegador: `http://localhost:8000/index.html`

---

## 🎯 Opción 6: Live Server (VS Code Extension)

Si usas Visual Studio Code:

1. Instala la extensión **"Live Server"** de Ritwick Dey
2. Haz clic derecho en `index.html`
3. Selecciona **"Open with Live Server"**

Esto iniciará un servidor automáticamente y abrirá el juego en tu navegador.

---

## 🌐 Opción 7: Otros Servidores

### http-server (Node.js)
```bash
npm install -g http-server
http-server -p 8000
```

### serve (Node.js)
```bash
npm install -g serve
serve -p 8000
```

---

## ✅ Verificación

Una vez que el servidor esté corriendo:

1. Abre tu navegador
2. Ve a `http://localhost:8000/index.html`
3. Abre la consola del navegador (F12)
4. Verifica que no haya errores 404 para los assets
5. Los assets deberían cargarse correctamente

---

## 🔍 Solución de Problemas

### Puerto 8000 ya en uso
Si el puerto 8000 está ocupado, puedes cambiar el puerto en los scripts:
- `server.py`: Cambia `PORT = 8000` a otro número (ej: `8001`)
- `server.js`: Cambia `const PORT = 8000` a otro número

### Los assets aún no cargan
1. Verifica que los archivos estén en las rutas correctas
2. Revisa la consola del navegador (F12) para ver errores
3. Asegúrate de que el servidor esté corriendo desde el directorio correcto
4. Verifica que las rutas en `asset-loader.js` sean relativas (empiezan con `assets/`)

### CORS Errors
Los scripts incluidos ya tienen headers CORS configurados. Si usas otro servidor, asegúrate de que permita CORS.

---

## 📝 Notas

- El servidor debe estar corriendo mientras juegas
- Para detener el servidor, presiona `Ctrl+C` en la terminal
- No cierres la ventana de la terminal mientras juegas
- El puerto 8000 es el predeterminado, pero puedes usar cualquier puerto disponible

---

## 🎮 ¡Listo!

Una vez que el servidor esté corriendo, el juego debería cargar todos los assets correctamente. ¡Disfruta jugando!

```

Creando un README específico para el juego con instrucciones de inicio:


```markdown
# Plátano Borracho vs Monos 🍌🐵

Un juego de plataformas 2D estilo "Ghosts 'n Goblins" desarrollado con Phaser 3.

## 🎮 Descripción

Controla a un plátano borracho que debe sobrevivir en una jungla peligrosa llena de monos hambrientos. Debes atravesar múltiples niveles, derrotando monos y enfrentándote a poderosos gorilas jefe para sobrevivir.

## 🚀 Inicio Rápido

### ⚠️ IMPORTANTE: Servir por HTTP

**NO abras `index.html` directamente** (file://). Los navegadores bloquean la carga de assets locales por seguridad.

### Opción 1: Script Automático (Recomendado)

**Windows:**
```bash
start-server.bat
```

**Linux/Mac:**
```bash
chmod +x start-server.sh
./start-server.sh
```

### Opción 2: Python
```bash
python server.py
```

### Opción 3: Node.js
```bash
node server.js
```

### Opción 4: Python Simple
```bash
python -m http.server 8000
```

Luego abre: `http://localhost:8000/index.html`

### Opción 5: Live Server (VS Code)
1. Instala la extensión "Live Server"
2. Clic derecho en `index.html` → "Open with Live Server"

**Ver `SERVER_INSTRUCTIONS.md` para más opciones y detalles.**

## 🎯 Controles

- **A / D** o **← / →**: Mover izquierda/derecha
- **W** o **↑**: Saltar
- **J** o **Espacio**: Lanzar proyectil

## 📁 Estructura del Proyecto

```
ghosts-goblins-SGN/
├── index.html              # Archivo principal HTML
├── css/
│   └── style.css          # Estilos del juego
├── js/
│   ├── main.js            # Configuración Phaser
│   ├── scenes/            # Escenas del juego
│   ├── entities/           # Entidades (jugador, enemigos)
│   └── utils/              # Utilidades y constantes
├── assets/
│   ├── images/            # Sprites y fondos
│   ├── audio/             # Música y efectos
│   └── maps/              # Mapas de niveles (JSON)
├── server.py              # Servidor Python
├── server.js               # Servidor Node.js
└── start-server.bat/sh     # Scripts de inicio
```

## 🎨 Assets

El juego funciona sin assets externos (genera todo programáticamente), pero puedes agregar:

- **Sprites**: `assets/images/sprites/`
- **Fondos**: `assets/images/backgrounds/`
- **Audio**: `assets/audio/music/` y `assets/audio/sfx/`

Ver `assets/AI_TOOLS_AND_PROMPTS.md` para generar assets con IA.

## 🛠️ Tecnologías

- **Phaser 3** (v3.80.1)
- **HTML5**
- **CSS3**
- **JavaScript ES6+**

## 📝 Características

- ✅ Sistema de vidas
- ✅ Sistema de puntuación
- ✅ Múltiples niveles con dificultad progresiva
- ✅ Diferentes tipos de enemigos
- ✅ Jefes (gorilas) cada vez más poderosos
- ✅ Efecto de "tambaleo borracho" en el jugador
- ✅ Scroll horizontal con cámara que sigue al jugador
- ✅ Sistema de proyectiles
- ✅ Menú principal, pantallas de Game Over y Victoria

## 🐛 Solución de Problemas

### Los assets no cargan
- Asegúrate de estar usando un servidor HTTP (no file://)
- Verifica que los archivos estén en las rutas correctas
- Revisa la consola del navegador (F12) para errores

### El servidor no inicia
- Verifica que tengas Python o Node.js instalado
- Prueba cambiar el puerto si el 8000 está ocupado
- Usa Live Server en VS Code como alternativa

## 📚 Documentación

- `SERVER_INSTRUCTIONS.md` - Guía completa de servidores
- `assets/AI_TOOLS_AND_PROMPTS.md` - Generar assets con IA
- `assets/ASSETS_GUIDE.md` - Guía de assets
- `prompt-generacion.md` - Especificaciones del juego

## 🎮 ¡Disfruta jugando!

```

He creado varios servidores HTTP y documentación. Resumen:

## Servidores creados

### 1. Scripts automáticos
- `start-server.bat` (Windows): doble clic para iniciar
- `start-server.sh` (Linux/Mac): ejecuta `./start-server.sh`

Detectan automáticamente Python o Node.js y usan el servidor correspondiente.

### 2. Servidores individuales
- `server.py` (Python): servidor HTTP con CORS habilitado
- `server.js` (Node.js): servidor HTTP con CORS habilitado

### 3. Documentación
- `SERVER_INSTRUCTIONS.md`: guía con todas las opciones
- `README.md`: actualizado con instrucciones de inicio

## Cómo usar

### Opción más fácil (Windows):
1. Doble clic en `start-server.bat`
2. Se abrirá el navegador automáticamente
3. El juego debería cargar con todos los assets

### Si tienes Python:
```bash
python server.py
```

### Si tienes Node.js:
```bash
node server.js
```

### Si usas VS Code:
1. Instala la extensión "Live Server"
2. Clic derecho en `index.html` → "Open with Live Server"

## Características de los servidores

- CORS habilitado para cargar assets
- Puerto 8000 por defecto
- Abre el navegador automáticamente
- Muestra la URL en la consola
- Soporta todos los tipos de archivo (imágenes, audio, JSON, etc.)

## Verificación

Una vez que el servidor esté corriendo:
1. Abre `http://localhost:8000/index.html`
2. Abre la consola del navegador (F12)
3. Verifica que no haya errores 404
4. Los assets deberían cargarse correctamente

El juego debería funcionar correctamente con tus imágenes. ¿Quieres que pruebe algo más o necesitas ayuda con algún paso específico?

```shellscript
python server.py
```

```shellscript
node server.js
```

