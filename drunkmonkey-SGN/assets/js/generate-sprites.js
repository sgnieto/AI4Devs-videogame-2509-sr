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

