#!/bin/bash
# Script para configurar el auto-inicio del servidor Chitaga Tech

echo "Configurando auto-inicio para Chitaga Tech..."

# Crear script de inicio en ~/.bashrc si no existe
if ! grep -q "chitaga-server" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# Auto-start Chitaga Tech server" >> ~/.bashrc
    echo "if [ -f ~/chitaga-tech/start-server-tmux.sh ] && ! tmux has-session -t chitaga-server 2>/dev/null; then" >> ~/.bashrc
    echo "    echo 'Iniciando servidor Chitaga Tech...'" >> ~/.bashrc
    echo "    ~/chitaga-tech/start-server-tmux.sh" >> ~/.bashrc
    echo "fi" >> ~/.bashrc
    echo "Configurado auto-inicio en ~/.bashrc"
else
    echo "Auto-inicio ya configurado en ~/.bashrc"
fi

# Crear servicio systemd si tiene permisos de sudo
echo ""
echo "Para configurar como servicio systemd (recomendado para producción):"
echo "1. Copia el archivo de servicio:"
echo "   sudo cp ~/chitaga-tech/chitaga-tech.service /etc/systemd/system/"
echo ""
echo "2. Recarga systemd y habilita el servicio:"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable chitaga-tech.service"
echo "   sudo systemctl start chitaga-tech.service"
echo ""
echo "3. Verifica el estado:"
echo "   sudo systemctl status chitaga-tech.service"
echo ""
echo "El servidor ahora se reiniciará automáticamente si se cae."
echo "Para ver logs: tail -f /tmp/chitaga-server.log"
echo "Para conectar a tmux: tmux attach -t chitaga-server"