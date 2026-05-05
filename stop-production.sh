#!/bin/bash
# Script para detener el sistema de producción

cd /home/yamiddev/chitaga-tech

echo "================================================"
echo "DETENIENDO SISTEMA DE PRODUCCIÓN"
echo "================================================"
echo ""

# Verificar permisos
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Este script necesita permisos de superusuario"
    echo "   Ejecuta con: sudo ./stop-production.sh"
    exit 1
fi

# 1. Detener nginx
echo "1. Deteniendo nginx..."
systemctl stop nginx
if [ $? -eq 0 ]; then
    echo "   ✅ nginx detenido"
else
    echo "   ⚠️  nginx no estaba corriendo o error al detener"
fi

# 2. Detener backend
echo "2. Deteniendo servidor backend..."
tmux kill-session -t chitaga-server 2>/dev/null
pkill -f "node server/index.js" 2>/dev/null
echo "   ✅ Backend detenido"

# 3. Limpiar configuraciones temporales
echo "3. Limpiando configuraciones..."
# No removemos la configuración de nginx, solo la deshabilitamos
rm -f /etc/nginx/sites-enabled/chitaga-tech 2>/dev/null || true
echo "   ✅ Configuraciones limpiadas"

echo ""
echo "================================================"
echo "✅ SISTEMA DETENIDO CORRECTAMENTE"
echo "================================================"
echo ""
echo "Para reiniciar: sudo ./start-production.sh"
echo "Para desarrollo: ./start-server-tmux.sh"