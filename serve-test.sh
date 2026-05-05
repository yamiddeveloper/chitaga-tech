#!/bin/bash
# Script para servir y probar el formulario

echo "========================================="
echo "PRUEBA DEL SISTEMA DE INSCRIPCIÓN"
echo "========================================="
echo ""
echo "1. Verificando servidor backend..."
curl -s http://localhost:4324/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Backend funcionando en http://localhost:4324"
else
    echo "   ❌ Backend NO responde. Ejecuta: ./start-server-tmux.sh"
    exit 1
fi

echo ""
echo "2. Iniciando servidor web para frontend..."
cd /home/yamiddev/chitaga-tech

# Matar cualquier servidor previo en puerto 8080
pkill -f "http.server 8080" 2>/dev/null

# Iniciar servidor en segundo plano
python3 -m http.server 8080 --directory dist/evento/introduccion-programacion > /tmp/test-server.log 2>&1 &
SERVER_PID=$!
sleep 2

echo "   ✅ Frontend en http://localhost:8080"
echo ""
echo "3. Probando conexión..."
curl -s http://localhost:8080/ | grep -q "Introducción a la Programación"
if [ $? -eq 0 ]; then
    echo "   ✅ Página cargada correctamente"
else
    echo "   ❌ Error cargando la página"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "========================================="
echo "INSTRUCCIONES PARA PROBAR:"
echo "========================================="
echo "1. Abre el navegador y ve a: http://localhost:8080"
echo "2. Abre la consola del navegador (F12 → Console)"
echo "3. Ingresa un correo en el formulario"
echo "4. Haz clic en '¡Quiero entrar!'"
echo "5. Deberías ver:"
echo "   - Logs en la consola"
echo "   - Modal de éxito si funciona"
echo "   - Modal de error si hay problemas"
echo ""
echo "========================================="
echo "PARA DETENER EL SERVIDOR:"
echo "========================================="
echo "Presiona Ctrl+C en esta terminal"
echo "O ejecuta: kill $SERVER_PID"
echo ""
echo "Manteniendo servidor activo..."
echo "Logs del servidor: /tmp/test-server.log"

# Mantener el script corriendo
trap "echo ''; echo 'Deteniendo servidor...'; kill $SERVER_PID 2>/dev/null; exit 0" INT TERM
wait $SERVER_PID