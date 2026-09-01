#!/bin/bash
# Script de instalación completa para producción

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Usuario propietario del proyecto (quien invocó sudo)
APP_USER="${SUDO_USER:-$(id -un)}"

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
sudo -u "$APP_USER" npm install

echo "5. Construyendo proyecto..."
sudo -u "$APP_USER" npm run build

echo "6. Configurando nginx..."
sed "s|^\( *root \).*/dist;|\1${SCRIPT_DIR}/dist;|" chitaga-tech-nginx.conf > /etc/nginx/sites-available/chitaga-tech
ln -sf /etc/nginx/sites-available/chitaga-tech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "7. Configurando servicio systemd..."
sed -e "s|^User=.*|User=${APP_USER}|" \
    -e "s|^Group=.*|Group=${APP_USER}|" \
    -e "s|^WorkingDirectory=.*|WorkingDirectory=${SCRIPT_DIR}|" \
    -e "s|^EnvironmentFile=.*|EnvironmentFile=-${SCRIPT_DIR}/.env|" \
    -e "s|^BindPaths=.*|BindPaths=${SCRIPT_DIR}|" \
    chitaga-tech.service > /etc/systemd/system/chitaga-tech.service
systemctl daemon-reload
systemctl enable chitaga-tech.service

echo "8. Configurando permisos..."
chown -R "$APP_USER":"$APP_USER" "$SCRIPT_DIR"
chmod -R 755 "$SCRIPT_DIR"

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