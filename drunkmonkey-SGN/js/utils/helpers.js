// Funciones auxiliares

/**
 * Crea un sprite simple usando Phaser Graphics
 */
function createSimpleSprite(scene, x, y, width, height, color, shape = 'rectangle') {
    const graphics = scene.add.graphics();
    
    graphics.fillStyle(color);
    
    if (shape === 'rectangle') {
        graphics.fillRect(0, 0, width, height);
    } else if (shape === 'circle') {
        graphics.fillCircle(width / 2, height / 2, width / 2);
    }
    
    const texture = graphics.generateTexture(shape + '_' + color.toString(16), width, height);
    graphics.destroy();
    
    return scene.add.image(x, y, texture);
}

/**
 * Calcula la distancia entre dos puntos
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Genera un número aleatorio entre min y max
 */
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Formatea el tiempo en formato MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

