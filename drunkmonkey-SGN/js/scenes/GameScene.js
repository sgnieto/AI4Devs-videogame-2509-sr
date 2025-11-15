class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || GAME_CONFIG.PLAYER_LIVES;
        this.startTime = Date.now();
        
        // Detener todos los sonidos de escenas anteriores
        // Esto se ejecuta antes de create(), así que necesitamos hacerlo en create()
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
        this.player.currentHealth = 100; // Inicializar salud al 100% al comenzar/reiniciar nivel
        
        // Crear enemigos según el nivel
        this.createEnemies();
        
        // Colisiones (configurar primero para que el jefe colisione correctamente)
        this.setupCollisions();
        
        // Crear gorila jefe (sobre la última plataforma)
        // La última plataforma está en x: GAME_CONFIG.WIDTH * 2.4, y: GAME_CONFIG.HEIGHT - 150
        // La plataforma tiene 30px de grosor, así que la parte superior está en y: GAME_CONFIG.HEIGHT - 150
        const bossPlatformX = GAME_CONFIG.WIDTH * 2.4;
        const bossPlatformY = GAME_CONFIG.HEIGHT - 150; // Parte superior de la plataforma
        const bossPlatformWidth = GAME_CONFIG.WIDTH * 0.4;
        const bossX = bossPlatformX + bossPlatformWidth / 2; // Centro de la plataforma
        // El gorila tiene 80px de altura, posicionarlo justo tocando la plataforma
        // Si el origen está en el centro, el jefe debe estar en: plataformaY - (altura/2)
        const bossY = bossPlatformY - 40; // Centro del jefe justo en la parte superior de la plataforma
        this.boss = new Gorilla(this, bossX, bossY, this.level);
        this.gorillas.add(this.boss);
        
        // Asegurar que el jefe sea visible y activo
        this.boss.setActive(true);
        this.boss.setVisible(true);
        this.boss.setDepth(10); // Asegurar que esté por encima de otros elementos
        
        // Detener completamente el movimiento del jefe inicialmente
        // El jefe comenzará a moverse cuando detecte al jugador
        this.boss.body.setVelocityX(0);
        this.boss.body.setVelocityY(0);
        // El jefe comenzará quieto y se moverá cuando detecte al jugador
        
        // Forzar que el jefe esté sobre la plataforma después de un frame
        this.time.delayedCall(100, () => {
            if (this.boss && this.boss.active) {
                // Asegurar que esté en la posición correcta
                this.boss.setPosition(bossX, bossY);
                this.boss.body.setVelocityX(0);
                this.boss.body.setVelocityY(0);
                console.log(`Jefe reposicionado: x=${this.boss.x}, y=${this.boss.y}`);
            }
        });
        
        // Debug: mostrar información del jefe
        console.log(`Jefe creado en posición: x=${bossX}, y=${bossY}, nivel=${this.level}`);
        console.log(`Jefe activo: ${this.boss.active}, visible: ${this.boss.visible}, alive: ${this.boss.isAlive}`);
        console.log(`Tamaño del jefe: width=${this.boss.width}, height=${this.boss.height}`);
        
        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        
        // HUD
        this.createHUD();
        this.updateHUD(); // Inicializar HUD con valores correctos
        
        // Detener todos los sonidos de escenas anteriores
        this.stopAllSounds();
        
        // Iniciar música de fondo del juego
        this.playMusic('game_music', true);
        
        // Configurar límites del mundo físico (más ancho que el fondo para permitir avanzar)
        // Ampliar límite inferior significativamente para que los personajes no desaparezcan al caer
        // setBounds(x, y, width, height) - ampliamos height para incluir espacio extra abajo
        this.physics.world.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT + 2000);
        
        // Cámara - seguir al jugador hasta el final del mundo
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH * 3, GAME_CONFIG.HEIGHT);
        this.cameras.main.startFollow(this.player, false, 1, 0.5, 0, 0); // Seguir suavemente, centrado horizontalmente
        this.cameras.main.setDeadzone(0, 0); // Sin deadzone para que siempre siga al jugador
        this.cameras.main.setFollowOffset(0, 0); // Sin offset
        
        // Timer para proyectiles
        this.lastProjectileTime = 0;
        this.projectileCooldown = 100; // 100ms entre proyectiles (disparo rápido continuo)
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
        
        // Plataforma inferior del mundo (suelo) - cubre todo el ancho para evitar que caigan
        const bottomPlatform = this.add.rectangle(
            (GAME_CONFIG.WIDTH * 3) / 2, // Centro del ancho total del mundo
            GAME_CONFIG.HEIGHT - 15, // Justo en el límite inferior visible
            GAME_CONFIG.WIDTH * 3, // Cubre todo el ancho del mundo
            30, // Grosor suficiente para colisionar
            COLORS.PLATFORM
        );
        this.physics.add.existing(bottomPlatform, true);
        this.platforms.add(bottomPlatform);
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
            this.playSound('sfx_hit', 0.4, false); // Sonido de impacto (sin sobreposición)
            if (monkey.takeDamage()) {
                this.playSound('sfx_enemy_death', 0.5, false); // Sonido de muerte de enemigo (sin sobreposición)
                this.score += monkey.getScore();
                this.updateHUD();
            }
        });
        
        this.physics.add.overlap(this.projectiles, this.gorillas, (projectile, gorilla) => {
            projectile.destroy();
            this.playSound('sfx_hit', 0.4, false); // Sonido de impacto (sin sobreposición)
            if (gorilla.takeDamage()) {
                this.playSound('sfx_enemy_death', 0.6, false); // Sonido de muerte de jefe (sin sobreposición)
                this.score += gorilla.getScore();
                this.updateHUD();
                // Verificar si el jefe fue derrotado
                if (gorilla === this.boss) {
                    this.completeLevel();
                }
            }
        });
        
        // Flag para prevenir múltiples reinicios simultáneos
        this.isRestarting = false;
        
        // Jugador con enemigos (monos - 10% de daño)
        this.physics.add.overlap(this.player, this.monkeys, (player, monkey) => {
            if (monkey.isAlive && !player.invulnerable && !this.isRestarting) {
                // Aplicar 10% de daño
                this.playSound('sfx_player_hurt', 0.5, false); // Sonido de daño al jugador (sin sobreposición)
                const lostLife = player.takeDamage(10);
                this.lives = player.lives;
                this.updateHUD();
                
                // Solo reiniciar si se perdió una vida completa
                if (lostLife) {
                    // Prevenir múltiples colisiones
                    this.isRestarting = true;
                    
                    this.time.delayedCall(500, () => {
                        const remainingLives = player.lives;
                        
                        if (remainingLives > 0) {
                            // Reiniciar nivel con las vidas restantes
                            this.scene.start('GameScene', {
                                level: this.level,
                                score: this.score,
                                lives: remainingLives
                            });
                        } else {
                            // No hay vidas, ir a Game Over
                            this.scene.start('GameOverScene', {
                                score: this.score,
                                level: this.level
                            });
                        }
                    });
                }
            }
        });
        
        // Jugador con jefe (gorila - 25% de daño)
        this.physics.add.overlap(this.player, this.gorillas, (player, gorilla) => {
            if (gorilla.isAlive && !player.invulnerable && !this.isRestarting) {
                // Aplicar 25% de daño
                this.playSound('sfx_player_hurt', 0.6, false); // Sonido de daño al jugador (sin sobreposición)
                const lostLife = player.takeDamage(25);
                this.lives = player.lives;
                this.updateHUD();
                
                // Solo reiniciar si se perdió una vida completa
                if (lostLife) {
                    // Prevenir múltiples colisiones
                    this.isRestarting = true;
                    
                    this.time.delayedCall(500, () => {
                        const remainingLives = player.lives;
                        
                        if (remainingLives > 0) {
                            // Reiniciar nivel con las vidas restantes
                            this.scene.start('GameScene', {
                                level: this.level,
                                score: this.score,
                                lives: remainingLives
                            });
                        } else {
                            // No hay vidas, ir a Game Over
                            this.scene.start('GameOverScene', {
                                score: this.score,
                                level: this.level
                            });
                        }
                    });
                }
            }
        });
    }
    
    createHUD() {
        // HUD fijo en la cámara
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setScrollFactor(0);
        this.hudContainer.setDepth(1000);
        
        // Fondo del HUD (más ancho para incluir barra de salud)
        const hudBg = this.add.rectangle(10, 10, 350, 120, 0x000000, 0.7);
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
        
        // Barra de salud
        this.healthBarBg = this.add.rectangle(20, 85, 200, 20, 0x333333, 1);
        this.healthBarBg.setOrigin(0, 0);
        this.hudContainer.add(this.healthBarBg);
        
        this.healthBar = this.add.rectangle(20, 85, 200, 20, 0x00ff00, 1);
        this.healthBar.setOrigin(0, 0);
        this.hudContainer.add(this.healthBar);
        
        this.healthText = this.add.text(230, 85, '100%', {
            fontSize: '16px',
            fill: '#ffffff'
        });
        this.healthText.setOrigin(0, 0.5);
        this.hudContainer.add(this.healthText);
        
        this.levelText = this.add.text(20, 110, `Nivel: ${this.level}`, {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.hudContainer.add(this.levelText);
    }
    
    updateHUD() {
        this.scoreText.setText(`Puntuación: ${this.score}`);
        this.livesText.setText(`Vidas: ${this.lives}`);
        
        // Actualizar barra de salud
        const healthPercent = Math.max(0, Math.min(100, this.player.currentHealth));
        const healthWidth = (healthPercent / 100) * 200;
        this.healthBar.width = healthWidth;
        
        // Cambiar color según la salud
        if (healthPercent > 60) {
            this.healthBar.fillColor = 0x00ff00; // Verde
        } else if (healthPercent > 30) {
            this.healthBar.fillColor = 0xffff00; // Amarillo
        } else {
            this.healthBar.fillColor = 0xff0000; // Rojo
        }
        
        this.healthText.setText(`${Math.round(healthPercent)}%`);
    }
    
    /**
     * Reproduce un sonido de forma segura (verifica si existe)
     * Evita sobreposiciones deteniendo el sonido anterior si está reproduciéndose
     */
    playSound(key, volume = 0.5, allowOverlap = false) {
        try {
            if (this.cache.audio.exists(key)) {
                // Si no se permite sobreposición, detener el sonido anterior
                if (!allowOverlap) {
                    // Buscar y detener todas las instancias de este sonido
                    if (this.sound.sounds) {
                        this.sound.sounds.forEach(sound => {
                            if (sound.key === key && sound.isPlaying) {
                                sound.stop();
                            }
                        });
                    }
                }
                this.sound.play(key, { volume: volume });
            }
        } catch (e) {
            // Silenciar errores si el sonido no existe
        }
    }
    
    /**
     * Reproduce música de fondo
     */
    playMusic(key, loop = false) {
        try {
            if (this.cache.audio.exists(key)) {
                if (this.music && this.music.isPlaying) {
                    this.music.stop();
                }
                this.music = this.sound.add(key, { loop: loop, volume: 0.3 });
                this.music.play();
            }
        } catch (e) {
            // Silenciar errores si la música no existe
        }
    }
    
    /**
     * Detiene la música de fondo
     */
    stopMusic() {
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }
    }
    
    /**
     * Detiene TODOS los sonidos y músicas activos
     */
    stopAllSounds() {
        try {
            // Detener música de fondo de esta escena
            if (this.music && this.music.isPlaying) {
                this.music.stop();
                this.music.destroy();
                this.music = null;
            }
            
            // Detener todos los sonidos activos del sistema de sonido
            if (this.sound) {
                // Detener todos los sonidos que están reproduciéndose
                this.sound.sounds.forEach(sound => {
                    if (sound && sound.isPlaying) {
                        sound.stop();
                    }
                });
                // También intentar detener todos los sonidos por clave (si el método existe)
                if (this.sound.stopByKey) {
                    const soundKeys = ['sfx_victory', 'sfx_game_over', 'sfx_player_hurt', 'sfx_enemy_death', 
                                     'sfx_hit', 'sfx_throw', 'sfx_jump', 'sfx_boss_roar',
                                     'game_music', 'victory_music', 'menu_music'];
                    soundKeys.forEach(key => {
                        if (this.cache.audio.exists(key)) {
                            try {
                                this.sound.stopByKey(key);
                            } catch (e) {
                                // Ignorar si no existe el método
                            }
                        }
                    });
                }
            }
        } catch (e) {
            // Silenciar errores
            console.log('Error al detener sonidos:', e);
        }
    }
    
    update(time, delta) {
        if (!this.player.isAlive) return;
        
        // Asegurar que el jugador permanezca activo y visible
        if (!this.player.active) {
            this.player.setActive(true);
        }
        if (!this.player.visible) {
            this.player.setVisible(true);
        }
        
        // Asegurar que el jefe permanezca activo y visible
        if (this.boss && this.boss.isAlive) {
            if (!this.boss.active) {
                this.boss.setActive(true);
                console.log('Jefe reactivado');
            }
            if (!this.boss.visible) {
                this.boss.setVisible(true);
                console.log('Jefe hecho visible');
            }
            
            // Si el jefe está cayendo (y > 1000), reposicionarlo sobre la plataforma
            if (this.boss.y > GAME_CONFIG.HEIGHT + 100) {
                const bossPlatformX = GAME_CONFIG.WIDTH * 2.4;
                const bossPlatformY = GAME_CONFIG.HEIGHT - 150;
                const bossPlatformWidth = GAME_CONFIG.WIDTH * 0.4;
                const bossX = bossPlatformX + bossPlatformWidth / 2;
                const bossY = bossPlatformY - 40;
                this.boss.setPosition(bossX, bossY);
                this.boss.body.setVelocityX(0);
                this.boss.body.setVelocityY(0);
                console.log(`Jefe estaba cayendo, reposicionado a: x=${bossX}, y=${bossY}`);
            }
            
            // Debug periódico (cada 5 segundos aproximadamente)
            if (Math.floor(time / 5000) !== Math.floor((time - delta) / 5000)) {
                console.log(`Jefe - Posición: x=${Math.round(this.boss.x)}, y=${Math.round(this.boss.y)}, activo: ${this.boss.active}, visible: ${this.boss.visible}, en suelo: ${this.boss.body.onFloor()}`);
            }
        }
        
        // Actualizar jugador
        this.player.update(this.cursors, time);
        
        // Lanzar proyectiles (disparo continuo rápido si se mantiene pulsado)
        const isShooting = this.cursors.j.isDown || this.cursors.space.isDown;
        if (isShooting && time - this.lastProjectileTime >= this.projectileCooldown) {
            const projectile = this.player.throwProjectile();
            if (projectile) {
                this.projectiles.add(projectile);
                this.lastProjectileTime = time;
                // Permitir sobreposición para el sonido de disparo (suena más natural con disparo rápido)
                this.playSound('sfx_throw', 0.2, true); // Volumen más bajo y permitir sobreposición controlada
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
                monkey.update(this.player, time);
            }
        });
        
        this.gorillas.children.entries.forEach(gorilla => {
            if (gorilla.isAlive) {
                gorilla.update(this.player, time);
            }
        });
    }
    
    completeLevel() {
        // Detener TODOS los sonidos y músicas antes de cambiar de escena
        this.stopAllSounds();
        
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
        // Detener TODOS los sonidos y músicas antes de cambiar de escena
        this.stopAllSounds();
        
        // Esta función ahora solo se usa cuando realmente no hay vidas
        // La lógica de reiniciar con vidas se maneja directamente en las colisiones
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}

