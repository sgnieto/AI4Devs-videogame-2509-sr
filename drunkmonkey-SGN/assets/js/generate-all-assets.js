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

