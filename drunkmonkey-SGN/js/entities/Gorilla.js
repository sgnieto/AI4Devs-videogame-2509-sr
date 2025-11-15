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
        
        // Asegurar que el gorila no se desactive al salir de los límites
        this.setActive(true);
        
        this.level = level;
        this.isAlive = true;
        this.direction = 0; // Empieza quieto, se moverá cuando detecte al jugador
        this.resistance = this.getResistance();
        this.maxResistance = this.resistance;
        this.speed = this.getSpeed();
        this.attackCooldown = 0;
        this.attackInterval = 2000 + (level * 500); // Más rápido en niveles altos
        
        // Comportamiento inteligente del jefe
        this.detectionRange = 400; // Rango de detección más amplio que los monos
        this.lastDirectionChange = 0;
        // Cooldown más largo para reducir agresividad, especialmente en nivel 3
        this.directionChangeCooldown = level === 3 ? 1500 : 800; // Nivel 3: 1.5s, otros: 0.8s
        this.pauseMovement = false;
        this.pauseTimer = 0;
        
        // Capacidad de salto y detección de obstáculos (similar a los monos pero más inteligente)
        this.canJump = true;
        this.isJumping = false;
        this.lastObstacleCheck = 0;
        this.obstacleCheckCooldown = 150; // Verificar obstáculos más frecuentemente que los monos
        this.jumpCooldown = 0;
        this.minJumpCooldown = 800; // Mínimo 0.8 segundos entre saltos
        this.stuckTimer = 0; // Tiempo que lleva atascado
        this.stuckThreshold = 500; // Si está atascado más de 500ms, forzar acción
        
        // Configurar física - usar el tamaño real del sprite
        const spriteSize = this.width || size;
        this.body.setSize(spriteSize - 10, spriteSize - 10);
        // Activar colisiones con todos los bordes del mundo
        this.body.setCollideWorldBounds(true);
        this.body.checkCollision.left = true; // Colisión con borde izquierdo
        this.body.checkCollision.right = true; // Colisión con borde derecho
        this.body.checkCollision.up = true;
        this.body.checkCollision.down = true; // Colisión con límite inferior
        this.body.setGravityY(GAME_CONFIG.GRAVITY);
        this.body.setVelocityX(this.speed * this.direction);
        
        // Barra de vida
        this.createHealthBar(scene);
        
        // Cambiar dirección o saltar al tocar bordes
        this.body.onWorldBounds = true;
        scene.physics.world.on('worldbounds', (event) => {
            if (event.gameObject === this && (event.body.blocked.left || event.body.blocked.right)) {
                // Decidir si saltar o cambiar de dirección (50% saltar, 50% cambiar dirección)
                if (this.canJump && !this.isJumping && Math.random() < 0.5 && this.jumpCooldown <= 0) {
                    this.jump();
                } else {
                    this.direction *= -1;
                    this.body.setVelocityX(this.speed * this.direction);
                    this.stuckTimer = 0; // Resetear contador de atascado
                }
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
        
        // Detectar si está atascado (bloqueado y sin movimiento)
        if (this.body.blocked.left || this.body.blocked.right) {
            this.stuckTimer += time;
            
            // Si está atascado más del umbral, forzar acción inmediata
            if (this.stuckTimer > this.stuckThreshold) {
                // Forzar cambio de dirección o salto sin cooldown
                if (this.canJump && !this.isJumping && this.jumpCooldown <= 0) {
                    this.jump();
                    this.stuckTimer = 0;
                } else {
                    this.direction *= -1;
                    this.body.setVelocityX(this.speed * this.direction * 1.2); // Movimiento más rápido para escapar
                    this.stuckTimer = 0;
                    this.lastDirectionChange = time; // Resetear cooldown de cambio de dirección
                }
            }
        } else {
            // Si no está bloqueado, resetear contador
            this.stuckTimer = 0;
        }
        
        // Verificar obstáculos delante (más frecuentemente que los monos)
        if (time - this.lastObstacleCheck > this.obstacleCheckCooldown) {
            this.checkObstacles(time);
            this.lastObstacleCheck = time;
        }
        
        // Comportamiento similar a los monos pero más complejo
        let targetDirection = this.direction;
        
        if (player && player.isAlive) {
            const distanceToPlayer = Phaser.Math.Distance.Between(
                this.x, this.y, player.x, player.y
            );
            
            // Si el jugador está dentro del rango de detección
            if (distanceToPlayer < this.detectionRange) {
                // En nivel 3, hacer el movimiento menos directo y agresivo
                const isLevel3 = this.level === 3;
                const aggressionFactor = isLevel3 ? 0.6 : 1.0; // Reducir agresividad en nivel 3
                
                // Moverse hacia el jugador, pero con menos precisión en nivel 3
                if (player.x > this.x + 30) {
                    targetDirection = 1;
                } else if (player.x < this.x - 30) {
                    targetDirection = -1;
                } else {
                    // Si el jugador está muy cerca, mantener dirección actual o elegir una
                    targetDirection = this.direction !== 0 ? this.direction : (player.x > this.x ? 1 : -1);
                }
                
                // En nivel 3, ocasionalmente ignorar el jugador para hacer movimiento más errático
                if (isLevel3 && Math.random() < 0.15) {
                    // 15% de probabilidad de moverse en dirección aleatoria en lugar de hacia el jugador
                    targetDirection = Math.random() < 0.5 ? -1 : 1;
                }
                
                // Establecer dirección si no tiene una o cambiar si es necesario
                // Si está atascado, ignorar el cooldown
                const canChangeDirection = (time - this.lastDirectionChange > this.directionChangeCooldown) || 
                                         (this.stuckTimer > this.stuckThreshold / 2);
                
                if (this.direction === 0) {
                    // Primera vez que detecta al jugador
                    this.direction = targetDirection;
                    this.lastDirectionChange = time;
                } else if (targetDirection !== this.direction && canChangeDirection) {
                    // Cambiar dirección (movimiento más estratégico, pero permitir cambio si está atascado)
                    this.direction = targetDirection;
                    this.lastDirectionChange = time;
                    this.stuckTimer = 0; // Resetear contador al cambiar dirección
                }
                
                // Ocasionalmente pausar el movimiento para hacer el jefe más impredecible
                // En nivel 3, pausar más frecuentemente
                const pauseChance = isLevel3 ? 0.02 : 0.01;
                if (Math.random() < pauseChance && !this.pauseMovement) {
                    this.pauseMovement = true;
                    const pauseDuration = isLevel3 ? 500 + Math.random() * 300 : 300 + Math.random() * 200;
                    this.pauseTimer = time + pauseDuration; // Pausa más larga en nivel 3
                }
            } else {
                // Si el jugador está lejos, quedarse quieto o patrullar suavemente
                if (this.direction !== 0 && time - this.lastDirectionChange > this.directionChangeCooldown * 2) {
                    // Ocasionalmente cambiar dirección cuando el jugador está lejos
                    if (Math.random() < 0.2) {
                        this.direction *= -1;
                        this.lastDirectionChange = time;
                    } else if (Math.random() < 0.1) {
                        // Ocasionalmente detenerse completamente
                        this.direction = 0;
                        this.lastDirectionChange = time;
                    }
                }
            }
        }
        
        // Manejar pausa de movimiento
        if (this.pauseMovement) {
            if (time > this.pauseTimer) {
                this.pauseMovement = false;
            } else {
                this.body.setVelocityX(0);
                // Voltear sprite según dirección
                if (this.direction > 0) {
                    this.setFlipX(false);
                } else {
                    this.setFlipX(true);
                }
                return; // No hacer nada más durante la pausa
            }
        }
        
        // Aplicar velocidad con variación para hacer el movimiento más complejo
        // Solo moverse si hay una dirección válida
        if (this.direction !== 0) {
            const baseSpeed = this.speed * this.direction;
            // En nivel 3, reducir la velocidad efectiva para hacerlo menos agresivo
            const effectiveSpeed = this.level === 3 ? baseSpeed * 0.85 : baseSpeed;
            // Agregar variación de velocidad ocasional (aceleraciones/desaceleraciones)
            const speedVariation = Math.sin(time * 0.002) * (this.speed * 0.2);
            this.body.setVelocityX(effectiveSpeed + speedVariation);
        } else {
            // Si no hay dirección, quedarse quieto
            this.body.setVelocityX(0);
        }
        
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
    
    checkObstacles(time) {
        // Verificar si estamos bloqueados por un obstáculo lateral
        if (this.body.blocked.left || this.body.blocked.right) {
            // Estamos bloqueados, decidir acción inmediata
            if (this.canJump && !this.isJumping && Math.random() < 0.5 && this.jumpCooldown <= 0) {
                // 50% de probabilidad de saltar sobre el obstáculo
                this.jump();
            } else {
                // 50% de probabilidad de cambiar de dirección
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction * 1.2); // Movimiento más rápido
                this.stuckTimer = 0;
                this.lastDirectionChange = time; // Resetear cooldown
            }
            return; // Ya manejamos el obstáculo
        }
        
        // Verificar si estamos cerca de los bordes del mundo
        if (this.body.onFloor() && this.body.velocity.x !== 0) {
            const worldBounds = this.scene.physics.world.bounds;
            const isNearWorldEdge = (this.direction > 0 && this.x > worldBounds.width - 150) ||
                                   (this.direction < 0 && this.x < 150);
            
            if (isNearWorldEdge && Math.random() < 0.2) {
                // 20% de probabilidad de cambiar dirección cerca de los bordes
                this.direction *= -1;
                this.body.setVelocityX(this.speed * this.direction);
                this.lastDirectionChange = time;
            }
        }
    }
    
    jump() {
        if (this.canJump && !this.isJumping && this.jumpCooldown <= 0) {
            this.setVelocityY(GAME_CONFIG.JUMP_VELOCITY * 0.8); // Salto del jefe (80% del salto del jugador)
            this.canJump = false;
            this.isJumping = true;
            this.jumpCooldown = this.minJumpCooldown;
            this.stuckTimer = 0; // Resetear contador al saltar
        }
    }
    
    attack(player) {
        // Ataque más complejo: carga hacia el jugador
        if (player && player.isAlive) {
            // Reproducir rugido del jefe (evitar sobreposición)
            try {
                if (this.scene.cache.audio.exists('sfx_boss_roar')) {
                    // Detener el rugido anterior si está reproduciéndose
                    if (this.scene.sound.sounds) {
                        this.scene.sound.sounds.forEach(sound => {
                            if (sound.key === 'sfx_boss_roar' && sound.isPlaying) {
                                sound.stop();
                            }
                        });
                    }
                    this.scene.sound.play('sfx_boss_roar', { volume: 0.5 });
                }
            } catch (e) {
                // Silenciar errores si el sonido no existe
            }
            
            // Determinar dirección hacia el jugador
            if (player.x > this.x) {
                this.direction = 1;
            } else {
                this.direction = -1;
            }
            // Carga rápida hacia el jugador
            this.body.setVelocityX(this.speed * this.direction * 1.3);
            // La carga dura un tiempo limitado (se resetea en el siguiente update)
        }
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

