#!/usr/bin/env bash
set -e

# Function to stop a service by port
stop_service() {
  local port=$1
  local name=$2
  echo -n "Stopping $name (port $port)... "
  # Find PIDs listening on the port
  pids=$(lsof -ti tcp:$port) || pids=""
  if [ -n "$pids" ]; then
    # Send SIGINT to allow graceful shutdown
    echo "$pids" | xargs kill -SIGINT
    # Wait for processes to exit
    for pid in $pids; do
      while kill -0 $pid 2>/dev/null; do
        sleep 1
      done
    done
    echo "Stopped"
  else
    echo "Not running"
  fi
}

# Stop backend (port 3000) and frontend (port 3001)
stop_service 3000 "backend"
stop_service 3001 "frontend"

echo "All services have been stopped."
