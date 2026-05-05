#!/bin/bash
# Script para iniciar el servidor en tmux automáticamente

cd /home/yamiddev/chitaga-tech

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "Error: tmux no está instalado. Instálalo con:"
    echo "  sudo apt install tmux  # Ubuntu/Debian"
    echo "  brew install tmux      # macOS"
    exit 1
fi

# Check if server is already running in tmux
if tmux has-session -t chitaga-server 2>/dev/null; then
    echo "El servidor ya está corriendo en tmux (sesión: chitaga-server)"
    echo "Para conectarte: tmux attach -t chitaga-server"
    echo "Para ver logs: tail -f /tmp/chitaga-server.log"
    exit 0
fi

# Create new tmux session and run the server
echo "Iniciando servidor Chitaga Tech en tmux..."
tmux new-session -d -s chitaga-server -c /home/yamiddev/chitaga-tech

# Send commands to tmux session
tmux send-keys -t chitaga-server 'echo "================================================"' C-m
tmux send-keys -t chitaga-server 'echo "Chitaga Tech Server - Tmux Session"' C-m
tmux send-keys -t chitaga-server 'echo "Iniciado: $(date)"' C-m
tmux send-keys -t chitaga-server 'echo "================================================"' C-m
tmux send-keys -t chitaga-server 'echo ""' C-m
tmux send-keys -t chitaga-server 'echo "Ejecutando servidor con auto-reinicio..."' C-m
tmux send-keys -t chitaga-server 'echo "Logs: /tmp/chitaga-server.log"' C-m
tmux send-keys -t chitaga-server 'echo "Para salir: Ctrl+B, luego D (detach)"' C-m
tmux send-keys -t chitaga-server 'echo "Para matar: tmux kill-session -t chitaga-server"' C-m
tmux send-keys -t chitaga-server 'echo "================================================"' C-m
tmux send-keys -t chitaga-server 'echo ""' C-m
tmux send-keys -t chitaga-server './run-server.sh' C-m

echo "Servidor iniciado en tmux sesión: chitaga-server"
echo ""
echo "Comandos útiles:"
echo "  Conectar a la sesión: tmux attach -t chitaga-server"
echo "  Ver logs: tail -f /tmp/chitaga-server.log"
echo "  Detach (salir sin detener): Ctrl+B, luego D"
echo "  Matar sesión: tmux kill-session -t chitaga-server"
echo ""
echo "El servidor se auto-reiniciará si se cae."
echo "Puerto: 4324"