class Monkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = ENEMY_TYPES.MONKEY_BASIC) {
        // Intentar usar sprite cargado, si no existe, generar programáticamente
        const spriteKey = `monkey_${type}`;
        
        // Definir el tamaño según el tipo (necesario para la física)
        const size = type === ENEMY_TYPES.MONKEY_STRONG ? 50 : 40;
        
        if (scene.textures.exists(spriteKey)) {
            super(scene, x, y, spriteKey);
        } else {
            // Crear sprite del mono según el tipo programáticamente
            const graphics = scene.add.graphics();
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
        
        // Asegurar que el mono no se desactive al salir de los límites
        this.setActive(true);
        
        this.type = type;
        this.isAlive = true;
        this.direction = Math.random() > 0.5 ? 1 : -1; // Dirección aleatoria inicial
        this.detectionRange = 200; // Rango de detección del jugador
        this.resistance = this.getResistance();
        this.speed = this.getSpeed();
        
        // Capacidad de salto y detección de obstáculos
        this.canJump = true;
        this.isJumping = false;
        this.lastObstacleCheck = 0;
        this.obstacleCheckCooldown = 200; // Verificar obstáculos cada 200ms
        this.jumpCooldown = 0;
        this.minJumpCooldown = 1000; // Mínimo 1 segundo entre saltos
        
        // Configurar física
        this.body.setSize(size - 5, size - 5);
        // Activar colisiones con todos los bordes del mundo
        this.body.setCollideWorldBounds(true);
        this.body.checkCollision.left = true; // Colisión con borde izquierdo
        this.body.checkCollision.right = true; // Colisión con borde derecho
        this.body.checkCollision.up = true;
        this.body.checkCollision.down = true; // Colisión con límite inferior
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        this.body.setVelocityX(this.speed * this.direction);
        
        // Cambiar dirección o saltar al tocar bordes horizontales
        this.body.onWorldBounds = true;
        scene.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this && (event.body.blocked.left || event.body.blocked.right)) {
                // Decidir si saltar o cambiar de dirección (70% cambiar dirección, 30% saltar)
                if (this.canJump && !this.isJumping && Math.random() < 0.3 && this.jumpCooldown <= 0) {
                    this.jump();
                } else {
                    this.direction *= -1;
                    this.body.setVelocityX(this.speed * this.direction);
                }
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
    
    update(player, time) {
        if (!this.isAlive) return;
        
        // Actualizar cooldowns
        if (this.jumpCooldown > 0) {
            this.jumpCooldown -= time;
        }
        
        // Verificar si está en el suelo
        if (this.body.onFloor()) {
            this.canJump = true;
            this.isJumping = false;
        } else {
            this.isJumping = true;
        }
        
        // Detectar obstáculos delante (solo si ha pasado el cooldown)
        if (time - this.lastObstacleCheck > this.obstacleCheckCooldown) {
            this.checkObstacles(time);
            this.lastObstacleCheck = time;
        }
        
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
    
    checkObstacles(time) {
        // Verificar si estamos bloqueados por un obstáculo lateral (colisión activa)
        if (this.body.blocked.left || this.body.blocked.right) {
            // Estamos bloqueados, decidir acción
            if (this.canJump && !this.isJumping && Math.random() < 0.4 && this.jumpCooldown <= 0) {
                // 40% de probabilidad de saltar sobre el obstáculo
                this.jump();
            } else {
                // 60% de probabilidad de cambiar de dirección
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction);
            }
            return; // Ya manejamos el obstáculo
        }
        
        // Verificar si hay plataformas delante usando overlap temporal
        // Crear un pequeño rectángulo de detección delante del mono
        const detectionDistance = 40;
        const detectionX = this.x + (this.direction * (this.width / 2 + detectionDistance));
        const detectionY = this.y;
        const detectionWidth = 20;
        const detectionHeight = this.height;
        
        // Verificar colisión con plataformas usando el sistema de física
        // Si hay una plataforma delante a la misma altura o más alta, considerar saltar
        if (this.body.onFloor() && this.body.velocity.x !== 0) {
            // Verificar si estamos cerca de los bordes del mundo
            const worldBounds = this.scene.physics.world.bounds;
            const isNearWorldEdge = (this.direction > 0 && this.x > worldBounds.width - 150) ||
                                   (this.direction < 0 && this.x < 150);
            
            if (isNearWorldEdge && Math.random() < 0.3) {
                // 30% de probabilidad de cambiar dirección cerca de los bordes del mundo
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction);
            }
        }
    }
    
    jump() {
        if (this.canJump && !this.isJumping && this.jumpCooldown <= 0) {
            this.setVelocityY(GAME_CONFIG.JUMP_VELOCITY * 0.7); // Salto un poco más bajo que el jugador
            this.canJump = false;
            this.isJumping = true;
            this.jumpCooldown = this.minJumpCooldown;
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

