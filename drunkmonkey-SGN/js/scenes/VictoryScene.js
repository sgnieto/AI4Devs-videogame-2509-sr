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
        // Detener todos los sonidos de escenas anteriores
        this.stopAllSounds();
        
        // Reproducir sonido de victoria
        try {
            if (this.cache.audio.exists('sfx_victory')) {
                this.sound.play('sfx_victory', { volume: 0.6 });
            }
        } catch (e) {
            // Silenciar errores si el sonido no existe
        }
        
        // Reproducir música de victoria
        try {
            if (this.cache.audio.exists('victory_music')) {
                this.music = this.sound.add('victory_music', { loop: false, volume: 0.3 });
                this.music.play();
            }
        } catch (e) {
            // Silenciar errores si la música no existe
        }
        
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
        
        // Botón Siguiente Nivel (solo si no es el nivel 4)
        if (this.level < 4) {
            const nextButton = this.add.rectangle(GAME_CONFIG.WIDTH / 2, 550, 350, 80, 0x228b22)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    // Detener todos los sonidos antes de cambiar de escena
                    this.stopAllSounds();
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
        } else {
            // Si es el nivel 4, mostrar mensaje de victoria final
            this.add.text(GAME_CONFIG.WIDTH / 2, 550, '¡JUEGO COMPLETADO!', {
                fontSize: '40px',
                fontFamily: 'Arial',
                fill: '#ffd700',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
        }
        
        // Botón Menú Principal
        const menuButton = this.add.rectangle(GAME_CONFIG.WIDTH / 2, 650, 350, 80, 0x444444)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                // Detener todos los sonidos antes de cambiar de escena
                this.stopAllSounds();
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
}

