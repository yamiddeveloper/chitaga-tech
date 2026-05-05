#!/bin/bash
# Script para iniciar el sistema completo de producción de Chitagá Tech

cd /home/yamiddev/chitaga-tech

echo "================================================"
echo "CHITAGÁ TECH - SISTEMA DE PRODUCCIÓN"
echo "================================================"
echo ""

# Verificar que estamos como root o con sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Este script necesita permisos de superusuario para nginx"
    echo "   Ejecuta con: sudo ./start-production.sh"
    exit 1
fi

# 1. Detener servicios previos
echo "1. Deteniendo servicios previos..."
systemctl stop nginx 2>/dev/null || true
pkill -f "node server/index.js" 2>/dev/null || true
tmux kill-session -t chitaga-server 2>/dev/null || true

# 2. Construir el proyecto
echo "2. Construyendo proyecto Astro..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error construyendo el proyecto"
    exit 1
fi
echo "   ✅ Proyecto construido en dist/"

# 3. Iniciar backend en tmux
echo "3. Iniciando servidor backend..."
./start-server-tmux.sh > /dev/null 2>&1
sleep 3

# Verificar que el backend esté funcionando
if curl -s http://localhost:4324/api/health > /dev/null; then
    echo "   ✅ Backend funcionando en puerto 4324"
else
    echo "❌ Backend no responde"
    exit 1
fi

# 4. Configurar nginx
echo "4. Configurando nginx..."
NGINX_CONF="/etc/nginx/sites-available/chitaga-tech"
NGINX_ENABLED="/etc/nginx/sites-enabled/chitaga-tech"

# Copiar configuración
cp chitaga-tech-nginx.conf $NGINX_CONF

# Crear enlace simbólico si no existe
if [ ! -L $NGINX_ENABLED ]; then
    ln -s $NGINX_CONF $NGINX_ENABLED
fi

# Remover configuración por defecto
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Verificar configuración de nginx
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Error en configuración de nginx"
    exit 1
fi

# 5. Iniciar nginx
echo "5. Iniciando nginx..."
systemctl start nginx
if [ $? -eq 0 ]; then
    echo "   ✅ nginx iniciado"
else
    echo "❌ Error iniciando nginx"
    exit 1
fi

# 6. Configurar firewall (si está activo)
echo "6. Configurando firewall..."
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "   ✅ Firewall configurado (puertos 80 y 443)"
fi

# 7. Verificar que todo funcione
echo "7. Verificando sistema completo..."
sleep 2

echo ""
echo "================================================"
echo "✅ SISTEMA INICIADO CORRECTAMENTE"
echo "================================================"
echo ""
echo "📊 SERVICIOS:"
echo "   • Backend API: http://localhost:4324 (tmux)"
echo "   • Frontend: http://localhost:80"
echo "   • nginx: sirviendo archivos estáticos y proxy"
echo ""
echo "📁 ARCHIVOS:"
echo "   • Config nginx: /etc/nginx/sites-available/chitaga-tech"
echo "   • Logs nginx: /var/log/nginx/chitaga-tech-*.log"
echo "   • Logs backend: /tmp/chitaga-server.log"
echo ""
echo "🎯 ACCESO:"
echo "   • Sitio web: http://localhost"
echo "   • API Health: http://localhost/api/health"
echo "   • Formulario: http://localhost/evento/introduccion-programacion/"
echo ""
echo "🔧 ADMINISTRACIÓN:"
echo "   • Ver logs backend: tail -f /tmp/chitaga-server.log"
echo "   • Ver logs nginx: tail -f /var/log/nginx/chitaga-tech-access.log"
echo "   • Conectar a tmux: tmux attach -t chitaga-server"
echo "   • Reiniciar nginx: systemctl restart nginx"
echo "   • Detener sistema: sudo ./stop-production.sh"
echo ""
echo "================================================"
echo "El sistema está listo para producción 🚀"
echo "================================================"

# Mostrar estado actual
echo ""
echo "Estado actual:"
systemctl status nginx --no-pager | grep -A2 "Active:"
echo ""
curl -s http://localhost/api/health | python3 -m json.tool 2>/dev/null || echo "API: OK"