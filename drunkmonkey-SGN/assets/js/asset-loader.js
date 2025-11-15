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
        // Configurar manejo centralizado de errores
        // Verificar si ya está registrado para evitar duplicados
        if (!this._errorHandlerRegistered) {
            this.scene.load.on('fileerror', (file) => {
                // Los 404 de audio son esperados cuando los archivos no existen
                // Solo mostrar errores para imágenes y otros assets críticos
                const isAudio = file.type === 'audio' || 
                               file.src.includes('/audio/') ||
                               file.key.startsWith('sfx_') ||
                               file.key.includes('_music');
                
                if (!isAudio) {
                    console.log(`No se pudo cargar: ${file.key} desde ${file.src}`);
                }
            });
            this._errorHandlerRegistered = true;
        }
        
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
        
        // Cargar sprites (el manejo de errores está en preload())
        sprites.forEach(sprite => {
            this.scene.load.image(sprite.key, sprite.path);
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
        // Los 404 son normales cuando los archivos no existen
        // El manejo de errores está centralizado en preload()
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

