/**
 * Script para generar fondos del juego usando Phaser Graphics API
 */

class BackgroundGenerator {
    constructor(scene) {
        this.scene = scene;
    }
    
    /**
     * Genera fondo del menú principal
     */
    generateMenuBackground() {
        const graphics = this.scene.add.graphics();
        const width = 1200;
        const height = 800;
        
        // Fondo base (verde jungla oscuro)
        graphics.fillStyle(0x1a4d2e);
        graphics.fillRect(0, 0, width, height);
        
        // Capa de vegetación
        graphics.fillStyle(0x2d5016);
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 30 + Math.random() * 40;
            graphics.fillCircle(x, y, size);
        }
        
        // Hojas
        graphics.fillStyle(0x228b22);
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            graphics.fillEllipse(x, y, 40 + Math.random() * 30, 20 + Math.random() * 20);
        }
        
        // Lianas
        graphics.lineStyle(3, 0x3d5a1f);
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * width;
            graphics.lineBetween(x, 0, x + (Math.random() - 0.5) * 100, height);
        }
        
        const texture = graphics.generateTexture('menu_bg', width, height);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera fondo de nivel de jungla
     */
    generateJungleBackground(level = 1) {
        const graphics = this.scene.add.graphics();
        const width = 1200;
        const height = 800;
        
        // Colores según el nivel (más oscuro en niveles avanzados)
        const baseColors = [
            { dark: 0x1a4d2e, mid: 0x2d5016, light: 0x228b22 },
            { dark: 0x153d25, mid: 0x254014, light: 0x1f6b1f },
            { dark: 0x0f2a05, mid: 0x1a3d0a, light: 0x155515 },
            { dark: 0x0a1f03, mid: 0x123008, light: 0x0f440f }
        ];
        
        const colors = baseColors[Math.min(level - 1, 3)];
        
        // Fondo base
        graphics.fillStyle(colors.dark);
        graphics.fillRect(0, 0, width, height);
        
        // Cielo (gradiente simulado)
        graphics.fillStyle(0x87ceeb);
        graphics.fillRect(0, 0, width, height * 0.3);
        
        // Nubes
        graphics.fillStyle(0xffffff);
        for (let i = 0; i < 5; i++) {
            const x = (i * 250) + Math.random() * 100;
            const y = 50 + Math.random() * 100;
            graphics.fillEllipse(x, y, 80 + Math.random() * 40, 40 + Math.random() * 20);
        }
        
        // Vegetación de fondo
        graphics.fillStyle(colors.mid);
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = height * 0.3 + Math.random() * (height * 0.7);
            const size = 20 + Math.random() * 30;
            graphics.fillCircle(x, y, size);
        }
        
        // Árboles de fondo
        graphics.fillStyle(colors.mid);
        for (let i = 0; i < 8; i++) {
            const x = i * 150 + Math.random() * 50;
            const treeHeight = 200 + Math.random() * 150;
            const treeWidth = 40 + Math.random() * 20;
            graphics.fillRect(x, height - treeHeight, treeWidth, treeHeight);
            
            // Copa del árbol
            graphics.fillStyle(colors.light);
            graphics.fillCircle(x + treeWidth / 2, height - treeHeight, 60 + Math.random() * 40);
            graphics.fillStyle(colors.mid);
        }
        
        // Hojas flotantes
        graphics.fillStyle(colors.light);
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            graphics.fillEllipse(x, y, 25 + Math.random() * 20, 15 + Math.random() * 10);
        }
        
        // Lianas
        graphics.lineStyle(2, 0x3d5a1f);
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * width;
            graphics.lineBetween(x, height * 0.3, x + (Math.random() - 0.5) * 80, height);
        }
        
        const texture = graphics.generateTexture(`jungle_bg_${level}`, width, height);
        graphics.destroy();
        return texture;
    }
    
    /**
     * Genera todos los fondos
     */
    generateAll() {
        this.generateMenuBackground();
        for (let i = 1; i <= 4; i++) {
            this.generateJungleBackground(i);
        }
    }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundGenerator;
}

