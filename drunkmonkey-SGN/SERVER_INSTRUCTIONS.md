# Instrucciones para Servir el Juego por HTTP

Los navegadores modernos bloquean la carga de recursos locales cuando se abre un archivo HTML directamente (`file://`). Por eso necesitas servir el juego a través de un servidor HTTP local.

## 🚀 Opción 1: Scripts Automáticos (Recomendado)

### Windows
Doble clic en `start-server.bat` o ejecuta en la terminal:
```bash
start-server.bat
```

### Linux/Mac
Ejecuta en la terminal:
```bash
chmod +x start-server.sh
./start-server.sh
```

El script detectará automáticamente si tienes Python o Node.js y usará el servidor correspondiente.

---

## 🐍 Opción 2: Python (Si tienes Python instalado)

### Python 3
```bash
python server.py
```

O si tienes Python 3 específicamente:
```bash
python3 server.py
```

El servidor se iniciará en `http://localhost:8000` y abrirá el navegador automáticamente.

---

## 📦 Opción 3: Node.js (Si tienes Node.js instalado)

```bash
node server.js
```

El servidor se iniciará en `http://localhost:8000` y abrirá el navegador automáticamente.

---

## 🔧 Opción 4: Python Simple (Una línea)

Si tienes Python 3, puedes usar el servidor HTTP integrado:

```bash
# Python 3
python -m http.server 8000

# O Python 2 (si solo tienes Python 2)
python -m SimpleHTTPServer 8000
```

Luego abre en tu navegador: `http://localhost:8000/index.html`

---

## 💻 Opción 5: PHP (Si tienes PHP instalado)

```bash
php -S localhost:8000
```

Luego abre en tu navegador: `http://localhost:8000/index.html`

---

## 🎯 Opción 6: Live Server (VS Code Extension)

Si usas Visual Studio Code:

1. Instala la extensión **"Live Server"** de Ritwick Dey
2. Haz clic derecho en `index.html`
3. Selecciona **"Open with Live Server"**

Esto iniciará un servidor automáticamente y abrirá el juego en tu navegador.

---

## 🌐 Opción 7: Otros Servidores

### http-server (Node.js)
```bash
npm install -g http-server
http-server -p 8000
```

### serve (Node.js)
```bash
npm install -g serve
serve -p 8000
```

---

## ✅ Verificación

Una vez que el servidor esté corriendo:

1. Abre tu navegador
2. Ve a `http://localhost:8000/index.html`
3. Abre la consola del navegador (F12)
4. Verifica que no haya errores 404 para los assets
5. Los assets deberían cargarse correctamente

---

## 🔍 Solución de Problemas

### Puerto 8000 ya en uso
Si el puerto 8000 está ocupado, puedes cambiar el puerto en los scripts:
- `server.py`: Cambia `PORT = 8000` a otro número (ej: `8001`)
- `server.js`: Cambia `const PORT = 8000` a otro número

### Los assets aún no cargan
1. Verifica que los archivos estén en las rutas correctas
2. Revisa la consola del navegador (F12) para ver errores
3. Asegúrate de que el servidor esté corriendo desde el directorio correcto
4. Verifica que las rutas en `asset-loader.js` sean relativas (empiezan con `assets/`)

### CORS Errors
Los scripts incluidos ya tienen headers CORS configurados. Si usas otro servidor, asegúrate de que permita CORS.

---

## 📝 Notas

- El servidor debe estar corriendo mientras juegas
- Para detener el servidor, presiona `Ctrl+C` en la terminal
- No cierres la ventana de la terminal mientras juegas
- El puerto 8000 es el predeterminado, pero puedes usar cualquier puerto disponible

---

## 🎮 ¡Listo!

Una vez que el servidor esté corriendo, el juego debería cargar todos los assets correctamente. ¡Disfruta jugando!

