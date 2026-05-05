#!/bin/bash
# Auto-restart server with better error handling and port management
cd /home/yamiddev/chitaga-tech

PORT=4324
MAX_RETRIES=5
RETRY_DELAY=3
LOG_FILE="/tmp/chitaga-server.log"

# Function to check if port is in use
check_port() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -ti:$PORT >/dev/null 2>&1
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tln | grep -q ":$PORT "
    elif command -v ss >/dev/null 2>&1; then
        ss -tln | grep -q ":$PORT "
    else
        # If no tools available, assume port is free
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    echo "[$(date)] Checking for processes on port $PORT..."
    if command -v lsof >/dev/null 2>&1; then
        PID=$(lsof -ti:$PORT 2>/dev/null)
        if [ -n "$PID" ]; then
            echo "[$(date)] Killing existing process(es) on port $PORT: $PID"
            kill -9 $PID 2>/dev/null
            sleep 1
        fi
    fi
}

# Function to wait for port to be free
wait_for_port() {
    local attempts=0
    while check_port; do
        attempts=$((attempts + 1))
        if [ $attempts -ge 10 ]; then
            echo "[$(date)] ERROR: Port $PORT still in use after 10 attempts. Force killing..."
            kill_port
            return 1
        fi
        echo "[$(date)] Port $PORT is in use, waiting... (attempt $attempts)"
        sleep 1
    done
    echo "[$(date)] Port $PORT is free"
    return 0
}

# Trap signals for clean shutdown
trap 'echo "[$(date)] Received shutdown signal. Exiting..."; exit 0' INT TERM

echo "================================================"
echo "Chitaga Tech Server Auto-Restart Script"
echo "Starting at: $(date)"
echo "Port: $PORT"
echo "Log file: $LOG_FILE"
echo "================================================"

RETRY_COUNT=0
LAST_EXIT=0

while true; do
    # Check if we've hit max retries
    if [ $RETRY_COUNT -ge $MAX_RETRIES ] && [ $MAX_RETRIES -gt 0 ]; then
        echo "[$(date)] ERROR: Maximum retries ($MAX_RETRIES) reached. Last exit code: $LAST_EXIT"
        echo "[$(date)] Waiting 30 seconds before attempting again..."
        sleep 30
        RETRY_COUNT=0
    fi
    
    # Ensure port is free
    if ! wait_for_port; then
        echo "[$(date)] ERROR: Could not free port $PORT. Retrying in 5 seconds..."
        sleep 5
        continue
    fi
    
    # Start the server
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "[$(date)] [Attempt $RETRY_COUNT] Starting Chitaga server on port $PORT..."
    
    # Start server with logging
    {
        echo "================================================"
        echo "Server started at: $(date)"
        echo "================================================"
        npm run server
    } >> "$LOG_FILE" 2>&1 &
    
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 2
    
    # Check if server is still running
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        echo "[$(date)] ERROR: Server failed to start (PID $SERVER_PID died)"
        LAST_EXIT=1
        sleep $RETRY_DELAY
        continue
    fi
    
    # Wait for server to exit
    echo "[$(date)] Server started successfully with PID $SERVER_PID"
    echo "[$(date)] Monitoring server process..."
    
    wait $SERVER_PID
    LAST_EXIT=$?
    
    echo "[$(date)] Server exited with code $LAST_EXIT"
    
    # Reset retry count on clean exit (0 or 130 = SIGINT)
    if [ $LAST_EXIT -eq 0 ] || [ $LAST_EXIT -eq 130 ]; then
        RETRY_COUNT=0
        echo "[$(date)] Clean exit detected. Resetting retry count."
    fi
    
    # Clean up any remaining processes on port
    kill_port
    
    echo "[$(date)] Restarting in $RETRY_DELAY seconds..."
    sleep $RETRY_DELAY
done
