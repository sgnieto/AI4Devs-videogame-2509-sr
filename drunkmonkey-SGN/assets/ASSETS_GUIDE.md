# Guía de Assets para Plátano Borracho vs Monos

## Introducción

Este juego está diseñado para funcionar **completamente sin assets externos**, generando todos los gráficos programáticamente. Sin embargo, puedes mejorar significativamente la experiencia del jugador agregando assets personalizados.

## Estructura de Carpetas

```
assets/
├── images/
│   ├── sprites/          # Sprites de personajes y objetos
│   └── backgrounds/      # Fondos de niveles
├── audio/
│   ├── music/            # Música de fondo
│   └── sfx/              # Efectos de sonido
└── maps/                 # Mapas de niveles (opcional)
```

## Sprites Necesarios

### Jugador (Plátano Borracho)
- **Tamaño recomendado**: 40x60 píxeles
- **Formato**: PNG con transparencia
- **Nombre**: `player.png`
- **Animaciones opcionales**: 
  - `player_idle.png` (quieto)
  - `player_walk_1.png`, `player_walk_2.png` (caminar)
  - `player_jump.png` (saltar)
  - `player_throw.png` (lanzar)

### Enemigos (Monos)
- **Tamaño recomendado**: 40x40 píxeles (básico y rápido), 50x50 píxeles (fuerte)
- **Formato**: PNG con transparencia
- **Nombres**: 
  - `monkey_basic.png`
  - `monkey_fast.png`
  - `monkey_strong.png`

### Jefes (Gorilas)
- **Tamaño recomendado**: 80x80 píxeles (nivel 1), aumentando 10px por nivel
- **Formato**: PNG con transparencia
- **Nombres**: `gorilla_1.png`, `gorilla_2.png`, `gorilla_3.png`, etc.

### Objetos
- **Proyectil**: 16x16 píxeles, `projectile.png`
- **Plataforma**: Textura opcional, `platform.png` (se puede repetir)

## Fondos

### Menú Principal
- **Tamaño**: 1200x800 píxeles
- **Nombre**: `menu_bg.png`
- **Tema**: Jungla con elementos temáticos

### Niveles
- **Tamaño**: 1200x800 píxeles (o más ancho para scroll)
- **Nombres**: `jungle_bg_1.png`, `jungle_bg_2.png`, etc.
- **Tema**: Fondos de jungla con diferentes profundidades y elementos

## Audio

### Música de Fondo
- **Formato**: MP3 o OGG (OGG recomendado para mejor compresión)
- **Loop**: Todas las músicas deben hacer loop
- **Archivos**:
  - `menu_music.mp3` - Música del menú (tranquila, temática)
  - `game_music.mp3` - Música durante el juego (acción, ritmo)
  - `victory_music.mp3` - Música de victoria (celebratoria)

### Efectos de Sonido
- **Formato**: WAV o OGG (WAV para calidad, OGG para tamaño)
- **Archivos**:
  - `sfx_jump.wav` - Salto del jugador (corto, ~0.2s)
  - `sfx_throw.wav` - Lanzar proyectil (corto, ~0.1s)
  - `sfx_hit.wav` - Impacto de proyectil (corto, ~0.15s)
  - `sfx_enemy_death.wav` - Muerte de enemigo (corto, ~0.3s)
  - `sfx_player_hurt.wav` - Daño al jugador (corto, ~0.2s)
  - `sfx_game_over.wav` - Game over (medio, ~1s)
  - `sfx_victory.wav` - Victoria (medio, ~1.5s)
  - `sfx_boss_roar.wav` - Rugido del gorila (opcional, ~0.5s)

## Mapas (Opcional)

Los mapas pueden estar en formato JSON. Ver `maps/level_1_example.json` para un ejemplo.

### Estructura de Mapa JSON

```json
{
  "level": 1,
  "width": 3600,
  "height": 800,
  "platforms": [
    {
      "x": 0,
      "y": 750,
      "width": 360,
      "height": 30
    }
  ],
  "enemies": [
    {
      "type": "monkey_basic",
      "x": 240,
      "y": 700
    }
  ],
  "boss": {
    "type": "gorilla",
    "level": 1,
    "x": 3000,
    "y": 600
  },
  "playerStart": {
    "x": 100,
    "y": 650
  }
}
```

## Cómo Usar Assets Personalizados

1. **Coloca los archivos** en las carpetas correspondientes según la estructura indicada.

2. **Usa el AssetLoader** (ver `assets/js/asset-loader.js`):
   ```javascript
   const loader = new AssetLoader(this);
   loader.preload();
   ```

3. **Modifica las clases de entidades** para usar los sprites cargados en lugar de generarlos programáticamente.

## Recursos Gratuitos Recomendados

### Generación con IA (Nuevo)
- **Ver**: `AI_TOOLS_AND_PROMPTS.md` para herramientas de IA gratuitas y prompts específicos
- **Imágenes**: Leonardo.ai, Bing Image Creator, Stable Diffusion
- **Audio**: Suno AI, MusicGen, Bfxr, ChipTone

### Recursos Tradicionales
- **Sprites**: OpenGameArt.org, itch.io (assets gratuitos)
- **Audio**: Freesound.org, OpenGameArt.org
- **Herramientas**: 
  - Aseprite (sprites)
  - GIMP/Photoshop (edición de imágenes)
  - Audacity (edición de audio)

## Notas Importantes

- El juego **funciona perfectamente sin assets externos**
- Los assets son **opcionales** pero mejoran la experiencia
- Asegúrate de que los archivos tengan los nombres exactos indicados
- Los formatos recomendados son PNG para imágenes y OGG/MP3 para audio
- Mantén los archivos optimizados (tamaño razonable) para mejor rendimiento

