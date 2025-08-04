#!/usr/bin/env bash
set -euo pipefail

# --- resolve project root (parent of the script’s directory) ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

BACKEND_DIR="$ROOT_DIR/relief-backend"
FRONTEND_DIR="$ROOT_DIR/relief-ui"

# 1) Start backend
echo "Starting backend (dev)…"
pushd "$BACKEND_DIR" >/dev/null
npm install          # remove if you don’t want it every time
npm run dev > "$ROOT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
popd >/dev/null

# 2) Start frontend
echo "Starting frontend…"
pushd "$FRONTEND_DIR" >/dev/null
npm install
npm start > "$ROOT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
popd >/dev/null

# 3) Wait for services
printf "Waiting for backend @ http://localhost:3000/ "
until curl -fs http://localhost:3000/ >/dev/null; do printf "."; sleep 1; done; echo "OK"
printf "Waiting for frontend @ http://localhost:3001/ "
until curl -fs http://localhost:3001/ >/dev/null; do printf "."; sleep 1; done; echo "OK"

echo -e "\n✅ Both services are up!"
echo "• Backend logs : $ROOT_DIR/backend.log"
echo "• Frontend logs: $ROOT_DIR/frontend.log"
echo

wait $BACKEND_PID $FRONTEND_PID
