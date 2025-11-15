# Guía para Generar Audio del Juego

Como no es posible generar archivos de audio binarios directamente, esta guía te ayudará a crear o encontrar los archivos de audio necesarios.

## Opción 1: Usar Recursos Gratuitos

### Sitios Recomendados
- **Freesound.org**: Efectos de sonido gratuitos con licencia Creative Commons
- **OpenGameArt.org**: Música y efectos de sonido para juegos
- **Zapsplat.com**: Efectos de sonido gratuitos (requiere registro)
- **Incompetech.com**: Música libre de derechos de Kevin MacLeod

### Búsquedas Recomendadas

#### Efectos de Sonido
- `sfx_jump.wav`: Buscar "jump sound", "hop sound"
- `sfx_throw.wav`: Buscar "throw sound", "whoosh sound"
- `sfx_hit.wav`: Buscar "hit sound", "impact sound", "punch sound"
- `sfx_enemy_death.wav`: Buscar "enemy death", "monster death", "defeat sound"
- `sfx_player_hurt.wav`: Buscar "hurt sound", "damage sound", "ouch sound"
- `sfx_game_over.wav`: Buscar "game over sound", "fail sound"
- `sfx_victory.wav`: Buscar "victory sound", "win sound", "success sound"
- `sfx_boss_roar.wav`: Buscar "roar sound", "monster roar", "gorilla sound"

#### Música
- `menu_music.mp3`: Buscar "jungle theme", "tropical music", "adventure menu"
- `game_music.mp3`: Buscar "action music", "adventure music", "jungle adventure"
- `victory_music.mp3`: Buscar "victory theme", "success music", "celebration"

## Opción 2: Generar con Herramientas

### Herramientas Gratuitas

#### Para Efectos de Sonido
1. **Bfxr** (http://www.bfxr.net/): Generador de efectos de sonido 8-bit
2. **ChipTone** (https://sfbgames.com/chiptone/): Generador de sonidos retro
3. **Audacity** (https://www.audacityteam.org/): Editor de audio gratuito

#### Para Música
1. **Bosca Ceoil** (https://boscaceoil.net/): Compositor de música chiptune
2. **LMMS** (https://lmms.io/): Estación de trabajo de audio digital
3. **MuseScore** (https://musescore.org/): Editor de partituras

### Ejemplo con Bfxr
1. Abre Bfxr en el navegador
2. Para `sfx_jump.wav`: Usa "Jump" preset
3. Para `sfx_throw.wav`: Usa "Powerup" preset y ajusta
4. Para `sfx_hit.wav`: Usa "Hit" preset
5. Exporta como WAV

### Ejemplo con Audacity
1. Abre Audacity
2. Genera → Tone para crear sonidos básicos
3. Efectos → Reverb para añadir profundidad
4. Efectos → Echo para efectos especiales
5. Exporta como WAV o MP3

## Opción 3: Usar Text-to-Speech y Convertir (Temporal)

Puedes usar servicios de TTS para generar sonidos básicos y luego procesarlos con Audacity.

## Especificaciones Técnicas

### Música
- **Formato**: MP3 (128-192 kbps) o OGG Vorbis
- **Duración**: Loop infinito (3-5 minutos recomendado)
- **Volumen**: Normalizado a -3dB
- **Frecuencia**: 44.1 kHz

### Efectos de Sonido
- **Formato**: WAV (16-bit, 44.1 kHz) o OGG
- **Duración**: 
  - Cortos: 0.1-0.3 segundos (jump, throw, hit)
  - Medios: 0.5-1.5 segundos (death, hurt, victory)
- **Volumen**: Normalizado según importancia
- **Frecuencia**: 44.1 kHz

## Estructura de Archivos Esperada

```
assets/audio/
├── music/
│   ├── menu_music.mp3
│   ├── game_music.mp3
│   └── victory_music.mp3
└── sfx/
    ├── sfx_jump.wav
    ├── sfx_throw.wav
    ├── sfx_hit.wav
    ├── sfx_enemy_death.wav
    ├── sfx_player_hurt.wav
    ├── sfx_game_over.wav
    ├── sfx_victory.wav
    └── sfx_boss_roar.wav
```

## Nota Importante

El juego funciona perfectamente sin archivos de audio. Los sonidos son opcionales pero mejoran significativamente la experiencia del jugador.

## Recursos Específicos Recomendados

### Música de Kevin MacLeod (Incompetech)
- "Jungle Adventure" para música del juego
- "Local Forecast" para menú
- "Monkeys Spinning Monkeys" (temático!)

### Freesound Tags Útiles
- `game`, `8bit`, `retro`, `jump`, `hit`, `victory`, `jungle`, `monkey`

