# Mapas de Niveles

Esta carpeta contiene los mapas de niveles del juego (opcional).

## Formato

Los mapas pueden estar en formato JSON, CSV, o cualquier formato que el juego pueda leer.

## Estructura de Mapa Sugerida (JSON)

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
  }
}
```

## Nota

Actualmente, los niveles se generan programáticamente en `GameScene.js`. Si deseas usar mapas externos, necesitarás modificar el código para cargar y parsear estos archivos.

