#!/bin/bash
# Script de instalación completa para producción

cd /home/yamiddev/chitaga-tech

echo "================================================"
echo "INSTALACIÓN COMPLETA - CHITAGÁ TECH"
echo "================================================"
echo ""

# Verificar que estamos como root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Este script necesita permisos de superusuario"
    echo "   Ejecuta con: sudo ./install-production.sh"
    exit 1
fi

echo "1. Actualizando sistema..."
apt-get update
apt-get upgrade -y

echo "2. Instalando dependencias del sistema..."
apt-get install -y nginx nodejs npm sqlite3 tmux

echo "3. Configurando Node.js..."
# Asegurar que npm esté actualizado
npm install -g npm@latest

echo "4. Instalando dependencias del proyecto..."
sudo -u yamiddev npm install

echo "5. Construyendo proyecto..."
sudo -u yamiddev npm run build

echo "6. Configurando nginx..."
cp chitaga-tech-nginx.conf /etc/nginx/sites-available/chitaga-tech
ln -sf /etc/nginx/sites-available/chitaga-tech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "7. Configurando servicio systemd..."
cp chitaga-tech.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable chitaga-tech.service

echo "8. Configurando permisos..."
chown -R yamiddev:yamiddev /home/yamiddev/chitaga-tech
chmod -R 755 /home/yamiddev/chitaga-tech

echo "9. Configurando firewall..."
if command -v ufw >/dev/null 2>&1; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 22/tcp
    ufw --force enable
fi

echo "10. Verificando configuración..."
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Error en configuración de nginx"
    exit 1
fi

echo ""
echo "================================================"
echo "✅ INSTALACIÓN COMPLETADA"
echo "================================================"
echo ""
echo "PARA INICIAR EL SISTEMA:"
echo "1. Iniciar backend: systemctl start chitaga-tech"
echo "2. Iniciar nginx: systemctl start nginx"
echo ""
echo "O usa el script completo:"
echo "   sudo ./start-production.sh"
echo ""
echo "COMANDOS ÚTILES:"
echo "   • Ver estado: systemctl status chitaga-tech"
echo "   • Ver logs: journalctl -u chitaga-tech -f"
echo "   • Reiniciar: systemctl restart chitaga-tech"
echo "   • Detener: systemctl stop chitaga-tech"
echo ""
echo "El sistema está listo para producción 🚀"