class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Detener todos los sonidos de escenas anteriores
        this.stopAllSounds();
        
        // Reproducir música de menú
        try {
            if (this.cache.audio.exists('menu_music')) {
                this.music = this.sound.add('menu_music', { loop: true, volume: 0.3 });
                this.music.play();
            } else {
                console.log('Música de menú no encontrada');
            }
        } catch (e) {
            console.error('Error al reproducir música de menú:', e);
        }
        
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
                // Detener todos los sonidos antes de cambiar de escena
                this.stopAllSounds();
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

