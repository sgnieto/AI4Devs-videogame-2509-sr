#!/usr/bin/env python3
"""
Servidor HTTP simple para servir el juego
Uso: python server.py
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers CORS para permitir carga de assets
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Log simplificado
        print(f"{args[0]} - {args[1]}")

def main():
    # Cambiar al directorio del script
    os.chdir(Path(__file__).parent)
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 60)
        print(f"Servidor iniciado en http://localhost:{PORT}")
        print(f"Abre tu navegador en: {url}")
        print("Presiona Ctrl+C para detener el servidor")
        print("=" * 60)
        
        # Intentar abrir el navegador automáticamente
        try:
            webbrowser.open(url)
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServidor detenido.")

if __name__ == "__main__":
    main()

