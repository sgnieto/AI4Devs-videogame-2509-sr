# Assets del Juego: Plátano Borracho vs Monos

Esta carpeta contiene todos los recursos del juego: imágenes, audio y mapas.

## Estructura

```
assets/
├── images/
│   ├── sprites/       # Sprites de personajes y objetos
│   └── backgrounds/   # Fondos de niveles
├── audio/
│   ├── music/         # Música de fondo
│   └── sfx/           # Efectos de sonido
└── maps/              # Mapas de niveles (opcional)
```

## Nota Importante

El juego está diseñado para funcionar **sin assets externos**. Todos los sprites se generan programáticamente usando Phaser Graphics API. Sin embargo, si deseas mejorar el juego con assets personalizados, puedes agregarlos aquí siguiendo la estructura indicada.

## Assets Generados Programáticamente

El juego genera automáticamente:
- **Sprites del jugador (plátano borracho)**: Forma amarilla con ojos y boca
- **Sprites de monos**: Círculos marrones con ojos
- **Sprites de gorilas**: Formas grandes y oscuras
- **Proyectiles**: Círculos amarillos
- **Plataformas**: Rectángulos verdes
- **Fondos**: Rectángulos de color sólido

## Si Quieres Agregar Assets Personalizados

### Sprites Recomendados
- **player.png**: Sprite del plátano borracho (40x60px recomendado)
- **monkey_basic.png**: Mono básico (40x40px)
- **monkey_fast.png**: Mono rápido (40x40px)
- **monkey_strong.png**: Mono fuerte (50x50px)
- **gorilla_1.png, gorilla_2.png, etc.**: Gorilas jefe (80x80px base, más grande según nivel)
- **projectile.png**: Proyectil (16x16px)

### Fondos Recomendados
- **jungle_bg_1.png, jungle_bg_2.png, etc.**: Fondos de jungla para cada nivel (1200x800px)

### Audio Recomendado
- **music_menu.mp3**: Música del menú principal
- **music_game.mp3**: Música de fondo durante el juego
- **sfx_jump.wav**: Sonido de salto
- **sfx_throw.wav**: Sonido de lanzar proyectil
- **sfx_hit.wav**: Sonido de impacto
- **sfx_enemy_death.wav**: Sonido de enemigo derrotado
- **sfx_player_hurt.wav**: Sonido de daño al jugador
- **sfx_game_over.wav**: Sonido de game over
- **sfx_victory.wav**: Sonido de victoria

