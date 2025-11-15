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
        
        // Asegurar que el jugador no se desactive al salir de los límites
        this.setActive(true);
        
        // Propiedades del jugador
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.currentHealth = 100; // Porcentaje de salud de la vida actual (0-100)
        this.isAlive = true;
        this.facingRight = true;
        this.canJump = true;
        this.isJumping = false;
        this.invulnerable = false;
        this.hasArmor = true; // Piel del plátano
        
        // Configurar física
        this.body.setSize(35, 55);
        // Activar colisiones con todos los bordes del mundo
        this.body.setCollideWorldBounds(true);
        this.body.checkCollision.left = true; // Colisión con borde izquierdo
        this.body.checkCollision.right = true; // Colisión con borde derecho
        this.body.checkCollision.up = true;
        this.body.checkCollision.down = true; // Colisión con límite inferior
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
        
        // Salto (solo W o flecha arriba, NO espacio)
        if ((cursors.up.isDown || cursors.w.isDown) && this.canJump && !this.isJumping) {
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
            // Reproducir sonido de salto (evitar sobreposición)
            try {
                if (this.scene.cache.audio.exists('sfx_jump')) {
                    // Detener el sonido anterior si está reproduciéndose
                    if (this.scene.sound.sounds) {
                        this.scene.sound.sounds.forEach(sound => {
                            if (sound.key === 'sfx_jump' && sound.isPlaying) {
                                sound.stop();
                            }
                        });
                    }
                    this.scene.sound.play('sfx_jump', { volume: 0.4 });
                }
            } catch (e) {
                // Silenciar errores si el sonido no existe
            }
        }
    }
    
    throwProjectile() {
        if (!this.isAlive) return null;
        
        const direction = this.facingRight ? 1 : -1;
        const offsetX = this.facingRight ? 30 : -30;
        const projectile = new Projectile(this.scene, this.x + offsetX, this.y, direction);
        
        return projectile;
    }
    
    takeDamage(damagePercent = 10) {
        if (this.invulnerable || !this.isAlive) return false;
        
        // Aplicar daño al porcentaje de salud actual
        this.currentHealth -= damagePercent;
        this.invulnerable = true;
        this.invulnerableTime = this.invulnerableDuration;
        
        // Perder armadura (piel del plátano) cuando la salud baja del 50%
        if (this.hasArmor && this.currentHealth <= 50) {
            this.hasArmor = false;
            // Cambiar color a más claro (plátano sin piel)
            this.setTint(0xffffcc);
        }
        
        // Si la salud llega a 0 o menos, perder una vida
        if (this.currentHealth <= 0) {
            this.lives--;
            this.currentHealth = 100; // Resetear salud para la siguiente vida
            
            if (this.lives <= 0) {
                this.die();
                return true; // Indica que se perdió una vida y no hay más vidas
            }
            return true; // Indica que se perdió una vida pero aún hay más
        }
        
        return false; // No se perdió una vida completa
    }
    
    die() {
        this.isAlive = false;
        this.setVelocity(0, 0);
        this.setTint(0x666666); // Gris cuando muere
    }
    
    reset(x, y) {
        this.setPosition(x, y);
        this.lives = GAME_CONFIG.PLAYER_LIVES;
        this.currentHealth = 100; // Resetear salud al 100%
        this.isAlive = true;
        this.hasArmor = true;
        this.invulnerable = false;
        this.setAlpha(1);
        this.clearTint();
        this.setVelocity(0, 0);
    }
}

