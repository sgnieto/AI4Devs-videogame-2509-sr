@echo off
echo ========================================
echo Iniciando servidor del juego
echo ========================================
echo.

REM Verificar si Python está disponible
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Usando Python...
    python server.py
    goto :end
)

REM Verificar si Node.js está disponible
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Usando Node.js...
    node server.js
    goto :end
)

echo.
echo ERROR: No se encontró Python ni Node.js
echo.
echo Por favor instala uno de los siguientes:
echo - Python: https://www.python.org/downloads/
echo - Node.js: https://nodejs.org/
echo.
echo O usa una extension de VS Code como "Live Server"
echo.
pause

:end

