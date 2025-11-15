# Plátano Borracho vs Monos 🍌🐵

Un juego de plataformas 2D estilo "Ghosts 'n Goblins" desarrollado con Phaser 3.

## 🎮 Descripción

Controla a un plátano borracho que debe sobrevivir en una jungla peligrosa llena de monos hambrientos. Debes atravesar múltiples niveles, derrotando monos y enfrentándote a poderosos gorilas jefe para sobrevivir.

## 🚀 Inicio Rápido

### ⚠️ IMPORTANTE: Servir por HTTP

**NO abras `index.html` directamente** (file://). Los navegadores bloquean la carga de assets locales por seguridad.

### Opción 1: Script Automático (Recomendado)

**Windows:**
```bash
start-server.bat
```

**Linux/Mac:**
```bash
chmod +x start-server.sh
./start-server.sh
```

### Opción 2: Python
```bash
python server.py
```

### Opción 3: Node.js
```bash
node server.js
```

### Opción 4: Python Simple
```bash
python -m http.server 8000
```

Luego abre: `http://localhost:8000/index.html`

### Opción 5: Live Server (VS Code)
1. Instala la extensión "Live Server"
2. Clic derecho en `index.html` → "Open with Live Server"

**Ver `SERVER_INSTRUCTIONS.md` para más opciones y detalles.**

## 🎯 Controles

- **A / D** o **← / →**: Mover izquierda/derecha
- **W** o **↑**: Saltar
- **J** o **Espacio**: Lanzar proyectil

## 📁 Estructura del Proyecto

```
ghosts-goblins-SGN/
├── index.html              # Archivo principal HTML
├── css/
│   └── style.css          # Estilos del juego
├── js/
│   ├── main.js            # Configuración Phaser
│   ├── scenes/            # Escenas del juego
│   ├── entities/           # Entidades (jugador, enemigos)
│   └── utils/              # Utilidades y constantes
├── assets/
│   ├── images/            # Sprites y fondos
│   ├── audio/             # Música y efectos
│   └── maps/              # Mapas de niveles (JSON)
├── server.py              # Servidor Python
├── server.js               # Servidor Node.js
└── start-server.bat/sh     # Scripts de inicio
```

## 🎨 Assets

El juego funciona sin assets externos (genera todo programáticamente), pero puedes agregar:

- **Sprites**: `assets/images/sprites/`
- **Fondos**: `assets/images/backgrounds/`
- **Audio**: `assets/audio/music/` y `assets/audio/sfx/`

Ver `assets/AI_TOOLS_AND_PROMPTS.md` para generar assets con IA.

## 🛠️ Tecnologías

- **Phaser 3** (v3.80.1)
- **HTML5**
- **CSS3**
- **JavaScript ES6+**

## 📝 Características

- ✅ Sistema de vidas
- ✅ Sistema de puntuación
- ✅ Múltiples niveles con dificultad progresiva
- ✅ Diferentes tipos de enemigos
- ✅ Jefes (gorilas) cada vez más poderosos
- ✅ Efecto de "tambaleo borracho" en el jugador
- ✅ Scroll horizontal con cámara que sigue al jugador
- ✅ Sistema de proyectiles
- ✅ Menú principal, pantallas de Game Over y Victoria

## 🐛 Solución de Problemas

### Los assets no cargan
- Asegúrate de estar usando un servidor HTTP (no file://)
- Verifica que los archivos estén en las rutas correctas
- Revisa la consola del navegador (F12) para errores

### El servidor no inicia
- Verifica que tengas Python o Node.js instalado
- Prueba cambiar el puerto si el 8000 está ocupado
- Usa Live Server en VS Code como alternativa

## 📚 Documentación

- `SERVER_INSTRUCTIONS.md` - Guía completa de servidores
- `assets/AI_TOOLS_AND_PROMPTS.md` - Generar assets con IA
- `assets/ASSETS_GUIDE.md` - Guía de assets
- `prompt-generacion.md` - Especificaciones del juego

## 🎮 ¡Disfruta jugando!

