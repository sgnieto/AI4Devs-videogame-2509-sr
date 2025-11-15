class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.finalScore = data.score || 0;
        this.level = data.level || 1;
    }
    
    create() {
        // Detener todos los sonidos de escenas anteriores
        this.stopAllSounds();
        
        // Reproducir sonido de game over
        try {
            if (this.cache.audio.exists('sfx_game_over')) {
                this.sound.play('sfx_game_over', { volume: 0.6 });
            }
        } catch (e) {
            // Silenciar errores si el sonido no existe
        }
        
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
                // Detener todos los sonidos antes de cambiar de escena
                this.stopAllSounds();
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

