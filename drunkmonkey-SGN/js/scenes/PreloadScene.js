class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    
    preload() {
        // Mostrar barra de carga
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 200, height / 2 - 30, 400, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Cargando...',
            style: {
                font: '20px Arial',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px Arial',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Actualizar barra de progreso
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 190, height / 2 - 20, 380 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // Cargar assets usando AssetLoader
        const assetLoader = new AssetLoader(this);
        assetLoader.preload();
    }
    
    create() {
        // Generar assets programáticamente si no se cargaron
        this.generateMissingAssets();
        
        // Ir al menú
        this.scene.start('MenuScene');
    }
    
    generateMissingAssets() {
        // Generar sprites si no existen
        if (!this.textures.exists('player')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generatePlayer();
        }
        if (!this.textures.exists('monkey_basic')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyBasic();
        }
        if (!this.textures.exists('monkey_fast')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyFast();
        }
        if (!this.textures.exists('monkey_strong')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateMonkeyStrong();
        }
        if (!this.textures.exists('projectile')) {
            const spriteGen = new SpriteGenerator(this);
            spriteGen.generateProjectile();
        }
        
        // Generar gorilas si no existen
        for (let i = 1; i <= 4; i++) {
            if (!this.textures.exists(`gorilla_${i}`)) {
                const spriteGen = new SpriteGenerator(this);
                spriteGen.generateGorilla(i);
            }
        }
        
        // Generar fondos si no existen
        if (!this.textures.exists('menu_bg')) {
            const bgGen = new BackgroundGenerator(this);
            bgGen.generateMenuBackground();
        }
        for (let i = 1; i <= 4; i++) {
            // Para nivel 4, verificar también el nombre alternativo con typo
            let bgKey = `jungle_bg_${i}`;
            if (i === 4 && this.textures.exists('jungle_bg_4_alt') && !this.textures.exists('jungle_bg_4')) {
                // Copiar la textura con typo al nombre correcto (Phaser 3 no tiene rename)
                const sourceTexture = this.textures.get('jungle_bg_4_alt');
                const sourceImage = sourceTexture.getSourceImage();
                
                // Crear un canvas temporal para copiar la imagen
                const canvas = document.createElement('canvas');
                canvas.width = sourceImage.width || sourceTexture.width;
                canvas.height = sourceImage.height || sourceTexture.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(sourceImage, 0, 0);
                
                // Agregar la textura copiada con el nombre correcto
                this.textures.addCanvas('jungle_bg_4', canvas);
            }
            
            if (!this.textures.exists(bgKey)) {
                const bgGen = new BackgroundGenerator(this);
                bgGen.generateJungleBackground(i);
            }
        }
    }
}

