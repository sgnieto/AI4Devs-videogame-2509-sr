# Prompt para Generación del Juego: Plátano Borracho vs Monos

Desarrolla un juego completo de plataformas 2D estilo "Ghosts 'n Goblins" utilizando **Phaser 3**, HTML5, CSS y JavaScript. El juego debe estar completamente funcional y listo para jugar en navegadores web.

## Tema y Narrativa

**Protagonista:** Un plátano borracho que debe luchar por su supervivencia.

**Enemigos:** Monos que quieren comerse al plátano.

**Jefes:** Gorilas cada vez más poderosos al final de cada nivel.

**Historia:** El plátano borracho se encuentra en una jungla peligrosa llena de monos hambrientos. Debe atravesar múltiples niveles, derrotando monos y enfrentándose a poderosos gorilas jefe para sobrevivir.

---

## Requisitos Técnicos

### Framework y Tecnologías
- **Framework:** Phaser 3 (versión 3.80.1 o superior)
- **Incluir Phaser via CDN:** `<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>`
- **HTML5:** Estructura semántica y accesible
- **CSS3:** Estilos modernos y responsivos
- **JavaScript ES6+:** Código moderno y bien estructurado

### Estructura de Archivos

```
ghosts-goblins-SGN/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js (configuración Phaser y punto de entrada)
│   ├── scenes/
│   │   ├── MenuScene.js (menú principal)
│   │   ├── GameScene.js (escena principal del juego)
│   │   ├── GameOverScene.js (pantalla de game over)
│   │   └── VictoryScene.js (pantalla de victoria al completar nivel)
│   ├── entities/
│   │   ├── Player.js (clase del plátano borracho)
│   │   ├── Monkey.js (clase de los monos enemigos)
│   │   ├── Gorilla.js (clase de los gorilas jefe)
│   │   └── Projectile.js (clase de proyectiles/armas)
│   └── utils/
│       ├── constants.js (constantes del juego)
│       └── helpers.js (funciones auxiliares)
├── assets/
│   ├── images/
│   │   ├── sprites/ (sprites del juego)
│   │   └── backgrounds/ (fondos de niveles)
│   ├── audio/
│   │   ├── music/ (música de fondo)
│   │   └── sfx/ (efectos de sonido)
│   └── maps/ (opcional: mapas de niveles)
└── prompt-generacion.md
```

---

## Mecánicas del Juego

### 1. Protagonista (Plátano Borracho)

**Características:**
- Movimiento horizontal con teclas A/D o flechas izquierda/derecha
- Salto con tecla W, Espacio o flecha arriba
- Movimiento "borracho": El plátano se mueve con un ligero balanceo/tambaleo para simular el estado de embriaguez
- Animaciones: caminar, saltar, estar quieto, lanzar proyectiles
- Sistema de vidas: 3 vidas iniciales
- Cuando recibe daño, pierde temporalmente su "armadura" (piel del plátano) quedando más vulnerable

**Controles:**
- **A / Flecha Izquierda:** Mover izquierda
- **D / Flecha Derecha:** Mover derecha
- **W / Flecha Arriba:** Saltar
- **X / Flecha Abajo:** Agacharse o mirar hacia abajo si está saltando
- **J / Espacio:** Lanzar proyectil/atacar

### 2. Sistema de Armas/Proyectiles

- El plátano puede lanzar proyectiles (pueden ser cáscaras de plátano, semillas, o cualquier objeto temático)
- Los proyectiles se lanzan en la dirección que mira el jugador
- Los proyectiles desaparecen al impactar con enemigos o plataformas
- Cada proyectil causa daño a los enemigos

### 3. Enemigos (Monos)

**Comportamiento:**
- Se mueven horizontalmente en plataformas
- Cambian de dirección al llegar a los bordes de plataformas
- Detectan al jugador y se mueven hacia él cuando está cerca
- Al tocar al jugador, le causan daño
- Mueren al recibir un número determinado de impactos de proyectiles
- Diferentes tipos de monos con diferentes velocidades y resistencia

**Tipos de monos:**
- **Mono Básico:** Velocidad normal, 1 impacto para derrotar
- **Mono Rápido:** Velocidad alta, 1 impacto para derrotar
- **Mono Fuerte:** Velocidad normal, 2 impactos para derrotar

### 4. Jefes (Gorilas)

**Características:**
- Aparecen al final de cada nivel
- Cada gorila es más poderoso que el anterior:
  - **Gorila Nivel 1:** Velocidad moderada, 5 impactos para derrotar
  - **Gorila Nivel 2:** Velocidad alta, 8 impactos para derrotar
  - **Gorila Nivel 3:** Velocidad muy alta, 12 impactos para derrotar
  - Y así sucesivamente...

**Comportamiento:**
- Se mueven por la plataforma
- Pueden lanzar proyectiles o atacar de cerca
- Patrones de movimiento más complejos que los monos normales
- Indicador de vida visible (barra de vida)

### 5. Sistema de Niveles

- **Scroll horizontal:** La cámara sigue al jugador
- **Múltiples plataformas:** Niveles con plataformas a diferentes alturas
- **Gravedad:** Sistema de física realista
- **Colisiones:** Detección precisa de colisiones con plataformas y enemigos
- **Checkpoints:** Puntos de guardado dentro de cada nivel (opcional pero recomendado)

### 6. Sistema de Puntuación

- Puntos por derrotar monos
- Puntos por derrotar gorilas (muchos más puntos)
- Puntos por completar niveles
- Bonus por tiempo (completar rápido)
- La puntuación se muestra en pantalla durante el juego

### 7. Sistema de Vidas

- 3 vidas iniciales
- Pierde una vida al recibir daño de enemigos
- Game Over cuando se quedan sin vidas
- Posibilidad de ganar vidas extra (opcional)

---

## Sistema de Escenas (Phaser 3)

### 1. MenuScene
- Título del juego: "Plátano Borracho vs Monos"
- Botón "Jugar" para iniciar el juego
- Botón "Instrucciones" (opcional)
- Diseño atractivo con el tema del juego

### 2. GameScene
- Escena principal donde se desarrolla el juego
- Gestiona el jugador, enemigos, plataformas, colisiones
- Muestra HUD: vidas, puntuación, nivel actual
- Gestiona la cámara y el scroll

### 3. GameOverScene
- Se muestra cuando el jugador pierde todas las vidas
- Muestra puntuación final
- Botón "Reintentar" para volver a jugar
- Botón "Menú Principal" para volver al menú

### 4. VictoryScene
- Se muestra al completar un nivel
- Muestra puntuación del nivel
- Botón "Siguiente Nivel" o "Continuar"
- Botón "Menú Principal"

---

## Detalles de Implementación

### Física (Arcade Physics de Phaser)
- Gravedad: 500-800 píxeles/segundo²
- Velocidad de salto: -400 a -600 píxeles/segundo
- Velocidad horizontal del jugador: 200-300 píxeles/segundo
- Colisiones precisas entre jugador, enemigos, proyectiles y plataformas

### Animaciones
- Usar spritesheets o crear animaciones programáticamente
- Si no hay sprites disponibles, usar formas geométricas coloreadas con animaciones de movimiento
- El plátano debe tener animación de "tambaleo" constante para simular borrachera

### Audio
- Música de fondo (loop)
- Efectos de sonido: salto, lanzar proyectil, impacto, derrota de enemigo, daño recibido, game over, victoria

### Visual
- Fondos temáticos de jungla
- Colores vibrantes y contrastantes
- UI clara y legible
- Efectos visuales al derrotar enemigos (partículas opcionales)

---

## Características Adicionales Recomendadas

1. **Sistema de Power-ups (opcional):**
   - Plátano dorado: proyectiles más poderosos temporalmente
   - Corazón: recuperar vida
   - Estrella: invencibilidad temporal

2. **Dificultad Progresiva:**
   - Más enemigos en niveles avanzados
   - Enemigos más rápidos
   - Plataformas más complejas

3. **Efectos Visuales:**
   - Partículas al derrotar enemigos
   - Efecto de "daño" cuando el jugador recibe golpes (parpadeo)
   - Animaciones de transición entre escenas

---

## Estilo de Código

- **Código limpio y bien comentado:** Explicar secciones importantes
- **Modularidad:** Separar lógica en clases y funciones reutilizables
- **Constantes:** Usar constantes para valores mágicos (velocidades, daños, etc.)
- **Nombres descriptivos:** Variables y funciones con nombres claros
- **Manejo de errores:** Validaciones básicas y manejo de casos edge

---

## Compatibilidad

- Funcionar en navegadores modernos (Chrome, Firefox, Safari, Edge)
- Responsive: adaptarse a diferentes tamaños de pantalla (mínimo 800x600)
- Optimización de rendimiento: 60 FPS cuando sea posible

---

## Entregables

1. **index.html:** Archivo HTML principal con estructura completa
2. **css/style.css:** Estilos para el juego y la UI
3. **js/main.js:** Configuración de Phaser y punto de entrada
4. **js/scenes/:** Todas las escenas del juego
5. **js/entities/:** Todas las entidades (jugador, enemigos, proyectiles)
6. **js/utils/:** Utilidades y constantes
7. **Assets básicos:** Si no hay imágenes, usar formas geométricas coloreadas con Phaser. Si hay imágenes, organizarlas en la carpeta assets/

---

## Notas Importantes

- Si no hay sprites disponibles, crear sprites simples usando Phaser Graphics API (formas geométricas coloreadas)
- El plátano puede ser representado como un rectángulo amarillo con detalles
- Los monos pueden ser círculos/cuadrados marrones con ojos
- Los gorilas pueden ser formas más grandes y oscuras
- Priorizar funcionalidad sobre gráficos si no hay assets disponibles
- El juego debe ser completamente jugable incluso con gráficos simples

---

## Ejemplo de Estructura de Clases

### Player.js
```javascript
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Inicialización del jugador
        // Configurar física, animaciones, propiedades
    }
    
    update(cursors) {
        // Lógica de movimiento y controles
        // Efecto de "tambaleo" borracho
    }
    
    jump() {
        // Lógica de salto
    }
    
    throwProjectile() {
        // Crear y lanzar proyectil
    }
    
    takeDamage() {
        // Lógica de recibir daño
    }
}
```

### Monkey.js
```javascript
class Monkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        // Inicialización del mono
        // type: 'basic', 'fast', 'strong'
    }
    
    update() {
        // IA básica: movimiento, detección de jugador
    }
    
    takeDamage() {
        // Lógica de recibir daño y morir
    }
}
```

### Gorilla.js
```javascript
class Gorilla extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, level) {
        // Inicialización del gorila
        // level determina poder y resistencia
    }
    
    update() {
        // IA más compleja que los monos
        // Patrones de movimiento y ataque
    }
    
    attack() {
        // Ataques del gorila
    }
}
```

---

## Prioridades de Desarrollo

1. **Fase 1 - Básico:**
   - Estructura de archivos
   - MenuScene y GameScene básicos
   - Jugador con movimiento y salto
   - Plataformas básicas
   - Un tipo de enemigo (mono básico)

2. **Fase 2 - Completo:**
   - Sistema de proyectiles
   - Múltiples tipos de enemigos
   - Sistema de vidas y daño
   - Gorila jefe del nivel 1
   - Sistema de puntuación

3. **Fase 3 - Pulido:**
   - Múltiples niveles
   - Gorilas progresivamente más poderosos
   - GameOverScene y VictoryScene
   - Audio y efectos de sonido
   - Animaciones mejoradas
   - Efectos visuales

---

## Resultado Esperado

Un juego completo y funcional de plataformas 2D donde:
- El jugador controla un plátano borracho
- Debe derrotar monos enemigos lanzando proyectiles
- Debe enfrentarse a gorilas jefe al final de cada nivel
- Los gorilas se vuelven más poderosos en cada nivel
- El juego es desafiante pero jugable
- Tiene sistema de vidas, puntuación y múltiples niveles
- Está completamente implementado con Phaser 3

**¡El juego debe ser completamente funcional y listo para jugar!**

