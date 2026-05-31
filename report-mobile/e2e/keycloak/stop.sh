#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

echo "Stopping Keycloak E2E test container..."
docker compose -f "$COMPOSE_FILE" down -v
echo "Keycloak stopped and volumes removed."
