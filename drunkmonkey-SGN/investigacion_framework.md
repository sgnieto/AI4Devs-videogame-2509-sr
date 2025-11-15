# Investigación: Framework para Clon de Ghosts 'n Goblins

## Objetivo
Desarrollar un clon del juego clásico "Ghosts 'n Goblins" (Ghosts and Goblins) utilizando HTML5, CSS y JavaScript. Este juego requiere:
- Sistema de plataformas 2D con scroll horizontal
- Sistema de sprites y animaciones
- Detección de colisiones
- Física básica (gravedad, saltos)
- Sistema de enemigos y IA básica
- Sistema de armas y proyectiles
- Múltiples niveles
- Sistema de vidas y puntuación

## Frameworks Investigados

### 1. **Phaser 3** ⭐ RECOMENDADO

**Descripción:**
Framework de código abierto y gratuito, específicamente diseñado para el desarrollo de juegos 2D en HTML5. Es el más popular y ampliamente utilizado en la comunidad de desarrollo de juegos web.

**Ventajas:**
- ✅ **Gratuito y de código abierto** (licencia MIT)
- ✅ **Documentación extensa** y comunidad muy activa
- ✅ **Soporte dual**: Canvas y WebGL para máximo rendimiento
- ✅ **Sistema de física integrado** (Arcade Physics, Matter.js)
- ✅ **Gestión de sprites y animaciones** muy completa
- ✅ **Sistema de escenas** para organizar niveles
- ✅ **Soporte para tilesets** (mapas de niveles)
- ✅ **Audio integrado** para música y efectos de sonido
- ✅ **Input system** robusto (teclado, mouse, touch)
- ✅ **Muchos tutoriales y ejemplos** disponibles
- ✅ **Activamente mantenido** (versión 3.x actual)

**Desventajas:**
- ⚠️ Curva de aprendizaje moderada (pero bien documentada)
- ⚠️ Tamaño del framework (~500KB minificado)

**Ideal para:**
Juegos de plataformas 2D complejos como Ghosts 'n Goblins, con múltiples enemigos, armas, y niveles.

**Recursos:**
- Sitio oficial: https://phaser.io
- Documentación: https://photonstorm.github.io/phaser3-docs/
- Ejemplos: https://labs.phaser.io

---

### 2. **MelonJS**

**Descripción:**
Motor de juegos HTML5 ligero y gratuito, específicamente diseñado para juegos de plataformas.

**Ventajas:**
- ✅ Gratuito y de código abierto
- ✅ **Muy ligero** (menor tamaño que Phaser)
- ✅ **Integración nativa con mapas de tiles** (Tiled Map Editor)
- ✅ Específicamente diseñado para juegos de plataformas
- ✅ Sistema de colisiones integrado
- ✅ Buena documentación

**Desventajas:**
- ⚠️ Comunidad más pequeña que Phaser
- ⚠️ Menos ejemplos y tutoriales disponibles
- ⚠️ Menos características avanzadas

**Ideal para:**
Juegos de plataformas simples a medianos, especialmente si ya tienes experiencia con editores de mapas como Tiled.

---

### 3. **PixiJS**

**Descripción:**
Biblioteca de renderizado 2D de alto rendimiento que utiliza WebGL. No es un motor de juegos completo, sino una biblioteca de renderizado.

**Ventajas:**
- ✅ **Excelente rendimiento** (WebGL acelerado por hardware)
- ✅ Muy ligero para renderizado
- ✅ Gratuito y de código abierto

**Desventajas:**
- ❌ **No es un motor completo** - solo renderizado
- ❌ Necesitas implementar física, colisiones, etc. manualmente
- ❌ Más trabajo de implementación desde cero

**Ideal para:**
Proyectos que requieren máximo rendimiento gráfico y donde quieres control total sobre la implementación.

---

### 4. **Kaboom.js**

**Descripción:**
Framework moderno y minimalista para crear juegos 2D con una sintaxis muy simple y declarativa.

**Ventajas:**
- ✅ **Sintaxis muy simple** y fácil de aprender
- ✅ Moderno y bien diseñado
- ✅ Gratuito y de código abierto
- ✅ Buen rendimiento

**Desventajas:**
- ⚠️ Comunidad más pequeña
- ⚠️ Menos maduro que Phaser
- ⚠️ Menos características avanzadas

**Ideal para:**
Prototipos rápidos y juegos más simples. Puede ser limitado para un juego complejo como Ghosts 'n Goblins.

---

### 5. **Cocos2d-JS**

**Descripción:**
Versión JavaScript del popular framework Cocos2d, diseñado para juegos 2D multiplataforma.

**Ventajas:**
- ✅ Framework completo y robusto
- ✅ Multiplataforma (web, móvil, desktop)
- ✅ Buenas herramientas de desarrollo

**Desventajas:**
- ⚠️ Curva de aprendizaje más pronunciada
- ⚠️ Más complejo de lo necesario para un proyecto web simple
- ⚠️ Comunidad más pequeña en JavaScript

**Ideal para:**
Proyectos que necesitan exportar a múltiples plataformas.

---

### 6. **ImpactJS**

**Descripción:**
Motor de juegos HTML5 consolidado y probado.

**Desventajas:**
- ❌ **Es de pago** (no gratuito)
- ⚠️ Menos mantenimiento activo actualmente

**No recomendado para:**
Proyectos educativos o de código abierto.

---

## Recomendación Final

### 🏆 **PHASER 3** es la mejor opción para este proyecto

**Razones:**
1. **Completitud**: Incluye todo lo necesario para un juego de plataformas (física, colisiones, sprites, audio, input)
2. **Comunidad y recursos**: La mayor comunidad y más tutoriales disponibles
3. **Documentación**: Excelente documentación oficial y muchos ejemplos
4. **Gratuito**: Licencia MIT, completamente gratuito
5. **Rendimiento**: Soporte para WebGL garantiza buen rendimiento
6. **Madurez**: Framework maduro y estable, usado en muchos juegos comerciales
7. **Facilidad de desarrollo**: Sistema de escenas facilita organizar niveles
8. **Soporte para tilesets**: Perfecto para crear niveles complejos

### Características de Phaser 3 relevantes para Ghosts 'n Goblins:

- **Arcade Physics**: Sistema de física perfecto para plataformas (gravedad, colisiones, saltos)
- **Sprite System**: Gestión completa de sprites y animaciones
- **Tilemap**: Soporte para crear niveles con editores como Tiled
- **Groups**: Para gestionar múltiples enemigos y proyectiles eficientemente
- **Scene Management**: Para organizar menús, niveles, game over, etc.
- **Input System**: Manejo de teclado, mouse y touch
- **Audio**: Sistema de audio para música y efectos de sonido
- **Camera**: Sistema de cámara con scroll automático

---

## Próximos Pasos

1. **Instalación de Phaser 3:**
   ```html
   <!-- Opción 1: CDN -->
   <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
   
   <!-- Opción 2: npm -->
   npm install phaser
   ```

2. **Estructura básica del proyecto:**
   ```
   ghosts-goblins-SGN/
   ├── index.html
   ├── css/
   │   └── style.css
   ├── js/
   │   ├── main.js (configuración Phaser)
   │   ├── scenes/
   │   │   ├── MenuScene.js
   │   │   ├── GameScene.js
   │   │   └── GameOverScene.js
   │   ├── entities/
   │   │   ├── Player.js
   │   │   ├── Enemy.js
   │   │   └── Projectile.js
   │   └── utils/
   ├── assets/
   │   ├── images/
   │   ├── audio/
   │   └── maps/
   └── prompts.md
   ```

3. **Recursos de aprendizaje:**
   - Tutorial oficial: https://phaser.io/tutorials/making-your-first-phaser-3-game
   - Ejemplos de plataformas: https://labs.phaser.io (buscar "platform")
   - Documentación API: https://photonstorm.github.io/phaser3-docs/

---

## Conclusión

**Phaser 3** es la elección más apropiada para desarrollar un clon de Ghosts 'n Goblins debido a su completitud, facilidad de uso, excelente documentación y comunidad activa. Proporciona todas las herramientas necesarias para crear un juego de plataformas 2D profesional sin necesidad de implementar sistemas complejos desde cero.

