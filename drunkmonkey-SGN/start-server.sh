#!/bin/bash

echo "========================================"
echo "Iniciando servidor del juego"
echo "========================================"
echo ""

# Verificar si Python está disponible
if command -v python3 &> /dev/null; then
    echo "Usando Python3..."
    python3 server.py
    exit 0
fi

if command -v python &> /dev/null; then
    echo "Usando Python..."
    python server.py
    exit 0
fi

# Verificar si Node.js está disponible
if command -v node &> /dev/null; then
    echo "Usando Node.js..."
    node server.js
    exit 0
fi

echo ""
echo "ERROR: No se encontró Python ni Node.js"
echo ""
echo "Por favor instala uno de los siguientes:"
echo "- Python: https://www.python.org/downloads/"
echo "- Node.js: https://nodejs.org/"
echo ""
echo "O usa una extensión de VS Code como 'Live Server'"
echo ""

