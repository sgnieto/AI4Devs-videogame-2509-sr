class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        // Intentar usar sprite cargado, si no existe, generar programáticamente
        if (scene.textures.exists('projectile')) {
            super(scene, x, y, 'projectile');
        } else {
            // Crear sprite simple programáticamente
            const graphics = scene.add.graphics();
            graphics.fillStyle(COLORS.PROJECTILE);
            graphics.fillCircle(0, 0, 8);
            const texture = graphics.generateTexture('projectile', 16, 16);
            graphics.destroy();
            
            super(scene, x, y, texture);
        }
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.direction = direction; // 1 para derecha, -1 para izquierda
        this.speed = GAME_CONFIG.PROJECTILE_SPEED;
        
        // Configurar física
        this.body.setSize(12, 12);
        this.body.setCollideWorldBounds(false); // No colisionar con bordes, destruir manualmente
        this.body.setGravityY(GAME_CONFIG.GRAVITY); // Misma gravedad que el protagonista
        
        // Velocidad inicial con componente horizontal y vertical (arco parabólico)
        // Mantener velocidad horizontal constante como el protagonista
        this.horizontalSpeed = this.speed * this.direction;
        const verticalSpeed = -200; // Velocidad vertical inicial hacia arriba
        this.setVelocity(this.horizontalSpeed, verticalSpeed);
        
        // Guardar referencia a la escena
        this.scene = scene;
    }
    
    update() {
        // Mantener velocidad horizontal constante (mismas reglas físicas que el protagonista)
        // La gravedad ya está aplicada automáticamente
        this.body.setVelocityX(this.horizontalSpeed);
        
        // Destruir si sale de los límites del mundo
        if (this.x < -50 || this.x > GAME_CONFIG.WIDTH * 3 + 50 || 
            this.y < -50 || this.y > GAME_CONFIG.HEIGHT + 50) {
            this.destroy();
        }
    }
}

